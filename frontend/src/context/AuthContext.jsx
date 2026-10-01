import { createContext, useContext, useEffect, useState } from 'react'
import { loginRequest, logoutRequest, fetchCurrentUser } from '../api/authApi.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'agriguard_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false)
        return
      }
      if (user) {
        // Right after login we already have the user - no need to fetch again.
        setLoading(false)
        return
      }
      try {
        const currentUser = await fetchCurrentUser()
        setUser(currentUser)
      } catch (err) {
        // Only drop the session when the token is really invalid (401).
        // If the backend is just unreachable, keep the token so a refresh doesn't log you out.
        if (err.response?.status === 401) {
          localStorage.removeItem(TOKEN_KEY)
          setToken(null)
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function login(username, password) {
    const data = await loginRequest(username, password)
    localStorage.setItem(TOKEN_KEY, data.access_token)
    setToken(data.access_token)
    setUser(data.user)
    return data
  }

  async function logout() {
    try {
      await logoutRequest()
    } catch (err) {
      // ignore network errors on logout; clear local state regardless
    }
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export { TOKEN_KEY }
