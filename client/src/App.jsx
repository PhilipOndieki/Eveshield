import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider } from './context/AuthContext'

// Components that should load immediately
import AIChatbot from './components/common/AIChatbot'
import ProtectedRoute from './routes/ProtectedRoute'

// Lazy load pages for code splitting and better performance
const LandingPage = lazy(() => import('./pages/LandingPage'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Emergency = lazy(() => import('./pages/Emergency'))
const Contacts = lazy(() => import('./pages/Contacts'))
const BystandersEnhanced = lazy(() => import('./pages/BystandersEnhanced'))
const Incidents = lazy(() => import('./pages/Incidents'))
const ResourceHub = lazy(() => import('./pages/ResourceHub'))
const Profile = lazy(() => import('./pages/Profile'))
const Chat = lazy(() => import('./pages/Chat'))
const Notifications = lazy(() => import('./pages/Notifications'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-pale-blue flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-medium-blue mb-4"></div>
      <p className="text-warm-gray">Loading...</p>
    </div>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/emergency" element={
            <ProtectedRoute>
              <Emergency />
            </ProtectedRoute>
          } />
          <Route path="/contacts" element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          } />
          <Route path="/bystanders" element={
            <ProtectedRoute>
              <BystandersEnhanced />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          <Route path="/incidents" element={
            <ProtectedRoute>
              <Incidents />
            </ProtectedRoute>
          } />
          <Route path="/resource-hub" element={
            <ProtectedRoute>
              <ResourceHub />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          </Routes>
        </Suspense>
        {/* AI Chatbot - Available on all protected routes */}
        {window.location.pathname.startsWith('/dashboard') ||
         window.location.pathname.startsWith('/contacts') ||
         window.location.pathname.startsWith('/bystanders') ||
         window.location.pathname.startsWith('/incidents') ||
         window.location.pathname.startsWith('/resource-hub') ||
         window.location.pathname.startsWith('/profile') ||
         window.location.pathname.startsWith('/chat') ? (
          <AIChatbot />
        ) : null}
      </Router>
    </AuthProvider>
  )
}

export default App
