import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Calendar, Clock, BookOpen, BarChart2, Brain } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ParentDashboard: React.FC = () => {
  const [guardianEmail, setGuardianEmail] = useState('');

  // Mock data for the dashboard
  const studentProgress = {
    name: "Alex Johnson",
    grade: "10th Grade",
    currentCourse: "Advanced Mathematics",
    attendance: "95%",
    quizzesTaken: 15,
    averageScore: 87,
    lastActive: "2 hours ago"
  };

  const quizHistory = [
    { date: '2024-01', score: 75 },
    { date: '2024-02', score: 82 },
    { date: '2024-03', score: 78 },
    { date: '2024-04', score: 85 },
    { date: '2024-05', score: 90 }
  ];

  const dailyReports = [
    {
      date: "May 19, 2025",
      attendance: "Present",
      timeSpent: "45 minutes",
      modulesCompleted: "2/4",
      quizScore: "85%",
      topics: [
        { name: "Introduction to Programming", progress: 100 },
        { name: "Data Structures & Algorithms", progress: 60 },
        { name: "Web Development Basics", progress: 0 }
      ],
      nextGoal: "Complete \"Advanced Sorting Algorithms\" by Friday, May 23"
    },
    // More daily reports...
  ];

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Guardian Connect
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Keep track of your child's learning progress and receive daily updates
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Student Overview Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Overview</CardTitle>
            <CardDescription>Current progress and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {studentProgress.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{studentProgress.grade}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <BookOpen size={16} className="mr-2" />
                    <span>Current Course: {studentProgress.currentCourse}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={16} className="mr-2" />
                    <span>Attendance: {studentProgress.attendance}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Brain size={16} className="mr-2" />
                    <span>Quizzes Taken: {studentProgress.quizzesTaken}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <BarChart2 size={16} className="mr-2" />
                    <span>Average Score: {studentProgress.averageScore}%</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock size={16} className="mr-2" />
                    <span>Last Active: {studentProgress.lastActive}</span>
                  </div>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={quizHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Quiz Performance History
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connect Guardian Account */}
        <Card>
          <CardHeader>
            <CardTitle>Connect Guardian Account</CardTitle>
            <CardDescription>
              Add a parent or guardian email to enable daily reports and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Parent/Guardian Email"
                icon={<Mail size={18} />}
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                fullWidth
              />
              <Button fullWidth>
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Report */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Latest Daily Report</CardTitle>
            <CardDescription>
              Detailed summary of today's learning activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/30">
              <div className="mb-6 grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dailyReports[0].attendance}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dailyReports[0].timeSpent}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Modules Completed</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dailyReports[0].modulesCompleted}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quiz Score</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dailyReports[0].quizScore}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-4 font-semibold text-gray-900 dark:text-white">
                  Current Progress
                </h4>
                <div className="space-y-4">
                  {dailyReports[0].topics.map((topic, index) => (
                    <div key={index}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{topic.name}</span>
                        <span className="text-gray-600 dark:text-gray-400">{topic.progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${topic.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Next Goal</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {dailyReports[0].nextGoal}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;