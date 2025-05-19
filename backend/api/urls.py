from django.urls import path
from .views import (
    LearningPathList, 
    LearningPathDetail, 
    LearningJourneyDetail,
    TopLearningPaths,
    GenerateLearningPath,
    RegisterView,
    LoginView,
    LogoutView,
    UserDetailView
)

urlpatterns = [
    path('learning-paths/', LearningPathList.as_view()),
    path('learning-paths/<int:pk>/', LearningPathDetail.as_view()),
    path('learning-journeys/<int:pk>/', LearningJourneyDetail.as_view()),
    path('top-learning-paths/', TopLearningPaths.as_view()),
    path('generate-learning-path/', GenerateLearningPath.as_view()),
    
    # Authentication URLs
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/user/', UserDetailView.as_view(), name='user-detail'),
]
