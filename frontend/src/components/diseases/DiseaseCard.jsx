import { useState } from 'react'

const SEVERITY_CLASS = {
  Mild: 'badge--mild',
  Moderate: 'badge--moderate',
  Severe: 'badge--severe',
}

const FALLBACK_IMAGE = '/images/crops/tomato.svg'

export default function DiseaseCard({ disease }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="card disease-card">
      <img
        src={disease.image}
        alt={disease.name}
        className="disease-card__image"
        loading="lazy"
        onError={(e) => {
          if (!e.currentTarget.src.endsWith(FALLBACK_IMAGE)) e.currentTarget.src = FALLBACK_IMAGE
        }}
      />
      <div className="disease-card__body">
        <div className="disease-card__header">
          <h3>{disease.name}</h3>
          <span className={`badge ${SEVERITY_CLASS[disease.severity] || ''}`}>
            {disease.severity}
          </span>
        </div>
        <p className="disease-card__crop">Affects: {disease.crop}</p>

        <h4>Symptoms</h4>
        <ul>
          {disease.symptoms.slice(0, expanded ? undefined : 2).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        {expanded && (
          <>
            <h4>Causes</h4>
            <ul>
              {disease.causes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>

            <h4>Identification signs</h4>
            <ul>
              {disease.identification_signs.map((sign) => (
                <li key={sign}>{sign}</li>
              ))}
            </ul>

            <h4>Details</h4>
            <p>{disease.detailed_info}</p>
          </>
        )}

        <button
          type="button"
          className="btn btn--link"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less ▲' : 'Show more ▼'}
        </button>
      </div>
    </div>
  )
}
