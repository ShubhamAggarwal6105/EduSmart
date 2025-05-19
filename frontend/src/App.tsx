import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "react-hot-toast"

// Layouts
import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"

// Pages
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Roadmap from "./pages/Roadmap"
import Quizzes from "./pages/Quizzes"
import QuizDetail from "./pages/QuizDetail"
import ParentDashboard from "./pages/ParentDashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import Journey from "./pages/Journey"

// Components
import ProtectedRoute from "./components/ProtectedRoute"

// Context providers
import { AuthProvider } from "./contexts/AuthContext"
import { ThemeProvider } from "./contexts/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
              },
            }}
          />
          <Routes>
            {/* Public routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/quizzes" element={<Quizzes />} />
                <Route path="/quiz/:id" element={<QuizDetail />} />
                <Route path="/parent" element={<ParentDashboard />} />
                <Route path="/journey/:journeyId" element={<Journey />} />
              </Route>
            </Route>

            {/* Public home page */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
