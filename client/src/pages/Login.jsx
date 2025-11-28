import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import { validateEmail } from '../utils/validation'

const Login = () => {
  const navigate = useNavigate()
  const { login, signInWithGoogle } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    // Clear error for this field
    setErrors({ ...errors, [name]: '' })
    setGeneralError('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setGeneralError('')

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setGeneralError('Invalid email or password')
      } else if (error.code === 'auth/too-many-requests') {
        setGeneralError('Too many failed attempts. Please try again later.')
      } else if (error.code === 'auth/invalid-credential') {
        setGeneralError('Invalid credentials. Please check your email and password.')
      } else {
        setGeneralError('Failed to login. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setGeneralError('')

    try {
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      console.error('Google sign-in error:', error)
      
      // Handle different error types
      if (error.code === 'auth/popup-closed-by-user') {
        setGeneralError('Sign-in cancelled. Please try again.')
      } else if (error.code === 'auth/popup-blocked') {
        setGeneralError('Popup blocked. Please allow popups for this site and try again.')
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User cancelled - don't show error
        setGeneralError('')
      } else if (error.code === 'auth/unauthorized-domain') {
        setGeneralError('This domain is not authorized. Please contact support.')
      } else if (error.message && error.message.includes('initial state')) {
        setGeneralError('Authentication error. Please try again or use email/password login.')
      } else {
        setGeneralError('Failed to sign in with Google. Please try email/password login instead.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-pale-pink flex flex-col">
      {/* Simple Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="text-2xl font-bold text-deep-rose">
            EveShield
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-charcoal mb-2">
              Welcome Back
            </h1>
            <p className="text-warm-gray">
              Sign in to access your safety network
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {generalError && (
                <div className="bg-error-red bg-opacity-10 border border-error-red text-error-red px-4 py-3 rounded-lg">
                  {generalError}
                </div>
              )}

              {/* Email/Password Login First */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-charcoal mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose ${
                    errors.email ? 'border-error-red' : 'border-light-gray'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-error-red text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-charcoal mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose ${
                      errors.password ? 'border-error-red' : 'border-light-gray'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warm-gray hover:text-dark-charcoal"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-error-red text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-deep-rose focus:ring-deep-rose border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-warm-gray">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-deep-rose hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="medium"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-light-gray"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-warm-gray">OR</span>
                </div>
              </div>

              {/* Google Sign-In Button */}
              <Button
                type="button"
                variant="secondary"
                size="medium"
                fullWidth
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
              </Button>

              <p className="text-xs text-center text-warm-gray">
                Having issues with Google Sign-In? Use email/password instead.
              </p>

              {/* Sign Up Link */}
              <div className="text-center pt-4">
                <p className="text-warm-gray">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-deep-rose font-medium hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login