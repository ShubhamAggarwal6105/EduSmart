"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Loader, Plus, BookOpen, ChevronRight, X } from "lucide-react"
import toast from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs"
import { Badge } from "../components/ui/Badge"
import { Skeleton } from "../components/ui/Skeleton"

interface LearningPath {
  id: number
  title: string
  description: string
  duration: string
  match_percentage: number
  journeys?: LearningJourney[]
}

interface LearningJourney {
  id: number
  title: string
  description: string
  total_lessons: number
  completed_lessons: number
  progress: number
  next_lesson: string
}

const Roadmap: React.FC = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [topPaths, setTopPaths] = useState<LearningPath[]>([])
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    target_date: "",
    study_hours: 10,
    selected_skills: [""] as string[],
  })

  // Add this near the top of the component after the existing state declarations
  const [searchParams] = useState(new URLSearchParams(window.location.search))

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/learning-paths/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        const data = await response.json()
        setPaths(data)

        const topResponse = await fetch("http://localhost:8000/api/top-learning-paths/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        const topData = await response.json()
        setTopPaths(topData)
      } catch (error) {
        console.error("Error fetching learning paths:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPaths()
  }, [token])

  // Add this useEffect after the existing useEffect
  useEffect(() => {
    // Check if the generate parameter is present in the URL
    if (searchParams.get("generate") === "true") {
      setIsGenerateModalOpen(true)

      // Clear the toast if it exists
      toast.dismiss()
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "study_hours" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.selected_skills]
    newSkills[index] = value
    setFormData((prev) => ({
      ...prev,
      selected_skills: newSkills,
    }))
  }

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      selected_skills: [...prev.selected_skills, ""],
    }))
  }

  const removeSkill = (index: number) => {
    const newSkills = [...formData.selected_skills]
    newSkills.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      selected_skills: newSkills.length ? newSkills : [""],
    }))
  }

  const handleGeneratePath = async () => {
    // Validate form
    if (!formData.target_date) {
      toast.error("Please select a target date")
      return
    }

    if (formData.study_hours <= 0) {
      toast.error("Study hours must be greater than 0")
      return
    }

    if (formData.selected_skills.some((skill) => !skill.trim())) {
      toast.error("Please fill in all skills or remove empty ones")
      return
    }

    if (!token) {
      toast.error("You must be logged in to generate a learning path")
      return
    }

    setIsGenerating(true)
    const toastId = toast.loading("Generating your personalized learning path...")

    try {
      const response = await fetch("http://localhost:8000/api/generate-learning-path/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)

        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.error || `Failed with status: ${response.status}`)
        } catch (e) {
          throw new Error(`Failed with status: ${response.status}. Response: ${errorText}`)
        }
      }

      const data = await response.json()
      toast.success("Learning path generated successfully!", { id: toastId })
      setIsGenerateModalOpen(false)

      // Refresh the learning paths
      const pathsResponse = await fetch("http://localhost:8000/api/learning-paths/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      const pathsData = await pathsResponse.json()
      setPaths(pathsData)

      // Get the first journey ID from the newly created learning path
      if (data.journeys && data.journeys.length > 0) {
        // Navigate to the first journey of the learning path
        navigate(`/journey/${data.journeys[0].id}`)
      } else {
        // Fetch the detailed learning path to get journey IDs
        const detailResponse = await fetch(`http://localhost:8000/api/learning-paths/${data.id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (detailResponse.ok) {
          const detailData = await detailResponse.json()
          if (detailData.journeys && detailData.journeys.length > 0) {
            navigate(`/journey/${detailData.journeys[0].id}`)
          } else {
            // If no journeys, just go to the dashboard
            navigate("/dashboard")
          }
        } else {
          // If detail fetch fails, go to dashboard
          navigate("/dashboard")
        }
      }
    } catch (error) {
      console.error("Error generating learning path:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate learning path", { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleViewPath = async (pathId: number) => {
    try {
      // Fetch the detailed learning path to get journey IDs
      const response = await fetch(`http://localhost:8000/api/learning-paths/${pathId}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.journeys && data.journeys.length > 0) {
          // Navigate to the first journey of the learning path
          navigate(`/journey/${data.journeys[0].id}`)
        } else {
          toast.error("This learning path has no journeys yet")
        }
      } else {
        toast.error("Failed to load learning path details")
      }
    } catch (error) {
      console.error("Error fetching learning path details:", error)
      toast.error("Failed to load learning path details")
    }
  }

  const renderPathCard = (path: LearningPath) => (
    <div
      key={path.id}
      className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {path.duration}
          </Badge>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">{path.match_percentage}% Match</span>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{path.title}</h3>
        <p className="mb-4 flex-1 text-gray-600 dark:text-gray-400">{path.description}</p>
        <Button variant="outline" className="mt-auto w-full justify-between" onClick={() => handleViewPath(path.id)}>
          View Path <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Paths</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Discover personalized learning paths tailored to your goals and interests.
          </p>
        </div>
        <Button onClick={() => setIsGenerateModalOpen(true)} leftIcon={<Plus size={16} />}>
          Generate Learning Path
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Paths</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                >
                  <Skeleton className="mb-4 h-6 w-24" />
                  <Skeleton className="mb-2 h-8 w-3/4" />
                  <Skeleton className="mb-4 h-24 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : paths.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{paths.map((path) => renderPathCard(path))}</div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <BookOpen className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No Learning Paths Yet</h3>
              <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
                Generate your first personalized learning path to start your educational journey.
              </p>
              <Button onClick={() => setIsGenerateModalOpen(true)} leftIcon={<Plus size={16} />}>
                Generate Learning Path
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="recommended">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                >
                  <Skeleton className="mb-4 h-6 w-24" />
                  <Skeleton className="mb-2 h-8 w-3/4" />
                  <Skeleton className="mb-4 h-24 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : topPaths.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topPaths.map((path) => renderPathCard(path))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
              <BookOpen className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No Recommendations Yet</h3>
              <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
                Complete your profile or generate a learning path to get personalized recommendations.
              </p>
              <Button onClick={() => setIsGenerateModalOpen(true)} leftIcon={<Plus size={16} />}>
                Generate Learning Path
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-800/50">
            <BookOpen className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No Paths In Progress</h3>
            <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
              Start a learning path to track your progress and continue your learning journey.
            </p>
            <Button onClick={() => setIsGenerateModalOpen(true)} leftIcon={<Plus size={16} />}>
              Generate Learning Path
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Generate Learning Path Modal */}
      <Dialog open={isGenerateModalOpen} onOpenChange={setIsGenerateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Learning Path</DialogTitle>
            <DialogDescription>
              Create a personalized learning path based on your goals, available time, and interests.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="target_date" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Completion Date
              </label>
              <Input
                id="target_date"
                name="target_date"
                type="date"
                value={formData.target_date}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="study_hours" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Study Hours per Week
              </label>
              <Input
                id="study_hours"
                name="study_hours"
                type="number"
                value={formData.study_hours}
                onChange={handleInputChange}
                min={1}
                max={40}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills You Want to Learn
              </label>
              <div className="space-y-2">
                {formData.selected_skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      placeholder="e.g., Python, Machine Learning, Web Development"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(index)}
                      disabled={formData.selected_skills.length === 1}
                    >
                      <X size={16} />
                      <span className="sr-only">Remove skill</span>
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addSkill} leftIcon={<Plus size={16} />}>
                  Add Skill
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateModalOpen(false)} disabled={isGenerating}>
              Cancel
            </Button>
            <Button onClick={handleGeneratePath} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Path"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Roadmap
