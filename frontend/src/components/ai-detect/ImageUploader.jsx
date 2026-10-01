import { useCallback, useRef, useState } from 'react'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
const MAX_MB = 10

export default function ImageUploader({ onFileSelected, previewUrl, onRemove }) {
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState('')
  const inputRef = useRef(null)

  const handleFiles = useCallback(
    (files) => {
      const file = files?.[0]
      if (!file) return
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setLocalError('Please upload a JPEG, PNG or WEBP image.')
        return
      }
      if (file.size > MAX_MB * 1024 * 1024) {
        setLocalError(`That image is larger than ${MAX_MB} MB. Please choose a smaller one.`)
        return
      }
      setLocalError('')
      onFileSelected(file)
    },
    [onFileSelected]
  )

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  if (previewUrl) {
    return (
      <div className="uploader__preview">
        <img src={previewUrl} alt="Selected crop leaf" />
        <button type="button" className="btn btn--soft" onClick={onRemove}>
          ✕ Remove image
        </button>
      </div>
    )
  }

  return (
    <>
      <div
        className={`uploader__dropzone ${isDragging ? 'uploader__dropzone--active' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload a leaf image"
      >
        <p className="uploader__icon">📷</p>
        <p className="uploader__title">Drag and drop a leaf photo here</p>
        <p className="uploader__or">or</p>
        <span className="btn btn--primary">Browse image</span>
        <p className="uploader__hint">JPEG, PNG or WEBP, up to {MAX_MB} MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          hidden
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = '' // allow re-selecting the same file
          }}
        />
      </div>
      {localError && (
        <div className="error-banner" role="alert">
          ⚠️ {localError}
        </div>
      )}
    </>
  )
}
