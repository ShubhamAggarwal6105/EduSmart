import React from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 md:w-1/2">
        <Link to="/" className="mb-8 flex items-center">
          <Brain className="h-10 w-10 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">EduSmart</span>
        </Link>
        <div className="w-full max-w-md space-y-8">
          <Outlet />
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} EduSmart. All rights reserved.
        </p>
      </div>

      {/* Right side - Image and text */}
      <div className="hidden bg-blue-600 md:flex md:w-1/2 md:flex-col md:items-center md:justify-center">
        <div className="max-w-md px-8 text-center text-white">
          <h2 className="mb-6 text-3xl font-bold">Transform Your Learning Journey</h2>
          <p className="mb-8 text-lg">
            Personalized roadmaps, AI-powered quizzes, and real-time tutoring to help you achieve your educational goals.
          </p>
          <img 
            src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg" 
            alt="Education illustration" 
            className="mx-auto rounded-lg shadow-xl" 
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
