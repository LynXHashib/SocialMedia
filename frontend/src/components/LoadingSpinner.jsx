import React from "react";

const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  const sizeClasses = {
    small: { width: "16px", height: "16px" },
    medium: { width: "32px", height: "32px" },
    large: { width: "48px", height: "48px" },
  };

  return (
    <div className="loading-container">
      <div className="spinner" style={sizeClasses[size]}></div>
      {text && <p className="loading-text">{text}</p>}

      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
        }

        .loading-text {
          margin-top: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
