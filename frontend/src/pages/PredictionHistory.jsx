import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPredictionHistory } from '../api/predictApi.js'
import { getErrorMessage } from '../api/axiosClient.js'
import Loader from '../components/common/Loader.jsx'
import ErrorBanner from '../components/common/ErrorBanner.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import { formatDateTime, prettyClass, percent } from '../utils/format.js'

export default function PredictionHistory() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPredictionHistory()
      .then(setPredictions)
      .catch((err) => setError(getErrorMessage(err, 'Failed to load history.')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page history-page">
      <PageHeader
        icon="📊"
        title="Scan history"
        subtitle="Every image you've analyzed with AI Detect, saved to your account."
      />

      {loading && <Loader label="Loading history..." />}
      <ErrorBanner message={error} />

      {!loading && predictions.length === 0 && !error && (
        <EmptyState icon="🔬" title="No scans yet">
          <Link to="/ai-detect">Scan your first leaf</Link> and the result will be saved here.
        </EmptyState>
      )}

      {predictions.length > 0 && (
        <div className="table-wrap card">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Result</th>
                <th>Confidence</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr key={p.id}>
                  <td>{formatDateTime(p.created_at)}</td>
                  <td>
                    <span
                      className={`latest-scan__pill ${
                        p.predicted_class === 'Healthy' ? 'latest-scan__pill--ok' : 'latest-scan__pill--bad'
                      }`}
                    >
                      {prettyClass(p.predicted_class)}
                    </span>
                  </td>
                  <td>{percent(p.confidence)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
