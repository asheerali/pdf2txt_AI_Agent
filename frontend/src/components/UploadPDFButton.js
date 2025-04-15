// components/ChoosePDFButton.js
import React from "react";

export default function ChoosePDFButton({ onClick }) {
  return (
    <button className="home-button" onClick={onClick}>
      Process PDF
    </button>
  );
}
