import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchPreventionTips } from '../api/preventionApi.js'
import { getErrorMessage } from '../api/axiosClient.js'
import Loader from '../components/common/Loader.jsx'
import ErrorBanner from '../components/common/ErrorBanner.jsx'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'

export default function Prevention() {
  const location = useLocation()
  // When arriving from a scan result, pre-select that crop (e.g. "tomato_late_blight" -> "Tomato").
  const cropFromScan = location.state?.diseaseId?.split('_')[0]
  const initialCrop = cropFromScan ? cropFromScan.charAt(0).toUpperCase() + cropFromScan.slice(1) : 'All'

  const [tips, setTips] = useState([])
  const [crop, setCrop] = useState(initialCrop)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPreventionTips()
      .then(setTips)
      .catch((err) => setError(getErrorMessage(err, 'Failed to load prevention tips.')))
      .finally(() => setLoading(false))
  }, [])

  const crops = useMemo(
    () => ['All', ...new Set(tips.map((t) => t.crop).filter((c) => c !== 'General'))],
    [tips]
  )
  const visible = tips.filter((t) => crop === 'All' || t.crop === crop || t.crop === 'General')

  return (
    <div className="page prevention-page">
      <PageHeader
        icon="🛡️"
        title="Prevention"
        subtitle="General and crop-specific practices to keep diseases from taking hold."
      />

      {tips.length > 0 && (
        <div className="disease-filter prevention-page__filter">
          {crops.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${crop === c ? 'chip--active' : ''}`}
              onClick={() => setCrop(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {loading && <Loader label="Loading prevention tips..." />}
      <ErrorBanner message={error} />

      <div className="prevention-grid">
        {visible.map((tip) => (
          <Card key={tip.title} className="prevention-card">
            <span className="badge">{tip.crop}</span>
            <h3>{tip.title}</h3>
            <ul>
              {tip.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}
