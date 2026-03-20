import { useEffect, useRef, useState } from 'react';
import PageHeader from '../components/common/PageHeader';

const UploadZone = ({ onBrowseClick, onDragOver, onDragLeave, onDrop, onFileChange, fileInputRef }) => {
  return (
    <div
      className="upload-zone"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onBrowseClick}
    >
      <div className="upload-icon">📂</div>
      <div className="upload-title">Drop your file here</div>
      <div className="upload-sub">or click to browse · CSV, XLSX up to 10MB</div>
      <div style={{ marginTop: '14px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <span className="badge badge-blue">Employees</span>
        <span className="badge badge-green">Attendance</span>
        <span className="badge badge-amber">Leave Data</span>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </div>
  );
};

const UploadProgress = ({ uploadFile, uploadProgress }) => {
  if (uploadProgress === null) {
    return null;
  }

  return (
    <div className="progress-wrap" style={{ marginTop: '20px', display: 'block' }}>
      <div className="progress-item">
        <div className="progress-top">
          <span>{uploadFile}</span>
          <span>{Math.round(uploadProgress)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      </div>
      {uploadProgress === 100 && (
        <div
          style={{
            display: 'block',
            padding: '12px 14px',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '10px',
            fontSize: '13px',
            color: '#15803D',
          }}
        >
          ✓ 85 records imported successfully · 2 errors found
          <button className="btn btn-outline btn-sm" style={{ marginLeft: '10px' }}>
            Download Error Log
          </button>
        </div>
      )}
    </div>
  );
};

const UploadInstructions = () => {
  return (
    <div className="card">
      <div className="card-title">Upload Instructions</div>
      <div style={{ fontSize: '13px', color: 'var(--text-sec)', lineHeight: 1.8 }}>
        <p style={{ marginBottom: '10px' }}>
          1. Download the template CSV for the data type you want to import.
        </p>
        <p style={{ marginBottom: '10px' }}>
          2. Fill in all required fields (marked with *). Do not change column headers.
        </p>
        <p style={{ marginBottom: '10px' }}>
          3. Save as .csv or .xlsx and upload the file above.
        </p>
        <p style={{ marginBottom: '16px' }}>
          4. Review the import summary and download error logs if needed.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            📄 Employee Template
          </button>
          <button className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            📄 Attendance Template
          </button>
          <button className="btn btn-outline" style={{ justifyContent: 'flex-start', gap: '8px' }}>
            📄 Leave Template
          </button>
        </div>
      </div>
    </div>
  );
};

const UploadPage = () => {
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const fileInputRef = useRef(null);
  const uploadIntervalRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag');
    const file = e.dataTransfer.files[0];
    if (file) {
      startUpload(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      startUpload(file);
    }
  };

  const startUpload = (file) => {
    if (uploadIntervalRef.current) {
      clearInterval(uploadIntervalRef.current);
    }
    setUploadFile(file.name);
    setUploadProgress(0);

    // Simulate upload progress
    uploadIntervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 18;
        if (newProgress >= 100) {
          clearInterval(uploadIntervalRef.current);
          uploadIntervalRef.current = null;
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
      }
    };
  }, []);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ paddingBottom: '20px' }}>
      <PageHeader
        title="Bulk Upload"
        subtitle="Import employees, attendance, or leave data via CSV"
      />

      <div className="grid-2">
        <div>
          <UploadZone
            onBrowseClick={handleBrowseClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileChange={handleFileInput}
            fileInputRef={fileInputRef}
          />
          <UploadProgress uploadFile={uploadFile} uploadProgress={uploadProgress} />
        </div>

        <UploadInstructions />
      </div>
    </div>
  );
};

export default UploadPage;
