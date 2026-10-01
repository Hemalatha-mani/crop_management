import { useNavigate } from 'react-router-dom'
import ConfidenceBar from './ConfidenceBar.jsx'
import Button from '../common/Button.jsx'
import { prettyClass, percent } from '../../utils/format.js'

const DISEASE_ID_MAP = {
  Potato_Early_blight: 'potato_early_blight',
  Potato_Late_blight: 'potato_late_blight',
  Tomato_Bacterial_spot: 'tomato_bacterial_spot',
  Tomato_Early_blight: 'tomato_early_blight',
  Tomato_Late_blight: 'tomato_late_blight',
}

export default function PredictionResult({ result, previewUrl }) {
  const navigate = useNavigate()
  const isHealthy = result.predicted_class === 'Healthy'
  const diseaseId = DISEASE_ID_MAP[result.predicted_class]

  const top = Object.entries(result.all_probabilities || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <div className="prediction-result">
      {previewUrl && (
        <img src={previewUrl} alt="Analyzed crop leaf" className="prediction-result__image" />
      )}

      <span className={`latest-scan__pill ${isHealthy ? 'latest-scan__pill--ok' : 'latest-scan__pill--bad'}`}>
        {isHealthy ? 'Healthy' : 'Disease detected'}
      </span>
      <h3 className={isHealthy ? 'text-success' : 'text-danger'}>
        {prettyClass(result.predicted_class)}
      </h3>

      <ConfidenceBar confidence={result.confidence} />

      {top.length > 1 && (
        <div className="prediction-result__others">
          <p className="text-muted">Other possibilities</p>
          <ul>
            {top.slice(1).map(([name, p]) => (
              <li key={name}>
                <span>{prettyClass(name)}</span>
                <strong>{percent(p)}</strong>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="prediction-result__action">
        {isHealthy
          ? 'No signs of disease detected. Continue routine monitoring and good field hygiene.'
          : 'A disease was detected. Review the remedies and prevention steps, and consider consulting a local expert if symptoms are severe or spreading.'}
      </p>

      {!isHealthy && diseaseId && (
        <div className="prediction-result__actions">
          <Button variant="primary" onClick={() => navigate('/remedies', { state: { diseaseId } })}>
            View remedies
          </Button>
          <Button variant="soft" onClick={() => navigate('/prevention', { state: { diseaseId } })}>
            View prevention
          </Button>
        </div>
      )}
    </div>
  )
}
