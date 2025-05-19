import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg'
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { 
  Menu, X, User, LogOut, BookOpen, Home, 
  BarChart2, Brain, BookCheck, Moon, Sun 
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={18} /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart2 size={18} /> },
    { path: '/roadmap', label: 'Learning Path', icon: <Brain size={18} /> },
    { path: '/quizzes', label: 'Quizzes', icon: <BookCheck size={18} /> },
  ];

  // Add parent dashboard if user is a parent
  if (user && user.role === 'parent') {
    navItems.push({ 
      path: '/parent', 
      label: 'Parent View', 
      icon: <BookOpen size={18} /> 
    });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <img src={logo} alt="EduSmart Logo" className="h-12 w-12" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">EduSmart</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="ml-3 flex items-center">
                <div className="relative">
                  <Link to="/dashboard" className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={user.name}
                    />
                    <span className="ml-2 hidden text-sm font-medium text-gray-700 dark:text-gray-300 md:block">
                      {user.name}
                    </span>
                  </Link>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  onClick={logout}
                  leftIcon={<LogOut size={16} />}
                >
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="ml-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-800"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${
                location.pathname === item.path
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
              onClick={closeMenu}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;