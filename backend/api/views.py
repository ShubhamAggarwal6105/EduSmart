from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import os
import json
import random
from datetime import datetime, timedelta
import google.generativeai as genai
from .models import LearningPath, LearningJourney, Topic, Quiz, UserProfile, UserStats, UserActivity, QuizResult, LearningInsight
from .serializers import (
    LearningPathSerializer, 
    LearningPathListSerializer,
    LearningJourneySerializer, 
    TopicSerializer,
    GeneratePathRequestSerializer,
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    UserStatsSerializer,
    QuizResultSerializer,
    LearningInsightSerializer
)
from django.http import Http404
from django.utils import timezone

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def predict(request):
    input_data = request.data['input']
    # ... run TensorFlow inference here ...
    result = "dummy result"
    return Response({'result': result})

class LearningPathList(APIView):
    """
    List all learning paths or create a new one
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        paths = LearningPath.objects.all()
        serializer = LearningPathListSerializer(paths, many=True)
        return Response(serializer.data)

class LearningPathDetail(APIView):
    """
    Retrieve a learning path instance
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return LearningPath.objects.get(pk=pk)
        except LearningPath.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        path = self.get_object(pk)
        serializer = LearningPathSerializer(path)
        return Response(serializer.data)

class LearningJourneyDetail(APIView):
    """
    Retrieve a learning journey instance with all topics and quizzes
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return LearningJourney.objects.get(pk=pk)
        except LearningJourney.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        journey = self.get_object(pk)
        serializer = LearningJourneySerializer(journey)
        return Response(serializer.data)

class TopicUpdateView(generics.UpdateAPIView):
    """
    Update a topic (mark as complete/incomplete)
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Record user activity when a topic is completed
        if instance.is_completed:
            UserActivity.record_activity(request.user)
            
            # Update user stats
            try:
                user_stats = request.user.stats
                user_stats.update_stats()
            except UserStats.DoesNotExist:
                pass
        
        # After updating, return the updated journey data
        journey_serializer = LearningJourneySerializer(instance.learning_journey)
        return Response(journey_serializer.data)

class TopLearningPaths(APIView):
    """
    Get top recommended learning paths
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        # In a real app, this would use a recommendation algorithm
        # For now, we'll just return the top 3 by match percentage
        paths = LearningPath.objects.all().order_by('-match_percentage')[:3]
        serializer = LearningPathListSerializer(paths, many=True)
        return Response(serializer.data)

class GenerateLearningPath(APIView):
    """
    Generate a personalized learning path based on user preferences using Gemini API
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, format=None):
        serializer = GeneratePathRequestSerializer(data=request.data)
        if serializer.is_valid():
            target_date = serializer.validated_data['target_date']
            study_hours = serializer.validated_data['study_hours']
            selected_skills = serializer.validated_data['selected_skills']
            
            # Calculate duration based on target date
            today = datetime.now().date()
            days_until_target = (target_date - today).days
            weeks = max(1, days_until_target // 7)
            duration = f"{weeks} weeks"
            
            # Try to use Gemini API if API key is available
            gemini_api_key = os.environ.get('GEMINI_API_KEY')
            if gemini_api_key:
                try:
                    # Configure the Gemini API
                    genai.configure(api_key=gemini_api_key)
                    model = genai.GenerativeModel('gemini-pro')
                    
                    # Create a structured prompt for Gemini
                    prompt = f"""
                    Create a detailed learning path for {', '.join(selected_skills)}. 
                    The user has {study_hours} hours per week to study and wants to complete it in {duration}.
                    
                    Format the response as a JSON object with the following structure:
                    {{
                        "path_title": "Title of the learning path",
                        "path_description": "Detailed description of the learning path",
                        "journeys": [
                            {{
                                "journey_title": "Title of journey 1",
                                "journey_description": "Description of journey 1",
                                "topics": [
                                    {{
                                        "topic_title": "Title of topic 1",
                                        "topic_description": "Description of topic 1",
                                        "topic_duration": "Duration in hours",
                                        "quizzes": [
                                            {{
                                                "quiz_title": "Title of quiz 1",
                                                "quiz_description": "Description of quiz 1",
                                                "quiz_duration": "Duration in minutes",
                                                "quiz_difficulty": "Beginner/Intermediate/Advanced",
                                                "questions_count": 10
                                            }}
                                        ]
                                    }}
                                ]
                            }}
                        ]
                    }}
                    
                    Make sure to create at least 2 journeys, each with 3-5 topics, and each topic with 1-2 quizzes.
                    """
                    
                    # Generate content with Gemini
                    response = model.generate_content(prompt)
                    
                    # Parse the response to extract the JSON
                    response_text = response.text
                    # Find JSON content between triple backticks if present
                    if "\`\`\`json" in response_text and "\`\`\`" in response_text.split("\`\`\`json", 1)[1]:
                        json_content = response_text.split("\`\`\`json", 1)[1].split("\`\`\`", 1)[0].strip()
                    elif "\`\`\`" in response_text and "\`\`\`" in response_text.split("\`\`\`", 1)[1]:
                        json_content = response_text.split("\`\`\`", 1)[1].split("\`\`\`", 1)[0].strip()
                    else:
                        json_content = response_text
                    
                    # Clean up the JSON content
                    json_content = json_content.replace('\n', ' ').replace('\r', '')
                    data = json.loads(json_content)
                    
                    # Create the learning path from the generated data
                    learning_path = LearningPath.objects.create(
                        title=data.get('path_title', f"Learning Path for {', '.join(selected_skills)}"),
                        description=data.get('path_description', f"A personalized learning path to master {', '.join(selected_skills)}"),
                        duration=duration,
                        match_percentage=random.randint(85, 98)  # Random match percentage between 85-98%
                    )
                    
                    # Create journeys, topics, and quizzes from the generated data
                    journeys_data = data.get('journeys', [])
                    total_topics = 0
                    
                    for i, journey_data in enumerate(journeys_data):
                        journey = LearningJourney.objects.create(
                            title=journey_data.get('journey_title', f"Journey {i+1}: {selected_skills[0]} Mastery"),
                            description=journey_data.get('journey_description', f"Master the fundamentals of {selected_skills[0]}"),
                            learning_path=learning_path,
                            user=request.user,
                            total_lessons=len(journey_data.get('topics', [])),
                            completed_lessons=0,
                            progress=0
                        )
                        
                        topics_data = journey_data.get('topics', [])
                        total_topics += len(topics_data)
                        
                        for j, topic_data in enumerate(topics_data):
                            topic = Topic.objects.create(
                                title=topic_data.get('topic_title', f"Topic {j+1}: {selected_skills[0]} Basics"),
                                description=topic_data.get('topic_description', f"Learn the fundamentals of {selected_skills[0]}"),
                                learning_journey=journey,
                                order=j+1,
                                duration=topic_data.get('topic_duration', "2 hours")
                            )
                            
                            quizzes_data = topic_data.get('quizzes', [])
                            
                            for k, quiz_data in enumerate(quizzes_data):
                                Quiz.objects.create(
                                    title=quiz_data.get('quiz_title', f"Quiz {k+1}: {selected_skills[0]} Assessment"),
                                    description=quiz_data.get('quiz_description', f"Test your knowledge of {selected_skills[0]}"),
                                    topic=topic,
                                    duration=quiz_data.get('quiz_duration', "30 minutes"),
                                    difficulty=quiz_data.get('quiz_difficulty', "Beginner"),
                                    questions_count=quiz_data.get('questions_count', 10)
                                )
                    
                    # Record user activity
                    UserActivity.record_activity(request.user)
                    
                    # Return the created learning path
                    serializer = LearningPathSerializer(learning_path)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                    
                except Exception as e:
                    print(f"Error using Gemini API: {str(e)}")
                    # Fall back to the structured data generation below
            
            # If Gemini API is not available or failed, create structured data manually
            # Create a learning path with realistic data
            learning_path = LearningPath.objects.create(
                title=f"Learning Path for {', '.join(selected_skills)}",
                description=f"A comprehensive learning path designed to help you master {', '.join(selected_skills)} in {duration}. This path is tailored to your schedule of {study_hours} hours per week.",
                duration=duration,
                match_percentage=random.randint(85, 98)  # Random match percentage between 85-98%
            )
            
            # Define journey structures based on skills
            journey_structures = {
                "python": {
                    "title": "Python Programming Mastery",
                    "description": "Master Python programming from basics to advanced concepts",
                    "topics": [
                        {
                            "title": "Python Fundamentals",
                            "description": "Learn the core concepts of Python programming language",
                            "duration": "8 hours",
                            "quizzes": [
                                {
                                    "title": "Python Syntax Quiz",
                                    "description": "Test your understanding of Python syntax and basic concepts",
                                    "duration": "30 minutes",
                                    "difficulty": "Beginner",
                                    "questions_count": 10
                                }
                            ]
                        },
                        {
                            "title": "Data Structures in Python",
                            "description": "Learn about lists, dictionaries, sets, and tuples in Python",
                            "duration": "6 hours",
                            "quizzes": [
                                {
                                    "title": "Data Structures Quiz",
                                    "description": "Test your knowledge of Python data structures",
                                    "duration": "45 minutes",
                                    "difficulty": "Intermediate",
                                    "questions_count": 15
                                }
                            ]
                        },
                        {
                            "title": "Functions and Modules",
                            "description": "Learn how to create and use functions and modules in Python",
                            "duration": "5 hours",
                            "quizzes": [
                                {
                                    "title": "Functions Quiz",
                                    "description": "Test your understanding of Python functions",
                                    "duration": "30 minutes",
                                    "difficulty": "Intermediate",
                                    "questions_count": 12
                                }
                            ]
                        },
                        {
                            "title": "Object-Oriented Programming",
                            "description": "Learn OOP concepts in Python including classes and inheritance",
                            "duration": "10 hours",
                            "quizzes": [
                                {
                                    "title": "OOP Concepts Quiz",
                                    "description": "Test your understanding of object-oriented programming in Python",
                                    "duration": "60 minutes",
                                    "difficulty": "Advanced",
                                    "questions_count": 20
                                }
                            ]
                        }
                    ]
                },
                "machine learning": {
                    "title": "Machine Learning Foundations",
                    "description": "Learn the fundamentals of machine learning algorithms and applications",
                    "topics": [
                        {
                            "title": "Introduction to Machine Learning",
                            "description": "Understand the basic concepts and types of machine learning",
                            "duration": "6 hours",
                            "quizzes": [
                                {
                                    "title": "ML Basics Quiz",
                                    "description": "Test your understanding of machine learning fundamentals",
                                    "duration": "45 minutes",
                                    "difficulty": "Beginner",
                                    "questions_count": 15
                                }
                            ]
                        },
                        {
                            "title": "Supervised Learning Algorithms",
                            "description": "Learn about regression, classification, and decision trees",
                            "duration": "12 hours",
                            "quizzes": [
                                {
                                    "title": "Supervised Learning Quiz",
                                    "description": "Test your knowledge of supervised learning algorithms",
                                    "duration": "60 minutes",
                                    "difficulty": "Intermediate",
                                    "questions_count": 20
                                }
                            ]
                        },
                        {
                            "title": "Unsupervised Learning",
                            "description": "Explore clustering, dimensionality reduction, and association",
                            "duration": "10 hours",
                            "quizzes": [
                                {
                                    "title": "Unsupervised Learning Quiz",
                                    "description": "Test your understanding of unsupervised learning techniques",
                                    "duration": "45 minutes",
                                    "difficulty": "Advanced",
                                    "questions_count": 15
                                }
                            ]
                        }
                    ]
                },
                "web development": {
                    "title": "Web Development Journey",
                    "description": "Master the skills needed to build modern web applications",
                    "topics": [
                        {
                            "title": "HTML and CSS Fundamentals",
                            "description": "Learn the building blocks of web pages",
                            "duration": "8 hours",
                            "quizzes": [
                                {
                                    "title": "HTML & CSS Quiz",
                                    "description": "Test your knowledge of HTML and CSS basics",
                                    "duration": "30 minutes",
                                    "difficulty": "Beginner",
                                    "questions_count": 15
                                }
                            ]
                        },
                        {
                            "title": "JavaScript Essentials",
                            "description": "Learn the core concepts of JavaScript programming",
                            "duration": "10 hours",
                            "quizzes": [
                                {
                                    "title": "JavaScript Basics Quiz",
                                    "description": "Test your understanding of JavaScript fundamentals",
                                    "duration": "45 minutes",
                                    "difficulty": "Intermediate",
                                    "questions_count": 20
                                }
                            ]
                        },
                        {
                            "title": "Frontend Frameworks",
                            "description": "Learn popular frontend frameworks like React or Vue",
                            "duration": "15 hours",
                            "quizzes": [
                                {
                                    "title": "Frontend Frameworks Quiz",
                                    "description": "Test your knowledge of modern frontend frameworks",
                                    "duration": "60 minutes",
                                    "difficulty": "Advanced",
                                    "questions_count": 25
                                }
                            ]
                        },
                        {
                            "title": "Backend Development",
                            "description": "Learn server-side programming and databases",
                            "duration": "12 hours",
                            "quizzes": [
                                {
                                    "title": "Backend Development Quiz",
                                    "description": "Test your understanding of backend concepts",
                                    "duration": "60 minutes",
                                    "difficulty": "Advanced",
                                    "questions_count": 20
                                }
                            ]
                        }
                    ]
                }
            }
            
            # Default journey structure for skills not in our predefined list
            default_journey = {
                "title": "Learning Journey",
                "description": "A comprehensive journey to master new skills",
                "topics": [
                    {
                        "title": "Fundamentals",
                        "description": "Learn the core concepts and principles",
                        "duration": "8 hours",
                        "quizzes": [
                            {
                                "title": "Fundamentals Quiz",
                                "description": "Test your understanding of the basic concepts",
                                "duration": "30 minutes",
                                "difficulty": "Beginner",
                                "questions_count": 10
                            }
                        ]
                    },
                    {
                        "title": "Intermediate Concepts",
                        "description": "Build upon the fundamentals with more advanced topics",
                        "duration": "10 hours",
                        "quizzes": [
                            {
                                "title": "Intermediate Quiz",
                                "description": "Test your knowledge of intermediate concepts",
                                "duration": "45 minutes",
                                "difficulty": "Intermediate",
                                "questions_count": 15
                            }
                        ]
                    },
                    {
                        "title": "Advanced Applications",
                        "description": "Apply your knowledge to real-world scenarios",
                        "duration": "12 hours",
                        "quizzes": [
                            {
                                "title": "Advanced Quiz",
                                "description": "Test your mastery of advanced concepts",
                                "duration": "60 minutes",
                                "difficulty": "Advanced",
                                "questions_count": 20
                            }
                        ]
                    }
                ]
            }
            
            # Record user activity
            UserActivity.record_activity(request.user)
            
            # Return the created learning path
            serializer = LearningPathSerializer(learning_path)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserStatsView(APIView):
    """
    Get user statistics for dashboard
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        # Record user activity when they view their stats
        UserActivity.record_activity(request.user)
        
        try:
            # Get or create user stats
            user_stats, created = UserStats.objects.get_or_create(user=request.user)
            
            # Update stats to ensure they're current
            user_stats.update_stats()
            
            # Serialize and return
            serializer = UserStatsSerializer(user_stats)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve user statistics: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class QuizPerformanceView(APIView):
    """
    Get user's quiz performance history
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        try:
            # Get quiz results for the user
            quiz_results = QuizResult.objects.filter(user=request.user).order_by('date_taken')
            
            # If no results exist, create some sample data
            if not quiz_results.exists():
                # Create sample quiz results for demonstration
                current_date = timezone.now().date()
                for i in range(5):
                    month_date = current_date - timedelta(days=30 * (4-i))
                    # Create a random score between 65 and 95
                    score = random.randint(65, 95)
                    
                    # Find a quiz or create a dummy one
                    quiz = Quiz.objects.first()
                    if not quiz:
                        # Create a topic if none exists
                        topic = Topic.objects.first()
                        if not topic:
                            journey = LearningJourney.objects.first()
                            if not journey:
                                path = LearningPath.objects.create(
                                    title="Sample Path",
                                    description="Sample path for demonstration",
                                    duration="4 weeks",
                                    match_percentage=85
                                )
                                journey = LearningJourney.objects.create(
                                    title="Sample Journey",
                                    description="Sample journey for demonstration",
                                    learning_path=path,
                                    user=request.user
                                )
                            topic = Topic.objects.create(
                                title="Sample Topic",
                                description="Sample topic for demonstration",
                                learning_journey=journey,
                                duration="2 hours"
                            )
                        quiz = Quiz.objects.create(
                            title=f"Sample Quiz {i+1}",
                            description="Sample quiz for demonstration",
                            topic=topic,
                            duration="30 minutes",
                            difficulty="Intermediate",
                            questions_count=10
                        )
                    
                    QuizResult.objects.create(
                        user=request.user,
                        quiz=quiz,
                        score=score,
                        date_taken=month_date
                    )
                
                # Fetch the newly created results
                quiz_results = QuizResult.objects.filter(user=request.user).order_by('date_taken')
            
            serializer = QuizResultSerializer(quiz_results, many=True)
            return Response(serializer.data)
            
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve quiz performance: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LearningInsightsView(APIView):
    """
    Get user's learning insights (strengths and areas for improvement)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        try:
            # Get existing insights for the user
            strengths = LearningInsight.objects.filter(
                user=request.user, 
                insight_type='strength'
            )
            
            improvements = LearningInsight.objects.filter(
                user=request.user, 
                insight_type='improvement'
            )
            
            # If no insights exist, create some sample data
            if not strengths.exists():
                sample_strengths = [
                    "Strong understanding of basic programming concepts",
                    "Excellent problem-solving skills",
                    "Quick grasp of algorithmic thinking"
                ]
                
                for description in sample_strengths:
                    LearningInsight.objects.create(
                        user=request.user,
                        insight_type='strength',
                        description=description
                    )
                
                strengths = LearningInsight.objects.filter(
                    user=request.user, 
                    insight_type='strength'
                )
            
            if not improvements.exists():
                sample_improvements = [
                    "Need more practice with advanced data structures",
                    "Can improve code optimization techniques",
                    "Review time complexity analysis"
                ]
                
                for description in sample_improvements:
                    LearningInsight.objects.create(
                        user=request.user,
                        insight_type='improvement',
                        description=description
                    )
                
                improvements = LearningInsight.objects.filter(
                    user=request.user, 
                    insight_type='improvement'
                )
            
            # Serialize and return the data
            strengths_serializer = LearningInsightSerializer(strengths, many=True)
            improvements_serializer = LearningInsightSerializer(improvements, many=True)
            
            return Response({
                'strengths': strengths_serializer.data,
                'improvements': improvements_serializer.data
            })
            
        except Exception as e:
            return Response(
                {"error": f"Failed to retrieve learning insights: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create token for the new user
        token, created = Token.objects.get_or_create(user=user)
        
        # Create initial user stats
        UserStats.objects.get_or_create(user=user)
        
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            
            # Record user activity on login
            UserActivity.record_activity(user)
            
            return Response({
                "user": UserSerializer(user).data,
                "token": token.key
            })
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, format=None):
        # Delete the user's token to logout
        try:
            request.user.auth_token.delete()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, format=None):
        # Record user activity
        UserActivity.record_activity(request.user)
        
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
