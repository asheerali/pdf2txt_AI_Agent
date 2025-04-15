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
    <>
      <div className="button-group">
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <ChoosePDFButton onClick={handleChooseFile} />
        <UploadPDFButton
          onClick={handleUpload}
          loading={status === "loading"}
        />
      </div>

      {selectedFile && (
        <div className="file-preview">
          <span>{selectedFile.name}</span>
          <button className="remove-button" onClick={handleRemoveFile}>
            ❌
          </button>
        </div>
      )}

      <div className="button-group">
        <button className="home-button" onClick={goBack}>
          Back to Home
        </button>
      </div>

      <div className="status-message">
        {status === "no_file" && <p className="error">⚠️ No file selected.</p>}
        {status === "loading" && <p>⏳ Uploading file...</p>}
        {status === "success" && (
          <p className="success">✅ Response: {JSON.stringify(responseData)}</p>
        )}
        {status === "error" && (
          <p className="error">❌ Upload failed. Try again.</p>
        )}
      </div>

      {combinedFiles.length > 0 && (
        <div className="combined-files">
          <h3>📁 Download Combined Files</h3>
          <ul>
            {combinedFiles.map((fileName) => (
              <li key={fileName}>
                <a
                  href={`http://localhost:8000/download/${fileName}`}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ⬇️ {fileName}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
