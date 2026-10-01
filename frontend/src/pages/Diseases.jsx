import { useEffect, useMemo, useState } from 'react'
import { fetchDiseases } from '../api/diseasesApi.js'
import { getErrorMessage } from '../api/axiosClient.js'
import DiseaseCard from '../components/diseases/DiseaseCard.jsx'
import DiseaseSearch from '../components/diseases/DiseaseSearch.jsx'
import DiseaseFilter from '../components/diseases/DiseaseFilter.jsx'
import Loader from '../components/common/Loader.jsx'
import ErrorBanner from '../components/common/ErrorBanner.jsx'
import EmptyState from '../components/common/EmptyState.jsx'
import PageHeader from '../components/common/PageHeader.jsx'

export default function Diseases() {
  const [diseases, setDiseases] = useState([])
  const [search, setSearch] = useState('')
  const [crop, setCrop] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDiseases()
      .then(setDiseases)
      .catch((err) => setError(getErrorMessage(err, 'Failed to load diseases.')))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return diseases.filter((d) => {
      const matchesCrop = crop === 'All' || d.crop === crop
      const matchesSearch = d.name.toLowerCase().includes(search.trim().toLowerCase())
      return matchesCrop && matchesSearch
    })
  }, [diseases, search, crop])

  return (
    <div className="page diseases-page">
      <PageHeader
        icon="🦠"
        title="Crop diseases"
        subtitle="Browse detailed information on the diseases our AI model can detect."
      />

      <div className="diseases-page__controls">
        <DiseaseSearch value={search} onChange={setSearch} />
        <DiseaseFilter value={crop} onChange={setCrop} />
      </div>

      {loading && <Loader label="Loading diseases..." />}
      <ErrorBanner message={error} />

      {!loading && filtered.length === 0 && !error && (
        <EmptyState icon="🔎" title="No diseases found">
          Try a different search term or clear the crop filter.
        </EmptyState>
      )}

      <div className="diseases-grid">
        {filtered.map((disease) => (
          <DiseaseCard key={disease.id} disease={disease} />
        ))}
      </div>
    </div>
  )
}
