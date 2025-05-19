// API service for making requests to the backend

const API_URL = "http://localhost:8000/api"

export interface LearningPath {
  id: number
  title: string
  description: string
  duration: string
  match_percentage: number
}

export interface LearningJourney {
  id: number
  title: string
  description: string | null
  total_lessons: number
  completed_lessons: number
  progress: number
  next_lesson: string | null
  topics: Topic[]
}

export interface Topic {
  id: number
  title: string
  description: string | null
  order: number
  duration: string
  is_completed: boolean
  quizzes: Quiz[]
}

export interface Quiz {
  id: number
  title: string
  description: string | null
  duration: string
  difficulty: string
  questions_count: number
  is_completed: boolean
}

export const api = {
  // Helper function to get auth headers
  getHeaders: () => {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    }
  },

  // Learning Paths
  getLearningPaths: async (): Promise<LearningPath[]> => {
    try {
      const response = await fetch(`${API_URL}/learning-paths/`, {
        headers: api.getHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch learning paths")
      return await response.json()
    } catch (error) {
      console.error("Error fetching learning paths:", error)
      throw error
    }
  },

  // Top Learning Paths
  getTopLearningPaths: async (): Promise<LearningPath[]> => {
    try {
      const response = await fetch(`${API_URL}/top-learning-paths/`, {
        headers: api.getHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch top learning paths")
      return await response.json()
    } catch (error) {
      console.error("Error fetching top learning paths:", error)
      throw error
    }
  },

  // Learning Journey Details
  getLearningJourney: async (journeyId: number): Promise<LearningJourney> => {
    try {
      const response = await fetch(`${API_URL}/learning-journeys/${journeyId}/`, {
        headers: api.getHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch learning journey")
      return await response.json()
    } catch (error) {
      console.error("Error fetching learning journey:", error)
      throw error
    }
  },

  // Generate Learning Path
  generateLearningPath: async (data: {
    target_date: string
    study_hours: number
    selected_skills: string[]
  }): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/generate-learning-path/`, {
        method: "POST",
        headers: api.getHeaders(),
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to generate learning path")
      return await response.json()
    } catch (error) {
      console.error("Error generating learning path:", error)
      throw error
    }
  },
}
