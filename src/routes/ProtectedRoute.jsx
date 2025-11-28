import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pale-pink">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-deep-rose mx-auto"></div>
          <p className="mt-4 text-warm-gray">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
