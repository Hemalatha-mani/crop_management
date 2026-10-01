import { useEffect, useState } from 'react'
import { fetchFarmingGuide } from '../api/farmingGuideApi.js'
import { getErrorMessage } from '../api/axiosClient.js'
import Loader from '../components/common/Loader.jsx'
import ErrorBanner from '../components/common/ErrorBanner.jsx'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'

export default function FarmingGuide() {
  const [guide, setGuide] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFarmingGuide()
      .then(setGuide)
      .catch((err) => setError(getErrorMessage(err, 'Failed to load farming guide.')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page farming-guide-page">
      <PageHeader
        icon="📖"
        title="Farming guide"
        subtitle="A stage-by-stage walkthrough of best practices from soil prep to harvest."
      />

      {loading && <Loader label="Loading guide..." />}
      <ErrorBanner message={error} />

      <ol className="timeline">
        {guide.map((entry, idx) => (
          <li key={entry.title} className="timeline__row">
            <span className="timeline__marker">{idx + 1}</span>
            <Card className="timeline__item">
              <span className="badge">{entry.stage}</span>
              <h3>{entry.title}</h3>
              <ul>
                {entry.content.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  )
}
