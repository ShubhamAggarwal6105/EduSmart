import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Brain, Clock, Award, AlertCircle, CheckCircle, ChevronRight, HelpCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QuizDetail: React.FC = () => {
  const { id } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  // Mock quiz data
  const quiz = {
    id,
    title: 'Machine Learning Fundamentals',
    description: 'Test your knowledge of basic machine learning concepts and algorithms.',
    totalQuestions: 10,
    timeLimit: 20, // minutes
    difficulty: 'Intermediate',
    category: 'Computer Science',
    questions: [
      {
        id: 1,
        question: 'What is the main purpose of supervised learning?',
        options: [
          'To find patterns in unlabeled data',
          'To predict outcomes based on labeled training data',
          'To group similar data points together',
          'To optimize system parameters randomly'
        ],
        correctAnswer: 1,
        explanation: 'Supervised learning uses labeled training data to learn patterns and make predictions on new, unseen data. The algorithm learns from examples where the correct output is provided.'
      },
      // More questions would be loaded from the backend in a real application
    ] as Question[]
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    // In a real app, this would be handled by the backend
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const currentQuestionData = quiz.questions[currentQuestion];
  const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;
  const isQuizComplete = currentQuestion === quiz.questions.length - 1 && selectedAnswer !== null;

  const calculateScore = () => {
    const correctAnswers = answers.filter((answer, index) => 
      answer === quiz.questions[index].correctAnswer
    ).length;
    return (correctAnswers / quiz.questions.length) * 100;
  };

  return (
    <div className="container mx-auto max-w-4xl py-8">
      {/* Quiz Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{quiz.description}</p>
        
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Brain size={18} />
            <span>Difficulty: {quiz.difficulty}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock size={18} />
            <span>{quiz.timeLimit} minutes</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Award size={18} />
            <span>{quiz.category}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <HelpCircle size={18} />
            <span>{quiz.totalQuestions} Questions</span>
          </div>
        </div>

        <div className="mt-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
      </div>

      {/* Question Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestionData.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentQuestionData.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  selectedAnswer === null
                    ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/30'
                    : selectedAnswer === index
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-900/30'
                        : 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-900/30'
                      : index === currentQuestionData.correctAnswer && showExplanation
                        ? 'border-green-500 bg-green-50 dark:border-green-500 dark:bg-green-900/30'
                        : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer === index && (
                    isCorrect 
                      ? <CheckCircle className="h-5 w-5 text-green-500" />
                      : <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  {index === currentQuestionData.correctAnswer && showExplanation && selectedAnswer !== index && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/30">
              <h4 className="mb-2 font-semibold text-blue-900 dark:text-blue-300">Explanation</h4>
              <p className="text-blue-800 dark:text-blue-200">{currentQuestionData.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <div></div> {/* Spacer for alignment */}
        {isQuizComplete ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Quiz Complete!</CardTitle>
              <CardDescription>
                You've completed the quiz. Here's how you did:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Score: {calculateScore()}%
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-2 rounded-full bg-green-600"
                    style={{ width: `${calculateScore()}%` }}
                  ></div>
                </div>
              </div>
              <Button variant="default" fullWidth>
                Review Answers
              </Button>
            </CardContent>
          </Card>
        ) : (
          selectedAnswer !== null && (
            <Button 
              onClick={handleNextQuestion}
              rightIcon={<ChevronRight size={16} />}
            >
              Next Question
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default QuizDetail;