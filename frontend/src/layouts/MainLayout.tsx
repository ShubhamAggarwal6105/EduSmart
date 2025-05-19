import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MainLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const currentPath = window.location.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register'];

  // Don't show the loading state for public routes
  if (isLoading && !publicRoutes.includes(currentPath)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on a public route, redirect to login
  if (!isAuthenticated && !publicRoutes.includes(currentPath) && currentPath !== '/') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;