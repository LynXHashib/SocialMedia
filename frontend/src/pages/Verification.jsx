import React from "react";
import { Link } from "react-router-dom";

const Verification = () => {
  return (
    <div className="verification-page">
      <div className="verification-container">
        <div className="verification-icon">📧</div>
        <h1 className="verification-title">Check Your Email</h1>
        <p className="verification-message">
          We've sent a verification link to your email address. Please check
          your inbox and click the link to verify your account.
        </p>

        <div className="verification-instructions">
          <h3>Next Steps:</h3>
          <ol>
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the verification link in the email</li>
            <li>Return here and sign in to your account</li>
          </ol>
        </div>

        <div className="verification-actions">
          <Link to="/login" className="btn btn-primary">
            Go to Sign In
          </Link>
          <Link to="/register" className="btn btn-outline">
            Back to Registration
          </Link>
        </div>

        <div className="verification-help">
          <p className="help-text">
            Didn't receive the email? Check your spam folder or try registering
            again.
          </p>
        </div>
      </div>

      <style jsx>{`
        .verification-page {
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .verification-container {
          max-width: 500px;
          text-align: center;
          background: white;
          padding: 3rem;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .verification-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .verification-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .verification-message {
          font-size: 1.125rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .verification-instructions {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .verification-instructions h3 {
          color: #1e293b;
          margin-bottom: 1rem;
          font-size: 1.125rem;
        }

        .verification-instructions ol {
          color: #64748b;
          line-height: 1.6;
          padding-left: 1.25rem;
        }

        .verification-instructions li {
          margin-bottom: 0.5rem;
        }

        .verification-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .verification-help {
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .help-text {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }

        @media (max-width: 768px) {
          .verification-container {
            padding: 2rem;
            margin: 0 0.5rem;
          }

          .verification-title {
            font-size: 1.75rem;
          }

          .verification-message {
            font-size: 1rem;
          }

          .verification-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Verification;
