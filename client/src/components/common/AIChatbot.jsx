import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import Card from './Card'
import Button from './Button'
import { GoogleGenerativeAI } from '@google/generative-ai'

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
  const messagesEndRef = useRef(null)
  const genAI = useRef(null)

  // Initialize Gemini
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (apiKey) {
      genAI.current = new GoogleGenerativeAI(apiKey)
    } else {
      console.error('Gemini API key not found')
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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

    try {
      // Call Gemini API
      const response = await callGeminiAPI(message)
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error calling Gemini:', error)
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: "I apologize, but I'm having trouble connecting right now. For urgent matters, please:\n\n• Call emergency services: 999\n• Use our Emergency Alert button\n• Contact GBV Hotline: 1195",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const callGeminiAPI = async (userMessage) => {
    if (!genAI.current) {
      throw new Error('Gemini API not initialized')
    }

    // System prompt to guide the AI's behavior
    const systemPrompt = `You are Eveshield AI, a compassionate and knowledgeable safety education assistant for EveShield, a platform dedicated to combating gender-based violence (GBV) in Kenya.

Your role:
- Provide accurate information about GBV, safety strategies, and survivor support
- Guide users on how to use the EveShield platform features
- Offer emotional support with empathy and understanding
- Always prioritize user safety and well-being

Platform features you can help with:
1. Emergency Alert System - Users can trigger SOS alerts that notify emergency contacts and nearby bystanders
2. Trusted Bystanders Network - Users can connect with people they trust for support
3. Resources Hub - Directory of verified support services (hotlines, shelters, legal aid, counseling)
4. Incident Reporting - Users can document incidents securely
5. Safety Education - Information about GBV prevention and response

Important guidelines:
- If someone is in immediate danger, direct them to call 999 or use the Emergency Alert button
- For GBV support, mention the GBV Hotline: 1195
- Be trauma-informed: avoid victim-blaming, use empowering language
- Acknowledge that leaving an abusive situation is complex and takes time
- Respect cultural context while prioritizing safety
- Keep responses concise but comprehensive
- If you don't know something, admit it and suggest alternative resources

User question: ${userMessage}

Provide a helpful, compassionate response:`

    try {
      const model = genAI.current.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const result = await model.generateContent(systemPrompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini API error:', error)
      throw error
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-28 right-6 z-[9999] bg-medium-blue text-white p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all hover:scale-110"
          aria-label="Open AI Chatbot"
        >
          <Bot size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999] w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] flex flex-col bg-white rounded-lg shadow-2xl">
          {/* Header */}
          <div className="bg-medium-blue text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold">Eveshield AI</h3>
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
            
            <div ref={messagesEndRef} />
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
                disabled={isTyping}
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