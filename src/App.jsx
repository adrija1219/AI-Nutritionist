import React, { useState, useRef } from 'react'
import './index.css'

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
  })
}

export default function App() {
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [instructions, setInstructions] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef()
  const resultRef = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImage(file)
    setPreviewUrl(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImage(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    try {
      const base64 = await fileToBase64(image)
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: image.type, extraInstructions: instructions || undefined })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Server error')
      }
      const data = await res.json()
      setResult(data)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header>
        <div className="logo">🥗</div>
        <div className="logo-text">
          <h1>NutriLens</h1>
          <p>AI NUTRITIONIST</p>
        </div>
      </header>

      <main>
        <div className="hero">
          <h2>Know exactly what you eat,<br /><span>in a snap.</span></h2>
          <p>Snap a photo of your meal and let our AI nutritionist instantly calculate calories, break down macros, and give you personalized dietary feedback.</p>
        </div>

        <div className="card" style={{ position: 'relative' }}>
          <div className="two-col">
            <div>
              <p className="col-label">1. Add your meal</p>
              <p className="col-sub">Upload a clear photo of your food.</p>

              {!image ? (
                <div
                  className={`dropzone${dragActive ? ' drag-active' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                  <div className="dropzone-icon">📷</div>
                  <h3>{dragActive ? 'Drop it here!' : 'Upload your meal'}</h3>
                  <p>Drag & drop or click to browse</p>
                  <div className="badges">
                    <span className="badge">JPG</span>
                    <span className="badge">PNG</span>
                    <span className="badge">WEBP</span>
                  </div>
                </div>
              ) : (
                <div className="preview-wrapper">
                  <img src={previewUrl} alt="Food" />
                  <button className="clear-btn" onClick={handleClear}>✕</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p className="col-label">2. Add context <span style={{ fontWeight: 400, color: '#9ca3af', fontSize: '0.85rem' }}>(Optional)</span></p>
              <p className="col-sub">Hidden ingredients? Portion size? Tell us more.</p>

              <textarea
                placeholder="e.g., 'Cooked in olive oil', 'Half portion', 'With ranch dressing'"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                disabled={loading}
              />

              <button
                className="submit-btn"
                disabled={!image || loading}
                onClick={handleSubmit}
              >
                {loading ? '⏳ Analyzing...' : '✨ Tell me the total calories'}
              </button>

              {!image && <p className="hint">Please upload an image to begin.</p>}
              {error && <p className="hint" style={{ color: '#ef4444', marginTop: '0.5rem' }}>⚠️ {error}</p>}
            </div>
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="spinner-box">
                <div className="spinner" />
                <h3>Analyzing Ingredients...</h3>
                <p>Our AI is breaking down your meal's nutritional profile.</p>
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="result-card" ref={resultRef}>
            <div className={`result-header ${result.isHealthy ? 'healthy' : 'unhealthy'}`}>
              <div className={`result-icon ${result.isHealthy ? 'healthy' : 'unhealthy'}`}>
                {result.isHealthy ? '🥦' : '⚠️'}
              </div>
              <div>
                <h2>{result.isHealthy ? 'Healthy Choice!' : 'Enjoy in Moderation'}</h2>
                <p>📊 AI Nutritional Analysis Complete</p>
              </div>
            </div>
            <div className="result-body">{result.analysis}</div>
          </div>
        )}
      </main>
    </div>
  )
}
