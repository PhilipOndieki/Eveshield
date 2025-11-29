import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, AlertTriangle, AlertCircle, Siren, MapPin, CheckCircle, Phone } from 'lucide-react'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import { generateIncidentNumber } from '../utils/helpers'
import toast from 'react-hot-toast'

const Emergency = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()

  const [step, setStep] = useState('select') // select, confirm, success
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [address, setAddress] = useState(null)
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [incidentId, setIncidentId] = useState(null)
  const [notificationStats, setNotificationStats] = useState({
    bystanders: 0,
    contacts: 0
  })

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

  // Convert coordinates to readable address
  const getAddressFromCoordinates = async (lat, lng) => {
    setLoadingAddress(true)
    try {
      // Using OpenStreetMap Nominatim (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'EveShield-Emergency-App'
          }
        }
      )
      const data = await response.json()
      
      if (data && data.address) {
        const addr = data.address
        // Build readable address
        const parts = [
          addr.road || addr.street,
          addr.suburb || addr.neighbourhood || addr.quarter,
          addr.city || addr.town || addr.village,
          addr.county || addr.state_district,
          addr.country
        ].filter(Boolean) // Remove undefined values
        
        setAddress(parts.join(', '))
      } else {
        setAddress(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      }
    } catch (error) {
      console.error('Error getting address:', error)
      setAddress(`Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    } finally {
      setLoadingAddress(false)
    }
  }

  // Get user's location with better error handling
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          
          setLocation({
            lat: lat,
            lng: lng,
            accuracy: position.coords.accuracy,
          })
          setLocationError(null)
          
          // Get human-readable address
          await getAddressFromCoordinates(lat, lng)
        },
        (error) => {
          console.error('Error getting location:', error)
          let errorMessage = 'Unable to get location'
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location in your browser settings.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.'
              break
            default:
              errorMessage = 'An unknown error occurred.'
          }
          
          setLocationError(errorMessage)
          setLocation(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setLocationError('Geolocation not supported by this browser')
    }
  }, [])

  const handleLevelSelect = (level) => {
    setSelectedLevel(level)
    setStep('confirm')
  }

  const handleSendAlert = async () => {
    setLoading(true)

    try {
      // Fetch all connected bystanders
      const bystandersQuery = query(
        collection(db, 'connections'),
        where('fromUserId', '==', currentUser.uid),
        where('status', '==', 'accepted')
      )
      
      const bystandersSnapshot = await getDocs(bystandersQuery)
      const bystanders = bystandersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      console.log('🚨 Found bystanders:', bystanders.length)

      // Fetch emergency contacts
      const contactsSnapshot = await getDocs(
        collection(db, 'users', currentUser.uid, 'emergencyContacts')
      )
      const contacts = contactsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      console.log('📞 Found emergency contacts:', contacts.length)

      // Create incident in Firestore
      const incidentData = {
        userId: currentUser.uid,
        incidentNumber: generateIncidentNumber(),
        severity: selectedLevel.level,
        status: 'active',
        triggeredAt: serverTimestamp(),
        location: location ? {
          lat: location.lat,
          lng: location.lng,
          accuracy: location.accuracy,
          address: address || 'Address lookup failed'
        } : { 
          lat: 0, 
          lng: 0, 
          address: 'Location unavailable' 
        },
        alertDetails: {
          description: selectedLevel.description,
          customNotes: additionalInfo,
          method: 'manual',
        },
        notifications: {
          emergencyContacts: contacts.map(c => c.id),
          bystanders: bystanders.map(b => b.toUserId),
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
      console.log('✅ Incident created:', docRef.id)

      // Send notifications to all bystanders
      const notificationPromises = bystanders.map(async (bystander) => {
        try {
          await addDoc(collection(db, 'notifications'), {
            userId: bystander.toUserId,
            type: 'emergency',
            title: `🚨 ${selectedLevel.badge} - ${userProfile?.fullName || 'Someone'} needs help!`,
            message: `${userProfile?.fullName || 'A person'} in your safety network has triggered a ${selectedLevel.badge} alert${location ? ` at ${address || `coordinates ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}` : ''}. ${additionalInfo ? `Note: ${additionalInfo}` : 'Please check on them immediately.'}`,
            read: false,
            actionUrl: `/incidents`,
            metadata: {
              incidentId: docRef.id,
              incidentNumber: incidentData.incidentNumber,
              severity: selectedLevel.level,
              fromUserId: currentUser.uid,
              fromUserName: userProfile?.fullName || 'User',
              location: location ? {
                lat: location.lat,
                lng: location.lng,
                address: address || 'Location unavailable'
              } : null,
            },
            createdAt: serverTimestamp(),
          })
          console.log('✅ Notification sent to bystander:', bystander.toUserProfile?.fullName)
        } catch (error) {
          console.error('❌ Error sending notification to bystander:', error)
        }
      })

      // Send notifications to emergency contacts
      const contactNotificationPromises = contacts.map(async (contact) => {
        try {
          // Note: In a production app, you would also send SMS/email here via a backend function
          console.log(`📧 Would send SMS to ${contact.phoneNumber}: Emergency alert from ${userProfile?.fullName}`)
          console.log(`📧 Would send email to ${contact.email}: Emergency alert details`)
          
          // For now, we'll show a toast notification
          toast.success(`Emergency contact ${contact.fullName} would be notified via SMS/Email`, {
            duration: 3000,
          })
        } catch (error) {
          console.error('❌ Error notifying contact:', error)
        }
      })

      // Wait for all notifications to be sent
      await Promise.all([...notificationPromises, ...contactNotificationPromises])
      
      console.log('✅ All notifications sent successfully')
      
      // Update notification stats
      setNotificationStats({
        bystanders: bystanders.length,
        contacts: contacts.length
      })
      
      setIncidentId(docRef.id)
      setStep('success')

      // Show success toast
      toast.success(`Alert sent to ${bystanders.length} bystander${bystanders.length !== 1 ? 's' : ''} and ${contacts.length} contact${contacts.length !== 1 ? 's' : ''}!`, {
        duration: 5000,
        icon: '🚨',
      })
    } catch (error) {
      console.error('Error sending alert:', error)
      toast.error('Failed to send alert. Please try again or call emergency services directly.')
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
                    style={{
                      backgroundColor: level.level === 1 ? '#F59E0B' : level.level === 2 ? '#EF4444' : '#DC2626'
                    }}
                    className="hover:opacity-90 transition-all duration-200 hover:scale-105 rounded-lg p-6 text-white text-left shadow-lg"
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
                <MapPin className="text-primary-blue" size={20} />
                <h3 className="font-bold text-dark-charcoal">Your Location</h3>
              </div>
              {location ? (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  {loadingAddress ? (
                    <p className="text-sm text-warm-gray">📍 Getting address...</p>
                  ) : address ? (
                    <p className="text-sm text-dark-charcoal mb-2">📍 {address}</p>
                  ) : null}
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
                  <p className="text-warning-orange text-sm font-medium mb-2">
                    ⚠️ Location unavailable
                  </p>
                  <p className="text-sm text-warm-gray">
                    {locationError || 'Please enable location services in your browser'}
                  </p>
                  <p className="text-xs text-warm-gray mt-2">
                    Your alert will still be sent, but responders won't have your exact location.
                  </p>
                </div>
              )}
            </div>

            {/* Alert Recipients */}
            <div className="mb-6">
              <h3 className="font-bold text-dark-charcoal mb-2">Who Will Be Alerted</h3>
              <div className="bg-light-gray p-4 rounded-lg">
                <p className="text-sm text-warm-gray">
                  🔔 All your connected bystanders will receive instant notifications
                </p>
                <p className="text-sm text-warm-gray">
                  📧 All emergency contacts will be notified
                </p>
                <p className="text-sm text-info-blue mt-2">
                  💡 Make sure you have added bystanders and contacts for maximum protection
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
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
                    <p className="text-sm text-warm-gray">Bystanders Notified</p>
                    <p className="font-bold text-dark-charcoal">{notificationStats.bystanders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-gray">Contacts Notified</p>
                    <p className="font-bold text-dark-charcoal">{notificationStats.contacts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warm-gray">Time</p>
                    <p className="font-bold text-dark-charcoal">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                
                {/* Show location in success screen */}
                {address && (
                  <div className="mt-4 pt-4 border-t border-warm-gray border-opacity-20">
                    <p className="text-sm text-warm-gray mb-1">Location Shared</p>
                    <p className="text-sm font-medium text-dark-charcoal">📍 {address}</p>
                  </div>
                )}
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