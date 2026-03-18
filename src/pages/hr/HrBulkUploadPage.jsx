import { useState } from 'react'
import { apiClient } from '../../lib/apiClient'

function HrBulkUploadPage() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await apiClient.post('/api/v1/admin/users/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(res.data)
    } catch (err) {
      setResult({ error: err.message || 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Bulk user upload</h2>
          <p className="page-subtitle">Upload .xlsx files to create or update many users.</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label>
              Select .xlsx file
              <input
                type="file"
                accept=".xlsx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={uploading || !file}>
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </form>
        {result && (
          <pre style={{ marginTop: '1rem', maxHeight: 260, overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

export default HrBulkUploadPage

