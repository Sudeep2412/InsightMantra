import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DataUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => { if (e.target.files?.length > 0) { setFile(e.target.files[0]); setStatusMsg(''); } };

  const handleUpload = async () => {
    if (!file) { setStatusMsg("Please select a file."); setStatusType("error"); return; }
    const formData = new FormData(); formData.append('file', file);
    setIsUploading(true); setStatusMsg("Processing..."); setStatusType("loading");
    try {
      const response = await fetch('http://localhost:2000/api/upload_data', { method: 'POST', credentials: 'include', body: formData });
      const result = await response.json();
      if (response.ok) {
        setStatusMsg(`Uploaded! ${result.rows_processed || result.records_processed || ''} records processed. Redirecting...`); setStatusType("success");
        if (onUploadSuccess) onUploadSuccess();
        setTimeout(() => navigate('/dashboard'), 2000);
      } else { setStatusMsg(result.error || "Upload failed."); setStatusType("error"); }
    } catch (error) { setStatusMsg("Network error."); setStatusType("error"); }
    finally { setIsUploading(false); }
  };

  return (
    <section className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-surface-50 to-white">
      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-3">Upload Data</h1>
          <p className="text-surface-500">Upload CSV or JSON files to generate custom forecasts.</p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-card p-8">
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".csv,.json" onChange={handleFileChange} />

          <div
            onClick={() => fileInputRef.current.click()}
            className="border-2 border-dashed border-surface-200 rounded-2xl p-12 text-center cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-all group"
          >
            <svg className="w-12 h-12 text-surface-300 mx-auto mb-4 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-surface-600 font-medium mb-1">
              {file ? file.name : "Click to choose a file"}
            </p>
            <p className="text-sm text-surface-400">CSV or JSON • Sales / market data</p>
          </div>

          <button onClick={handleUpload} disabled={isUploading || !file}
            className="w-full mt-6 py-3.5 bg-surface-900 text-white font-semibold rounded-xl hover:bg-surface-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {isUploading ? "Processing..." : "Upload & Analyze"}
          </button>

          {statusMsg && (
            <div className={`mt-4 text-sm text-center py-3 px-4 rounded-xl ${
              statusType === 'success' ? 'bg-green-50 text-green-600' :
              statusType === 'error' ? 'bg-red-50 text-red-600' :
              'bg-blue-50 text-blue-600 animate-pulse'}`}>
              {statusMsg}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DataUploader;
