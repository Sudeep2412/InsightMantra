import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from './Section';
import Button from './Button';

const DataUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success' or 'error'
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatusMsg('');
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) {
      setStatusMsg("Please select a file first.");
      setStatusType("error");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setStatusMsg("Analyzing and processing data model...");
    setStatusType("loading");

    try {
      const response = await fetch('http://localhost:2000/api/upload_data', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        setStatusMsg(`Upload successful! Indexed ${result.rows_processed || result.records_processed || 'all'} records. Model retrained. Teleporting...`);
        setStatusType("success");
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setStatusMsg(result.error || "Failed to upload.");
        setStatusType("error");
      }
    } catch (error) {
      console.error(error);
      setStatusMsg("Network Error: Could not reach the server.");
      setStatusType("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Section className="pt-[6rem] -mt-[5.25rem]">
      <div className="container mx-auto px-4 py-8 mb-10">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">Deep Data Fusion Hub</h2>
          <p className="body-1 max-w-3xl mx-auto mb-10 text-n-2 lg:mb-12">
            Inject your enterprise CSV or JSON market datasets directly into the InsightMantra core engine. Our neural layers instantly parse your telemetry to fine-tune ongoing forecasts.
          </p>
          
          <div className="flex flex-col items-center justify-center p-10 bg-n-8/40 backdrop-blur-md border border-n-1/10 rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".csv,.json"
              onChange={handleFileChange}
            />
            
            <div className="mb-8 mt-4 flex gap-6">
               <button onClick={handleUploadClick} className="px-8 py-4 bg-n-7/50 hover:bg-n-6 text-white border border-n-1/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all rounded-lg font-semibold tracking-wide" style={{borderRadius: '8px'}}>
                 {file ? "Change Data File" : "Select Enterprise Dataset"}
               </button>
               <button onClick={handleUpload} disabled={isUploading} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-widest uppercase border-0 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all rounded-lg" style={{borderRadius: '8px', color: 'white'}}>
                 {isUploading ? "Processing..." : "Commence Fusion"}
               </button>
            </div>

            {file && (
              <p className="text-sm text-n-3 mb-4">
                Selected artifact: <span className="text-n-1 font-semibold">{file.name}</span>
              </p>
            )}

            {statusMsg && (
              <div className={`mt-4 px-6 py-3 rounded-lg font-medium shadow-md transition-all ${
                statusType === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                statusType === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                'bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse'
              }`}>
                {statusMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default DataUploader;
