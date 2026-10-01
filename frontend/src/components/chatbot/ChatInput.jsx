import { useState } from 'react'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        placeholder="Ask about crops, diseases, prevention, watering..."
        aria-label="Your question"
        maxLength={1000}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <button type="submit" className="btn btn--primary" disabled={disabled || !value.trim()}>
        Send
      </button>
    </form>
  )
}
