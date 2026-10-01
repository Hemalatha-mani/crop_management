import { useEffect, useState } from 'react'
import { fetchCropManagementList } from '../api/cropManagementApi.js'
import { getErrorMessage } from '../api/axiosClient.js'
import Loader from '../components/common/Loader.jsx'
import ErrorBanner from '../components/common/ErrorBanner.jsx'
import Card from '../components/common/Card.jsx'
import PageHeader from '../components/common/PageHeader.jsx'

const CROP_IMAGES = {
  Potato: '/images/crops/potato.svg',
  Tomato: '/images/crops/tomato.svg',
}

export default function CropManagement() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCropManagementList()
      .then(setCrops)
      .catch((err) => setError(getErrorMessage(err, 'Failed to load crop data.')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page crop-management-page">
      <PageHeader
        icon="🌾"
        title="Crop management"
        subtitle="Practical guidance for growing healthy, high-yield crops."
      />

      {loading && <Loader label="Loading crop management data..." />}
      <ErrorBanner message={error} />

      <div className="crop-management-grid">
        {crops.map((crop) => (
          <Card key={crop.crop_name} className="crop-card">
            <img
              src={CROP_IMAGES[crop.crop_name] || CROP_IMAGES.Tomato}
              alt={crop.crop_name}
              className="crop-card__image"
              loading="lazy"
            />
            <h3>{crop.crop_name}</h3>
            <p><strong>Ideal conditions:</strong> {crop.ideal_conditions}</p>
            <p><strong>Watering:</strong> {crop.watering}</p>
            <p><strong>Fertilization:</strong> {crop.fertilization}</p>
            <p><strong>Common pests:</strong> {crop.common_pests.join(', ')}</p>
            <p><strong>Harvesting:</strong> {crop.harvesting_tips}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
