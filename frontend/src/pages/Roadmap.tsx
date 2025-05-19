import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Brain, BookOpen, Star, Clock, ChevronRight, CheckCircle } from 'lucide-react';

const Roadmap: React.FC = () => {
  const [targetDate, setTargetDate] = useState('');
  const [studyHours, setStudyHours] = useState(10);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const skills = [
    'Programming',
    'Data Science',
    'Web Development',
    'AI',
    'Math',
    'Physics',
    'Design'
  ];

  // Mock learning journey data
  const learningJourney = [
    {
      id: 1,
      title: 'Introduction to Programming',
      weeks: 'Week 1-2: Basic concepts and syntax',
      progress: 100,
      status: 'Completed'
    },
    {
      id: 2,
      title: 'Data Structures & Algorithms',
      weeks: 'Week 3-5: Arrays, lists, and basic algorithms',
      progress: 60,
      status: 'In Progress'
    },
    {
      id: 3,
      title: 'Web Development Basics',
      weeks: 'Week 6-8: HTML, CSS, and JavaScript',
      progress: 0,
      status: 'Not Started'
    },
    {
      id: 4,
      title: 'Advanced Topics',
      weeks: 'Week 9-12: Projects and specialized skills',
      progress: 0,
      status: 'Not Started'
    }
  ];

  // Mock top learning paths
  const topPaths = [
    {
      title: 'Machine Learning Fundamentals',
      description: 'Based on your programming progress',
      match: '95%',
      duration: '8 weeks'
    },
    {
      title: 'Advanced Data Structures',
      description: 'Recommended for algorithm enthusiasts',
      match: '90%',
      duration: '6 weeks'
    },
    {
      title: 'Web Development Bootcamp',
      description: 'Perfect next step for beginners',
      match: '85%',
      duration: '12 weeks'
    }
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Paths</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Answer a few questions to create your personalized learning journey
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Current Learning Journey */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Learning Roadmap</CardTitle>
                <CardDescription>Track your progress through the curriculum</CardDescription>
              </div>
              <div className="rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                40% Complete
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {learningJourney.map((step, index) => (
                <div key={step.id} className="mb-8 flex last:mb-0">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        step.progress === 100
                          ? 'bg-green-500 text-white'
                          : step.progress > 0
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700'
                      }`}
                    >
                      {step.progress === 100 ? (
                        <CheckCircle size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < learningJourney.length - 1 && (
                      <div className="h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {step.weeks}
                    </p>
                    {step.progress > 0 && (
                      <div className="mt-2">
                        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-primary-500"
                            style={{ width: `${step.progress}%` }}
                          ></div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {step.progress}% Complete
                        </p>
                      </div>
                    )}
                    {step.progress === 0 && (
                      <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {step.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personalization Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personalize Your Path</CardTitle>
            <CardDescription>
              Tell us about your goals and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  What's your target completion date?
                </label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  fullWidth
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  How many hours can you study per week? ({studyHours} hours)
                </label>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={studyHours}
                  onChange={(e) => setStudyHours(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Which skills are you most interested in?
                </label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                className="mt-6"
              >
                Generate My Learning Path
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Learning Paths */}
      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Recommended for You
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topPaths.map((path, index) => (
            <Card key={index} hover>
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {path.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {path.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    {path.match} Match
                  </span>
                </div>
                <div className="mb-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={16} className="mr-2" />
                  <span>{path.duration}</span>
                </div>
                <Button variant="outline" fullWidth>
                  View Path
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;