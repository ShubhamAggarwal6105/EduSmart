"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Progress } from "../components/ui/Progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Skeleton } from "../components/ui/Skeleton"
import {
  BookOpen,
  ChevronRight,
  Clock,
  Award,
  BarChart,
  Plus,
  ArrowUpRight,
  CheckCircle,
  Calendar,
  Brain,
  MessageSquare,
  Lightbulb,
  Target,
  Loader,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import toast from "react-hot-toast"

interface LearningJourney {
  id: number
  title: string
  description: string
  total_lessons: number
  completed_lessons: number
  progress: number
  next_lesson: string
  topics: Topic[]
}

interface Topic {
  id: number
  title: string
  description: string
  order: number
  duration: string
  is_completed: boolean
  quizzes: Quiz[]
}

interface Quiz {
  id: number
  title: string
  description: string
  duration: string
  difficulty: string
  questions_count: number
  is_completed: boolean
}

interface LearningPath {
  id: number
  title: string
  description: string
  duration: string
  match_percentage: number
  journeys: LearningJourney[]
}

interface UserStats {
  courses_completed: number
  quizzes_taken: number
  overall_progress: number
  courses_completed_this_month: number
  quizzes_taken_this_week: number
  streak: number
}

interface QuizHistoryItem {
  id?: number
  quiz?: number
  date: string
  score: number
}

interface LearningInsight {
  id?: number
  insight_type?: string
  description: string
}

interface Recommendation {
  title: string
  description: string
  reason: string
  match_percentage: number
}

const Dashboard: React.FC = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [journeys, setJourneys] = useState<LearningJourney[]>([])
  const [recentPaths, setRecentPaths] = useState<LearningPath[]>([])
  const [stats, setStats] = useState<UserStats>({
    courses_completed: 0,
    quizzes_taken: 0,
    overall_progress: 0,
    courses_completed_this_month: 0,
    quizzes_taken_this_week: 0,
    streak: 0,
  })
  const [feedback, setFeedback] = useState("")
  const [question, setQuestion] = useState("")
  const [isAskingQuestion, setIsAskingQuestion] = useState(false)
  const [aiAnswer, setAiAnswer] = useState<string | null>(null)

  // Add new state variables for quiz history and learning insights
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([])
  const [strengths, setStrengths] = useState<LearningInsight[]>([])
  const [improvements, setImprovements] = useState<LearningInsight[]>([])
  const [insightsLoading, setInsightsLoading] = useState(true)
  const [quizHistoryLoading, setQuizHistoryLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [recommendationsLoading, setRecommendationsLoading] = useState(true)

  // Mock data for parts that aren't yet connected to the backend
  const upcomingQuizzes = [
    {
      id: 1,
      title: "Machine Learning Algorithms",
      date: "Today",
      difficulty: "Intermediate",
      questions: 15,
      estimatedTime: "25 min",
    },
    {
      id: 2,
      title: "Statistics Fundamentals",
      date: "Tomorrow",
      difficulty: "Beginner",
      questions: 10,
      estimatedTime: "15 min",
    },
  ]

  useEffect(() => {
    // Add this function at the beginning of the useEffect
    const fetchDashboardData = async () => {
      try {
        console.log("Using token for requests:", token)
        const loadingToast = toast.loading("Loading your dashboard data...")

        // Fetch user stats
        const statsResponse = await fetch("http://localhost:8000/api/user-stats/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        console.log("Stats response status:", statsResponse.status)

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        } else {
          console.error("Failed to fetch user stats:", await statsResponse.text())
          // Use default stats if API fails
        }

        // Fetch learning paths
        const pathsResponse = await fetch("http://localhost:8000/api/learning-paths/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (pathsResponse.ok) {
          const pathsData = await pathsResponse.json()

          // Get the 3 most recent paths
          const recent = pathsData.slice(0, 3)
          setRecentPaths(recent)

          // Extract all journeys from the paths
          const allJourneys: LearningJourney[] = []

          // Fetch detailed data for each path to get journeys
          for (const path of recent) {
            try {
              const detailResponse = await fetch(`http://localhost:8000/api/learning-paths/${path.id}/`, {
                headers: {
                  Authorization: `Token ${token}`,
                },
              })

              if (detailResponse.ok) {
                const detailData = await detailResponse.json()
                if (detailData.journeys) {
                  // Assign user to journeys if not already assigned
                  for (const journey of detailData.journeys) {
                    // Add the journey to our list
                    allJourneys.push(journey)
                  }
                }
              }
            } catch (error) {
              console.error(`Error fetching details for path ${path.id}:`, error)
            }
          }

          setJourneys(allJourneys)
          toast.dismiss(loadingToast)
        } else {
          console.error("Failed to fetch learning paths:", await pathsResponse.text())
          toast.error("Failed to load learning paths")
          toast.dismiss(loadingToast)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    // Add new fetch functions for quiz history and learning insights
    const fetchQuizHistory = async () => {
      try {
        setQuizHistoryLoading(true)
        const response = await fetch("http://localhost:8000/api/quiz-performance/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setQuizHistory(data)
        } else {
          console.error("Failed to fetch quiz history:", await response.text())
          // Fallback to mock data if API fails
          setQuizHistory([
            { date: "2024-01", score: 75 },
            { date: "2024-02", score: 82 },
            { date: "2024-03", score: 78 },
            { date: "2024-04", score: 85 },
            { date: "2024-05", score: 90 },
          ])
        }
      } catch (error) {
        console.error("Error fetching quiz history:", error)
        // Fallback to mock data if API fails
        setQuizHistory([
          { date: "2024-01", score: 75 },
          { date: "2024-02", score: 82 },
          { date: "2024-03", score: 78 },
          { date: "2024-04", score: 85 },
          { date: "2024-05", score: 90 },
        ])
      } finally {
        setQuizHistoryLoading(false)
      }
    }

    const fetchLearningInsights = async () => {
      try {
        setInsightsLoading(true)
        const response = await fetch("http://localhost:8000/api/learning-insights/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setStrengths(data.strengths)
          setImprovements(data.improvements)
        } else {
          console.error("Failed to fetch learning insights:", await response.text())
          // Fallback to mock data if API fails
          setStrengths([
            { description: "Strong understanding of basic programming concepts" },
            { description: "Excellent problem-solving skills" },
            { description: "Quick grasp of algorithmic thinking" },
          ])
          setImprovements([
            { description: "Need more practice with advanced data structures" },
            { description: "Can improve code optimization techniques" },
            { description: "Review time complexity analysis" },
          ])
        }
      } catch (error) {
        console.error("Error fetching learning insights:", error)
        // Fallback to mock data if API fails
        setStrengths([
          { description: "Strong understanding of basic programming concepts" },
          { description: "Excellent problem-solving skills" },
          { description: "Quick grasp of algorithmic thinking" },
        ])
        setImprovements([
          { description: "Need more practice with advanced data structures" },
          { description: "Can improve code optimization techniques" },
          { description: "Review time complexity analysis" },
        ])
      } finally {
        setInsightsLoading(false)
      }
    }

    const fetchRecommendations = async () => {
      try {
        setRecommendationsLoading(true)
        const response = await fetch("http://localhost:8000/api/recommendations/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setRecommendations(data)
        } else {
          console.error("Failed to fetch recommendations:", await response.text())
          // Fallback to mock data if API fails
          setRecommendations([
            {
              title: "Machine Learning Fundamentals",
              description: "Learn the basics of machine learning algorithms and applications",
              reason: "Based on your interest in data science",
              match_percentage: 95,
            },
            {
              title: "Advanced JavaScript",
              description: "Take your web development skills to the next level",
              reason: "Complements your web development knowledge",
              match_percentage: 88,
            },
            {
              title: "Data Visualization",
              description: "Learn to create compelling visualizations",
              reason: "Builds on your Python skills",
              match_percentage: 92,
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        // Fallback to mock data if API fails
        setRecommendations([
          {
            title: "Machine Learning Fundamentals",
            description: "Learn the basics of machine learning algorithms and applications",
            reason: "Based on your interest in data science",
            match_percentage: 95,
          },
          {
            title: "Advanced JavaScript",
            description: "Take your web development skills to the next level",
            reason: "Complements your web development knowledge",
            match_percentage: 88,
          },
          {
            title: "Data Visualization",
            description: "Learn to create compelling visualizations",
            reason: "Builds on your Python skills",
            match_percentage: 92,
          },
        ])
      } finally {
        setRecommendationsLoading(false)
      }
    }

    fetchDashboardData()
    fetchQuizHistory()
    fetchLearningInsights()
    fetchRecommendations()
  }, [token])

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question")
      return
    }

    setIsAskingQuestion(true)
    setAiAnswer(null)

    try {
      const response = await fetch("http://localhost:8000/api/ask-ai-tutor/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ question }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiAnswer(data.answer)
      } else {
        console.error("Failed to get AI tutor response:", await response.text())
        toast.error("Failed to get answer from AI tutor")
      }
    } catch (error) {
      console.error("Error asking AI tutor:", error)
      toast.error("An error occurred while asking the AI tutor")
    } finally {
      setIsAskingQuestion(false)
    }
  }

  const handleSubmitFeedback = () => {
    if (feedback.trim()) {
      toast.success("Thank you for your feedback!")
      setFeedback("")
    } else {
      toast.error("Please enter your feedback")
    }
  }

  const handleGetPersonalizedPlan = () => {
    toast.loading("Generating your personalized plan...")

    // Navigate to roadmap with a query parameter to trigger the modal
    navigate("/roadmap?generate=true")
  }

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-8 flex flex-col justify-between md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.first_name || user?.username || "Student"}!
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Here's an overview of your learning journey</p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0">
          <Button
            variant="default"
            leftIcon={<Brain size={18} />}
            onClick={() => {
              if (journeys.length > 0) {
                navigate(`/journey/${journeys[0].id}`)
              } else {
                navigate("/roadmap")
              }
            }}
          >
            Continue Learning
          </Button>
          <Button variant="outline" onClick={() => navigate("/roadmap")}>
            View All Courses
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Completed</p>
                <h3 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? <Skeleton className="h-9 w-16" /> : stats.courses_completed}
                </h3>
              </div>
              <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <BookOpen size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <ArrowUpRight size={18} className="mr-1" />
              <span>+{loading ? "..." : stats.courses_completed_this_month} this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quizzes Taken</p>
                <h3 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? <Skeleton className="h-9 w-16" /> : stats.quizzes_taken}
                </h3>
              </div>
              <div className="rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <CheckCircle size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <ArrowUpRight size={18} className="mr-1" />
              <span>+{loading ? "..." : stats.quizzes_taken_this_week} this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Progress</p>
                <h3 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? <Skeleton className="h-9 w-16" /> : `${stats.overall_progress}%`}
                </h3>
              </div>
              <div className="rounded-full bg-teal-100 p-3 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <BarChart size={24} />
              </div>
            </div>
            <div className="mt-3 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              {loading ? (
                <Skeleton className="h-2.5 w-full" />
              ) : (
                <div className="h-2.5 rounded-full bg-teal-600" style={{ width: `${stats.overall_progress}%` }}></div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Learning Streak</p>
                <h3 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? <Skeleton className="h-9 w-16" /> : `${stats.streak} days`}
                </h3>
              </div>
              <div className="rounded-full bg-yellow-100 p-3 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Award size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Calendar size={18} className="mr-1" />
              <span>Keep it up!</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Learning Paths */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Learning Paths</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/roadmap")} rightIcon={<ArrowUpRight size={16} />}>
            View All
          </Button>
        </div>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="mb-4 h-4 w-1/2" />
                  <Skeleton className="mb-4 h-2 w-full" />
                  <Skeleton className="mb-4 h-4 w-2/3" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : journeys.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {journeys.map((journey) => (
              <Card key={journey.id}>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{journey.title}</h3>
                  <div className="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      {journey.completed_lessons} of {journey.total_lessons} lessons
                    </span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{journey.progress}%</span>
                  </div>
                  <div className="mb-4 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${journey.progress}%` }}></div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Next lesson:</p>
                    <p className="text-gray-600 dark:text-gray-400">{journey.next_lesson}</p>
                  </div>
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<BookOpen size={16} />}
                    onClick={() => navigate(`/journey/${journey.id}`)}
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <BookOpen className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No Active Journeys</h3>
            <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
              Start a learning journey to track your progress and continue your learning.
            </p>
            <Button onClick={() => navigate("/roadmap")} leftIcon={<Plus size={16} />}>
              Generate Learning Path
            </Button>
          </div>
        )}
      </div>

      {/* Upcoming Quizzes & Recommendations */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Upcoming Quizzes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Quizzes</CardTitle>
              <CardDescription>Prepare for these quizzes to test your knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="rounded-md bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Brain size={24} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{quiz.title}</h4>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            <span>{quiz.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            <span>{quiz.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Start
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" fullWidth className="mt-4" onClick={() => navigate("/quizzes")}>
                View All Quizzes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div>
          <Card className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
            <CardHeader>
              <CardTitle className="text-white">Recommended for You</CardTitle>
              <CardDescription className="text-blue-100">Based on your learning patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendationsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <Skeleton className="mb-2 h-5 w-3/4 bg-white/20" />
                      <Skeleton className="h-4 w-full bg-white/20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <h4 className="font-medium">{recommendation.title}</h4>
                      <p className="mt-1 text-sm text-blue-100">{recommendation.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-blue-200">{recommendation.reason}</span>
                        <span className="text-xs font-medium text-blue-200">
                          {recommendation.match_percentage}% Match
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                fullWidth
                className="mt-4 border-white text-white hover:bg-white/20"
                onClick={handleGetPersonalizedPlan}
              >
                Get Personalized Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quiz Performance and Feedback */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Quiz Performance Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Quiz Performance</CardTitle>
            <CardDescription>Your score history and progress</CardDescription>
          </CardHeader>
          <CardContent>
            {quizHistoryLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={quizHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>AI Learning Analysis</CardTitle>
            <CardDescription>Personalized insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {insightsLoading ? (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                    <Target size={20} className="mr-2 text-green-500" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {[1, 2, 3].map((index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        <Skeleton className="h-4 w-full" />
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                    <Lightbulb size={20} className="mr-2 text-yellow-500" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {[1, 2, 3].map((index) => (
                      <li key={index} className="flex items-center">
                        <ArrowUpRight size={16} className="mr-2 text-yellow-500" />
                        <Skeleton className="h-4 w-full" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                    <Target size={20} className="mr-2 text-green-500" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {strengths.map((strength, index) => (
                      <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        {strength.description}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center text-lg font-semibold text-gray-900 dark:text-white">
                    <Lightbulb size={20} className="mr-2 text-yellow-500" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {improvements.map((improvement, index) => (
                      <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                        <ArrowUpRight size={16} className="mr-2 text-yellow-500" />
                        {improvement.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Interaction */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ask AI */}
        <Card>
          <CardHeader>
            <CardTitle>Ask AI Tutor</CardTitle>
            <CardDescription>Get instant help with your questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Type your question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleAskQuestion()
                  }
                }}
              />
              <Button
                variant="default"
                className="w-full"
                leftIcon={
                  isAskingQuestion ? <Loader className="animate-spin" size={18} /> : <MessageSquare size={18} />
                }
                onClick={handleAskQuestion}
                disabled={isAskingQuestion || !question.trim()}
              >
                {isAskingQuestion ? "Getting Answer..." : "Ask Question"}
              </Button>

              {aiAnswer && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                  <h4 className="mb-2 font-medium text-gray-900 dark:text-white">AI Tutor Response:</h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{aiAnswer}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Provide Feedback</CardTitle>
            <CardDescription>Help us improve your learning experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                className="w-full rounded-md border border-gray-300 p-3 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
                rows={4}
                placeholder="Share your thoughts and suggestions..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <Button variant="outline" className="w-full" onClick={handleSubmitFeedback}>
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Original Tabs Content - Hidden but kept for reference */}
      <div className="hidden">
        <Tabs defaultValue="journeys" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="journeys">Active Journeys</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          </TabsList>

          <TabsContent value="journeys">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="mb-2 h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="mb-4 h-2 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : journeys.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {journeys.map((journey) => (
                  <Card key={journey.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{journey.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{journey.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress: {journey.completed_lessons}/{journey.total_lessons} lessons
                          </span>
                          <span className="font-medium">{journey.progress}%</span>
                        </div>
                        <Progress value={journey.progress} className="h-2" />
                      </div>
                      {journey.next_lesson && (
                        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Next up:</span> {journey.next_lesson}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-gray-50 pt-2 dark:bg-gray-800/50">
                      <Button
                        variant="ghost"
                        className="w-full justify-between"
                        onClick={() => navigate(`/journey/${journey.id}`)}
                      >
                        Continue <ChevronRight size={16} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
                <BookOpen className="mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No Learning Paths</h3>
                <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
                  Generate your first personalized learning path to start your educational journey.
                </p>
                <Button onClick={() => navigate("/roadmap")} leftIcon={<Plus size={16} />}>
                  Generate Learning Path
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Dashboard
