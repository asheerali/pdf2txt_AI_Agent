import React, { useState } from "react";
import "../styles/home.css";
import UnmarkedUpload from "../components/UnmarkedUpload";
import MarkedUpload from "../components/MarkedUpload";

export default function Home() {
  const [uploadType, setUploadType] = useState(null);

  const goBack = () => setUploadType(null);

  return (
    <div className="home-container">
      {!uploadType && (
        <div className="button-group">
          <button className="home-button" onClick={() => setUploadType("unmarked")}>
            Upload PDF (Unmarked Questions)
          </button>
          <button className="home-button" onClick={() => setUploadType("marked")}>
            Upload PDF (Marked Questions)
          </button>
        </div>
      )}

      {uploadType === "unmarked" && <UnmarkedUpload goBack={goBack} />}
      {uploadType === "marked" && <MarkedUpload goBack={goBack} />}
    </div>
  );
}
