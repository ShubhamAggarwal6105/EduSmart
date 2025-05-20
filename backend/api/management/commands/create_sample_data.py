from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import LearningPath, LearningJourney, Topic, Quiz, UserProfile, UserStats, UserActivity, QuizResult, LearningInsight
from django.utils import timezone
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Creates sample data for the EduSmart application'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create sample learning paths
        self.create_sample_learning_paths()
        
        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
    
    def create_sample_learning_paths(self):
        # Sample learning paths
        paths_data = [
            {
                "title": "Python Programming Mastery",
                "description": "A comprehensive learning path to master Python programming from basics to advanced concepts.",
                "duration": "8 weeks",
                "match_percentage": 95,
                "journeys": [
                    {
                        "title": "Python Fundamentals",
                        "description": "Learn the core concepts of Python programming language",
                        "topics": [
                            {
                                "title": "Python Basics",
                                "description": "Introduction to Python syntax, variables, and data types",
                                "duration": "6 hours",
                                "quizzes": [
                                    {
                                        "title": "Python Syntax Quiz",
                                        "description": "Test your understanding of Python syntax",
                                        "duration": "30 minutes",
                                        "difficulty": "Beginner",
                                        "questions_count": 10
                                    }
                                ]
                            },
                            {
                                "title": "Control Flow",
                                "description": "Learn about conditionals, loops, and control structures",
                                "duration": "5 hours",
                                "quizzes": [
                                    {
                                        "title": "Control Flow Quiz",
                                        "description": "Test your knowledge of Python control flow",
                                        "duration": "30 minutes",
                                        "difficulty": "Beginner",
                                        "questions_count": 12
                                    }
                                ]
                            },
                            {
                                "title": "Functions and Modules",
                                "description": "Learn how to create and use functions and modules",
                                "duration": "8 hours",
                                "quizzes": [
                                    {
                                        "title": "Functions Quiz",
                                        "description": "Test your understanding of Python functions",
                                        "duration": "45 minutes",
                                        "difficulty": "Intermediate",
                                        "questions_count": 15
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Python Advanced Concepts",
                        "description": "Dive deeper into Python with advanced programming concepts",
                        "topics": [
                            {
                                "title": "Object-Oriented Programming",
                                "description": "Learn about classes, inheritance, and OOP principles",
                                "duration": "10 hours",
                                "quizzes": [
                                    {
                                        "title": "OOP Quiz",
                                        "description": "Test your understanding of object-oriented programming",
                                        "duration": "60 minutes",
                                        "difficulty": "Advanced",
                                        "questions_count": 20
                                    }
                                ]
                            },
                            {
                                "title": "Error Handling",
                                "description": "Learn about exceptions and error handling in Python",
                                "duration": "4 hours",
                                "quizzes": [
                                    {
                                        "title": "Error Handling Quiz",
                                        "description": "Test your knowledge of Python exceptions",
                                        "duration": "30 minutes",
                                        "difficulty": "Intermediate",
                                        "questions_count": 10
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "title": "Web Development Fundamentals",
                "description": "Learn the essential skills for modern web development.",
                "duration": "10 weeks",
                "match_percentage": 88,
                "journeys": [
                    {
                        "title": "Frontend Basics",
                        "description": "Learn the fundamentals of frontend web development",
                        "topics": [
                            {
                                "title": "HTML and CSS",
                                "description": "Learn the building blocks of web pages",
                                "duration": "8 hours",
                                "quizzes": [
                                    {
                                        "title": "HTML Quiz",
                                        "description": "Test your understanding of HTML",
                                        "duration": "30 minutes",
                                        "difficulty": "Beginner",
                                        "questions_count": 15
                                    },
                                    {
                                        "title": "CSS Quiz",
                                        "description": "Test your knowledge of CSS styling",
                                        "duration": "30 minutes",
                                        "difficulty": "Beginner",
                                        "questions_count": 15
                                    }
                                ]
                            },
                            {
                                "title": "JavaScript Basics",
                                "description": "Introduction to JavaScript programming",
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
                            }
                        ]
                    },
                    {
                        "title": "Backend Development",
                        "description": "Learn server-side programming and databases",
                        "topics": [
                            {
                                "title": "Node.js Fundamentals",
                                "description": "Learn the basics of Node.js for backend development",
                                "duration": "12 hours",
                                "quizzes": [
                                    {
                                        "title": "Node.js Quiz",
                                        "description": "Test your understanding of Node.js",
                                        "duration": "45 minutes",
                                        "difficulty": "Intermediate",
                                        "questions_count": 15
                                    }
                                ]
                            },
                            {
                                "title": "Database Fundamentals",
                                "description": "Learn about SQL and NoSQL databases",
                                "duration": "10 hours",
                                "quizzes": [
                                    {
                                        "title": "Database Quiz",
                                        "description": "Test your knowledge of database concepts",
                                        "duration": "60 minutes",
                                        "difficulty": "Advanced",
                                        "questions_count": 20
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "title": "Data Science Essentials",
                "description": "Master the fundamentals of data science and analysis.",
                "duration": "12 weeks",
                "match_percentage": 92,
                "journeys": [
                    {
                        "title": "Data Analysis Fundamentals",
                        "description": "Learn the basics of data analysis and visualization",
                        "topics": [
                            {
                                "title": "Introduction to Data Science",
                                "description": "Overview of data science concepts and applications",
                                "duration": "6 hours",
                                "quizzes": [
                                    {
                                        "title": "Data Science Concepts Quiz",
                                        "description": "Test your understanding of data science fundamentals",
                                        "duration": "30 minutes",
                                        "difficulty": "Beginner",
                                        "questions_count": 10
                                    }
                                ]
                            },
                            {
                                "title": "Data Visualization",
                                "description": "Learn to create effective data visualizations",
                                "duration": "8 hours",
                                "quizzes": [
                                    {
                                        "title": "Data Visualization Quiz",
                                        "description": "Test your knowledge of data visualization techniques",
                                        "duration": "45 minutes",
                                        "difficulty": "Intermediate",
                                        "questions_count": 15
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "title": "Machine Learning Basics",
                        "description": "Introduction to machine learning algorithms and applications",
                        "topics": [
                            {
                                "title": "Supervised Learning",
                                "description": "Learn about regression, classification, and decision trees",
                                "duration": "12 hours",
                                "quizzes": [
                                    {
                                        "title": "Supervised Learning Quiz",
                                        "description": "Test your understanding of supervised learning algorithms",
                                        "duration": "60 minutes",
                                        "difficulty": "Advanced",
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
                                        "description": "Test your knowledge of unsupervised learning techniques",
                                        "duration": "45 minutes",
                                        "difficulty": "Advanced",
                                        "questions_count": 15
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
        
        # Create the learning paths
        for path_data in paths_data:
            # Create the learning path
            path = LearningPath.objects.create(
                title=path_data["title"],
                description=path_data["description"],
                duration=path_data["duration"],
                match_percentage=path_data["match_percentage"]
            )
            
            # Create journeys for this path
            for journey_data in path_data["journeys"]:
                journey = LearningJourney.objects.create(
                    title=journey_data["title"],
                    description=journey_data["description"],
                    learning_path=path,
                    total_lessons=len(journey_data["topics"]),
                    completed_lessons=0,
                    progress=0
                )
                
                # Create topics for this journey
                for i, topic_data in enumerate(journey_data["topics"]):
                    topic = Topic.objects.create(
                        title=topic_data["title"],
                        description=topic_data["description"],
                        learning_journey=journey,
                        order=i+1,
                        duration=topic_data["duration"]
                    )
                    
                    # Create quizzes for this topic
                    for quiz_data in topic_data["quizzes"]:
                        Quiz.objects.create(
                            title=quiz_data["title"],
                            description=quiz_data["description"],
                            topic=topic,
                            duration=quiz_data["duration"],
                            difficulty=quiz_data["difficulty"],
                            questions_count=quiz_data["questions_count"]
                        )
                
                # Update journey progress
                journey.update_progress()
            
            self.stdout.write(f"Created learning path: {path.title}")
