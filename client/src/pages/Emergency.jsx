import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, AlertTriangle, AlertCircle, Siren, MapPin, CheckCircle, Phone } from 'lucide-react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import { generateIncidentNumber } from '../utils/helpers'

const Emergency = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [step, setStep] = useState('select') // select, confirm, success
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [location, setLocation] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [incidentId, setIncidentId] = useState(null)

  const severityLevels = [
    {
      level: 1,
      color: 'concern',
      icon: AlertCircle,
      title: 'I Feel Unsafe',
      description: 'You\'re being followed, feel uncomfortable, need someone on standby',
      examples: 'Walking alone at night, suspicious person nearby, verbal harassment',
      badge: 'Level 1 - Concern',
    },
    {
      level: 2,
      color: 'immediate',
      icon: AlertTriangle,
      title: 'I Need Help Now',
      description: 'Verbal harassment escalating, need nearby assistance immediately',
      examples: 'Threatening situation, harassment intensifying, need intervention',
      badge: 'Level 2 - Immediate',
    },
    {
      level: 3,
      color: 'critical',
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
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const handleLevelSelect = (level) => {
    setSelectedLevel(level)
    setStep('confirm')
  }

  const handleSendAlert = async () => {
    setLoading(true)

    try {
      // Create incident in Firestore
      const incidentData = {
        userId: currentUser.uid,
        incidentNumber: generateIncidentNumber(),
        severity: selectedLevel.level,
        status: 'active',
        triggeredAt: serverTimestamp(),
        location: location || { lat: 0, lng: 0, address: 'Location unavailable' },
        alertDetails: {
          description: selectedLevel.description,
          customNotes: additionalInfo,
          method: 'manual',
        },
        notifications: {
          emergencyContacts: [],
          bystanders: [],
        },
        responseLog: [
          {
            timestamp: new Date(),
            action: 'Alert triggered',
            actor: 'User',
            details: `${selectedLevel.badge} alert initiated`,
          },
        ],
      }

      const docRef = await addDoc(collection(db, 'users', currentUser.uid, 'incidents'), incidentData)
      setIncidentId(docRef.id)
      setStep('success')
    } catch (error) {
      console.error('Error sending alert:', error)
      alert('Failed to send alert. Please try again or call emergency services directly.')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkSafe = () => {
    navigate('/incidents')
  }

  const handleCallEmergency = () => {
    window.location.href = 'tel:999'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Level Selection */}
        {step === 'select' && (
          <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-dark-charcoal">Emergency Alert</h2>
                <p className="text-warm-gray mt-2">Select the severity level of your situation</p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-warm-gray hover:text-dark-charcoal transition-colors p-1 rounded-full hover:bg-light-gray"
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
          <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-dark-charcoal">Confirm Alert</h2>
              <button
                onClick={() => setStep('select')}
                className="text-warm-gray hover:text-dark-charcoal transition-colors p-1 rounded-full hover:bg-light-gray"
              >
                <X size={24} />
              </button>
            </div>

            {/* Selected Level Display */}
            <div className={`bg-${selectedLevel.color} bg-opacity-10 border-2 border-${selectedLevel.color} rounded-lg p-4 mb-6`}>
              <div className="flex items-center gap-3">
                <div className={`bg-${selectedLevel.color} text-white rounded-full p-2`}>
                  {selectedLevel.icon && <selectedLevel.icon size={24} />}
                </div>
                <div>
                  <p className={`text-${selectedLevel.color} font-bold`}>{selectedLevel.badge}</p>
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
                  <p className="text-sm text-dark-charcoal">
                    Latitude: {location.lat.toFixed(6)}
                  </p>
                  <p className="text-sm text-dark-charcoal">
                    Longitude: {location.lng.toFixed(6)}
                  </p>
                  <p className="text-sm text-warm-gray mt-1">
                    Accuracy: ±{Math.round(location.accuracy)}m
                  </p>
                </div>
              ) : (
                <div className="bg-warning-orange bg-opacity-10 border border-warning-orange p-4 rounded-lg">
                  <p className="text-warning-orange text-sm">
                    ⚠️ Location unavailable. Enable location services for better assistance.
                  </p>
                </div>
              )}
            </div>

            {/* Alert Recipients */}
            <div className="mb-6">
              <h3 className="font-bold text-dark-charcoal mb-2">Who Will Be Alerted</h3>
              <div className="bg-light-gray p-4 rounded-lg">
                <p className="text-sm text-warm-gray">
                  • 0 emergency contacts
                </p>
                <p className="text-sm text-warm-gray">
                  • 0 nearby trusted bystanders
                </p>
                <p className="text-sm text-warning-orange mt-2">
                  ⚠️ Add emergency contacts to receive assistance
                </p>
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
                Cancel
              </Button>
            </div>

            {/* Countdown warning (optional) */}
            <p className="text-center text-sm text-warm-gray mt-4">
              Your alert will be sent to your emergency network
            </p>
          </div>
        )}

        {/* Success Screen */}
        {step === 'success' && selectedLevel && (
          <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6">
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
                    <p className="font-bold text-dark-charcoal">0</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-gray">Bystanders Alerted</p>
                    <p className="font-bold text-dark-charcoal">0</p>
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
                <Button variant="secondary" size="medium" fullWidth onClick={() => navigate('/dashboard')}>
                  Return to Dashboard
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
