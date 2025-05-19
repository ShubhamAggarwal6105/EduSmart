"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Brain, BookOpen, BarChart2, Users, ChevronRight, Award } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 py-20 text-white">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg')] bg-cover bg-center"></div>
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="text-center md:text-left">
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Transform Your Learning Journey
              </h1>
              <p className="mb-8 text-lg text-blue-100 md:text-xl">
                Experience personalized education with AI-powered roadmaps, smart quizzes, and real-time tutoring
                designed to accelerate your learning.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:justify-start">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg"
                alt="Students learning"
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-950"></div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Powered by AI, Designed for Growth
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Our platform combines advanced AI technology with educational expertise to create a learning experience
              that adapts to your needs.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Brain size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Personalized Learning Paths</h3>
              <p className="text-gray-600 dark:text-gray-400">
                AI-generated roadmaps tailored to your goals, learning style, and current knowledge level.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                <BookOpen size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Smart Quiz System</h3>
              <p className="text-gray-600 dark:text-gray-400">
                LLM-generated questions that adapt based on your performance and provide detailed explanations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Award size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Real-Time AI Tutoring</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get immediate help when you're stuck with our AI tutor that guides you through challenging concepts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                <BarChart2 size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Progress Visualization</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your learning journey with intuitive charts and insights that show your growth over time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Users size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Parent Connect</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep parents informed with automated reports and insights about their child's educational journey.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <ChevronRight size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">Continuous Improvement</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our platform learns from user feedback to constantly enhance learning materials and experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Trusted by Students and Parents
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              See what our users have to say about their experience with EduSmart.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                <img className="h-12 w-12 rounded-full" src="https://i.pravatar.cc/150?img=1" alt="User avatar" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Sarah Johnson</h4>
                  <p className="text-gray-600 dark:text-gray-400">High School Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "The personalized roadmap helped me improve my math grades from a C to an A. The AI tutor explains
                concepts better than my textbooks ever could!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                <img className="h-12 w-12 rounded-full" src="https://i.pravatar.cc/150?img=11" alt="User avatar" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Michael Torres</h4>
                  <p className="text-gray-600 dark:text-gray-400">Parent</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "As a busy parent, I appreciate the daily updates about my son's progress. I can finally stay involved
                in his education without having to constantly ask him about homework."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="mb-4 flex items-center">
                <img className="h-12 w-12 rounded-full" src="https://i.pravatar.cc/150?img=5" alt="User avatar" />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Emily Chen</h4>
                  <p className="text-gray-600 dark:text-gray-400">College Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "Studying for the MCAT was overwhelming until I found EduSmart. The smart quizzes identified my weak
                areas and the roadmap helped me focus my study time effectively."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to transform your learning experience?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join thousands of students who are achieving their educational goals with EduSmart.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => navigate("/register")}
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
