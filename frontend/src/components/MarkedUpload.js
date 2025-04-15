import React, { useRef, useState } from "react";
import ChoosePDFButton from "./ChoosePDFButton";
import UploadPDFButton from "./UploadPDFButton";

export default function MarkedUpload({ goBack }) {
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
      const res = await fetch("http://localhost:8000/marked", {
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
    <div className="upload-container">
      <div className="upload-content">
        <h2 className="upload-title">Upload Marked PDF</h2>
        
        <div className="file-upload-area">
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          
          {!selectedFile ? (
            <div className="drop-zone" onClick={handleChooseFile}>
              <div className="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 16.5L12 11.5L17 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11.5V21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.39 18.39C21.3653 17.8583 22.1358 17.0169 22.5798 15.9986C23.0239 14.9804 23.1162 13.8432 22.8422 12.7667C22.5682 11.6901 21.9434 10.7355 21.0666 10.0534C20.1898 9.37137 19.1108 9.00072 18 9.00001H16.74C16.4373 7.82926 15.8731 6.74235 15.09 5.82101C14.3069 4.89967 13.3249 4.16786 12.2181 3.68062C11.1114 3.19338 9.90831 2.96337 8.70008 3.00777C7.49185 3.05217 6.30999 3.3703 5.24822 3.93137C4.18645 4.49244 3.27447 5.28091 2.57823 6.23727C1.88198 7.19363 1.41895 8.2916 1.22279 9.44573C1.02663 10.5999 1.10206 11.7829 1.44258 12.9057C1.7831 14.0285 2.38172 15.0648 3.19 15.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="drop-text">
                <p className="primary-text">Drag & Drop your PDF here</p>
                <p className="secondary-text">or click to browse files</p>
              </div>
            </div>
          ) : (
            <div className="selected-file">
              <div className="file-info">
                <div className="file-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="file-details">
                  <p className="file-name">{selectedFile.name}</p>
                  <p className="file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
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
        
        <div className="action-buttons">
          <button 
            className="action-button upload-button" 
            onClick={handleUpload}
            disabled={!selectedFile || status === "loading"}
          >
            {status === "loading" ? (
              <div className="loading-spinner"></div>
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
          
          <button 
            className="action-button back-button" 
            onClick={goBack}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </button>
        </div>
        
        <div className="status-container">
          {status === "no_file" && (
            <div className="status-message error">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.29 3.86L1.82 18C1.64537 18.3024 1.55296 18.6453 1.55199 18.9945C1.55101 19.3437 1.6415 19.6871 1.81442 19.9905C1.98734 20.2939 2.23586 20.5467 2.53513 20.7239C2.8344 20.901 3.17618 20.9962 3.52 21H20.48C20.8238 20.9962 21.1656 20.901 21.4649 20.7239C21.7641 20.5467 22.0127 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86C13.5317 3.56611 13.2807 3.32312 12.9812 3.15448C12.6817 2.98585 12.3437 2.89725 12 2.89725C11.6563 2.89725 11.3183 2.98585 11.0188 3.15448C10.7193 3.32312 10.4683 3.56611 10.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              No file selected. Please select a PDF file first.
            </div>
          )}
          
          {status === "error" && (
            <div className="status-message error">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload failed. Please try again or check your connection.
            </div>
          )}
          
          {status === "success" && (
            <div className="status-message success">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Upload successful!
            </div>
          )}
        </div>
        
        {combinedFiles.length > 0 && (
          <div className="download-section">
            <h3 className="download-title">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Available Downloads
            </h3>
            <ul className="download-list">
              {combinedFiles.map((fileName) => (
                <li key={fileName} className="download-item">
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
                    {fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {responseData && (
          <div className="response-data">
            <h3 className="response-title">Response Data</h3>
            <pre className="response-content">{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .upload-container {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .upload-content {
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        
        .upload-title {
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 600;
        }
        
        .file-upload-area {
          margin-bottom: 1.5rem;
        }
        
        .drop-zone {
          border: 2px dashed #11998e;
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(17, 153, 142, 0.05);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .drop-zone:hover {
          background-color: rgba(17, 153, 142, 0.1);
          border-color: #38ef7d;
        }
        
        .upload-icon {
          width: 60px;
          height: 60px;
          color: #11998e;
          margin-bottom: 1rem;
        }
        
        .drop-text {
          text-align: center;
        }
        
        .primary-text {
          font-size: 1.1rem;
          font-weight: 500;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        
        .secondary-text {
          font-size: 0.9rem;
          color: #718096;
        }
        
        .selected-file {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(17, 153, 142, 0.1);
          border-radius: 12px;
          padding: 1rem;
          border: 1px solid rgba(17, 153, 142, 0.3);
        }
        
        .file-info {
          display: flex;
          align-items: center;
        }
        
        .file-icon {
          width: 40px;
          height: 40px;
          color: #11998e;
          margin-right: 1rem;
        }
        
        .file-details {
          display: flex;
          flex-direction: column;
        }
        
        .file-name {
          font-weight: 500;
          color: #2d3748;
          margin: 0;
          margin-bottom: 0.25rem;
        }
        
        .file-size {
          font-size: 0.85rem;
          color: #718096;
          margin: 0;
        }
        
        .remove-button {
          background: none;
          border: none;
          color: #e53e3e;
          cursor: pointer;
          width: 30px;
          height: 30px;
          padding: 5px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .remove-button:hover {
          background-color: #fed7d7;
        }
        
        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .action-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }
        
        .action-button svg {
          width: 20px;
          height: 20px;
        }
        
        .upload-button {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
          box-shadow: 0 4px 10px rgba(17, 153, 142, 0.3);
        }
        
        .upload-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(17, 153, 142, 0.4);
        }
        
        .upload-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .back-button {
          background: #e2e8f0;
          color: #4a5568;
        }
        
        .back-button:hover {
          background: #cbd5e0;
        }
        
        .status-container {
          margin-bottom: 1.5rem;
        }
        
        .status-message {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 10px;
          font-size: 0.95rem;
        }
        
        .status-message svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }
        
        .error {
          background-color: #fff5f5;
          color: #c53030;
          border: 1px solid #fc8181;
        }
        
        .error svg {
          color: #e53e3e;
        }
        
        .success {
          background-color: #f0fff4;
          color: #276749;
          border: 1px solid #9ae6b4;
        }
        
        .success svg {
          color: #38a169;
        }
        
        .download-section {
          margin-top: 2rem;
          background-color: #f7fafc;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #edf2f7;
        }
        
        .download-title {
          font-size: 1.2rem;
          color: #2d3748;
          margin-top: 0;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .download-title svg {
          width: 20px;
          height: 20px;
          color: #4299e1;
        }
        
        .download-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .download-item {
          margin-bottom: 0.75rem;
        }
        
        .download-item:last-child {
          margin-bottom: 0;
        }
        
        .download-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #4299e1;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .download-link:hover {
          background-color: #ebf8ff;
        }
        
        .download-link svg {
          width: 18px;
          height: 18px;
        }
        
        .response-data {
          margin-top: 2rem;
          background-color: #2d3748;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .response-title {
          background-color: #4a5568;
          color: white;
          padding: 0.75rem 1rem;
          margin: 0;
          font-size: 1rem;
        }
        
        .response-content {
          color: #a0aec0;
          font-family: monospace;
          padding: 1rem;
          margin: 0;
          overflow-x: auto;
          font-size: 0.9rem;
          max-height: 300px;
          overflow-y: auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }
        
        @media (max-width: 640px) {
          .upload-content {
            padding: 1.5rem;
          }
          
          .upload-title {
            font-size: 1.5rem;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .drop-zone {
            padding: 1.5rem;
          }
          
          .upload-icon {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </div>
  );
}