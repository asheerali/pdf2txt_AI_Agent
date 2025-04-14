import React from "react";
import "../styles/home.css"; // Assuming you have a CSS file for styling

export default function Home() {
  return (
    <div className="home-container">
      <div className="button-group">
        <button className="home-button">
          Upload PDF (without marked question)
        </button>
        <button className="home-button">
          Upload PDF (with marked question)
        </button>
      </div>
    </div>
  );
}
