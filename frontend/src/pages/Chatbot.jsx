import { useState } from 'react'
import ChatWindow from '../components/chatbot/ChatWindow.jsx'
import ChatInput from '../components/chatbot/ChatInput.jsx'
import ErrorBanner from '../components/common/ErrorBanner.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import { sendChatMessage } from '../api/chatApi.js'
import { getErrorMessage } from '../api/axiosClient.js'

let idCounter = 0
function nextId() {
  idCounter += 1
  return idCounter
}

export default function Chatbot() {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(text) {
    if (isTyping) return
    setError('')
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text }])
    setIsTyping(true)

    try {
      const data = await sendChatMessage(text)
      setMessages((prev) => [...prev, { id: nextId(), role: 'bot', text: data.answer }])
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to get a response. Please try again.'))
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="page chatbot-page">
      <PageHeader
        icon="💬"
        title="AI chatbot"
        subtitle="Ask about crops, diseases, prevention, watering and farming practices. For image-based diagnosis, use AI Detect."
      />

      <div className="card chatbot-container">
        <ChatWindow messages={messages} isTyping={isTyping} onSuggest={handleSend} />
        <ErrorBanner message={error} />
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  )
}
