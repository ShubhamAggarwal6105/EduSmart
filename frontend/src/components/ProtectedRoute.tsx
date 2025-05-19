"use client"

import type React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface ProtectedRouteProps {
  redirectPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = "/login" }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    // You could render a loading spinner here
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
