import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, AlertTriangle, AlertCircle, Siren, MapPin, CheckCircle, Phone, Navigation } from 'lucide-react'
import { collection, addDoc, serverTimestamp, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import { generateIncidentNumber } from '../utils/helpers'

const Emergency = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [step, setStep] = useState('select') // select, confirm, sending, success
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [incidentId, setIncidentId] = useState(null)
  const [contacts, setContacts] = useState([])
  const [bystanders, setBystanders] = useState([])
  const [countdown, setCountdown] = useState(null)

  const severityLevels = [
    {
      level: 1,
      color: 'warning-orange',
      icon: AlertCircle,
      title: 'I Feel Unsafe',
      description: 'You\'re being followed, feel uncomfortable, need someone on standby',
      examples: 'Walking alone at night, suspicious person nearby, verbal harassment',
      badge: 'Level 1 - Concern',
    },
    {
      level: 2,
      color: 'error-red',
      icon: AlertTriangle,
      title: 'I Need Help Now',
      description: 'Verbal harassment escalating, need nearby assistance immediately',
      examples: 'Threatening situation, harassment intensifying, need intervention',
      badge: 'Level 2 - Immediate',
    },
    {
      level: 3,
      color: 'deep-rose',
      icon: Siren,
      title: 'EMERGENCY - Life in Danger',
      description: 'Physical attack, severe danger, urgent intervention required',
      examples: 'Physical assault, imminent harm, life-threatening situation',
      badge: 'Level 3 - CRITICAL',
    },
  ]

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          })
          setLocationError(null)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationError('Location unavailable. Please enable location services.')
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setLocationError('Geolocation is not supported by your browser.')
    }
  }, [])

  // Fetch contacts and bystanders
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        // Fetch contacts
        const contactsSnapshot = await getDocs(
          collection(db, 'users', currentUser.uid, 'emergencyContacts')
        )
        const contactsData = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setContacts(contactsData)

        // Fetch bystanders
        const bystandersSnapshot = await getDocs(
          collection(db, 'users', currentUser.uid, 'trustedBystanders')
        )
        const bystandersData = bystandersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setBystanders(bystandersData.filter(b => b.availability === 'Available'))
      } catch (error) {
        console.error('Error fetching network data:', error)
      }
    }

    fetchNetworkData()
  }, [currentUser])

  const handleLevelSelect = (level) => {
    setSelectedLevel(level)
    setStep('confirm')
  }

  const sendSMSAlerts = async (phoneNumbers, message) => {
    // In production, this would integrate with Twilio, Africa's Talking, or similar SMS service
    console.log('Sending SMS to:', phoneNumbers)
    console.log('Message:', message)
    
    // Simulate SMS sending
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, sent: phoneNumbers.length })
      }, 1000)
    })
  }

  const handleSendAlert = async () => {
    setLoading(true)
    setStep('sending')

    try {
      const incidentNumber = generateIncidentNumber()
      
      // Prepare alert message
      const alertMessage = `🚨 EMERGENCY ALERT from EveShield
      
${selectedLevel.badge}
User: ${currentUser.displayName || 'User'}
Time: ${new Date().toLocaleString()}
Location: ${location ? `https://maps.google.com/?q=${location.lat},${location.lng}` : 'Location unavailable'}

${additionalInfo ? `Notes: ${additionalInfo}` : ''}

This is an automated emergency alert. Please respond immediately.`

      // Get contact phone numbers
      const contactNumbers = contacts
        .filter(c => c.phoneNumber)
        .map(c => c.phoneNumber)

      const bystanderNumbers = bystanders
        .filter(b => b.phoneNumber)
        .map(b => b.phoneNumber)

      // Send SMS alerts (in production)
      if (contactNumbers.length > 0 || bystanderNumbers.length > 0) {
        await sendSMSAlerts([...contactNumbers, ...bystanderNumbers], alertMessage)
      }

      // Create incident in Firestore
      const incidentData = {
        userId: currentUser.uid,
        incidentNumber: incidentNumber,
        severity: selectedLevel.level,
        status: 'active',
        triggeredAt: serverTimestamp(),
        location: location || { lat: 0, lng: 0, address: 'Location unavailable' },
        alertDetails: {
          description: selectedLevel.description,
          customNotes: additionalInfo,
          method: 'manual',
          levelBadge: selectedLevel.badge,
        },
        notifications: {
          emergencyContacts: contacts.map(c => ({
            id: c.id,
            name: c.fullName,
            phone: c.phoneNumber,
            notified: true,
            notifiedAt: new Date().toISOString(),
          })),
          bystanders: bystanders.map(b => ({
            id: b.id,
            name: b.fullName,
            phone: b.phoneNumber,
            notified: true,
            notifiedAt: new Date().toISOString(),
          })),
        },
        responseLog: [
          {
            timestamp: new Date().toISOString(),
            action: 'Alert triggered',
            actor: 'User',
            details: `${selectedLevel.badge} alert initiated`,
          },
        ],
      }

      const docRef = await addDoc(
        collection(db, 'users', currentUser.uid, 'incidents'),
        incidentData
      )
      
      setIncidentId(docRef.id)
      
      // Update user's safety status
      await updateDoc(doc(db, 'users', currentUser.uid), {
        safetyStatus: 'need-help',
        statusUpdatedAt: serverTimestamp(),
      })

      setStep('success')
    } catch (error) {
      console.error('Error sending alert:', error)
      alert('Failed to send alert. Please try again or call emergency services directly.')
      setStep('confirm')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkSafe = async () => {
    try {
      if (incidentId) {
        await updateDoc(
          doc(db, 'users', currentUser.uid, 'incidents', incidentId),
          {
            status: 'resolved',
            resolvedAt: serverTimestamp(),
            responseLog: [
              {
                timestamp: new Date().toISOString(),
                action: 'Marked as safe',
                actor: 'User',
                details: 'User indicated they are now safe',
              },
            ],
          }
        )
      }

      await updateDoc(doc(db, 'users', currentUser.uid), {
        safetyStatus: 'safe',
        statusUpdatedAt: serverTimestamp(),
      })

      navigate('/dashboard')
    } catch (error) {
      console.error('Error marking safe:', error)
      navigate('/dashboard')
    }
  }

  const handleCallEmergency = () => {
    window.location.href = 'tel:999'
  }

  const handleRetryLocation = () => {
    setLocationError(null)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString(),
          })
          setLocationError(null)
        },
        (error) => {
          setLocationError('Unable to get location. Please try again.')
        }
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Level Selection */}
        {step === 'select' && (
          <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-dark-charcoal">Emergency Alert</h2>
                <p className="text-warm-gray mt-2">Select the severity level of your situation</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-warm-gray hover:text-dark-charcoal transition-colors p-2 rounded-full hover:bg-light-gray"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {severityLevels.map((level) => {
                const Icon = level.icon
                return (
                  <button
                    key={level.level}
                    onClick={() => handleLevelSelect(level)}
                    className={`bg-${level.color} hover:opacity-90 transition-all duration-200 hover:scale-105 rounded-lg p-6 text-white text-left`}
                    style={{
                      backgroundColor: level.color === 'warning-orange' ? '#FFA726' :
                                      level.color === 'error-red' ? '#D32F2F' :
                                      '#E91E63'
                    }}
                  >
                    <div className="bg-white bg-opacity-20 rounded-full p-3 inline-block mb-4">
                      <Icon size={32} />
                    </div>
                    <div className="bg-white bg-opacity-20 text-xs font-medium px-3 py-1 rounded-full inline-block mb-3">
                      {level.badge}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{level.title}</h3>
                    <p className="text-sm mb-4 opacity-90">{level.description}</p>
                    <p className="text-xs opacity-75">Examples: {level.examples}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Confirmation Screen */}
        {step === 'confirm' && selectedLevel && (
          <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-dark-charcoal">Confirm Alert</h2>
              <button
                onClick={() => setStep('select')}
                className="text-warm-gray hover:text-dark-charcoal transition-colors p-2 rounded-full hover:bg-light-gray"
              >
                <X size={24} />
              </button>
            </div>

            {/* Selected Level Display */}
            <div className="bg-pale-pink border-2 border-deep-rose rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-deep-rose text-white rounded-full p-2">
                  {selectedLevel.icon && <selectedLevel.icon size={24} />}
                </div>
                <div>
                  <p className="text-deep-rose font-bold">{selectedLevel.badge}</p>
                  <p className="text-dark-charcoal font-medium">{selectedLevel.title}</p>
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="text-deep-rose" size={20} />
                <h3 className="font-bold text-dark-charcoal">Your Location</h3>
              </div>
              {location ? (
                <div className="bg-light-gray p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-dark-charcoal font-mono">
                        Lat: {location.lat.toFixed(6)}
                      </p>
                      <p className="text-sm text-dark-charcoal font-mono">
                        Lng: {location.lng.toFixed(6)}
                      </p>
                      <p className="text-sm text-warm-gray mt-1">
                        Accuracy: ±{Math.round(location.accuracy)}m
                      </p>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-info-blue hover:underline text-sm flex items-center gap-1"
                    >
                      <Navigation size={14} />
                      View Map
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-warning-orange bg-opacity-10 border border-warning-orange p-4 rounded-lg">
                  <p className="text-warning-orange text-sm mb-2">
                    ⚠️ {locationError || 'Getting your location...'}
                  </p>
                  <Button variant="secondary" size="small" onClick={handleRetryLocation}>
                    Retry Location
                  </Button>
                </div>
              )}
            </div>

            {/* Alert Recipients */}
            <div className="mb-6">
              <h3 className="font-bold text-dark-charcoal mb-2">Who Will Be Alerted</h3>
              <div className="bg-light-gray p-4 rounded-lg">
                <p className="text-sm text-dark-charcoal mb-1">
                  • {contacts.length} emergency contact{contacts.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-dark-charcoal">
                  • {bystanders.length} nearby trusted bystander{bystanders.length !== 1 ? 's' : ''}
                </p>
                {contacts.length === 0 && bystanders.length === 0 && (
                  <p className="text-sm text-warning-orange mt-2">
                    ⚠️ No contacts or bystanders will be notified. Consider calling emergency services directly.
                  </p>
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark-charcoal mb-2">
                Additional Information (Optional)
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full px-4 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
                rows="3"
                placeholder="Describe what's happening or any important details..."
              ></textarea>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                variant="danger"
                size="large"
                fullWidth
                onClick={handleSendAlert}
                disabled={loading}
              >
                {loading ? 'SENDING ALERT...' : 'SEND ALERT NOW'}
              </Button>
              <Button
                variant="secondary"
                size="large"
                onClick={() => setStep('select')}
              >
                Back
              </Button>
            </div>

            <p className="text-center text-sm text-warm-gray mt-4">
              Your network will receive an SMS with your location and details
            </p>
          </div>
        )}

        {/* Sending Screen */}
        {step === 'sending' && (
          <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center animate-fadeIn">
            <div className="animate-pulse mb-6">
              <Siren className="mx-auto text-deep-rose" size={64} />
            </div>
            <h2 className="text-2xl font-bold text-dark-charcoal mb-4">
              Sending Emergency Alert...
            </h2>
            <p className="text-warm-gray mb-4">
              Notifying your emergency network
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-deep-rose"></div>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {step === 'success' && selectedLevel && (
          <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 animate-fadeIn">
            <div className="text-center">
              <div className="bg-success-green bg-opacity-10 rounded-full p-6 inline-block mb-6">
                <CheckCircle className="text-success-green" size={64} />
              </div>
              <h2 className="text-3xl font-bold text-dark-charcoal mb-4">
                Alert Sent Successfully
              </h2>
              <p className="text-warm-gray mb-8">
                Your emergency network has been notified
              </p>

              {/* Alert Details */}
              <div className="bg-light-gray rounded-lg p-6 mb-6 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-warm-gray">Severity Level</p>
                    <p className="font-bold text-dark-charcoal">{selectedLevel.badge}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-gray">Contacts Notified</p>
                    <p className="font-bold text-dark-charcoal">{contacts.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-gray">Bystanders Alerted</p>
                    <p className="font-bold text-dark-charcoal">{bystanders.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-gray">Time</p>
                    <p className="font-bold text-dark-charcoal">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-info-blue bg-opacity-10 border border-info-blue rounded-lg p-4 mb-6">
                <p className="text-info-blue text-sm font-medium">
                  💡 Safety Tip: Stay calm. Keep your phone accessible. Move to a public area if possible.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button variant="success" size="large" fullWidth onClick={handleMarkSafe}>
                  I'm Safe Now
                </Button>
                <Button variant="danger" size="large" fullWidth onClick={handleCallEmergency}>
                  <Phone size={20} className="mr-2" />
                  Call Emergency Services (999)
                </Button>
                <Button variant="secondary" size="medium" fullWidth onClick={() => navigate('/incidents')}>
                  View Incident Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Emergency