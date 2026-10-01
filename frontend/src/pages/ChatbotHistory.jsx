import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchChatHistory, deleteChatHistoryItem } from '../api/chatApi.js'
import { getErrorMessage } from '../api/axiosClient.js'
import Loader from '../components/common/Loader.jsx'
import ErrorBanner from '../components/common/ErrorBanner.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import Card from '../components/common/Card.jsx'
import { formatDateTime } from '../utils/format.js'

export default function ChatbotHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchChatHistory()
      .then(setHistory)
      .catch((err) => setError(getErrorMessage(err, 'Failed to load chat history.')))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id) {
    setError('')
    try {
      await deleteChatHistoryItem(id)
      setHistory((prev) => prev.filter((h) => h.id !== id))
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete item.'))
    }
  }

  return (
    <div className="page history-page">
      <PageHeader
        icon="🗂️"
        title="Chat history"
        subtitle="All the questions you've asked the AI chatbot and its answers."
      />

      {loading && <Loader label="Loading chat history..." />}
      <ErrorBanner message={error} />

      {!loading && history.length === 0 && !error && (
        <EmptyState icon="💬" title="No conversations yet">
          <Link to="/chatbot">Ask the chatbot a question</Link> and it will be saved here.
        </EmptyState>
      )}

      <div className="chat-history-list">
        {history.map((item) => (
          <Card key={item.id} className="chat-history-item">
            <div className="chat-history-item__header">
              <span className="text-muted">{formatDateTime(item.created_at)}</span>
              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
            </div>
            <p><strong>Q:</strong> {item.question}</p>
            <p><strong>A:</strong> {item.answer}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
