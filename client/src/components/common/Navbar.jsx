import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Bell, User, LogOut, MessageCircle, Shield, LayoutDashboard, Users, ClipboardList, BookOpen, DollarSign } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Button from './Button'

const Navbar = ({ isAuthenticated = false, transparent = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { currentUser, userProfile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Navigation menu items for authenticated users
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/contacts', label: 'My Contacts', icon: Users },
    { path: '/bystanders', label: 'Trusted Bystanders', icon: Shield },
    { path: '/incidents', label: 'Incidents', icon: ClipboardList },
    { path: '/resource-hub', label: 'Resources Hub', icon: BookOpen },
  ]

  const isActivePath = (path) => location.pathname === path

  const navClasses = transparent
    ? 'bg-transparent text-white'
    : 'bg-deep-navy shadow-md text-white'

  return (
    <nav className={`sticky top-0 z-50 ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <Shield className="text-white" size={28} />
            <span className="text-2xl font-bold text-white">
              EveShield
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login">
                <Button variant="outline" size="small" className="border-white text-white hover:bg-white hover:text-deep-navy">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 bg-deep-rose text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1">
              {/* Navigation Links */}
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = isActivePath(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      isActive
                        ? 'bg-sky-blue bg-opacity-20 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              {/* Donate Button */}
              <button className="flex items-center gap-2 px-3 py-2 ml-2 border border-white text-white rounded-lg text-sm font-medium hover:bg-white hover:text-deep-navy transition-colors">
                <DollarSign size={18} />
                <span>Donate</span>
              </button>

              {/* Divider */}
              <div className="h-8 w-px bg-white bg-opacity-20 mx-2"></div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
                <Bell size={20} className="text-white" />
                <span className="absolute top-0 right-0 bg-deep-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  3
                </span>
              </button>

              {/* Chat Icon (placeholder for future implementation) */}
              <button className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
                <MessageCircle size={20} className="text-white" />
                <span className="absolute top-0 right-0 bg-deep-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  2
                </span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                >
                  <div className="h-8 w-8 bg-sky-blue rounded-full flex items-center justify-center text-deep-navy font-bold">
                    {userProfile?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="font-medium text-white">{userProfile?.fullName || 'User'}</span>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-pale-blue transition-colors text-dark-charcoal"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User size={18} />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-pale-blue transition-colors w-full text-left text-error-red"
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
            className="lg:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white border-opacity-20">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-deep-navy transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-4 py-2 bg-deep-rose text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Mobile Navigation Links */}
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = isActivePath(item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-sky-blue bg-opacity-20 text-white font-medium'
                          : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}

                {/* Donate Button Mobile */}
                <button className="flex items-center gap-3 px-4 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-deep-navy transition-colors">
                  <DollarSign size={20} />
                  <span>Donate</span>
                </button>

                <div className="border-t border-white border-opacity-20 my-2"></div>

                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={20} />
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors text-left text-deep-rose"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
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
