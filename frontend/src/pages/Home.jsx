import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDashboardStats } from '../api/dashboardApi.js'
import { getErrorMessage } from '../api/axiosClient.js'
import { useAuth } from '../context/AuthContext.jsx'
import Loader from '../components/common/Loader.jsx'
import ErrorBanner from '../components/common/ErrorBanner.jsx'
import Card from '../components/common/Card.jsx'
import { formatDateTime, prettyClass, percent } from '../utils/format.js'

const QUICK_LINKS = [
  { to: '/ai-detect', label: 'Scan a leaf', icon: '🔬', desc: 'Upload a photo and get an instant diagnosis' },
  { to: '/diseases', label: 'Browse diseases', icon: '🦠', desc: 'Symptoms, causes and how to spot them' },
  { to: '/farming-guide', label: 'Farming guide', icon: '📖', desc: 'Best practices from soil prep to harvest' },
  { to: '/chatbot', label: 'Ask the chatbot', icon: '💬', desc: 'Get quick answers to farming questions' },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err, 'Failed to load dashboard stats.')))
      .finally(() => setLoading(false))
  }, [])

  const byClass = Object.entries(stats?.predictions_by_class || {}).sort((a, b) => b[1] - a[1])
  const maxCount = byClass.length ? byClass[0][1] : 1
  const recent = stats?.most_recent_prediction
  const recentHealthy = recent?.predicted_class === 'Healthy'

  const STAT_CARDS = stats
    ? [
        { label: 'Total scans', value: stats.total_predictions, icon: '🔬', tone: 'green' },
        { label: 'Healthy results', value: stats.healthy_predictions, icon: '✅', tone: 'lime' },
        { label: 'Diseases detected', value: stats.disease_predictions, icon: '🦠', tone: 'red' },
        { label: 'Questions asked', value: stats.total_chat_messages, icon: '💬', tone: 'amber' },
      ]
    : []

  return (
    <div className="page home-page">
      <section className="home-hero">
        <div className="home-hero__text">
          <p className="home-hero__hello">
            {greeting()}
            {user ? `, ${user.username}` : ''}
          </p>
          <h1>Catch crop diseases before they spread</h1>
          <p className="home-hero__lead">
            Upload a photo of a potato or tomato leaf and AgriGuard will identify the disease and
            show you what to do next.
          </p>
          <div className="home-hero__cta">
            <Link to="/ai-detect" className="btn btn--accent btn--lg">
              Scan a leaf now
            </Link>
            <Link to="/diseases" className="btn btn--ghost btn--lg">
              Browse diseases
            </Link>
          </div>
        </div>
        <div className="home-hero__art" aria-hidden="true">
          <svg viewBox="0 0 320 320">
            <circle cx="160" cy="160" r="150" className="hero-ring hero-ring--1" />
            <circle cx="160" cy="160" r="112" className="hero-ring hero-ring--2" />
            <g transform="rotate(14 160 160)">
              <path d="M160 40 C 244 84 272 168 160 262 C 48 168 76 84 160 40 Z" fill="#26b566" />
              <path d="M160 48 L160 256" stroke="#0d3b28" strokeWidth="5" opacity=".45" />
              <circle cx="128" cy="130" r="20" fill="none" stroke="#3b2410" strokeWidth="4" />
              <circle cx="128" cy="130" r="9" fill="none" stroke="#3b2410" strokeWidth="3" />
              <circle cx="190" cy="186" r="13" fill="#3b2410" opacity=".85" />
            </g>
            <g stroke="#b7e34b" strokeWidth="6" fill="none" strokeLinecap="round">
              <path d="M62 96 v-34 h34" />
              <path d="M258 96 v-34 h-34" />
              <path d="M62 224 v34 h34" />
              <path d="M258 224 v34 h-34" />
            </g>
          </svg>
        </div>
      </section>

      <section className="section">
        <h2>Your activity</h2>
        {loading && <Loader label="Loading your stats..." />}
        <ErrorBanner message={error} />
        {stats && (
          <div className="stats-grid">
            {STAT_CARDS.map((s) => (
              <Card key={s.label} className={`stat-card stat-card--${s.tone}`}>
                <span className="stat-card__icon">{s.icon}</span>
                <div>
                  <span className="stat-card__value">{s.value}</span>
                  <span className="stat-card__label">{s.label}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {stats && (
        <section className="section insights-grid">
          <Card className="insight-card">
            <h3>Scan results breakdown</h3>
            {byClass.length === 0 ? (
              <p className="text-muted">
                No scans yet. <Link to="/ai-detect">Scan your first leaf</Link> to see results here.
              </p>
            ) : (
              <ul className="breakdown">
                {byClass.map(([name, count]) => (
                  <li key={name}>
                    <div className="breakdown__row">
                      <span>{prettyClass(name)}</span>
                      <strong>{count}</strong>
                    </div>
                    <div className="breakdown__track">
                      <div
                        className={`breakdown__fill ${name === 'Healthy' ? 'breakdown__fill--ok' : ''}`}
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="insight-card">
            <h3>Latest scan</h3>
            {recent ? (
              <div className="latest-scan">
                <span className={`latest-scan__pill ${recentHealthy ? 'latest-scan__pill--ok' : 'latest-scan__pill--bad'}`}>
                  {recentHealthy ? 'Healthy' : 'Disease detected'}
                </span>
                <p className="latest-scan__name">{prettyClass(recent.predicted_class)}</p>
                <p className="text-muted">
                  {percent(recent.confidence)} confidence, {formatDateTime(recent.created_at)}
                </p>
                <Link to="/prediction-history" className="btn btn--soft btn--small">
                  View all scans
                </Link>
              </div>
            ) : (
              <p className="text-muted">Your most recent scan will show up here.</p>
            )}
          </Card>
        </section>
      )}

      <section className="section">
        <h2>Quick actions</h2>
        <div className="quick-links-grid">
          {QUICK_LINKS.map((link) => (
            <Link to={link.to} key={link.to} className="card quick-link-card">
              <span className="quick-link-card__icon">{link.icon}</span>
              <h3>{link.label}</h3>
              <p>{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
