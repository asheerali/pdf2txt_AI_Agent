import React, { useRef, useState } from "react";
import ChoosePDFButton from "./ChoosePDFButton";
import UploadPDFButton from "./UploadPDFButton";

export default function UnmarkedUpload({ goBack }) {
  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [combinedFiles, setCombinedFiles] = useState([]);

  const handleChooseFile = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setStatus("");
      setResponseData(null);
      setCombinedFiles([]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = null;
    setStatus("");
    setResponseData(null);
    setCombinedFiles([]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus("no_file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setStatus("loading");
      const res = await fetch("http://localhost:8000/unmarked", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponseData(data);
      setStatus("success");

      const fileRes = await fetch("http://localhost:8000/combined-files");
      const fileData = await fileRes.json();
      setCombinedFiles(fileData.files);
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("error");
    }
  };

  return (
    <div className="unmarked-upload-container">
      <div className="upload-card">
        <h2 className="upload-title">Upload Unmarked PDF</h2>
        
        <div className="upload-area">
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            className="file-input"
            onChange={handleFileChange}
          />
          
          {!selectedFile ? (
            <div className="dropzone" onClick={handleChooseFile}>
              <div className="dropzone-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10L12 5L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 21H4C3.44772 21 3 20.5523 3 20V19C3 18.4477 3.44772 18 4 18H20C20.5523 18 21 18.4477 21 19V20C21 20.5523 20.5523 21 20 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="dropzone-text">
                <p className="dropzone-title">Drag & Drop PDF here</p>
                <p className="dropzone-subtitle">or click to browse files</p>
              </div>
            </div>
          ) : (
            <div className="file-preview">
              <div className="file-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="file-info">
                <p className="file-name">{selectedFile.name}</p>
                <p className="file-size">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button className="remove-button" onClick={handleRemoveFile}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
        
        <div className="button-row">
          <button className="back-button" onClick={goBack}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          
          <button 
            className={`upload-button ${!selectedFile ? 'disabled' : ''} ${status === 'loading' ? 'loading' : ''}`} 
            onClick={handleUpload}
            disabled={!selectedFile || status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <div className="spinner"></div>
                Uploading...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Process PDF
              </>
            )}
          </button>
        </div>
        
        <div className="status-area">
          {status === "no_file" && (
            <div className="status-message error">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.93 2.93L3.93 9.93C3.32843 10.5316 3 11.3388 3 12.18V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12.18C21 11.3388 20.6716 10.5316 20.07 9.93L13.07 2.93C12.7794 2.6394 12.3978 2.47754 12 2.47754C11.6022 2.47754 11.2206 2.6394 10.93 2.93Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>No file selected. Please choose a PDF file first.</span>
            </div>
          )}
          {status === "loading" && (
            <div className="status-message loading">
              <div className="status-spinner"></div>
              <span>Processing your PDF file...</span>
            </div>
          )}
          {status === "success" && (
            <div className="status-message success">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18457 2.99721 7.13633 4.39828 5.49707C5.79935 3.85782 7.69279 2.71538 9.79619 2.24015C11.8996 1.76491 14.1003 1.98234 16.07 2.86" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>PDF processed successfully!</span>
            </div>
          )}
          {status === "error" && (
            <div className="status-message error">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.93 2.93L3.93 9.93C3.32843 10.5316 3 11.3388 3 12.18V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12.18C21 11.3388 20.6716 10.5316 20.07 9.93L13.07 2.93C12.7794 2.6394 12.3978 2.47754 12 2.47754C11.6022 2.47754 11.2206 2.6394 10.93 2.93Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Upload failed. Please try again.</span>
            </div>
          )}
        </div>

        {combinedFiles.length > 0 && (
          <div className="files-section">
            <h3 className="files-title">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Generated Files
            </h3>
            <ul className="files-list">
              {combinedFiles.map((fileName) => (
                <li key={fileName} className="file-item">
                  <svg className="file-list-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="file-list-name">{fileName}</span>
                  <a
                    href={`http://localhost:8000/download/${fileName}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {responseData && (
          <div className="response-data">
            <h3 className="response-title">Response Data</h3>
            <pre className="response-json">{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .unmarked-upload-container {
          width: 100%;
          display: flex;
          justify-content: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .upload-card {
          width: 100%;
          max-width: 800px;
          background-color: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .upload-title {
          font-size: 1.75rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .upload-area {
          margin-bottom: 2rem;
        }
        
        .file-input {
          display: none;
        }
        
        .dropzone {
          border: 2px dashed #4776E6;
          border-radius: 16px;
          padding: 2.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(71, 118, 230, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .dropzone:hover {
          background-color: rgba(71, 118, 230, 0.1);
          border-color: #8E54E9;
          transform: translateY(-2px);
        }
        
        .dropzone-icon {
          width: 80px;
          height: 80px;
          color: #4776E6;
          margin-bottom: 1rem;
        }
        
        .dropzone-text {
          text-align: center;
        }
        
        .dropzone-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        
        .dropzone-subtitle {
          font-size: 0.9rem;
          color: #718096;
        }
        
        .file-preview {
          display: flex;
          align-items: center;
          padding: 1.25rem;
          background-color: #f7fafc;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }
        
        .file-icon {
          width: 40px;
          height: 40px;
          margin-right: 1rem;
          color: #4776E6;
        }
        
        .file-info {
          flex: 1;
        }
        
        .file-name {
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.25rem 0;
          word-break: break-all;
        }
        
        .file-size {
          font-size: 0.875rem;
          color: #718096;
          margin: 0;
        }
        
        .remove-button {
          background: none;
          border: none;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          color: #e53e3e;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          padding: 0;
        }
        
        .remove-button:hover {
          background-color: rgba(229, 62, 62, 0.1);
        }
        
        .remove-button svg {
          width: 20px;
          height: 20px;
        }
        
        .button-row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background-color: #f7fafc;
          color: #2d3748;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .back-button svg {
          width: 18px;
          height: 18px;
        }
        
        .back-button:hover {
          background-color: #edf2f7;
        }
        
        .upload-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          max-width: 200px;
        }
        
        .upload-button svg {
          width: 20px;
          height: 20px;
        }
        
        .upload-button:hover:not(.disabled):not(.loading) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(142, 84, 233, 0.3);
        }
        
        .upload-button.disabled {
          background: linear-gradient(135deg, #a0aec0 0%, #cbd5e0 100%);
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .upload-button.loading {
          background: linear-gradient(135deg, #a0aec0 0%, #cbd5e0 100%);
          cursor: wait;
        }
        
        .spinner, .status-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .status-area {
          margin-bottom: 1.5rem;
        }
        
        .status-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
        }
        
        .status-message svg {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }
        
        .status-message.error {
          background-color: #FFF5F5;
          color: #C53030;
          border: 1px solid #FED7D7;
        }
        
        .status-message.error svg {
          color: #E53E3E;
        }
        
        .status-message.success {
          background-color: #F0FFF4;
          color: #2F855A;
          border: 1px solid #C6F6D5;
        }
        
        .status-message.success svg {
          color: #38A169;
        }
        
        .status-message.loading {
          background-color: #EBF8FF;
          color: #2B6CB0;
          border: 1px solid #BEE3F8;
        }
        
        .status-spinner {
          border: 3px solid rgba(43, 108, 176, 0.3);
          border-top-color: #2B6CB0;
        }
        
        .files-section {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .files-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
        }
        
        .files-title svg {
          width: 24px;
          height: 24px;
          color: #4776E6;
        }
        
        .files-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .file-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background-color: #f7fafc;
          border-radius: 10px;
          margin-bottom: 0.75rem;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        
        .file-item:hover {
          background-color: #edf2f7;
        }
        
        .file-list-icon {
          width: 24px;
          height: 24px;
          color: #4776E6;
          margin-right: 1rem;
        }
        
        .file-list-name {
          flex: 1;
          font-size: 0.9rem;
          color: #2d3748;
          font-weight: 500;
        }
        
        .download-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #4776E6;
          color: white;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .download-link:hover {
          background-color: #8E54E9;
          transform: translateY(-2px);
        }
        
        .download-link svg {
          width: 16px;
          height: 16px;
        }
        
        .response-data {
          margin-top: 2rem;
          padding: 1.5rem;
          background-color: #2d3748;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .response-title {
          font-size: 1rem;
          font-weight: 600;
          color: #e2e8f0;
          margin-top: 0;
          margin-bottom: 1rem;
        }
        
        .response-json {
          background-color: #1a202c;
          color: #a0aec0;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          font-family: monospace;
          font-size: 0.85rem;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .upload-card {
            padding: 1.5rem;
          }
          
          .upload-title {
            font-size: 1.5rem;
          }
          
          .dropzone {
            padding: 2rem 1rem;
          }
          
          .dropzone-icon {
            width: 60px;
            height: 60px;
          }
          
          .button-row {
            flex-direction: column;
          }
          
          .back-button, .upload-button {
            width: 100%;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}