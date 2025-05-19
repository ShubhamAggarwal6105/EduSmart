import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Brain, Clock, BarChart2, Award, ChevronRight, Filter, Search } from 'lucide-react';
import { Input } from '../components/ui/Input';

const Quizzes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const quizzes = [
    {
      id: 1,
      title: 'Introduction to Machine Learning',
      description: 'Test your knowledge of ML fundamentals',
      difficulty: 'Beginner',
      category: 'AI & ML',
      questions: 15,
      timeLimit: '30 minutes',
      completions: 1234,
      avgScore: 85,
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg'
    },
    {
      id: 2,
      title: 'Advanced Data Structures',
      description: 'Challenge yourself with complex data structures',
      difficulty: 'Advanced',
      category: 'Programming',
      questions: 20,
      timeLimit: '45 minutes',
      completions: 856,
      avgScore: 72,
      image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg'
    },
    {
      id: 3,
      title: 'Web Development Basics',
      description: 'Essential concepts of web development',
      difficulty: 'Beginner',
      category: 'Web Dev',
      questions: 25,
      timeLimit: '40 minutes',
      completions: 2156,
      avgScore: 88,
      image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg'
    },
    {
      id: 4,
      title: 'Database Design Principles',
      description: 'Master database normalization and design',
      difficulty: 'Intermediate',
      category: 'Databases',
      questions: 18,
      timeLimit: '35 minutes',
      completions: 945,
      avgScore: 76,
      image: 'https://images.pexels.com/photos/7654096/pexels-photo-7654096.jpeg'
    }
  ];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Quizzes</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Test your knowledge and track your progress with our AI-powered quizzes
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Input
          placeholder="Search quizzes..."
          icon={<Search size={18} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
        <select
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="all">All Difficulties</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="AI & ML">AI & ML</option>
          <option value="Programming">Programming</option>
          <option value="Web Dev">Web Development</option>
          <option value="Databases">Databases</option>
        </select>
      </div>

      {/* Quiz Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} hover className="overflow-hidden">
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={quiz.image}
                alt={quiz.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                  {quiz.difficulty}
                </span>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {quiz.title}
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">{quiz.description}</p>
              
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Brain size={18} className="mr-2" />
                  <span>{quiz.questions} questions</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock size={18} className="mr-2" />
                  <span>{quiz.timeLimit}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <BarChart2 size={18} className="mr-2" />
                  <span>{quiz.avgScore}% avg score</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Award size={18} className="mr-2" />
                  <span>{quiz.completions} completed</span>
                </div>
              </div>

              <Link to={`/quiz/${quiz.id}`}>
                <Button 
                  variant="default" 
                  fullWidth 
                  rightIcon={<ChevronRight size={18} />}
                >
                  Start Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="mt-8 text-center">
          <Brain className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No quizzes found
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
};

export default Quizzes;