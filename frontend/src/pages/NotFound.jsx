import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page not-found-page">
      <p className="not-found-page__code">404</p>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn--primary btn--lg">Back to dashboard</Link>
    </div>
  )
}
