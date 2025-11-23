'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

// Function to get API URL based on environment
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000/api'
  }
  
  if (window.location.hostname.includes('azurecontainerapps.io')) {
    return 'https://invitation-backend.jollysea-6ff72832.southeastasia.azurecontainerapps.io/api'
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
}

interface Message {
  type: 'user' | 'bot'
  content: string
}

interface ChatBotProps {
  graduateId: string
}

export default function ChatBot({ graduateId }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: 'Xin chào! 👋 Tôi có thể giúp bạn trả lời các câu hỏi về lễ tốt nghiệp này. Bạn có câu hỏi gì không?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input
    setInput('')
    setMessages((prev) => [...prev, { type: 'user', content: userMessage }])
    setLoading(true)

    try {
      const API_URL = getApiUrl()
      console.log('=== CHATBOT DEBUG ===')
      console.log('Window hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server')
      console.log('Detected API URL:', API_URL)
      console.log('Full request URL:', `${API_URL}/graduates/${graduateId}/chat`)
      console.log('Graduate ID:', graduateId)
      console.log('Request payload:', { message: userMessage })
      console.log('====================')
      
      const response = await axios.post(
        `${API_URL}/graduates/${graduateId}/chat`,
        { message: userMessage },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      
      console.log('Response received:', response.data)
      
      if (response.data && response.data.response) {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', content: response.data.response },
        ])
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error: any) {
      console.error('Chat error:', error)
      
      const API_URL = getApiUrl()
      let errorMessage = '❌ **Lỗi kết nối**\n\n'
      
      // Add debug info for user
      errorMessage += `🔍 **Thông tin debug:**\n`
      errorMessage += `- Hostname: ${typeof window !== 'undefined' ? window.location.hostname : 'N/A'}\n`
      errorMessage += `- API URL: ${API_URL}\n`
      errorMessage += `- Graduate ID: ${graduateId}\n\n`
      
      if (error.response) {
        // Server responded with error status
        console.error('Error response:', error.response.data)
        errorMessage += `**Chi tiết lỗi:**\n`
        errorMessage += `- Status: ${error.response.status}\n`
        errorMessage += `- Message: ${JSON.stringify(error.response.data)}\n`
      } else if (error.request) {
        // Request made but no response
        console.error('No response from server')
        errorMessage += `**Chi tiết lỗi:**\nKhông nhận được phản hồi từ server.\n`
        errorMessage += `Có thể do:\n- Server đang offline\n- CORS issue\n- Network timeout`
      } else {
        // Error in request setup
        console.error('Error:', error.message)
        errorMessage += `**Chi tiết lỗi:**\n${error.message}`
      }
      
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          content: errorMessage,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F6F2EB]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-[#D4AF37] text-[#0B132B] rounded-br-none font-semibold'
                  : 'bg-white text-[#0B132B] rounded-bl-none shadow-sm'
              }`}
            >
              {msg.type === 'bot' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold text-[#D4AF37]">{children}</strong>,
                      ul: ({ children }) => <ul className="text-sm list-disc ml-4 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="text-sm list-decimal ml-4 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="text-sm">{children}</li>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-[#0B132B] px-4 py-2 rounded-lg rounded-bl-none shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[#9CA3AF] rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-[#9CA3AF] rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-[#9CA3AF] rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form - Fixed at bottom, no scroll */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-[#E5E7EB] flex-shrink-0">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-[#D4AF37] rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#FFD97A] focus:ring-opacity-50 transition disabled:bg-gray-100 text-[#0B132B] text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-10 h-10 bg-[#D4AF37] text-[#0B132B] font-semibold rounded-lg hover:bg-[#FFD97A] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span className="text-lg">➤</span>
          </button>
        </div>
      </form>
    </div>
  )
}
