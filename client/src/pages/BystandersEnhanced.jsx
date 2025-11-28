import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc, query, where, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { Shield, UserPlus, Info, Search, MapPin, CheckCircle, Clock, X, Send, Users as UsersIcon } from 'lucide-react'
import { getInitials } from '../utils/helpers'
import toast, { Toaster } from 'react-hot-toast'

const BystandersEnhanced = () => {
  const { currentUser, userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('discover') // discover, myBystanders, requests
  const [allUsers, setAllUsers] = useState([])
  const [myBystanders, setMyBystanders] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [receivedRequests, setReceivedRequests] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [requestMessage, setRequestMessage] = useState('')

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Fetch all users except current user
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const usersData = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== currentUser.uid)
      setAllUsers(usersData)

      // Fetch my bystanders (accepted connections)
      const bystandersQuery = query(
        collection(db, 'connections'),
        where('userId', '==', currentUser.uid),
        where('status', '==', 'accepted')
      )
      const bystandersSnapshot = await getDocs(bystandersQuery)
      const bystandersData = bystandersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMyBystanders(bystandersData)

      // Fetch sent requests
      const sentQuery = query(
        collection(db, 'connections'),
        where('fromUserId', '==', currentUser.uid),
        where('status', '==', 'pending')
      )
      const sentSnapshot = await getDocs(sentQuery)
      const sentData = sentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSentRequests(sentData)

      // Fetch received requests
      const receivedQuery = query(
        collection(db, 'connections'),
        where('toUserId', '==', currentUser.uid),
        where('status', '==', 'pending')
      )
      const receivedSnapshot = await getDocs(receivedQuery)
      const receivedData = receivedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setReceivedRequests(receivedData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async (user) => {
    setSelectedUser(user)
    setShowRequestModal(true)
  }

  const confirmSendRequest = async () => {
    try {
      await addDoc(collection(db, 'connections'), {
        fromUserId: currentUser.uid,
        fromUserProfile: {
          fullName: userProfile?.fullName,
          email: currentUser.email,
          photoURL: userProfile?.photoURL || null,
        },
        toUserId: selectedUser.id,
        toUserProfile: {
          fullName: selectedUser.fullName,
          email: selectedUser.email,
          photoURL: selectedUser.photoURL || null,
        },
        status: 'pending',
        message: requestMessage,
        createdAt: serverTimestamp(),
      })

      toast.success(`Request sent to ${selectedUser.fullName}`)
      setShowRequestModal(false)
      setRequestMessage('')
      fetchAllData()
    } catch (error) {
      console.error('Error sending request:', error)
      toast.error('Failed to send request')
    }
  }

  const handleAcceptRequest = async (request) => {
    try {
      await updateDoc(doc(db, 'connections', request.id), {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
      })

      // Create reverse connection for bi-directional relationship
      await addDoc(collection(db, 'connections'), {
        fromUserId: request.toUserId,
        fromUserProfile: request.toUserProfile,
        toUserId: request.fromUserId,
        toUserProfile: request.fromUserProfile,
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        originalRequestId: request.id,
      })

      toast.success(`You are now connected with ${request.fromUserProfile.fullName}`)
      fetchAllData()
    } catch (error) {
      console.error('Error accepting request:', error)
      toast.error('Failed to accept request')
    }
  }

  const handleDeclineRequest = async (request) => {
    try {
      await deleteDoc(doc(db, 'connections', request.id))
      toast.success('Request declined')
      fetchAllData()
    } catch (error) {
      console.error('Error declining request:', error)
      toast.error('Failed to decline request')
    }
  }

  const handleCancelRequest = async (request) => {
    try {
      await deleteDoc(doc(db, 'connections', request.id))
      toast.success('Request cancelled')
      fetchAllData()
    } catch (error) {
      console.error('Error cancelling request:', error)
      toast.error('Failed to cancel request')
    }
  }

  const isRequestSent = (userId) => {
    return sentRequests.some(req => req.toUserId === userId)
  }

  const isAlreadyConnected = (userId) => {
    return myBystanders.some(b => b.toUserId === userId)
  }

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-pale-blue">
      <Toaster position="top-right" />
      <Navbar isAuthenticated={true} />

      <main className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-dark-charcoal mb-2">
          Trusted Bystanders Network
        </h1>
        <p className="text-warm-gray mb-8">
          Build your safety circle with people you trust in your community
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('discover')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'discover'
                ? 'border-medium-blue text-medium-blue'
                : 'border-transparent text-warm-gray hover:text-dark-charcoal'
            }`}
          >
            <div className="flex items-center gap-2">
              <Search size={20} />
              <span>Discover Users ({filteredUsers.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('myBystanders')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'myBystanders'
                ? 'border-medium-blue text-medium-blue'
                : 'border-transparent text-warm-gray hover:text-dark-charcoal'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={20} />
              <span>My Bystanders ({myBystanders.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'requests'
                ? 'border-medium-blue text-medium-blue'
                : 'border-transparent text-warm-gray hover:text-dark-charcoal'
            }`}
          >
            <div className="flex items-center gap-2">
              <UsersIcon size={20} />
              <span>Requests ({receivedRequests.length})</span>
              {receivedRequests.length > 0 && (
                <span className="bg-deep-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {receivedRequests.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Discover Users Tab */}
        {activeTab === 'discover' && (
          <div>
            {/* Search Bar */}
            <Card className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                />
              </div>
            </Card>

            {/* Users Grid */}
            {loading ? (
              <Card className="text-center py-12">
                <p className="text-warm-gray">Loading users...</p>
              </Card>
            ) : filteredUsers.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-warm-gray">No users found</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <Card key={user.id} hover={true}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-12 w-12 bg-sky-blue rounded-full flex items-center justify-center text-deep-navy font-bold flex-shrink-0">
                        {getInitials(user.fullName || 'U')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-dark-charcoal truncate">{user.fullName || 'User'}</h3>
                        <p className="text-sm text-warm-gray truncate">{user.email}</p>
                        {user.location && (
                          <div className="flex items-center gap-1 text-xs text-warm-gray mt-1">
                            <MapPin size={12} />
                            <span className="truncate">{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {user.bio && (
                      <p className="text-sm text-warm-gray mb-4 line-clamp-2">{user.bio}</p>
                    )}

                    <div className="flex gap-2">
                      {isAlreadyConnected(user.id) ? (
                        <Button variant="secondary" size="small" fullWidth disabled>
                          <CheckCircle size={16} className="mr-2" />
                          Connected
                        </Button>
                      ) : isRequestSent(user.id) ? (
                        <Button variant="secondary" size="small" fullWidth disabled>
                          <Clock size={16} className="mr-2" />
                          Request Sent
                        </Button>
                      ) : (
                        <Button variant="primary" size="small" fullWidth onClick={() => handleSendRequest(user)}>
                          <UserPlus size={16} className="mr-2" />
                          Send Request
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Bystanders Tab */}
        {activeTab === 'myBystanders' && (
          <div>
            {myBystanders.length === 0 ? (
              <Card className="text-center py-16">
                <div className="bg-info-blue bg-opacity-10 rounded-full p-6 inline-block mb-6">
                  <Shield className="text-info-blue" size={64} />
                </div>
                <h2 className="text-2xl font-bold text-dark-charcoal mb-4">
                  No bystanders yet
                </h2>
                <p className="text-warm-gray mb-6">
                  Start building your safety network by discovering and connecting with users
                </p>
                <Button variant="primary" onClick={() => setActiveTab('discover')}>
                  <UserPlus size={20} className="mr-2" />
                  Discover Users
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myBystanders.map((connection) => (
                  <Card key={connection.id} hover={true}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="h-12 w-12 bg-sky-blue rounded-full flex items-center justify-center text-deep-navy font-bold">
                        {getInitials(connection.toUserProfile?.fullName || 'U')}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-dark-charcoal">{connection.toUserProfile?.fullName}</h3>
                        <p className="text-sm text-warm-gray">{connection.toUserProfile?.email}</p>
                        <span className="text-xs bg-success-green bg-opacity-10 text-success-green px-2 py-1 rounded-full mt-1 inline-block">
                          Connected
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="secondary" size="small" fullWidth>
                        View Profile
                      </Button>
                      <Button variant="primary" size="small" fullWidth>
                        Message
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            {/* Received Requests */}
            <div>
              <h3 className="text-xl font-bold text-dark-charcoal mb-4">
                Received Requests ({receivedRequests.length})
              </h3>
              {receivedRequests.length === 0 ? (
                <Card className="text-center py-8">
                  <p className="text-warm-gray">No pending requests</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {receivedRequests.map((request) => (
                    <Card key={request.id}>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="h-12 w-12 bg-sky-blue rounded-full flex items-center justify-center text-deep-navy font-bold">
                          {getInitials(request.fromUserProfile?.fullName || 'U')}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-dark-charcoal">{request.fromUserProfile?.fullName}</h3>
                          <p className="text-sm text-warm-gray">{request.fromUserProfile?.email}</p>
                          {request.message && (
                            <p className="text-sm text-dark-charcoal mt-2 p-2 bg-pale-blue rounded">
                              "{request.message}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="primary" size="small" fullWidth onClick={() => handleAcceptRequest(request)}>
                          <CheckCircle size={16} className="mr-2" />
                          Accept
                        </Button>
                        <Button variant="secondary" size="small" onClick={() => handleDeclineRequest(request)}>
                          <X size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sent Requests */}
            <div>
              <h3 className="text-xl font-bold text-dark-charcoal mb-4">
                Sent Requests ({sentRequests.length})
              </h3>
              {sentRequests.length === 0 ? (
                <Card className="text-center py-8">
                  <p className="text-warm-gray">No sent requests</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sentRequests.map((request) => (
                    <Card key={request.id}>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="h-12 w-12 bg-sky-blue rounded-full flex items-center justify-center text-deep-navy font-bold">
                          {getInitials(request.toUserProfile?.fullName || 'U')}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-dark-charcoal">{request.toUserProfile?.fullName}</h3>
                          <p className="text-sm text-warm-gray">{request.toUserProfile?.email}</p>
                          <span className="text-xs bg-warning-orange bg-opacity-10 text-warning-orange px-2 py-1 rounded-full mt-1 inline-block">
                            <Clock size={12} className="inline mr-1" />
                            Pending
                          </span>
                        </div>
                      </div>

                      <Button variant="secondary" size="small" fullWidth onClick={() => handleCancelRequest(request)}>
                        Cancel Request
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <FloatingActionButton />

      {/* Send Request Modal */}
      {showRequestModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-dark-charcoal">Send Connection Request</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-warm-gray hover:text-dark-charcoal"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4 p-3 bg-pale-blue rounded-lg">
              <div className="h-12 w-12 bg-sky-blue rounded-full flex items-center justify-center text-deep-navy font-bold">
                {getInitials(selectedUser.fullName || 'U')}
              </div>
              <div>
                <h4 className="font-bold text-dark-charcoal">{selectedUser.fullName}</h4>
                <p className="text-sm text-warm-gray">{selectedUser.email}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-dark-charcoal mb-2">
                Message (Optional)
              </label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                rows="3"
                placeholder="Introduce yourself..."
              />
            </div>

            <div className="flex gap-2">
              <Button variant="primary" fullWidth onClick={confirmSendRequest}>
                <Send size={16} className="mr-2" />
                Send Request
              </Button>
              <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BystandersEnhanced
