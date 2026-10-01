import { useEffect, useState } from 'react'
import ImageUploader from '../components/ai-detect/ImageUploader.jsx'
import PredictionResult from '../components/ai-detect/PredictionResult.jsx'
import ErrorBanner from '../components/common/ErrorBanner.jsx'
import Loader from '../components/common/Loader.jsx'
import PageHeader from '../components/common/PageHeader.jsx'
import { predictImage } from '../api/predictApi.js'
import { getErrorMessage } from '../api/axiosClient.js'

export default function AIDetect() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Free the temporary preview URL when it changes / the page unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function handleFileSelected(selectedFile) {
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setResult(null)
    setError('')
  }

  function handleRemove() {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError('')
  }

  async function handleDetect() {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await predictImage(file)
      setResult(data)
    } catch (err) {
      if (err.response?.status === 503) {
        setError(
          'The AI model is not available on the server yet. Add the trained model file ' +
            '(crop_disease_model_final.keras) to backend/ml_models/ and restart the backend.'
        )
      } else {
        setError(getErrorMessage(err, 'Prediction failed. Please check your connection and try again.'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page ai-detect-page">
      <PageHeader
        icon="🔬"
        title="AI disease detection"
        subtitle="Upload a clear photo of a potato or tomato leaf and our trained model will check it for disease."
      />

      <div className="ai-detect-grid">
        <div className="card ai-detect-grid__left">
          <h2>1. Upload image</h2>
          <ImageUploader
            onFileSelected={handleFileSelected}
            previewUrl={previewUrl}
            onRemove={handleRemove}
          />
          <button
            type="button"
            className="btn btn--primary btn--full btn--lg"
            disabled={!file || loading}
            onClick={handleDetect}
          >
            {loading ? 'Analyzing...' : '🔍 Detect disease'}
          </button>
          <ul className="tips">
            <li>Use natural daylight and keep the leaf in focus.</li>
            <li>Fill the frame with a single leaf on a plain background.</li>
          </ul>
        </div>

        <div className="card ai-detect-grid__right">
          <h2>2. Result</h2>
          {loading && <Loader label="Running AI analysis..." />}
          <ErrorBanner message={error} />
          {!loading && !result && !error && (
            <p className="ai-detect-grid__placeholder">
              Your results will appear here after you upload an image and click "Detect disease".
            </p>
          )}
          {result && <PredictionResult result={result} previewUrl={previewUrl} />}
        </div>
      </div>
    </div>
  )
}
