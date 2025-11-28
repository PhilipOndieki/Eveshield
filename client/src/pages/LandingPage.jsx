import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import Button from '../components/common/Button'
import { Shield, Users, AlertTriangle, BookOpen } from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBuildSafetyCircle = async () => {
    setLoading(true)
    setError('')

    try {
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      console.error('Google sign-in error:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled')
      } else if (error.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups.')
      } else {
        // If Google sign-in fails, redirect to signup page
        navigate('/signup')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1573497161161-c3e73707e25c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Navbar */}
        <div className="relative z-10">
          <Navbar transparent={true} />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 drop-shadow-lg">
              Together, We Stand Guard
            </h1>
            <p className="text-xl md:text-2xl text-white mb-12 drop-shadow-md max-w-2xl mx-auto">
              Community-powered emergency response platform for GBV prevention and survivor support
            </p>
            
            {/* Error message if Google sign-in fails */}
            {error && (
              <div className="bg-error-red bg-opacity-90 text-white px-6 py-3 rounded-lg mb-4 max-w-md mx-auto">
                {error}
              </div>
            )}

            <Button
              variant="primary"
              size="large"
              onClick={handleBuildSafetyCircle}
              disabled={loading}
              className="hover:scale-105"
            >
              {loading ? 'Loading...' : 'Build Your Safety Circle'}
            </Button>
            
            <p className="text-white text-sm mt-4 opacity-90">
              Sign in with Google to get started
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="text-white text-center">
              <div className="mb-2">↓</div>
              <p className="text-sm">Learn More</p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Propositions Section */}
      <section className="py-20 bg-pale-pink">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-dark-charcoal mb-16">
            How EveShield Protects You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-deep-rose bg-opacity-10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <AlertTriangle className="text-deep-rose" size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark-charcoal mb-2">
                Tiered Emergency Alerts
              </h3>
              <p className="text-warm-gray">
                Three severity levels ensure appropriate response based on your situation—from concern to life-critical.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-deep-rose bg-opacity-10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <Users className="text-deep-rose" size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark-charcoal mb-2">
                Emergency Contacts
              </h3>
              <p className="text-warm-gray">
                Add up to 5 trusted contacts who receive instant alerts with your location during emergencies.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-deep-rose bg-opacity-10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <Shield className="text-deep-rose" size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark-charcoal mb-2">
                Trusted Bystanders
              </h3>
              <p className="text-warm-gray">
                Build a verified network of people you trust in your community who can respond quickly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-deep-rose bg-opacity-10 rounded-full h-16 w-16 flex items-center justify-center mb-4">
                <BookOpen className="text-deep-rose" size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark-charcoal mb-2">
                Support Resources
              </h3>
              <p className="text-warm-gray">
                Instant access to verified GBV hotlines, safe houses, police stations, and medical services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-deep-rose text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Build Your Safety Network?
          </h2>
          <p className="text-xl mb-8">
            Join EveShield today and take control of your safety with community-powered support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="large"
              onClick={handleBuildSafetyCircle}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get Started Free'}
            </Button>
            <Button
              variant="outline"
              size="large"
              onClick={() => navigate('/login')}
              className="bg-white bg-opacity-10"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-charcoal text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-warm-gray">
            © 2025 EveShield. Built with care for Power Hacks 2025.
          </p>
          <p className="text-warm-gray mt-2">
            Theme: Safety by Design
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage