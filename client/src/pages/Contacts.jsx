import { useState, useEffect } from 'react'
import { Plus, Phone, Mail, Edit, Trash2, CheckCircle, Clock, Send } from 'lucide-react'
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { validatePhoneNumber, formatPhoneNumber, validateEmail, countryCodes } from '../utils/validation'
import { getInitials } from '../utils/helpers'

const Contacts = () => {
  const { currentUser } = useAuth()
  const [contacts, setContacts] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState('254')

  const [formData, setFormData] = useState({
    fullName: '',
    relationship: 'Friend',
    phoneNumber: '',
    email: '',
    priority: 'Primary',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'users', currentUser.uid, 'emergencyContacts')
      )
      const contactsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setContacts(contactsData)
    } catch (error) {
      console.error('Error fetching contacts:', error)
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
    if (!editingContact && contacts.length >= 5) {
      alert('Maximum 5 contacts allowed')
      return
    }

    setLoading(true)

    try {
      const fullPhone = formData.phoneNumber.startsWith('+') 
        ? formData.phoneNumber 
        : `+${selectedCountryCode}${formData.phoneNumber}`

      const contactData = {
        fullName: formData.fullName,
        relationship: formData.relationship,
        phoneNumber: formatPhoneNumber(fullPhone),
        email: formData.email,
        priority: formData.priority,
        verified: false,
        updatedAt: serverTimestamp(),
      }

      if (editingContact) {
        // Update existing contact
        await updateDoc(doc(db, 'users', currentUser.uid, 'emergencyContacts', editingContact.id), contactData)
      } else {
        // Add new contact
        await addDoc(collection(db, 'users', currentUser.uid, 'emergencyContacts'), {
          ...contactData,
          createdAt: serverTimestamp(),
        })
      }

      resetForm()
      fetchContacts()
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('Failed to save contact. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (contact) => {
    setEditingContact(contact)
    
    // Extract country code and phone number
    let phoneWithoutCode = contact.phoneNumber
    let countryCode = '254'
    
    if (contact.phoneNumber.startsWith('+')) {
      const match = contact.phoneNumber.match(/^\+(\d{1,3})(.+)/)
      if (match) {
        countryCode = match[1]
        phoneWithoutCode = match[2]
      }
    }
    
    setSelectedCountryCode(countryCode)
    setFormData({
      fullName: contact.fullName,
      relationship: contact.relationship,
      phoneNumber: phoneWithoutCode,
      email: contact.email || '',
      priority: contact.priority,
    })
    setShowAddModal(true)
  }

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to remove this contact?')) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'emergencyContacts', contactId))
        fetchContacts()
      } catch (error) {
        console.error('Error deleting contact:', error)
        alert('Failed to delete contact')
      }
    }
  }

  const handleVerifyContact = async (contactId) => {
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'emergencyContacts', contactId), {
        verified: true,
        verifiedAt: serverTimestamp(),
      })
      fetchContacts()
    } catch (error) {
      console.error('Error verifying contact:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      relationship: 'Friend',
      phoneNumber: '',
      email: '',
      priority: 'Primary',
    })
    setSelectedCountryCode('254')
    setEditingContact(null)
    setShowAddModal(false)
    setErrors({})
  }

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
                  My Emergency Contacts
                </h1>
                <p className="text-warm-gray">
                  Add up to 5 trusted people who will be alerted during emergencies
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                disabled={contacts.length >= 5}
              >
                <Plus size={20} className="mr-2" />
                Add Contact
              </Button>
            </div>

            {/* Progress Indicator */}
            <Card className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-dark-charcoal">
                  {contacts.length} of 5 contacts added
                </span>
                <span className="text-sm text-warm-gray">
                  {Math.round((contacts.length / 5) * 100)}%
                </span>
              </div>
              <div className="w-full bg-light-gray rounded-full h-2">
                <div
                  className="bg-deep-rose h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(contacts.length / 5) * 100}%` }}
                ></div>
              </div>
            </Card>

            {/* Contacts Grid */}
            {contacts.length === 0 ? (
              <Card className="text-center py-12">
                <div className="text-warm-gray mb-4">
                  <Phone size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">You haven't added any emergency contacts yet</p>
                  <p className="text-sm">
                    Add trusted friends or family who can help during emergencies
                  </p>
                </div>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  Add First Contact
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map((contact) => (
                  <Card key={contact.id} hover={true}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-deep-rose rounded-full flex items-center justify-center text-white font-bold">
                          {getInitials(contact.fullName)}
                        </div>
                        <div>
                          <h3 className="font-bold text-dark-charcoal">{contact.fullName}</h3>
                          <span className="text-xs bg-pale-pink text-deep-rose px-2 py-1 rounded-full">
                            {contact.relationship}
                          </span>
                        </div>
                      </div>
                      {contact.priority === 'Primary' && (
                        <span className="text-warning-orange">⭐</span>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-warm-gray">
                        <Phone size={16} />
                        <span>{contact.phoneNumber}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm text-warm-gray">
                          <Mail size={16} />
                          <span className="truncate">{contact.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      {contact.verified ? (
                        <div className="flex items-center gap-2 text-success-green text-sm">
                          <CheckCircle size={16} />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleVerifyContact(contact.id)}
                          className="flex items-center gap-2 text-warning-orange text-sm hover:underline"
                        >
                          <Clock size={16} />
                          <span>Click to Verify</span>
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.location.href = `tel:${contact.phoneNumber}`}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-success-green text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm"
                      >
                        <Phone size={16} />
                        Call
                      </button>
                      <button
                        onClick={() => handleEdit(contact)}
                        className="px-3 py-2 bg-info-blue bg-opacity-10 text-info-blue rounded-lg hover:bg-opacity-20 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
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

      {/* Add/Edit Contact Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={resetForm}
        title={editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-charcoal mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
              placeholder="Jane Doe"
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
              className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
            >
              <option>Friend</option>
              <option>Family</option>
              <option>Partner</option>
              <option>Colleague</option>
              <option>Neighbor</option>
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
                className="px-3 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
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
                className="flex-1 px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
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
              className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
              placeholder="jane@example.com"
            />
            {errors.email && (
              <p className="text-error-red text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-charcoal mb-2">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
            >
              <option>Primary</option>
              <option>Secondary</option>
            </select>
            <p className="text-sm text-warm-gray mt-1">
              Primary contacts are notified first during emergencies
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Saving...' : editingContact ? 'Update Contact' : 'Add Contact'}
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

export default Contacts