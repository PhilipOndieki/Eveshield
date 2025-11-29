import { useState, useEffect, useRef } from 'react'
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, getDocs, limit } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import { Search, Send, Image, MapPin, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react'
import { getInitials } from '../utils/helpers'
import { formatDistanceToNow } from 'date-fns'
import toast, { Toaster } from 'react-hot-toast'

const Chat = () => {
  const { currentUser, userProfile } = useAuth()
  const [conversations, setConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch conversations with last message
  useEffect(() => {
    if (!currentUser) return

    const fetchConversations = async () => {
      try {
        // Get all connections (bystanders)
        const q = query(
          collection(db, 'connections'),
          where('fromUserId', '==', currentUser.uid),
          where('status', '==', 'accepted')
        )

        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const convos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            partnerId: doc.data().toUserId,
            partnerProfile: doc.data().toUserProfile,
          }))

          // Remove duplicates based on partnerId
          const uniqueConvos = convos.filter((convo, index, self) =>
            index === self.findIndex(c => c.partnerId === convo.partnerId)
          )

          // Fetch last message for each conversation
          const convosWithLastMessage = await Promise.all(
            uniqueConvos.map(async (convo) => {
              const chatId = [currentUser.uid, convo.partnerId].sort().join('_')
              const messagesQuery = query(
                collection(db, 'chats', chatId, 'messages'),
                orderBy('timestamp', 'desc'),
                limit(1)
              )

              try {
                const messagesSnapshot = await getDocs(messagesQuery)
                const lastMessage = messagesSnapshot.docs[0]?.data()
                
                return {
                  ...convo,
                  lastMessage: lastMessage?.text || 'Click to start conversation',
                  lastMessageTime: lastMessage?.timestamp,
                }
              } catch (error) {
                console.error('Error fetching last message:', error)
                return {
                  ...convo,
                  lastMessage: 'Click to start conversation',
                  lastMessageTime: null,
                }
              }
            })
          )

          // Sort by most recent message
          const sortedConvos = convosWithLastMessage.sort((a, b) => {
            if (!a.lastMessageTime) return 1
            if (!b.lastMessageTime) return -1
            return b.lastMessageTime?.toDate?.() - a.lastMessageTime?.toDate?.()
          })

          setConversations(sortedConvos)
          setLoading(false)
        })

        return () => unsubscribe()
      } catch (error) {
        console.error('Error fetching conversations:', error)
        setLoading(false)
      }
    }

    fetchConversations()
  }, [currentUser?.uid])

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return

    const chatId = [currentUser.uid, selectedChat.partnerId].sort().join('_')
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setMessages(msgs)
    })

    return () => unsubscribe()
  }, [selectedChat, currentUser.uid])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return

    try {
      const chatId = [currentUser.uid, selectedChat.partnerId].sort().join('_')

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: currentUser.uid,
        senderName: userProfile?.fullName || 'User',
        receiverId: selectedChat.partnerId,
        text: newMessage,
        timestamp: serverTimestamp(),
        read: false,
      })

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    }
  }

  const filteredConversations = conversations.filter(convo =>
    convo.partnerProfile?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-pale-blue">
      <Toaster position="top-right" />
      <Navbar isAuthenticated={true} />

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className={`lg:col-span-1 ${selectedChat ? 'hidden lg:block' : 'block'}`}>
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-dark-charcoal mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray" size={18} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue text-sm"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-warm-gray">
                    Loading conversations...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-warm-gray">
                    <p className="mb-2">No conversations yet</p>
                    <p className="text-sm">Connect with bystanders to start chatting</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredConversations.map((convo) => (
                      <button
                        key={convo.id}
                        onClick={() => setSelectedChat(convo)}
                        className={`w-full p-4 hover:bg-pale-blue transition-colors text-left ${
                          selectedChat?.id === convo.id ? 'bg-sky-blue bg-opacity-10' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-12 w-12 bg-sky-blue rounded-full flex items-center justify-center text-deep-navy font-bold">
                              {getInitials(convo.partnerProfile?.fullName || 'U')}
                            </div>
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-success-green rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-dark-charcoal truncate">
                                {convo.partnerProfile?.fullName || 'User'}
                              </h3>
                              <span className="text-xs text-warm-gray">
                                {convo.lastMessageTime?.toDate
                                  ? formatDistanceToNow(convo.lastMessageTime.toDate(), { addSuffix: true })
                                  : ''}
                              </span>
                            </div>
                            <p className="text-sm text-warm-gray truncate">
                              {convo.lastMessage || 'Click to start conversation'}
                            </p>
                          </div>


                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className={`lg:col-span-2 ${selectedChat ? 'block' : 'hidden lg:block'}`}>
            {!selectedChat ? (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center text-warm-gray">
                  <p className="text-lg mb-2">Select a conversation to start messaging</p>
                  <p className="text-sm">Your messages will appear here</p>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="lg:hidden text-warm-gray hover:text-dark-charcoal"
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <div className="h-10 w-10 bg-sky-blue rounded-full flex items-center justify-center text-deep-navy font-bold">
                      {getInitials(selectedChat.partnerProfile?.fullName || 'U')}
                    </div>
                    <div>
                      <h3 className="font-bold text-dark-charcoal">
                        {selectedChat.partnerProfile?.fullName || 'User'}
                      </h3>
                      <p className="text-xs text-success-green">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-pale-blue rounded-full transition-colors">
                      <Phone size={20} className="text-warm-gray" />
                    </button>
                    <button className="p-2 hover:bg-pale-blue rounded-full transition-colors">
                      <Video size={20} className="text-warm-gray" />
                    </button>
                    <button className="p-2 hover:bg-pale-blue rounded-full transition-colors">
                      <MoreVertical size={20} className="text-warm-gray" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-warm-gray py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => {
                        const isSender = message.senderId === currentUser.uid
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isSender ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`rounded-lg p-3 ${
                                  isSender
                                    ? 'bg-medium-blue text-white'
                                    : 'bg-white text-dark-charcoal'
                                }`}
                              >
                                <p className="text-sm">{message.text}</p>
                              </div>
                              <p className="text-xs text-warm-gray mt-1 px-2">
                                {message.timestamp?.toDate
                                  ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true })
                                  : 'Just now'}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button
                      type="button"
                      className="p-2 hover:bg-pale-blue rounded-full transition-colors"
                    >
                      <Image size={20} className="text-warm-gray" />
                    </button>
                    <button
                      type="button"
                      className="p-2 hover:bg-pale-blue rounded-full transition-colors"
                    >
                      <MapPin size={20} className="text-warm-gray" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2 bg-medium-blue text-white rounded-full hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                  <p className="text-xs text-warm-gray mt-2 text-center">
                    Messages are encrypted end-to-end for your safety
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <FloatingActionButton />
    </div>
  )
}

export default Chat
