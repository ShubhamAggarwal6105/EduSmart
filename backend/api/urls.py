from django.urls import path
from .views import (
    predict,
    LearningPathList,
    LearningPathDetail,
    LearningJourneyDetail,
    TopLearningPaths,
    GenerateLearningPath,
    RegisterView,
    LoginView,
    LogoutView,
    UserDetailView,
    TopicUpdateView,
    UserStatsView,
    QuizPerformanceView,
    LearningInsightsView,
    AskAITutorView,
    RecommendationsView,
    SaveQuizResultView
)

urlpatterns = [
    path('predict/', predict, name='predict'),
    path('learning-paths/', LearningPathList.as_view(), name='learning-path-list'),
    path('learning-paths/<int:pk>/', LearningPathDetail.as_view(), name='learning-path-detail'),
    path('learning-journeys/<int:pk>/', LearningJourneyDetail.as_view(), name='learning-journey-detail'),
    path('top-learning-paths/', TopLearningPaths.as_view(), name='top-learning-paths'),
    path('generate-learning-path/', GenerateLearningPath.as_view(), name='generate-learning-path'),
    path('topics/<int:pk>/', TopicUpdateView.as_view(), name='topic-update'),
    path('user-stats/', UserStatsView.as_view(), name='user-stats'),
    path('quiz-performance/', QuizPerformanceView.as_view(), name='quiz-performance'),
    path('learning-insights/', LearningInsightsView.as_view(), name='learning-insights'),
    path('ask-ai-tutor/', AskAITutorView.as_view(), name='ask-ai-tutor'),
    path('recommendations/', RecommendationsView.as_view(), name='recommendations'),
    path('save-quiz-result/', SaveQuizResultView.as_view(), name='save-quiz-result'),
    
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/user/', UserDetailView.as_view(), name='user-detail'),
]
