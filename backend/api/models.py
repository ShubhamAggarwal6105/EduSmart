from django.db import models
from django.contrib.auth.models import User

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

class Topic(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    learning_journey = models.ForeignKey(LearningJourney, on_delete=models.CASCADE, related_name='topics')
    order = models.IntegerField(default=0)  # For ordering topics within a journey
    duration = models.CharField(max_length=50)  # e.g., "2 hours"
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title

class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='quizzes')
    duration = models.CharField(max_length=50)  # e.g., "30 minutes"
    difficulty = models.CharField(max_length=50)  # e.g., "Beginner", "Intermediate"
    questions_count = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title
