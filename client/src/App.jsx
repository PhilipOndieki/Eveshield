import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Emergency from './pages/Emergency'
import Contacts from './pages/Contacts'
import Bystanders from './pages/Bystanders'
import BystandersEnhanced from './pages/BystandersEnhanced'
import Incidents from './pages/Incidents'
import ResourceHub from './pages/ResourceHub'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'

// Components
import AIChatbot from './components/common/AIChatbot'

// Route Protection
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
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
