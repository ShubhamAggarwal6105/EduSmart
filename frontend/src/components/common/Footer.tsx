import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                EduSmart
              </span>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Transforming education through personalized AI-powered learning paths and insights.
            </p>
            <div className="mt-6 flex space-x-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                aria-label="Github"
              >
                <Github size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Platform
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/roadmap" 
                  className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link 
                  to="/quizzes" 
                  className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  Quizzes
                </Link>
              </li>
              <li>
                <Link 
                  to="/parent" 
                  className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  Parent Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/careers" 
                  className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-blue-600" />
                <span className="text-gray-600 dark:text-gray-400">
                  123 Educational Ave, Learning City, 98765
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-blue-600" />
                <a 
                  href="tel:+11234567890" 
                  className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-blue-600" />
                <a 
                  href="mailto:info@edusmart.com" 
                  className="text-gray-600 transition hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                >
                  info@edusmart.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} EduSmart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;