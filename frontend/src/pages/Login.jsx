import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import ErrorBanner from '../components/common/ErrorBanner.jsx'
import { registerRequest } from '../api/authApi.js'
import { getErrorMessage } from '../api/axiosClient.js'

export default function Login() {
  const { token, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) {
    const dest = location.state?.from?.pathname || '/'
    return <Navigate to={dest} replace />
  }

  const isRegister = mode === 'register'

  function switchMode() {
    setMode(isRegister ? 'login' : 'register')
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await registerRequest(username.trim(), email.trim(), password)
      }
      await login(username.trim(), password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__image">
        <div className="auth-page__overlay">
          <span className="auth-page__logo">🌱 AgriGuard</span>
          <h2>Healthy crops start with early detection</h2>
          <p>
            Diagnose potato and tomato leaf diseases with AI, then follow clear remedies and
            prevention steps.
          </p>
        </div>
      </div>

      <div className="auth-page__form-wrap">
        <div className="card auth-page__card">
          <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
          <p className="auth-page__subtitle">
            {isRegister
              ? 'Sign up to start scanning your crops.'
              : 'Log in to continue to your dashboard.'}
          </p>

          <ErrorBanner message={error} />

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className="input"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              required
            />

            {isRegister && (
              <>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </>
            )}

            <label htmlFor="password">Password</label>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input"
                autoComplete={isRegister ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <button
                type="button"
                className="input-group__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {isRegister && <p className="field-hint">At least 8 characters.</p>}

            <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Log in'}
            </button>
          </form>

          <button type="button" className="btn btn--link" onClick={switchMode}>
            {isRegister ? 'Already have an account? Log in' : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  )
}
