import { useState } from 'react'
import { User, Lock, Bell, Shield, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const Profile = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')

  const tabs = [
    { id: 'personal', name: 'Personal Information', icon: User },
    { id: 'security', name: 'Security & Privacy', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'safety', name: 'Safety Settings', icon: Shield },
    { id: 'preferences', name: 'App Preferences', icon: SettingsIcon },
  ]

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout()
        navigate('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar isAuthenticated={true} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-dark-charcoal mb-8">
              Profile & Settings
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar Tabs */}
              <div className="lg:col-span-1">
                <Card padding="small">
                  <nav className="space-y-1">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-pale-pink text-deep-rose'
                              : 'text-warm-gray hover:bg-light-gray'
                          }`}
                        >
                          <Icon size={20} />
                          <span className="text-sm font-medium">{tab.name}</span>
                        </button>
                      )
                    })}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-error-red hover:bg-error-red hover:bg-opacity-10"
                    >
                      <LogOut size={20} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </nav>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Personal Information Tab */}
                {activeTab === 'personal' && (
                  <Card>
                    <h2 className="text-2xl font-bold text-dark-charcoal mb-6">
                      Personal Information
                    </h2>

                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-20 w-20 bg-deep-rose rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {userProfile?.fullName?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <Button variant="secondary" size="small">
                          Change Photo
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-charcoal mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={userProfile?.fullName || ''}
                          className="w-full px-4 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark-charcoal mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={currentUser?.email || ''}
                          className="w-full px-4 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose bg-light-gray"
                          disabled
                        />
                        <p className="text-sm text-warm-gray mt-1">
                          ✓ Verified
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark-charcoal mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          defaultValue={userProfile?.phoneNumber || ''}
                          className="w-full px-4 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark-charcoal mb-2">
                          Location/Address (Optional)
                        </label>
                        <textarea
                          rows="2"
                          className="w-full px-4 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
                          placeholder="City, Country"
                        ></textarea>
                      </div>

                      <Button variant="primary" size="medium">
                        Save Changes
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Security & Privacy Tab */}
                {activeTab === 'security' && (
                  <Card>
                    <h2 className="text-2xl font-bold text-dark-charcoal mb-6">
                      Security & Privacy
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-dark-charcoal mb-4">
                          Password Management
                        </h3>
                        <Button variant="secondary" size="medium">
                          Change Password
                        </Button>
                      </div>

                      <hr className="border-light-gray" />

                      <div>
                        <h3 className="font-bold text-dark-charcoal mb-4">
                          Privacy Controls
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Location Sharing</p>
                              <p className="text-sm text-warm-gray">Allow location access during emergencies</p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Profile Visibility</p>
                              <p className="text-sm text-warm-gray">Allow others to find you by phone/email</p>
                            </div>
                            <input type="checkbox" className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                        </div>
                      </div>

                      <hr className="border-light-gray" />

                      <div>
                        <h3 className="font-bold text-dark-charcoal mb-4">
                          Account Management
                        </h3>
                        <div className="space-y-3">
                          <Button variant="secondary" size="medium">
                            Download Your Data
                          </Button>
                          <Button variant="danger" size="medium">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <Card>
                    <h2 className="text-2xl font-bold text-dark-charcoal mb-6">
                      Notification Preferences
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-dark-charcoal mb-4">
                          Alert Notifications
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Emergency Alert Sounds</p>
                              <p className="text-sm text-warm-gray">Play sound for emergency alerts</p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Vibration</p>
                              <p className="text-sm text-warm-gray">Enable haptic feedback</p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Push Notifications</p>
                              <p className="text-sm text-warm-gray">Receive push notifications</p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                        </div>
                      </div>

                      <hr className="border-light-gray" />

                      <div>
                        <h3 className="font-bold text-dark-charcoal mb-4">
                          Email Notifications
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Safety Tips & Resources</p>
                              <p className="text-sm text-warm-gray">Weekly safety tips email</p>
                            </div>
                            <input type="checkbox" defaultChecked className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Monthly Safety Report</p>
                              <p className="text-sm text-warm-gray">Summary of your safety activity</p>
                            </div>
                            <input type="checkbox" className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                        </div>
                      </div>

                      <Button variant="primary" size="medium">
                        Save Preferences
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Safety Settings Tab */}
                {activeTab === 'safety' && (
                  <Card>
                    <h2 className="text-2xl font-bold text-dark-charcoal mb-6">
                      Safety Settings
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-dark-charcoal mb-4">
                          Emergency Configuration
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Quick SOS Gesture</p>
                              <p className="text-sm text-warm-gray">Press power button 5 times to trigger alert</p>
                            </div>
                            <input type="checkbox" className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Silent Alarm Mode</p>
                              <p className="text-sm text-warm-gray">Trigger alert without sound</p>
                            </div>
                            <input type="checkbox" className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Auto-record Audio</p>
                              <p className="text-sm text-warm-gray">Record audio during alerts for evidence</p>
                            </div>
                            <input type="checkbox" className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                        </div>
                      </div>

                      <hr className="border-light-gray" />

                      <div>
                        <h3 className="font-bold text-dark-charcoal mb-4">
                          Default Alert Settings
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-dark-charcoal mb-2">
                            Default Severity Level
                          </label>
                          <select className="w-full px-4 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose">
                            <option>Level 1 - Concern</option>
                            <option>Level 2 - Immediate</option>
                            <option>Level 3 - Critical</option>
                          </select>
                        </div>
                      </div>

                      <Button variant="primary" size="medium">
                        Save Settings
                      </Button>
                    </div>
                  </Card>
                )}

                {/* App Preferences Tab */}
                {activeTab === 'preferences' && (
                  <Card>
                    <h2 className="text-2xl font-bold text-dark-charcoal mb-6">
                      App Preferences
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-dark-charcoal mb-2">
                          Theme
                        </label>
                        <select className="w-full px-4 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose">
                          <option>Light Mode</option>
                          <option>Dark Mode</option>
                          <option>System Default</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-dark-charcoal mb-2">
                          Language
                        </label>
                        <select className="w-full px-4 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose">
                          <option>English</option>
                          <option>Swahili</option>
                        </select>
                      </div>

                      <div>
                        <h3 className="font-bold text-dark-charcoal mb-4">
                          Accessibility
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">High Contrast Mode</p>
                              <p className="text-sm text-warm-gray">Increase contrast for better visibility</p>
                            </div>
                            <input type="checkbox" className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-dark-charcoal">Large Touch Targets</p>
                              <p className="text-sm text-warm-gray">Make buttons and links easier to tap</p>
                            </div>
                            <input type="checkbox" className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded" />
                          </div>
                        </div>
                      </div>

                      <Button variant="primary" size="medium">
                        Save Preferences
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <FloatingActionButton />
    </div>
  )
}

export default Profile
