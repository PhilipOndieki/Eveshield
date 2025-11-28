import { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { Shield, UserPlus, Info, Phone, Mail, MapPin, CheckCircle, Clock, Trash2, Edit, X } from 'lucide-react'
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import { validatePhoneNumber, validateEmail, formatPhoneNumber, countryCodes } from '../utils/validation'
import { getInitials } from '../utils/helpers'

const Bystanders = () => {
  const { currentUser } = useAuth()
  const [bystanders, setBystanders] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBystander, setEditingBystander] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState('254')

  const [formData, setFormData] = useState({
    fullName: '',
    relationship: 'Neighbor',
    phoneNumber: '',
    email: '',
    address: '',
    availability: 'Available',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchBystanders()
  }, [])

  const fetchBystanders = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'users', currentUser.uid, 'trustedBystanders')
      )
      const bystandersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setBystanders(bystandersData)
    } catch (error) {
      console.error('Error fetching bystanders:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required'
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required'
    } else {
      const fullPhone = formData.phoneNumber.startsWith('+') 
        ? formData.phoneNumber 
        : `+${selectedCountryCode}${formData.phoneNumber}`
      
      if (!validatePhoneNumber(fullPhone)) {
        newErrors.phoneNumber = 'Invalid phone number format'
      }
    }

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      const fullPhone = formData.phoneNumber.startsWith('+') 
        ? formData.phoneNumber 
        : `+${selectedCountryCode}${formData.phoneNumber}`

      const bystanderData = {
        fullName: formData.fullName,
        relationship: formData.relationship,
        phoneNumber: formatPhoneNumber(fullPhone),
        email: formData.email,
        address: formData.address,
        availability: formData.availability,
        verified: false,
        updatedAt: serverTimestamp(),
      }

      if (editingBystander) {
        await updateDoc(doc(db, 'users', currentUser.uid, 'trustedBystanders', editingBystander.id), bystanderData)
      } else {
        await addDoc(collection(db, 'users', currentUser.uid, 'trustedBystanders'), {
          ...bystanderData,
          createdAt: serverTimestamp(),
          invitationStatus: 'pending',
        })
      }

      resetForm()
      fetchBystanders()
    } catch (error) {
      console.error('Error saving bystander:', error)
      alert('Failed to save bystander. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (bystander) => {
    setEditingBystander(bystander)
    
    let phoneWithoutCode = bystander.phoneNumber
    let countryCode = '254'
    
    if (bystander.phoneNumber.startsWith('+')) {
      const match = bystander.phoneNumber.match(/^\+(\d{1,3})(.+)/)
      if (match) {
        countryCode = match[1]
        phoneWithoutCode = match[2]
      }
    }
    
    setSelectedCountryCode(countryCode)
    setFormData({
      fullName: bystander.fullName,
      relationship: bystander.relationship,
      phoneNumber: phoneWithoutCode,
      email: bystander.email || '',
      address: bystander.address || '',
      availability: bystander.availability || 'Available',
    })
    setShowAddModal(true)
  }

  const handleDelete = async (bystanderId) => {
    if (window.confirm('Are you sure you want to remove this bystander from your network?')) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'trustedBystanders', bystanderId))
        fetchBystanders()
      } catch (error) {
        console.error('Error deleting bystander:', error)
        alert('Failed to delete bystander')
      }
    }
  }

  const handleVerify = async (bystanderId) => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'trustedBystanders', bystanderId), {
        verified: true,
        verifiedAt: serverTimestamp(),
      })
      fetchBystanders()
    } catch (error) {
      console.error('Error verifying bystander:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      relationship: 'Neighbor',
      phoneNumber: '',
      email: '',
      address: '',
      availability: 'Available',
    })
    setSelectedCountryCode('254')
    setEditingBystander(null)
    setShowAddModal(false)
    setErrors({})
  }

  const availableBystanders = bystanders.filter(b => b.availability === 'Available').length
  const pendingInvitations = bystanders.filter(b => b.invitationStatus === 'pending').length

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar isAuthenticated={true} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-dark-charcoal mb-2">
                  My Trusted Bystanders Network
                </h1>
                <p className="text-warm-gray">
                  Build your safety circle with people you trust in your community
                </p>
              </div>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <UserPlus size={20} className="mr-2" />
                Add Bystander
              </Button>
            </div>

            {/* Info Banner */}
            <Card className="mb-6 bg-info-blue bg-opacity-10 border border-info-blue">
              <div className="flex items-start gap-3">
                <Info className="text-info-blue flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-dark-charcoal mb-2">
                    What are Trusted Bystanders?
                  </h3>
                  <p className="text-sm text-warm-gray">
                    Bystanders are people you personally know and trust who can respond if you need help.
                    They might be neighbors, classmates, coworkers, or community members. You must manually
                    add and verify each bystander - there are NO automatic alerts to strangers.
                  </p>
                </div>
              </div>
            </Card>

            {/* Network Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-info-blue mb-2">{bystanders.length}</p>
                  <p className="text-sm text-warm-gray">Total Bystanders</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-success-green mb-2">{availableBystanders}</p>
                  <p className="text-sm text-warm-gray">Currently Available</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-warning-orange mb-2">{pendingInvitations}</p>
                  <p className="text-sm text-warm-gray">Pending Invitations</p>
                </div>
              </Card>
            </div>

            {/* Bystanders List */}
            {bystanders.length === 0 ? (
              <Card className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="bg-info-blue bg-opacity-10 rounded-full p-6 inline-block mb-6">
                    <Shield className="text-info-blue" size={64} />
                  </div>
                  <h2 className="text-2xl font-bold text-dark-charcoal mb-4">
                    You haven't added any trusted bystanders yet
                  </h2>
                  <p className="text-warm-gray mb-4">
                    Bystanders are community members you trust who can help quickly because they're nearby
                  </p>
                  <p className="text-sm text-warm-gray mb-8">
                    Examples: Neighbors, classmates, roommates, coworkers, friends in your area
                  </p>
                  <Button variant="primary" size="large" onClick={() => setShowAddModal(true)}>
                    <UserPlus size={20} className="mr-2" />
                    Add First Bystander
                  </Button>
                  <div className="mt-8 p-4 bg-pale-pink rounded-lg">
                    <h3 className="font-bold text-dark-charcoal mb-2">Before adding bystanders:</h3>
                    <ul className="text-sm text-warm-gray text-left space-y-2">
                      <li>✓ I personally know this person</li>
                      <li>✓ I trust them to help me in an emergency</li>
                      <li>✓ I have their permission to add them</li>
                      <li>✓ They live or work near me</li>
                    </ul>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bystanders.map((bystander) => (
                  <Card key={bystander.id} hover={true}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-info-blue rounded-full flex items-center justify-center text-white font-bold">
                          {getInitials(bystander.fullName)}
                        </div>
                        <div>
                          <h3 className="font-bold text-dark-charcoal">{bystander.fullName}</h3>
                          <span className="text-xs bg-info-blue bg-opacity-10 text-info-blue px-2 py-1 rounded-full">
                            {bystander.relationship}
                          </span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bystander.availability === 'Available' 
                          ? 'bg-success-green bg-opacity-10 text-success-green' 
                          : 'bg-warm-gray bg-opacity-10 text-warm-gray'
                      }`}>
                        {bystander.availability}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-warm-gray">
                        <Phone size={16} />
                        <span>{bystander.phoneNumber}</span>
                      </div>
                      {bystander.email && (
                        <div className="flex items-center gap-2 text-sm text-warm-gray">
                          <Mail size={16} />
                          <span className="truncate">{bystander.email}</span>
                        </div>
                      )}
                      {bystander.address && (
                        <div className="flex items-center gap-2 text-sm text-warm-gray">
                          <MapPin size={16} />
                          <span className="truncate">{bystander.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      {bystander.verified ? (
                        <div className="flex items-center gap-2 text-success-green text-sm">
                          <CheckCircle size={16} />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleVerify(bystander.id)}
                          className="flex items-center gap-2 text-warning-orange text-sm hover:underline"
                        >
                          <Clock size={16} />
                          <span>Click to Verify</span>
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.location.href = `tel:${bystander.phoneNumber}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-success-green text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
                      >
                        <Phone size={16} />
                        Call
                      </button>
                      <button
                        onClick={() => handleEdit(bystander)}
                        className="px-3 py-2 bg-info-blue bg-opacity-10 text-info-blue rounded-lg hover:bg-opacity-20 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(bystander.id)}
                        className="px-3 py-2 bg-error-red bg-opacity-10 text-error-red rounded-lg hover:bg-opacity-20 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <FloatingActionButton />

      {/* Add/Edit Bystander Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={resetForm}
        title={editingBystander ? 'Edit Trusted Bystander' : 'Add Trusted Bystander'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-pale-pink p-4 rounded-lg mb-4">
            <p className="text-sm text-dark-charcoal">
              <strong>Important:</strong> Only add people you personally know and trust. 
              Get their permission before adding them to your network.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-charcoal mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-info-blue"
              placeholder="John Smith"
            />
            {errors.fullName && (
              <p className="text-error-red text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-charcoal mb-2">
              Relationship
            </label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-info-blue"
            >
              <option>Neighbor</option>
              <option>Classmate</option>
              <option>Coworker</option>
              <option>Friend</option>
              <option>Roommate</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-charcoal mb-2">
              Phone Number *
            </label>
            <div className="flex gap-2">
              <select
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-info-blue"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} +{country.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-info-blue"
                placeholder="712345678"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-error-red text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-charcoal mb-2">
              Email (Optional)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-info-blue"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-error-red text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-charcoal mb-2">
              Address/Location (Optional)
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-info-blue"
              placeholder="Apartment 2B, Main Street"
            />
            <p className="text-sm text-warm-gray mt-1">
              This helps identify nearby bystanders during emergencies
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-charcoal mb-2">
              Availability Status
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-info-blue"
            >
              <option>Available</option>
              <option>Busy</option>
              <option>Unavailable</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Saving...' : editingBystander ? 'Update Bystander' : 'Add Bystander'}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Bystanders