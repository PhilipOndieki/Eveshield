import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { Bell, AlertTriangle, UserPlus, MessageCircle, Shield, X, Check } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'

const Notifications = () => {
  const { currentUser } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all') // all, emergency, messages, updates
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setNotifications(notifs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser.uid])

  const getIcon = (type) => {
    switch (type) {
      case 'emergency':
        return <AlertTriangle className="text-deep-rose" size={20} />
      case 'connection':
        return <UserPlus className="text-info-blue" size={20} />
      case 'message':
        return <MessageCircle className="text-medium-blue" size={20} />
      case 'safety':
        return <Shield className="text-success-green" size={20} />
      default:
        return <Bell className="text-warm-gray" size={20} />
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
      })
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => !n.read)
      await Promise.all(
        unreadNotifs.map(n =>
          updateDoc(doc(db, 'notifications', n.id), { read: true })
        )
      )
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Failed to mark all as read')
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId))
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true
    return n.type === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-pale-blue">
      <Toaster position="top-right" />
      <Navbar isAuthenticated={true} />

      <main className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-charcoal mb-2">
              Notifications
            </h1>
            <p className="text-warm-gray">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="secondary" size="small" onClick={handleMarkAllAsRead}>
              <Check size={16} className="mr-2" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'emergency', label: 'Emergency', count: notifications.filter(n => n.type === 'emergency').length },
            { id: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
            { id: 'connection', label: 'Connections', count: notifications.filter(n => n.type === 'connection').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-medium-blue text-white'
                  : 'bg-white text-warm-gray hover:bg-sky-blue hover:bg-opacity-20'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {loading ? (
          <Card className="text-center py-12">
            <p className="text-warm-gray">Loading notifications...</p>
          </Card>
        ) : filteredNotifications.length === 0 ? (
          <Card className="text-center py-16">
            <Bell className="mx-auto mb-4 text-warm-gray" size={64} />
            <h2 className="text-2xl font-bold text-dark-charcoal mb-2">
              No notifications
            </h2>
            <p className="text-warm-gray">
              You're all caught up!
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all ${notification.read ? 'opacity-60' : 'border-l-4 border-medium-blue'}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${notification.read ? 'bg-gray-100' : 'bg-pale-blue'}`}>
                    {getIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-dark-charcoal">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-warm-gray whitespace-nowrap">
                        {notification.createdAt?.toDate
                          ? formatDistanceToNow(notification.createdAt.toDate(), { addSuffix: true })
                          : 'Just now'}
                      </span>
                    </div>

                    <p className="text-sm text-warm-gray mb-3">
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs text-medium-blue hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                      {notification.actionUrl && (
                        <button className="text-xs text-medium-blue hover:underline font-medium">
                          View Details
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="text-xs text-error-red hover:underline ml-auto"
                      >
                        <X size={14} className="inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <FloatingActionButton />
    </div>
  )
}

export default Notifications
