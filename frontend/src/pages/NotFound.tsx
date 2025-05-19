import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Brain, Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <Brain className="h-20 w-20 text-blue-600" />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="mb-8 text-3xl font-semibold text-gray-800 dark:text-gray-200">Page Not Found</h2>
        <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button leftIcon={<Home size={18} />} size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;