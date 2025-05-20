from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta

class UserProfile(models.Model):
    USER_TYPE_CHOICES = (
        ('student', 'Student'),
        ('parent', 'Parent'),
        ('teacher', 'Teacher'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='student')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_user_type_display()}"

class LearningPath(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    duration = models.CharField(max_length=50)  # e.g., "8 weeks"
    match_percentage = models.IntegerField(default=0)  # For recommendations
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class LearningJourney(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    learning_path = models.ForeignKey(LearningPath, on_delete=models.CASCADE, related_name='journeys')
    total_lessons = models.IntegerField(default=0)
    completed_lessons = models.IntegerField(default=0)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journeys', null=True, blank=True)
    progress = models.IntegerField(default=0)  # Percentage of completion
    next_lesson = models.CharField(max_length=200, blank=True, null=True)
    
    def __str__(self):
        return self.title
    
    def update_progress(self):
        """Update the progress based on completed topics"""
        topics = self.topics.all()
        if topics.count() > 0:
            completed_topics = topics.filter(is_completed=True).count()
            self.completed_lessons = completed_topics
            self.progress = int((completed_topics / topics.count()) * 100)
            
            # Set next lesson
            if completed_topics < topics.count():
                next_topic = topics.filter(is_completed=False).order_by('order').first()
                if next_topic:
                    self.next_lesson = next_topic.title
            else:
                self.next_lesson = "All lessons completed!"
                
            self.save()

class Topic(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    learning_journey = models.ForeignKey(LearningJourney, on_delete=models.CASCADE, related_name='topics')
    order = models.IntegerField(default=0)  # For ordering topics within a journey
    duration = models.CharField(max_length=50)  # e.g., "2 hours"
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # If marked as completed and completion time not set, set it now
        if self.is_completed and not self.completed_at:
            self.completed_at = timezone.now()
        # If marked as not completed, clear the completion time
        elif not self.is_completed and self.completed_at:
            self.completed_at = None
            
        super().save(*args, **kwargs)
        # Update journey progress when a topic is saved
        self.learning_journey.update_progress()

class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='quizzes')
    duration = models.CharField(max_length=50)  # e.g., "30 minutes"
    difficulty = models.CharField(max_length=50)  # e.g., "Beginner", "Intermediate"
    questions_count = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # If marked as completed and completion time not set, set it now
        if self.is_completed and not self.completed_at:
            self.completed_at = timezone.now()
        # If marked as not completed, clear the completion time
        elif not self.is_completed and self.completed_at:
            self.completed_at = None
            
        super().save(*args, **kwargs)

class UserActivity(models.Model):
    """Model to track user activity for calculating streaks"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    date = models.DateField(default=timezone.now)
    
    class Meta:
        unique_together = ('user', 'date')
        
    @classmethod
    def record_activity(cls, user):
        """Record user activity for today"""
        today = timezone.now().date()
        cls.objects.get_or_create(user=user, date=today)
    
    @classmethod
    def get_streak(cls, user):
        """Calculate current streak of consecutive days with activity"""
        today = timezone.now().date()
        
        # Get all user activities ordered by date
        activities = cls.objects.filter(user=user).order_by('-date')
        
        if not activities:
            return 0
            
        # Check if user was active today
        if activities.first().date != today:
            return 0
            
        # Count consecutive days
        streak = 1
        for i in range(1, activities.count()):
            prev_date = activities[i-1].date
            curr_date = activities[i].date
            
            # If dates are consecutive
            if prev_date - curr_date == timedelta(days=1):
                streak += 1
            else:
                break
                
        return streak

class UserStats(models.Model):
    """Model to store user statistics for dashboard"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='stats')
    courses_completed = models.IntegerField(default=0)
    quizzes_taken = models.IntegerField(default=0)
    overall_progress = models.IntegerField(default=0)  # Percentage
    
    def __str__(self):
        return f"Stats for {self.user.username}"
    
    def update_stats(self):
        """Update user statistics based on their activity"""
        # Count completed courses (learning journeys)
        completed_journeys = LearningJourney.objects.filter(
            user=self.user, 
            progress=100
        ).count()
        
        # Count completed quizzes
        completed_quizzes = Quiz.objects.filter(
            topic__learning_journey__user=self.user,
            is_completed=True
        ).count()
        
        # Calculate overall progress
        journeys = LearningJourney.objects.filter(user=self.user)
        if journeys.exists():
            total_progress = sum(journey.progress for journey in journeys)
            avg_progress = total_progress // journeys.count()
        else:
            avg_progress = 0
        
        # Update the stats
        self.courses_completed = completed_journeys
        self.quizzes_taken = completed_quizzes
        self.overall_progress = avg_progress
        self.save()
    
    def get_courses_completed_this_month(self):
        """Get number of courses completed this month"""
        first_day_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # Count topics that were completed this month
        # We use topics as a proxy for "courses" since they're the actual content units
        return Topic.objects.filter(
            learning_journey__user=self.user,
            is_completed=True,
            completed_at__gte=first_day_of_month
        ).count()
    
    def get_quizzes_taken_this_week(self):
        """Get number of quizzes taken this week"""
        # Get the start of the current week (Monday)
        today = timezone.now().date()
        start_of_week = today - timedelta(days=today.weekday())
        start_of_week = timezone.datetime.combine(start_of_week, timezone.datetime.min.time())
        
        return Quiz.objects.filter(
            topic__learning_journey__user=self.user,
            is_completed=True,
            completed_at__gte=start_of_week
        ).count()

# Add these new models after the existing UserStats model

class QuizResult(models.Model):
    """Model to store quiz results for performance tracking"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_results')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='results')
    score = models.IntegerField()  # Score as a percentage (0-100)
    date_taken = models.DateField(default=timezone.now)
    
    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.score}%"

class LearningInsight(models.Model):
    """Model to store AI-generated learning insights"""
    INSIGHT_TYPE_CHOICES = (
        ('strength', 'Strength'),
        ('improvement', 'Area for Improvement'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='learning_insights')
    insight_type = models.CharField(max_length=20, choices=INSIGHT_TYPE_CHOICES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_insight_type_display()}"

# Signal to create user profile when a new user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
        UserStats.objects.create(user=instance)
