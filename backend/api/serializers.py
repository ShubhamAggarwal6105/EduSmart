from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import LearningPath, LearningJourney, Topic, Quiz, UserProfile, UserStats, UserActivity, QuizResult, LearningInsight

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'duration', 'difficulty', 'questions_count', 'is_completed']

class TopicSerializer(serializers.ModelSerializer):
    quizzes = QuizSerializer(many=True, read_only=True)
    
    class Meta:
        model = Topic
        fields = ['id', 'title', 'description', 'order', 'duration', 'is_completed', 'quizzes']

class LearningJourneySerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    
    class Meta:
        model = LearningJourney
        fields = ['id', 'title', 'description', 'total_lessons', 'completed_lessons', 
                  'progress', 'next_lesson', 'topics']

class LearningPathSerializer(serializers.ModelSerializer):
    journeys = LearningJourneySerializer(many=True, read_only=True)
    
    class Meta:
        model = LearningPath
        fields = ['id', 'title', 'description', 'duration', 'match_percentage', 'journeys']

class LearningPathListSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningPath
        fields = ['id', 'title', 'description', 'duration', 'match_percentage']

class GeneratePathRequestSerializer(serializers.Serializer):
    target_date = serializers.DateField()
    study_hours = serializers.IntegerField()
    selected_skills = serializers.ListField(child=serializers.CharField())

# User Profile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user_type']

# User Stats Serializer
class UserStatsSerializer(serializers.ModelSerializer):
    courses_completed_this_month = serializers.SerializerMethodField()
    quizzes_taken_this_week = serializers.SerializerMethodField()
    streak = serializers.SerializerMethodField()
    
    class Meta:
        model = UserStats
        fields = [
            'courses_completed', 'quizzes_taken', 'overall_progress',
            'courses_completed_this_month', 'quizzes_taken_this_week', 'streak'
        ]
    
    def get_courses_completed_this_month(self, obj):
        return obj.get_courses_completed_this_month()
    
    def get_quizzes_taken_this_week(self, obj):
        return obj.get_quizzes_taken_this_week()
    
    def get_streak(self, obj):
        return UserActivity.get_streak(obj.user)

# Add these new serializers after the existing UserStatsSerializer

class QuizResultSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    
    class Meta:
        model = QuizResult
        fields = ['id', 'quiz', 'score', 'date']
    
    def get_date(self, obj):
        return obj.date_taken.strftime('%Y-%m')

class LearningInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningInsight
        fields = ['id', 'insight_type', 'description']

# User Serializers
class UserSerializer(serializers.ModelSerializer):
    user_type = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'user_type']
    
    def get_user_type(self, obj):
        try:
            return obj.profile.user_type
        except UserProfile.DoesNotExist:
            return 'student'  # Default

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    user_type = serializers.ChoiceField(choices=UserProfile.USER_TYPE_CHOICES, default='student')
    
    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'first_name', 'last_name', 'user_type']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        
        user.set_password(validated_data['password'])
        user.save()
        
        # Create user profile
        UserProfile.objects.create(user=user, user_type=user_type)
        
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
