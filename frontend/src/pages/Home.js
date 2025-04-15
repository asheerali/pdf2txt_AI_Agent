import React, { useState } from "react";
import "../styles/home.css"; // We'll keep this import for compatibility but add styles inline
import UnmarkedUpload from "../components/UnmarkedUpload";
import MarkedUpload from "../components/MarkedUpload";

export default function Home() {
  const [uploadType, setUploadType] = useState(null);

  const goBack = () => setUploadType(null);

  return (
    <div className="home-container">
      {!uploadType && (
        <div className="home-content">
          <h1 className="home-title">PDF Question Extractor</h1>
          <div className="button-group">
            <button 
              className="home-button unmarked-button" 
              onClick={() => setUploadType("unmarked")}
            >
              <div className="button-content">
                <div className="button-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 16.5L12 21.5L17 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12.5V21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.39 18.39C21.3653 17.8583 22.1358 17.0169 22.5798 15.9986C23.0239 14.9804 23.1162 13.8432 22.8422 12.7667C22.5682 11.6901 21.9434 10.7355 21.0666 10.0534C20.1898 9.37137 19.1108 9.00072 18 9.00001H16.74C16.4373 7.82926 15.8731 6.74235 15.09 5.82101C14.3069 4.89967 13.3249 4.16786 12.2181 3.68062C11.1114 3.19338 9.90831 2.96337 8.70008 3.00777C7.49185 3.05217 6.30999 3.3703 5.24822 3.93137C4.18645 4.49244 3.27447 5.28091 2.57823 6.23727C1.88198 7.19363 1.41895 8.2916 1.22279 9.44573C1.02663 10.5999 1.10206 11.7829 1.44258 12.9057C1.7831 14.0285 2.38172 15.0648 3.19 15.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="button-text">
                  <span className="button-title">Upload PDF</span>
                  <span className="button-subtitle">Unmarked Questions</span>
                </div>
              </div>
            </button>
            
            <button 
              className="home-button marked-button" 
              onClick={() => setUploadType("marked")}
            >
              <div className="button-content">
                <div className="button-icon">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 16.5L12 21.5L17 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 12.5V21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.39 18.39C21.3653 17.8583 22.1358 17.0169 22.5798 15.9986C23.0239 14.9804 23.1162 13.8432 22.8422 12.7667C22.5682 11.6901 21.9434 10.7355 21.0666 10.0534C20.1898 9.37137 19.1108 9.00072 18 9.00001H16.74C16.4373 7.82926 15.8731 6.74235 15.09 5.82101C14.3069 4.89967 13.3249 4.16786 12.2181 3.68062C11.1114 3.19338 9.90831 2.96337 8.70008 3.00777C7.49185 3.05217 6.30999 3.3703 5.24822 3.93137C4.18645 4.49244 3.27447 5.28091 2.57823 6.23727C1.88198 7.19363 1.41895 8.2916 1.22279 9.44573C1.02663 10.5999 1.10206 11.7829 1.44258 12.9057C1.7831 14.0285 2.38172 15.0648 3.19 15.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11L12 14L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="button-text">
                  <span className="button-title">Upload PDF</span>
                  <span className="button-subtitle">Marked Questions</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {uploadType === "unmarked" && <UnmarkedUpload goBack={goBack} />}
      {uploadType === "marked" && <MarkedUpload goBack={goBack} />}

      {/* Add inline styles */}
      <style jsx>{`
        .home-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          padding: 2rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .home-content {
          width: 100%;
          max-width: 800px;
          padding: 3rem;
          background-color: rgba(255, 255, 255, 0.9);
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          text-align: center;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .home-title {
          font-size: 2.5rem;
          color: #2d3748;
          margin-bottom: 2.5rem;
          font-weight: 700;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 500px;
          margin: 0 auto;
        }

        .home-button {
          position: relative;
          padding: 0;
          background: none;
          border: none;
          cursor: pointer;
          overflow: hidden;
          text-align: left;
          border-radius: 16px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .home-button:hover {
          transform: translateY(-5px);
        }

        .unmarked-button .button-content {
          background: linear-gradient(135deg, #4776E6 0%, #8E54E9 100%);
        }

        .marked-button .button-content {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .button-content {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          color: white;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          position: relative;
          z-index: 1;
          transition: box-shadow 0.3s ease;
        }

        .home-button:hover .button-content {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }

        .button-content:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          opacity: 0;
          z-index: -1;
          transition: opacity 0.3s ease;
          border-radius: 16px;
        }

        .home-button:hover .button-content:before {
          opacity: 1;
        }

        .button-icon {
          width: 50px;
          height: 50px;
          margin-right: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 12px;
        }

        .button-icon svg {
          width: 100%;
          height: 100%;
        }

        .button-text {
          display: flex;
          flex-direction: column;
        }

        .button-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .button-subtitle {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        /* Animation for button hover */
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }

        .home-button:focus {
          outline: none;
        }

        .home-button:focus .button-icon {
          animation: pulse 1.5s infinite;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .home-content {
            padding: 2rem 1.5rem;
          }
          
          .home-title {
            font-size: 2rem;
            margin-bottom: 2rem;
          }
          
          .button-content {
            padding: 1.2rem;
          }
          
          .button-icon {
            width: 40px;
            height: 40px;
            margin-right: 15px;
          }
          
          .button-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}