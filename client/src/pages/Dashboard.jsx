import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Users, Shield, ClipboardList, Phone, TrendingUp, CheckCircle } from 'lucide-react'
import { collection, getDocs, query, orderBy, limit, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../utils/firebase'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { useAuth } from '../context/AuthContext'
import { formatDateTime, getSeverityColor, getSeverityLabel } from '../utils/helpers'

const Dashboard = () => {
  const navigate = useNavigate()
  const { userProfile, currentUser } = useAuth()
  const [contacts, setContacts] = useState([])
  const [incidents, setIncidents] = useState([])
  const [bystanders, setBystanders] = useState([])
  const [safetyStatus, setSafetyStatus] = useState('safe')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checklist, setChecklist] = useState({
    addedContacts: false,
    invitedBystanders: false,
    testedAlert: false,
    exploredResources: false,
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch emergency contacts
      const contactsSnapshot = await getDocs(
        collection(db, 'users', currentUser.uid, 'emergencyContacts')
      )
      const contactsData = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setContacts(contactsData)

      // Fetch recent incidents
      const incidentsQuery = query(
        collection(db, 'users', currentUser.uid, 'incidents'),
        orderBy('triggeredAt', 'desc'),
        limit(3)
      )
      const incidentsSnapshot = await getDocs(incidentsQuery)
      const incidentsData = incidentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setIncidents(incidentsData)

      // Update checklist
      setChecklist({
        addedContacts: contactsData.length >= 3,
        invitedBystanders: bystanders.length > 0,
        testedAlert: incidentsData.some(i => i.alertDetails?.method === 'test'),
        exploredResources: false, // You can track this in user profile
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    setLoading(true)
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        safetyStatus: newStatus,
        statusUpdatedAt: serverTimestamp(),
      }, { merge: true })
      
      setSafetyStatus(newStatus)
      setShowStatusModal(false)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const handleChecklistToggle = (item) => {
    setChecklist({ ...checklist, [item]: !checklist[item] })
  }

  const handleCallHotline = (number) => {
    window.location.href = `tel:${number}`
  }

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
              className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-deep-rose to-pink-600 cursor-pointer hover:shadow-xl transition-shadow"
              padding="large"
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
                  <Button 
                    variant="outline" 
                    size="large"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/emergency')
                    }}
                  >
                    Trigger Emergency Alert
                  </Button>
                </div>
                <div className="hidden lg:block">
                  <AlertTriangle size={120} className="opacity-20" />
                </div>
              </div>
            </Card>

            {/* Safety Status Card - NOW FUNCTIONAL */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-success-green bg-opacity-10 p-3 rounded-full">
                  <TrendingUp className="text-success-green" size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal">Safety Status</h3>
              </div>
              <div className="mb-4">
                <div className={`inline-block px-4 py-2 rounded-full font-medium ${
                  safetyStatus === 'safe' ? 'bg-success-green bg-opacity-10 text-success-green' :
                  safetyStatus === 'concerned' ? 'bg-warning-orange bg-opacity-10 text-warning-orange' :
                  'bg-error-red bg-opacity-10 text-error-red'
                }`}>
                  {safetyStatus === 'safe' ? '✓ Safe' :
                   safetyStatus === 'concerned' ? '⚠ Concerned' :
                   '🚨 Need Help'}
                </div>
              </div>
              <p className="text-warm-gray text-sm mb-4">
                Last updated: Just now
              </p>
              <Button 
                variant="secondary" 
                size="small" 
                fullWidth
                onClick={() => setShowStatusModal(true)}
              >
                Update Status
              </Button>
            </Card>

            {/* Emergency Contacts Summary - NOW FUNCTIONAL */}
            <Card hover={true} onClick={() => navigate('/contacts')} className="cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-deep-rose bg-opacity-10 p-3 rounded-full">
                  <Users className="text-deep-rose" size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal">Emergency Contacts</h3>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-deep-rose">{contacts.length}</span>
                  <span className="text-warm-gray">of 5 contacts</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="w-full bg-light-gray rounded-full h-2">
                  <div
                    className="bg-deep-rose h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(contacts.length / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              {contacts.length === 0 ? (
                <p className="text-sm text-warning-orange mb-4">
                  ⚠️ Add emergency contacts to activate your safety network
                </p>
              ) : (
                <div className="mb-4">
                  <p className="text-sm text-success-green">
                    ✓ {contacts.filter(c => c.verified).length} verified contacts
                  </p>
                  <p className="text-sm text-warm-gray">
                    {contacts.filter(c => c.priority === 'Primary').length} primary contacts
                  </p>
                </div>
              )}
              <Button variant="primary" size="small" fullWidth>
                {contacts.length === 0 ? 'Add Contacts' : 'Manage Contacts'}
              </Button>
            </Card>

            {/* Trusted Bystanders Network - NOW FUNCTIONAL */}
            <Card hover={true} onClick={() => navigate('/bystanders')} className="cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-info-blue bg-opacity-10 p-3 rounded-full">
                  <Shield className="text-info-blue" size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal">Trusted Bystanders</h3>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-info-blue">{bystanders.length}</span>
                  <span className="text-warm-gray">responders</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  {bystanders.length === 0 ? (
                    <div className="h-8 w-8 rounded-full bg-warm-gray flex items-center justify-center text-white text-xs border-2 border-white">
                      +
                    </div>
                  ) : (
                    bystanders.slice(0, 3).map((b, i) => (
                      <div key={i} className="h-8 w-8 rounded-full bg-info-blue flex items-center justify-center text-white text-xs border-2 border-white font-bold">
                        {b.name?.charAt(0) || '?'}
                      </div>
                    ))
                  )}
                </div>
                <span className="text-sm text-warm-gray">
                  {bystanders.length === 0 ? 'Build your network' : `${bystanders.length} in network`}
                </span>
              </div>
              <Button variant="secondary" size="small" fullWidth>
                Manage Network
              </Button>
            </Card>

            {/* Recent Incidents - NOW FUNCTIONAL */}
            <Card hover={true} onClick={() => navigate('/incidents')} className="cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-warning-orange bg-opacity-10 p-3 rounded-full">
                  <ClipboardList className="text-warning-orange" size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal">Recent Incidents</h3>
              </div>
              <div className="mb-4 min-h-[60px]">
                {incidents.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-warm-gray text-center text-sm">
                      No incidents recorded
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {incidents.slice(0, 2).map((incident) => (
                      <div key={incident.id} className="text-sm border-l-4 border-warning-orange pl-3 py-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${getSeverityColor(incident.severity)} text-white`}>
                            {getSeverityLabel(incident.severity)}
                          </span>
                          <span className="text-xs text-warm-gray">
                            {incident.triggeredAt ? formatDateTime(incident.triggeredAt).split(' at ')[0] : 'N/A'}
                          </span>
                        </div>
                        <p className="text-xs text-warm-gray">
                          {incident.status === 'resolved' ? 'Resolved' : 'Active'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {incidents.length === 0 ? (
                <p className="text-sm text-success-green mb-4">
                  ✓ We hope it stays this way
                </p>
              ) : (
                <p className="text-sm text-info-blue mb-4">
                  {incidents.filter(i => i.status === 'active').length} active alerts
                </p>
              )}
              <Button variant="secondary" size="small" fullWidth>
                View All Reports
              </Button>
            </Card>

            {/* Quick Resources - NOW FUNCTIONAL */}
            <Card hover={true} onClick={() => navigate('/resource-hub')} className="md:col-span-2 cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-deep-rose bg-opacity-10 p-3 rounded-full">
                  <Phone className="text-deep-rose" size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-charcoal">Quick Resources</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCallHotline('1195')
                  }}
                  className="bg-pale-pink p-4 rounded-lg hover:bg-opacity-70 transition-colors text-left"
                >
                  <p className="font-medium text-dark-charcoal">GBV Hotline</p>
                  <p className="text-sm text-deep-rose font-bold">1195</p>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCallHotline('999')
                  }}
                  className="bg-pale-pink p-4 rounded-lg hover:bg-opacity-70 transition-colors text-left"
                >
                  <p className="font-medium text-dark-charcoal">Police Emergency</p>
                  <p className="text-sm text-deep-rose font-bold">999</p>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCallHotline('999')
                  }}
                  className="bg-pale-pink p-4 rounded-lg hover:bg-opacity-70 transition-colors text-left"
                >
                  <p className="font-medium text-dark-charcoal">Ambulance</p>
                  <p className="text-sm text-deep-rose font-bold">999</p>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate('/resource-hub')
                  }}
                  className="bg-pale-pink p-4 rounded-lg hover:bg-opacity-70 transition-colors text-left"
                >
                  <p className="font-medium text-dark-charcoal">Safe Houses</p>
                  <p className="text-sm text-deep-rose">Find nearby</p>
                </button>
              </div>
              <Button variant="primary" size="small" fullWidth>
                View All Resources
              </Button>
            </Card>

            {/* Getting Started Card - NOW FUNCTIONAL */}
            <Card className="md:col-span-2 lg:col-span-3" borderColor="deep-rose">
              <h3 className="text-xl font-bold text-dark-charcoal mb-4">
                Complete Your Safety Setup
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <input
                    type="checkbox"
                    checked={checklist.addedContacts}
                    onChange={() => handleChecklistToggle('addedContacts')}
                    className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded cursor-pointer"
                  />
                  <span className={`${checklist.addedContacts ? 'line-through text-warm-gray' : 'text-dark-charcoal'}`}>
                    Add at least 3 emergency contacts
                  </span>
                  {!checklist.addedContacts && (
                    <button
                      onClick={() => navigate('/contacts')}
                      className="ml-auto text-sm text-deep-rose hover:underline"
                    >
                      Add now →
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <input
                    type="checkbox"
                    checked={checklist.invitedBystanders}
                    onChange={() => handleChecklistToggle('invitedBystanders')}
                    className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded cursor-pointer"
                  />
                  <span className={`${checklist.invitedBystanders ? 'line-through text-warm-gray' : 'text-dark-charcoal'}`}>
                    Invite trusted bystanders to your network
                  </span>
                  {!checklist.invitedBystanders && (
                    <button
                      onClick={() => navigate('/bystanders')}
                      className="ml-auto text-sm text-deep-rose hover:underline"
                    >
                      Invite now →
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <input
                    type="checkbox"
                    checked={checklist.testedAlert}
                    onChange={() => handleChecklistToggle('testedAlert')}
                    className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded cursor-pointer"
                  />
                  <span className={`${checklist.testedAlert ? 'line-through text-warm-gray' : 'text-dark-charcoal'}`}>
                    Test your emergency alert system
                  </span>
                  {!checklist.testedAlert && (
                    <button
                      onClick={() => navigate('/emergency')}
                      className="ml-auto text-sm text-deep-rose hover:underline"
                    >
                      Test now →
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3 p-3 bg-light-gray rounded-lg">
                  <input
                    type="checkbox"
                    checked={checklist.exploredResources}
                    onChange={() => handleChecklistToggle('exploredResources')}
                    className="h-5 w-5 text-deep-rose focus:ring-deep-rose border-gray-300 rounded cursor-pointer"
                  />
                  <span className={`${checklist.exploredResources ? 'line-through text-warm-gray' : 'text-dark-charcoal'}`}>
                    Explore support resources in your area
                  </span>
                  {!checklist.exploredResources && (
                    <button
                      onClick={() => navigate('/resource-hub')}
                      className="ml-auto text-sm text-deep-rose hover:underline"
                    >
                      Explore →
                    </button>
                  )}
                </div>
              </div>
              {Object.values(checklist).every(v => v) && (
                <div className="mt-4 p-4 bg-success-green bg-opacity-10 rounded-lg text-center">
                  <CheckCircle className="inline-block text-success-green mb-2" size={32} />
                  <p className="text-success-green font-bold">
                    🎉 Your safety network is fully set up!
                  </p>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Update Status Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Safety Status"
      >
        <div className="space-y-4">
          <p className="text-warm-gray mb-4">
            Let your network know how you're doing
          </p>
          
          <button
            onClick={() => handleUpdateStatus('safe')}
            disabled={loading}
            className="w-full p-4 border-2 border-success-green rounded-lg hover:bg-success-green hover:bg-opacity-10 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-success-green bg-opacity-20 rounded-full flex items-center justify-center">
                <CheckCircle className="text-success-green" size={24} />
              </div>
              <div>
                <p className="font-bold text-dark-charcoal">I'm Safe</p>
                <p className="text-sm text-warm-gray">Everything is okay</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleUpdateStatus('concerned')}
            disabled={loading}
            className="w-full p-4 border-2 border-warning-orange rounded-lg hover:bg-warning-orange hover:bg-opacity-10 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-warning-orange bg-opacity-20 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-warning-orange" size={24} />
              </div>
              <div>
                <p className="font-bold text-dark-charcoal">I'm Concerned</p>
                <p className="text-sm text-warm-gray">Feeling uncomfortable or worried</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleUpdateStatus('need-help')}
            disabled={loading}
            className="w-full p-4 border-2 border-error-red rounded-lg hover:bg-error-red hover:bg-opacity-10 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-error-red bg-opacity-20 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-error-red" size={24} />
              </div>
              <div>
                <p className="font-bold text-dark-charcoal">I Need Help</p>
                <p className="text-sm text-warm-gray">Requires immediate attention</p>
              </div>
            </div>
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Dashboard