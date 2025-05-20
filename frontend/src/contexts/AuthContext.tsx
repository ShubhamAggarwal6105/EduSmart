"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  user_type: "student" | "parent" | "teacher"
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
}

interface RegisterData {
  username: string
  email: string
  password: string
  password2: string
  first_name: string
  last_name: string
  user_type: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        setToken(storedToken)
        try {
          const response = await fetch("http://localhost:8000/api/auth/user/", {
            headers: {
              Authorization: `Token ${storedToken}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            // Token is invalid or expired
            localStorage.removeItem("token")
            setToken(null)
          }
        } catch (error) {
          console.error("Authentication check failed:", error)
          localStorage.removeItem("token")
          setToken(null)
        }
      }
      setLoading(false) // Only set loading to false after the auth check is complete
    }

    checkAuth()
  }, [])

  // In the login function, make sure the token is being stored correctly
  const login = async (username: string, password: string) => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        console.log("Login successful, token:", data.token)
        localStorage.setItem("token", data.token)
        setToken(data.token)
        setUser(data.user)
        toast.success("Login successful!")

        // Redirect based on user role
        if (data.user.user_type === "parent") {
          navigate("/parent")
        } else if (data.user.user_type === "teacher") {
          navigate("/teacher")
        } else {
          navigate("/dashboard")
        }
      } else {
        toast.error(data.error || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Registration successful! Please log in.")
        navigate("/login")
      } else {
        const errorMessage = Object.values(data).flat().join(", ")
        toast.error(errorMessage || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast.error("An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (token) {
        await fetch("http://localhost:8000/api/auth/logout/", {
          method: "POST",
          headers: {
            Authorization: `Token ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      setToken(null)
      setUser(null)
      toast.success("Logged out successfully")
      navigate("/login")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token, // Make sure both user and token exist
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
