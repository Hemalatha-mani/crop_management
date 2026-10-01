export default function EmptyState({ icon = '🌿', title, children }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  )
}
