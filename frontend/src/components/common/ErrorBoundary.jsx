import { Component } from 'react'

/** Prevents a blank white screen if any component crashes - shows the error instead. */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('UI crashed:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="crash">
        <div className="card crash__card">
          <h1>Something went wrong</h1>
          <p>The page hit an unexpected error. Reloading usually fixes it.</p>
          <pre>{String(this.state.error?.message || this.state.error)}</pre>
          <button className="btn btn--primary" type="button" onClick={() => window.location.assign('/')}>
            Reload the app
          </button>
        </div>
      </div>
    )
  }
}
