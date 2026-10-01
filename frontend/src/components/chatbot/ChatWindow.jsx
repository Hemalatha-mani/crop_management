import { useEffect, useRef } from 'react'
import ChatBubble from './ChatBubble.jsx'

const SUGGESTIONS = [
  'How do I prevent late blight?',
  'How often should I water tomatoes?',
  'What causes early blight?',
  'Best fertilizer for potatoes?',
]

export default function ChatWindow({ messages, isTyping, onSuggest }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isTyping])

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="chat-window__empty">
          <p>👋 Ask me anything about crops, diseases, prevention, or farming practices.</p>
          {onSuggest && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((q) => (
                <button key={q} type="button" className="chip" onClick={() => onSuggest(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {messages.map((m) => (
        <ChatBubble key={m.id} role={m.role} text={m.text} />
      ))}
      {isTyping && <ChatBubble role="bot" text="Typing..." typing />}
      <div ref={endRef} />
    </div>
  )
}
