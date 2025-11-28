import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Users, Shield, ClipboardList, Phone, TrendingUp } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { userProfile } = useAuth()

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar isAuthenticated={true} />

      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-dark-charcoal mb-2">
              Welcome back, {userProfile?.fullName || 'User'}
            </h1>
            <p className="text-warm-gray">
              Your safety network is here to protect you
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Emergency Quick Access Card */}
            <Card
              className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-deep-rose to-pink-600"
              padding="large"
              hover={true}
              onClick={() => navigate('/emergency')}
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-full">
                      <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold">Emergency Alert</h2>
                  </div>
                  <p className="text-lg mb-6">
                    One tap to alert your safety network
                  </p>
                  <Button variant="outline" size="large">
                    Trigger Emergency Alert
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <AlertTriangle size={120} className="opacity-20" />
                </div>
              </div>
            </Card>

            {/* Safety Status Card */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-success-green bg-opacity-10 p-3 rounded-full">
                  <TrendingUp className="text-success-green" size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal">Safety Status</h3>
              </div>
              <div className="mb-4">
                <div className="inline-block bg-success-green bg-opacity-10 text-success-green px-4 py-2 rounded-full font-medium">
                  ✓ Safe
                </div>
              </div>
              <p className="text-warm-gray text-sm mb-4">
                Last updated: Just now
              </p>
              <Button variant="secondary" size="small" fullWidth>
                Update Status
              </Button>
            </Card>

            {/* Emergency Contacts Summary */}
            <Card hover={true} onClick={() => navigate('/contacts')}>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-deep-rose bg-opacity-10 p-3 rounded-full">
                  <Users className="text-deep-rose" size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal">Emergency Contacts</h3>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-deep-rose">0</span>
                  <span className="text-warm-gray">of 5 contacts</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="w-full bg-light-gray rounded-full h-2">
                  <div
                    className="bg-deep-rose h-2 rounded-full transition-all duration-300"
                    style={{ width: '0%' }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-warning-orange mb-4">
                ⚠️ Add emergency contacts to activate your safety network
              </p>
              <Button variant="primary" size="small" fullWidth>
                Add Contacts
              </Button>
            </Card>

            {/* Trusted Bystanders Network */}
            <Card hover={true} onClick={() => navigate('/bystanders')}>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-info-blue bg-opacity-10 p-3 rounded-full">
                  <Shield className="text-info-blue" size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal">Trusted Bystanders</h3>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-info-blue">0</span>
                  <span className="text-warm-gray">responders</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-warm-gray flex items-center justify-center text-white text-xs border-2 border-white">
                    +
                  </div>
                </div>
                <span className="text-sm text-warm-gray">Build your network</span>
              </div>
              <Button variant="secondary" size="small" fullWidth>
                Manage Network
              </Button>
            </Card>

            {/* Recent Incidents */}
            <Card hover={true} onClick={() => navigate('/incidents')}>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-warning-orange bg-opacity-10 p-3 rounded-full">
                  <ClipboardList className="text-warning-orange" size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal">Recent Incidents</h3>
              </div>
              <div className="mb-4 min-h-[60px] flex items-center justify-center">
                <p className="text-warm-gray text-center">
                  No incidents recorded
                </p>
              </div>
              <p className="text-sm text-success-green mb-4">
                ✓ We hope it stays this way
              </p>
              <Button variant="secondary" size="small" fullWidth>
                View All Reports
              </Button>
            </Card>

            {/* Quick Resources */}
            <Card hover={true} onClick={() => navigate('/resource-hub')} className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-deep-rose bg-opacity-10 p-3 rounded-full">
                  <Phone className="text-deep-rose" size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal">Quick Resources</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-pale-pink p-4 rounded-lg hover:bg-opacity-70 transition-colors cursor-pointer">
                  <p className="font-medium text-dark-charcoal">GBV Hotline</p>
                  <p className="text-sm text-deep-rose font-bold">1195</p>
                </div>
                <div className="bg-pale-pink p-4 rounded-lg hover:bg-opacity-70 transition-colors cursor-pointer">
                  <p className="font-medium text-dark-charcoal">Police Emergency</p>
                  <p className="text-sm text-deep-rose font-bold">999</p>
                </div>
                <div className="bg-pale-pink p-4 rounded-lg hover:bg-opacity-70 transition-colors cursor-pointer">
                  <p className="font-medium text-dark-charcoal">Ambulance</p>
                  <p className="text-sm text-deep-rose font-bold">999</p>
                </div>
                <div className="bg-pale-pink p-4 rounded-lg hover:bg-opacity-70 transition-colors cursor-pointer">
                  <p className="font-medium text-dark-charcoal">Safe Houses</p>
                  <p className="text-sm text-deep-rose">Find nearby</p>
                </div>
              </div>
              <Button variant="primary" size="small" fullWidth>
                View All Resources
              </Button>
            </Card>

            {/* Getting Started Card */}
            <Card className="md:col-span-2 lg:col-span-3" borderColor="deep-rose">
              <h3 className="text-xl font-bold text-dark-charcoal mb-4">
                Complete Your Safety Setup
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded"
                  />
                  <span className="text-dark-charcoal">Add at least 3 emergency contacts</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded"
                  />
                  <span className="text-dark-charcoal">Invite trusted bystanders to your network</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded"
                  />
                  <span className="text-dark-charcoal">Test your emergency alert system</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded"
                  />
                  <span className="text-dark-charcoal">Explore support resources in your area</span>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  )
}

export default Dashboard
