from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import LearningPath, LearningJourney, Topic, Quiz, UserProfile
from .serializers import (
    LearningPathSerializer, 
    LearningPathListSerializer,
    LearningJourneySerializer, 
    TopicSerializer,
    GeneratePathRequestSerializer,
    UserSerializer,
    RegisterSerializer,
    LoginSerializer
)
from django.http import Http404

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
    Generate a personalized learning path based on user preferences
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, format=None):
        serializer = GeneratePathRequestSerializer(data=request.data)
        if serializer.is_valid():
            # In a real app, this would use an algorithm to generate a path
            # For now, we'll just return a mock response
            return Response({
                "message": "Learning path generated successfully",
                "path": {
                    "id": 999,
                    "title": "Personalized Learning Path",
                    "description": f"Based on your selection of {', '.join(serializer.validated_data['selected_skills'])}",
                    "duration": "12 weeks",
                    "match_percentage": 98
                }
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Authentication Views
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            
            if user:
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user': UserSerializer(user).data
                })
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        # Delete the token to logout
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
