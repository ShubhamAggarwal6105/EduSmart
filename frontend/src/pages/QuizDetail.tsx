"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/Card"
import { RadioGroup, RadioGroupItem } from "../components/ui/RadioGroup"
import { Label } from "../components/ui/Label"
import { Progress } from "../components/ui/Progress"
import { Skeleton } from "../components/ui/Skeleton"
import { Clock, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight, Award, Loader } from "lucide-react"
import toast from "react-hot-toast"

interface Question {
  id: number
  text: string
  options: string[]
  correct_answer: number
}

interface Quiz {
  id: number
  title: string
  description: string
  duration: string
  difficulty: string
  questions: Question[]
  is_completed: boolean
}

const QuizDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [isSavingResult, setIsSavingResult] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true)
      try {
        // In a real app, this would fetch from your API
        // For now, we'll create a mock quiz
        const mockQuiz: Quiz = {
          id: Number.parseInt(id || "0"),
          title: "Python Fundamentals Quiz",
          description: "Test your knowledge of Python basics",
          duration: "30 minutes",
          difficulty: "Intermediate",
          is_completed: false,
          questions: [
            {
              id: 1,
              text: "What is the output of print(type(1/2)) in Python 3?",
              options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'decimal'>"],
              correct_answer: 1,
            },
            {
              id: 2,
              text: "Which of the following is not a valid way to create a list in Python?",
              options: ["list()", "[]", "list = (1, 2, 3)", "list = [1, 2, 3]"],
              correct_answer: 2,
            },
            {
              id: 3,
              text: "What does the 'self' keyword represent in a Python class?",
              options: [
                "It refers to the class itself",
                "It refers to the current instance of the class",
                "It is a reserved keyword for future use",
                "It refers to the parent class",
              ],
              correct_answer: 1,
            },
            {
              id: 4,
              text: "Which of the following is not a built-in data type in Python?",
              options: ["list", "dictionary", "tuple", "array"],
              correct_answer: 3,
            },
            {
              id: 5,
              text: "What is the correct way to import a module named 'math' in Python?",
              options: ["import math", "include math", "#include <math>", "using math"],
              correct_answer: 0,
            },
          ],
        }

        setQuiz(mockQuiz)
        setSelectedAnswers(new Array(mockQuiz.questions.length).fill(-1))

        // Set time remaining based on duration (for now, just a mock value)
        setTimeRemaining(30 * 60) // 30 minutes in seconds
      } catch (error) {
        console.error("Error fetching quiz:", error)
        toast.error("Failed to load quiz")
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [id])

  // Timer effect
  useEffect(() => {
    if (!loading && timeRemaining !== null && !quizSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(timer)
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [loading, timeRemaining, quizSubmitted])

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = Number.parseInt(value)
    setSelectedAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!quiz) return

    // Calculate score
    let correctAnswers = 0
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctAnswers++
      }
    })

    const calculatedScore = Math.round((correctAnswers / quiz.questions.length) * 100)
    setScore(calculatedScore)
    setQuizSubmitted(true)

    // Save the quiz result to the backend
    await saveQuizResult(calculatedScore)
  }

  const saveQuizResult = async (calculatedScore: number) => {
    if (!quiz || !token) return

    setIsSavingResult(true)
    try {
      const response = await fetch("http://localhost:8000/api/save-quiz-result/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          quiz_id: quiz.id,
          score: calculatedScore,
        }),
      })

      if (response.ok) {
        toast.success("Quiz result saved successfully!")
      } else {
        console.error("Failed to save quiz result:", await response.text())
        toast.error("Failed to save quiz result")
      }
    } catch (error) {
      console.error("Error saving quiz result:", error)
      toast.error("An error occurred while saving your quiz result")
    } finally {
      setIsSavingResult(false)
    }
  }

  const handleReviewQuiz = () => {
    setIsReviewing(true)
    setCurrentQuestionIndex(0)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="mb-2 h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-4 w-full" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
          <AlertTriangle className="mb-4 h-12 w-12 text-yellow-500" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Quiz Not Found</h3>
          <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
            The quiz you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate("/quizzes")}>Return to Quizzes</Button>
        </div>
      </div>
    )
  }

  if (quizSubmitted && !isReviewing) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{quiz.title} - Results</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{quiz.description}</p>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Award size={48} />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Quiz Completed!</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                You've completed the {quiz.title}. Here's how you did:
              </p>

              <div className="mb-8 w-full max-w-md">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Score</span>
                  <span className="text-sm font-medium">{score}%</span>
                </div>
                <Progress
                  value={score || 0}
                  className="h-3"
                  style={
                    {
                      backgroundColor: "#f3f4f6",
                      "--progress-background":
                        score && score >= 70 ? "#10b981" : score && score >= 40 ? "#f59e0b" : "#ef4444",
                    } as React.CSSProperties
                  }
                />
              </div>

              <div className="mb-8 grid w-full max-w-md grid-cols-2 gap-4 text-center">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Correct Answers</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(((score || 0) / 100) * quiz.questions.length)}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.questions.length}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                <Button variant="outline" onClick={() => navigate("/quizzes")}>
                  Back to Quizzes
                </Button>
                <Button onClick={handleReviewQuiz}>Review Answers</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isReviewing ? `${quiz.title} - Review` : quiz.title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{quiz.description}</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Clock size={20} />
              </div>
              {!isReviewing && timeRemaining !== null && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Time Remaining</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatTime(timeRemaining)}</p>
                </div>
              )}
              {isReviewing && (
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Review Mode</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Answers Revealed</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Question</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-2" />
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">{currentQuestion.text}</h3>
              <RadioGroup
                value={selectedAnswers[currentQuestionIndex].toString()}
                onValueChange={handleAnswerSelect}
                disabled={isReviewing}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center rounded-lg border p-4 ${
                        isReviewing
                          ? index === currentQuestion.correct_answer
                            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                            : selectedAnswers[currentQuestionIndex] === index
                              ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                              : "border-gray-200 dark:border-gray-700"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="ml-3 flex-1 cursor-pointer text-gray-700 dark:text-gray-300"
                      >
                        {option}
                      </Label>
                      {isReviewing && index === currentQuestion.correct_answer && (
                        <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            leftIcon={<ArrowLeft size={16} />}
          >
            Previous
          </Button>
          <div>
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              isReviewing ? (
                <Button onClick={() => navigate("/quizzes")}>Finish Review</Button>
              ) : (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={isSavingResult}
                  leftIcon={isSavingResult ? <Loader className="animate-spin" size={16} /> : undefined}
                >
                  {isSavingResult ? "Submitting..." : "Submit Quiz"}
                </Button>
              )
            ) : (
              <Button onClick={handleNextQuestion} rightIcon={<ArrowRight size={16} />}>
                Next
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default QuizDetail
