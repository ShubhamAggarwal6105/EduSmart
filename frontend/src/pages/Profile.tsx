"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Skeleton } from "../components/ui/Skeleton"
import { Badge } from "../components/ui/Badge"
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  Settings,
  Shield,
  Bell,
  Save,
  Loader,
} from "lucide-react"
import toast from "react-hot-toast"

interface UserProfile {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: string
  date_joined?: string
}

interface UserStats {
  courses_completed: number
  quizzes_taken: number
  overall_progress: number
  courses_completed_this_month: number
  quizzes_taken_this_week: number
  streak: number
}

const Profile: React.FC = () => {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [activeTab, setActiveTab] = useState("profile")

  // Form state for profile editing
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Notification preferences
  const [notifications, setNotifications] = useState({
    email_updates: true,
    quiz_reminders: true,
    achievement_alerts: true,
    new_courses: false,
  })

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true)
      try {
        // Fetch user profile
        const profileResponse = await fetch("http://localhost:8000/api/auth/user/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setProfile(profileData)
          setFormData({
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            email: profileData.email || "",
          })
        } else {
          console.error("Failed to fetch profile:", await profileResponse.text())
          toast.error("Failed to load profile data")
        }

        // Fetch user stats
        const statsResponse = await fetch("http://localhost:8000/api/user-stats/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        } else {
          console.error("Failed to fetch stats:", await statsResponse.text())
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
        toast.error("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // In a real app, this would update the user profile
      // For now, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the profile state with the new data
      if (profile) {
        setProfile({
          ...profile,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
        })
      }

      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = () => {
    // In a real app, this would update the notification preferences
    toast.success("Notification preferences saved")
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="mb-4 h-24 w-24 rounded-full" />
                  <Skeleton className="mb-2 h-6 w-32" />
                  <Skeleton className="mb-4 h-4 w-24" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <User size={48} />
                </div>
                <h2 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">@{profile?.username}</p>
                <Badge className="mb-4 capitalize">{profile?.user_type}</Badge>

                <div className="mt-4 w-full space-y-2">
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                    leftIcon={<User size={16} />}
                  >
                    Profile Information
                  </Button>
                  <Button
                    variant={activeTab === "stats" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("stats")}
                    leftIcon={<Award size={16} />}
                  >
                    Learning Stats
                  </Button>
                  <Button
                    variant={activeTab === "security" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("security")}
                    leftIcon={<Shield size={16} />}
                  >
                    Security
                  </Button>
                  <Button
                    variant={activeTab === "notifications" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("notifications")}
                    leftIcon={<Bell size={16} />}
                  >
                    Notifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          {activeTab === "profile" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  leftIcon={<Settings size={16} />}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          First Name
                        </label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="last_name"
                          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Last Name
                        </label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                    <Button
                      onClick={handleSaveProfile}
                      className="mt-4"
                      disabled={isSaving}
                      leftIcon={isSaving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center border-b border-gray-200 pb-4 dark:border-gray-700">
                      <User className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="text-gray-900 dark:text-white">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center border-b border-gray-200 pb-4 dark:border-gray-700">
                      <Mail className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-900 dark:text-white">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center border-b border-gray-200 pb-4 dark:border-gray-700">
                      <BookOpen className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</p>
                        <p className="capitalize text-gray-900 dark:text-white">{profile?.user_type}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="text-gray-900 dark:text-white">
                          {profile?.date_joined
                            ? new Date(profile.date_joined).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "stats" && (
            <Card>
              <CardHeader>
                <CardTitle>Learning Statistics</CardTitle>
                <CardDescription>Your learning progress and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Courses Completed</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats?.courses_completed || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                        <CheckCircle size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Quizzes Taken</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.quizzes_taken || 0}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <Award size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.streak || 0} days</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-green-100 p-2 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Progress</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats?.overall_progress || 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Achievements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div className="mr-3 rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">First Course Completed</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You completed your first learning journey
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div className="mr-3 rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Quiz Master</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You scored 90% or higher on 5 quizzes
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                      <div className="mr-3 rounded-full bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <Award size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">3-Day Streak</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You've been learning for 3 consecutive days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="current_password"
                          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Current Password
                        </label>
                        <Input id="current_password" type="password" className="w-full" placeholder="••••••••" />
                      </div>
                      <div>
                        <label
                          htmlFor="new_password"
                          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          New Password
                        </label>
                        <Input id="new_password" type="password" className="w-full" placeholder="••••••••" />
                      </div>
                      <div>
                        <label
                          htmlFor="confirm_password"
                          className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Confirm New Password
                        </label>
                        <Input id="confirm_password" type="password" className="w-full" placeholder="••••••••" />
                      </div>
                      <Button>Update Password</Button>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                      Two-Factor Authentication
                    </h3>
                    <p className="mb-4 text-gray-600 dark:text-gray-400">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email Updates</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive weekly progress updates via email
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="email_updates"
                        name="email_updates"
                        checked={notifications.email_updates}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label htmlFor="email_updates" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {notifications.email_updates ? "On" : "Off"}
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Quiz Reminders</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get reminders about upcoming quizzes</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="quiz_reminders"
                        name="quiz_reminders"
                        checked={notifications.quiz_reminders}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label htmlFor="quiz_reminders" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {notifications.quiz_reminders ? "On" : "Off"}
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Achievement Alerts</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications when you earn achievements
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="achievement_alerts"
                        name="achievement_alerts"
                        checked={notifications.achievement_alerts}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label htmlFor="achievement_alerts" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {notifications.achievement_alerts ? "On" : "Off"}
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">New Courses</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified when new courses are available
                      </p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="new_courses"
                        name="new_courses"
                        checked={notifications.new_courses}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label htmlFor="new_courses" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {notifications.new_courses ? "On" : "Off"}
                      </label>
                    </div>
                  </div>

                  <Button onClick={handleSaveNotifications} className="mt-4">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
