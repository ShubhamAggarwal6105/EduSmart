"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Progress } from "../components/ui/Progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import {
  CheckCircle,
  Clock,
  Play,
  FileText,
  Award,
  ArrowLeft,
  Brain,
  Lock,
  Unlock,
  Video,
  MessageSquare,
  Download,
  PenTool,
} from "lucide-react"
import { Badge } from "../components/ui/Badge"
import { Separator } from "../components/ui/Separator"
import { Skeleton } from "../components/ui/Skeleton"

interface Quiz {
  id: number
  title: string
  description: string | null
  duration: string
  difficulty: string
  questions_count: number
  is_completed: boolean
}

interface Topic {
  id: number
  title: string
  description: string | null
  order: number
  duration: string
  is_completed: boolean
  quizzes: Quiz[]
}

interface LearningJourney {
  id: number
  title: string
  description: string | null
  total_lessons: number
  completed_lessons: number
  progress: number
  next_lesson: string | null
  topics: Topic[]
}

const Journey: React.FC = () => {
  const { journeyId } = useParams<{ journeyId: string }>()
  const navigate = useNavigate()
  const [journey, setJourney] = useState<LearningJourney | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call
        // For now, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // This would be the actual API call:
        // const response = await fetch(`/api/learning-journeys/${journeyId}/`)
        // const data = await response.json()

        // Mock data for demonstration
        const mockJourney: LearningJourney = {
          id: Number.parseInt(journeyId || "1"),
          title: "Introduction to Machine Learning",
          description: "Learn the fundamentals of machine learning algorithms and applications",
          total_lessons: 15,
          completed_lessons: 6,
          progress: 40,
          next_lesson: "Neural Networks Basics",
          topics: [
            {
              id: 1,
              title: "Introduction to ML Concepts",
              description: "Understand the basic concepts and terminology of machine learning",
              order: 1,
              duration: "2 hours",
              is_completed: true,
              quizzes: [
                {
                  id: 1,
                  title: "ML Fundamentals Quiz",
                  description: "Test your understanding of basic ML concepts",
                  duration: "15 minutes",
                  difficulty: "Beginner",
                  questions_count: 10,
                  is_completed: true,
                },
              ],
            },
            {
              id: 2,
              title: "Supervised Learning",
              description: "Learn about supervised learning algorithms and their applications",
              order: 2,
              duration: "3 hours",
              is_completed: true,
              quizzes: [
                {
                  id: 2,
                  title: "Supervised Learning Quiz",
                  description: "Test your knowledge of supervised learning algorithms",
                  duration: "20 minutes",
                  difficulty: "Intermediate",
                  questions_count: 12,
                  is_completed: true,
                },
              ],
            },
            {
              id: 3,
              title: "Unsupervised Learning",
              description: "Explore clustering, dimensionality reduction, and other unsupervised techniques",
              order: 3,
              duration: "2.5 hours",
              is_completed: false,
              quizzes: [
                {
                  id: 3,
                  title: "Clustering Algorithms Quiz",
                  description: "Test your understanding of K-means and hierarchical clustering",
                  duration: "25 minutes",
                  difficulty: "Intermediate",
                  questions_count: 15,
                  is_completed: false,
                },
              ],
            },
            {
              id: 4,
              title: "Neural Networks Basics",
              description: "Introduction to neural networks architecture and training",
              order: 4,
              duration: "4 hours",
              is_completed: false,
              quizzes: [
                {
                  id: 4,
                  title: "Neural Networks Quiz",
                  description: "Test your knowledge of neural network fundamentals",
                  duration: "30 minutes",
                  difficulty: "Advanced",
                  questions_count: 20,
                  is_completed: false,
                },
              ],
            },
            {
              id: 5,
              title: "Deep Learning",
              description: "Advanced neural networks and deep learning architectures",
              order: 5,
              duration: "5 hours",
              is_completed: false,
              quizzes: [
                {
                  id: 5,
                  title: "Deep Learning Quiz",
                  description: "Test your understanding of CNNs, RNNs, and transformers",
                  duration: "40 minutes",
                  difficulty: "Advanced",
                  questions_count: 25,
                  is_completed: false,
                },
              ],
            },
          ],
        }

        setJourney(mockJourney)
        setLoading(false)
      } catch (err) {
        setError("Failed to load journey details")
        setLoading(false)
        console.error(err)
      }
    }

    fetchJourney()
  }, [journeyId])

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </div>
        <div className="grid gap-6">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
      </div>
    )
  }

  if (error || !journey) {
    return (
      <div className="container mx-auto max-w-7xl py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-900/20">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-400">Error Loading Journey</h2>
          <p className="mt-2 text-red-700 dark:text-red-300">{error || "Journey not found"}</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl py-8">
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" className="mr-4" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{journey.title}</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{journey.description}</p>
        </div>
      </div>

      {/* Progress overview */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Progress</h2>
              <div className="mt-2 flex items-center">
                <Progress value={journey.progress} className="h-2.5 flex-1" />
                <span className="ml-4 font-medium text-gray-900 dark:text-white">{journey.progress}%</span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {journey.completed_lessons} of {journey.total_lessons} lessons completed
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <Clock size={16} className="mr-2" />
                {journey.topics.reduce((acc, topic) => acc + Number.parseFloat(topic.duration.split(" ")[0]), 0)} hours
                total
              </div>
              <div className="flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                <FileText size={16} className="mr-2" />
                {journey.topics.length} topics
              </div>
              <div className="flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <Brain size={16} className="mr-2" />
                {journey.topics.reduce((acc, topic) => acc + topic.quizzes.length, 0)} quizzes
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="curriculum" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>

        <TabsContent value="curriculum">
          <div className="space-y-6">
            {journey.topics.map((topic, index) => (
              <Card key={topic.id} className={topic.is_completed ? "border-green-200 dark:border-green-900" : ""}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start">
                    {/* Topic number and completion status */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl font-bold dark:bg-gray-800">
                      {topic.is_completed ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    {/* Topic content */}
                    <div className="flex-1">
                      <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{topic.title}</h3>
                          <p className="mt-1 text-gray-600 dark:text-gray-400">{topic.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock size={16} />
                          <span>{topic.duration}</span>
                        </div>
                      </div>

                      {/* Topic materials */}
                      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                          <div className="mr-3 rounded-md bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <Video size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Video Lecture</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">45 minutes</p>
                          </div>
                        </div>

                        <div className="flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                          <div className="mr-3 rounded-md bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                            <FileText size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Reading Materials</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">3 articles</p>
                          </div>
                        </div>

                        <div className="flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                          <div className="mr-3 rounded-md bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <PenTool size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">Practice Exercises</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">5 exercises</p>
                          </div>
                        </div>
                      </div>

                      {/* Quizzes */}
                      {topic.quizzes.length > 0 && (
                        <div className="mt-4">
                          <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Quizzes</h4>
                          {topic.quizzes.map((quiz) => (
                            <div
                              key={quiz.id}
                              className="mb-2 flex flex-col justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800 md:flex-row md:items-center"
                            >
                              <div className="mb-3 md:mb-0">
                                <div className="flex items-center">
                                  <h5 className="font-medium text-gray-900 dark:text-white">{quiz.title}</h5>
                                  {quiz.is_completed && (
                                    <Badge variant="success" className="ml-2">
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{quiz.description}</p>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    <span>{quiz.duration}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <FileText size={14} className="mr-1" />
                                    <span>{quiz.questions_count} questions</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Award size={14} className="mr-1" />
                                    <span>{quiz.difficulty}</span>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant={quiz.is_completed ? "outline" : "default"}
                                size="sm"
                                leftIcon={quiz.is_completed ? <CheckCircle size={16} /> : <Play size={16} />}
                              >
                                {quiz.is_completed ? "Review" : "Start Quiz"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900/50">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {topic.is_completed ? (
                      <>
                        <CheckCircle size={16} className="mr-2 text-green-500" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        {index > 0 && !journey.topics[index - 1].is_completed ? (
                          <>
                            <Lock size={16} className="mr-2" />
                            <span>Complete previous topic to unlock</span>
                          </>
                        ) : (
                          <>
                            <Unlock size={16} className="mr-2" />
                            <span>Available to start</span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <Button
                    variant={topic.is_completed ? "outline" : "default"}
                    disabled={index > 0 && !journey.topics[index - 1].is_completed && !topic.is_completed}
                  >
                    {topic.is_completed ? "Review Topic" : "Start Learning"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>Additional materials to help you master the concepts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Recommended Books</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {
                            [
                              "Machine Learning: A Probabilistic Perspective",
                              "Deep Learning",
                              "Pattern Recognition and Machine Learning",
                            ][i - 1]
                          }
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {
                            ["Kevin Murphy", "Ian Goodfellow, Yoshua Bengio & Aaron Courville", "Christopher Bishop"][
                              i - 1
                            ]
                          }
                        </p>
                        <Button variant="outline" size="sm" className="mt-3" leftIcon={<Download size={14} />}>
                          Download PDF
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Supplementary Videos</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                        <div className="aspect-video rounded-md bg-gray-200 dark:bg-gray-800"></div>
                        <h4 className="mt-3 font-medium text-gray-900 dark:text-white">
                          {
                            [
                              "Introduction to Neural Networks",
                              "Backpropagation Explained",
                              "Convolutional Neural Networks",
                              "Recurrent Neural Networks",
                            ][i - 1]
                          }
                        </h4>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Duration: {["18:24", "32:15", "45:30", "27:45"][i - 1]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Cheat Sheets</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                        <div className="flex items-center">
                          <FileText size={24} className="mr-3 text-blue-500" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {
                                [
                                  "ML Algorithms Cheat Sheet",
                                  "Neural Networks Architecture",
                                  "Math for Machine Learning",
                                ][i - 1]
                              }
                            </h4>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">PDF • 2 pages</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2 w-full" leftIcon={<Download size={14} />}>
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussion">
          <Card>
            <CardHeader>
              <CardTitle>Discussion Forum</CardTitle>
              <CardDescription>Connect with other learners and ask questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Discussions</h3>
                  <div className="mt-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {
                                  [
                                    "Understanding backpropagation",
                                    "Help with CNN architecture",
                                    "Overfitting problems",
                                  ][i - 1]
                                }
                              </h4>
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Started by {["Alex Johnson", "Maria Garcia", "Sam Wilson"][i - 1]} •{" "}
                                {["2 days ago", "Yesterday", "5 hours ago"][i - 1]}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{["12 replies", "8 replies", "3 replies"][i - 1]}</Badge>
                        </div>
                        <p className="mt-3 text-gray-700 dark:text-gray-300">
                          {
                            [
                              "I'm having trouble understanding how backpropagation works in neural networks. Can someone explain?",
                              "What's the best CNN architecture for image classification tasks with limited training data?",
                              "My model is overfitting badly. I've tried regularization but still having issues. Any suggestions?",
                            ][i - 1]
                          }
                        </p>
                        <Button variant="ghost" size="sm" className="mt-3" leftIcon={<MessageSquare size={14} />}>
                          View Discussion
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Start a New Discussion</h3>
                  <div className="mt-4 space-y-4">
                    <input
                      type="text"
                      placeholder="Discussion title"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
                    />
                    <textarea
                      placeholder="What would you like to discuss?"
                      className="w-full rounded-md border border-gray-300 p-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-900"
                      rows={4}
                    />
                    <Button>Post Discussion</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Journey
