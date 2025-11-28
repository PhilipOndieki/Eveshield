import { useState } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import Card from './Card'
import Button from './Button'

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hello! I'm SafeGuide AI, your safety education assistant. I can help you with information about GBV, safety strategies, your rights, and how to use this platform. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const quickReplies = [
    'What is GBV?',
    'Safety tips',
    'How to use emergency alert',
    'Find resources',
  ]

  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: message,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response (in production, this would call Gemini API)
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: getBotResponse(message),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('gbv') || lowerMessage.includes('gender')) {
      return "Gender-Based Violence (GBV) refers to harmful acts directed at individuals based on their gender. It includes physical, sexual, emotional, and economic abuse. If you or someone you know is experiencing GBV, you can use our emergency alert system or contact local support services through our Resources Hub. Would you like to know more about safety planning or available resources?"
    }

    if (lowerMessage.includes('safety') || lowerMessage.includes('tips')) {
      return "Here are some key safety tips:\n\n1. Trust your instincts - if something feels wrong, it probably is\n2. Keep your emergency contacts updated\n3. Share your location with trusted bystanders when traveling\n4. Learn about the resources available in your area\n5. Create a safety plan with escape routes\n\nWould you like specific information about any of these areas?"
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('alert')) {
      return "To use the Emergency Alert system:\n\n1. Click the floating red SOS button on any page\n2. Select your severity level (Concern, Immediate, or Critical)\n3. Your location will be automatically shared\n4. Your emergency contacts and nearby bystanders will be notified\n\nYou can also add custom notes to provide more context. Remember to test the system with your network when you're safe!"
    }

    if (lowerMessage.includes('resource')) {
      return "Our Resources Hub provides verified support services including:\n\n• Emergency hotlines (24/7)\n• Safe houses and shelters\n• Police stations\n• Medical facilities\n• Legal aid organizations\n• Counseling services\n\nYou can filter resources by category, location, and availability. Visit the Resources Hub from your navigation menu to explore all available support in your area."
    }

    return "I understand you're asking about " + userMessage + ". While I'm here to provide general safety information and help you use this platform, for urgent matters please:\n\n• Call emergency services: 999\n• Use our Emergency Alert button\n• Contact GBV Hotline: 1195\n\nFor other questions, you can ask me about GBV information, safety strategies, platform features, or finding resources. How else can I assist you?"
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-40 bg-medium-blue text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all hover:scale-110"
          aria-label="Open AI Chatbot"
        >
          <Bot size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] flex flex-col bg-white rounded-lg shadow-2xl">
          {/* Header */}
          <div className="bg-medium-blue text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold">SafeGuide AI</h3>
                <p className="text-xs opacity-90">Safety Education Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-warning-orange bg-opacity-10 border-b border-warning-orange p-3">
            <p className="text-xs text-dark-charcoal">
              <strong>Important:</strong> This is an AI assistant for educational purposes. In emergencies, call 999 or use the Emergency Alert button.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  message.type === 'bot' ? 'bg-medium-blue bg-opacity-10' : 'bg-sky-blue bg-opacity-20'
                }`}>
                  {message.type === 'bot' ? (
                    <Bot size={20} className="text-medium-blue" />
                  ) : (
                    <User size={20} className="text-medium-blue" />
                  )}
                </div>
                <div className={`max-w-[75%] ${message.type === 'user' ? 'text-right' : ''}`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.type === 'bot'
                        ? 'bg-pale-blue text-dark-charcoal'
                        : 'bg-medium-blue text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                  <p className="text-xs text-warm-gray mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="p-2 rounded-full bg-medium-blue bg-opacity-10">
                  <Bot size={20} className="text-medium-blue" />
                </div>
                <div className="bg-pale-blue rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-medium-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-medium-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-medium-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-warm-gray mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(reply)}
                    className="text-xs bg-sky-blue bg-opacity-20 text-medium-blue px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(inputMessage)
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me anything about safety..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue text-sm"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2 bg-medium-blue text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatbot
