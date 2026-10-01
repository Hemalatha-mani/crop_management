export default function ChatBubble({ role, text, typing = false }) {
  const isUser = role === 'user'
  return (
    <div className={`chat-bubble ${isUser ? 'chat-bubble--user' : 'chat-bubble--bot'}`}>
      <span className="chat-bubble__icon">{isUser ? '🧑‍🌾' : '🤖'}</span>
      <p className={typing ? 'chat-bubble__typing' : ''}>{text}</p>
    </div>
  )
}
