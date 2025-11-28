import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import { validateEmail, validatePassword, validatePhoneNumber, getPasswordStrength, formatPhoneNumber, countryCodes } from '../utils/validation'

const SignUp = () => {
  const navigate = useNavigate()
  const { signup, signInWithGoogle } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })

  const [selectedCountryCode, setSelectedCountryCode] = useState('254')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
    setErrors({ ...errors, [name]: '' })
    setGeneralError('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required'
    } else {
      const fullPhone = `+${selectedCountryCode}${formData.phoneNumber}`
      if (!validatePhoneNumber(fullPhone)) {
        newErrors.phoneNumber = 'Please enter a valid phone number'
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
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
      const fullPhone = `+${selectedCountryCode}${formData.phoneNumber}`
      
      await signup(formData.email, formData.password, {
        fullName: formData.fullName,
        phoneNumber: formatPhoneNumber(fullPhone),
      })
      navigate('/dashboard')
    } catch (error) {
      console.error('Signup error:', error)
      if (error.code === 'auth/email-already-in-use') {
        setGeneralError('An account with this email already exists')
      } else if (error.code === 'auth/weak-password') {
        setGeneralError('Password is too weak. Please use a stronger password.')
      } else {
        setGeneralError('Failed to create account. Please try again.')
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
      if (error.code === 'auth/popup-closed-by-user') {
        setGeneralError('Sign-in cancelled. Please try again.')
      } else if (error.code === 'auth/popup-blocked') {
        setGeneralError('Popup blocked. Please allow popups for this site.')
      } else {
        setGeneralError('Failed to sign in with Google. Please try again.')
      }
    } finally {
      setGoogleLoading(false)
    }
  }

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null

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
              Create Your Safety Account
            </h1>
            <p className="text-warm-gray">
              Join EveShield and build your safety network
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {generalError && (
                <div className="bg-error-red bg-opacity-10 border border-error-red text-error-red px-4 py-3 rounded-lg">
                  {generalError}
                </div>
              )}

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

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-light-gray"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-warm-gray">OR</span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-dark-charcoal mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose ${
                    errors.fullName ? 'border-error-red' : 'border-light-gray'
                  }`}
                  placeholder="Jane Doe"
                />
                {errors.fullName && (
                  <p className="text-error-red text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-charcoal mb-2">
                  Email Address *
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
                  placeholder="jane@example.com"
                />
                {errors.email && (
                  <p className="text-error-red text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number with Country Code */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-dark-charcoal mb-2">
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="px-3 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} +{country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose ${
                      errors.phoneNumber ? 'border-error-red' : 'border-light-gray'
                    }`}
                    placeholder="712345678"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-error-red text-sm mt-1">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-charcoal mb-2">
                  Password *
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
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warm-gray hover:text-dark-charcoal"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.password && passwordStrength && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-light-gray rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.level === 'weak' ? 'bg-error-red' :
                            passwordStrength.level === 'medium' ? 'bg-warning-orange' :
                            'bg-success-green'
                          }`}
                          style={{
                            width: passwordStrength.level === 'weak' ? '33%' : passwordStrength.level === 'medium' ? '66%' : '100%'
                          }}
                        ></div>
                      </div>
                      <span className={`text-sm capitalize ${
                        passwordStrength.level === 'weak' ? 'text-error-red' :
                        passwordStrength.level === 'medium' ? 'text-warning-orange' :
                        'text-success-green'
                      }`}>
                        {passwordStrength.level}
                      </span>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-error-red text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-charcoal mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose ${
                      errors.confirmPassword ? 'border-error-red' : 'border-light-gray'
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warm-gray hover:text-dark-charcoal"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-error-red text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-deep-rose focus:ring-deep-rose border-gray-300 rounded mt-1"
                  />
                  <span className="ml-2 text-sm text-warm-gray">
                    I agree to the{' '}
                    <button type="button" className="text-deep-rose hover:underline">
                      Terms & Conditions
                    </button>{' '}
                    and{' '}
                    <button type="button" className="text-deep-rose hover:underline">
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-error-red text-sm mt-1">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="medium"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create My Safety Account'}
              </Button>

              {/* Sign In Link */}
              <div className="text-center pt-4">
                <p className="text-warm-gray">
                  Already have an account?{' '}
                  <Link to="/login" className="text-deep-rose font-medium hover:underline">
                    Sign in
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

export default SignUp