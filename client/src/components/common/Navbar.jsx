import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Bell, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Button from './Button'

const Navbar = ({ isAuthenticated = false, transparent = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { currentUser, userProfile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navClasses = transparent
    ? 'bg-transparent text-white'
    : 'bg-white shadow-md text-dark-charcoal'

  return (
    <nav className={`sticky top-0 z-50 ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
            <span className={`text-2xl font-bold ${transparent ? 'text-white' : 'text-deep-rose'}`}>
              EveShield
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant={transparent ? 'outline' : 'secondary'} size="small">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="small">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-light-gray rounded-full transition-colors">
                <Bell size={24} />
                <span className="absolute top-0 right-0 bg-deep-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-light-gray rounded-lg transition-colors"
                >
                  <div className="h-8 w-8 bg-deep-rose rounded-full flex items-center justify-center text-white font-bold">
                    {userProfile?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium">{userProfile?.fullName || 'User'}</span>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-light-gray">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-light-gray transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User size={18} />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-light-gray transition-colors w-full text-left text-error-red"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-light-gray">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="small" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="small" fullWidth>
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  className="px-4 py-2 hover:bg-light-gray rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="px-4 py-2 hover:bg-light-gray rounded-lg transition-colors text-left text-error-red"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
