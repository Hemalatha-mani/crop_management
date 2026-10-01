import { NavLink } from 'react-router-dom'
import LogoutButton from './LogoutButton.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: '🏠' },
      { to: '/ai-detect', label: 'AI Detect', icon: '🔬' },
      { to: '/chatbot', label: 'AI Chatbot', icon: '💬' },
    ],
  },
  {
    title: 'Knowledge',
    items: [
      { to: '/diseases', label: 'Diseases', icon: '🦠' },
      { to: '/remedies', label: 'Remedies', icon: '💊' },
      { to: '/prevention', label: 'Prevention', icon: '🛡️' },
      { to: '/farming-guide', label: 'Farming Guide', icon: '📖' },
      { to: '/crop-management', label: 'Crop Management', icon: '🌾' },
    ],
  },
  {
    title: 'History',
    items: [
      { to: '/prediction-history', label: 'Scan History', icon: '📊' },
      { to: '/chatbot-history', label: 'Chat History', icon: '🗂️' },
    ],
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const initial = (user?.username || 'F').charAt(0).toUpperCase()

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <span className="sidebar__brand-icon">🌱</span>
          <span className="sidebar__brand-name">AgriGuard</span>
        </div>

        <nav className="sidebar__nav" aria-label="Main navigation">
          {NAV_GROUPS.map((group) => (
            <div className="sidebar__group" key={group.title}>
              <p className="sidebar__group-title">{group.title}</p>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                  }
                >
                  <span className="sidebar__link-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <span className="sidebar__avatar">{initial}</span>
            <div className="sidebar__user-text">
              <strong>{user?.username || 'Farmer'}</strong>
              <span>{user?.email || 'Signed in'}</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {isOpen && <div className="sidebar__overlay" onClick={onClose} />}
    </>
  )
}
