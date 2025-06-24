import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/auth';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className='home-page'>
      <div className='hero-section'>
        <div className='hero-content'>
          <h1 className='hero-title'>
            Connect with friends and the world around you
          </h1>
          <p className='hero-description'>
            Share your thoughts, discover amazing content, and build meaningful
            connections in our vibrant social media community.
          </p>

          {!isAuthenticated ? (
            <div className='hero-actions'>
              <Link to='/register' className='btn btn-primary hero-btn'>
                Get Started
              </Link>
              <Link to='/login' className='btn btn-outline hero-btn'>
                Sign In
              </Link>
            </div>
          ) : (
            <div className='hero-actions'>
              <Link to='/feed' className='btn btn-primary hero-btn'>
                View Feed
              </Link>
              <Link to='/create-post' className='btn btn-outline hero-btn'>
                Create Post
              </Link>
            </div>
          )}
        </div>

        <div className='hero-image'>
          <div className='feature-cards'>
            <div className='feature-card'>
              <div className='feature-icon'>📱</div>
              <h3>Share</h3>
              <p>Post photos, thoughts, and moments</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>💬</div>
              <h3>Connect</h3>
              <p>Comment and engage with others</p>
            </div>
            <div className='feature-card'>
              <div className='feature-icon'>❤️</div>
              <h3>Discover</h3>
              <p>Find content you love</p>
            </div>
          </div>
        </div>
      </div>

      <div className='features-section'>
        <div className='container'>
          <h2 className='section-title'>Why Choose Our Platform?</h2>
          <div className='features-grid'>
            <div className='feature-item'>
              <div className='feature-icon-large'>🔒</div>
              <h3>Secure & Private</h3>
              <p>
                Your data is protected with enterprise-grade security and
                privacy controls.
              </p>
            </div>
            <div className='feature-item'>
              <div className='feature-icon-large'>🌟</div>
              <h3>Engaging Experience</h3>
              <p>
                Beautiful, intuitive interface designed for meaningful social
                interactions.
              </p>
            </div>
            <div className='feature-item'>
              <div className='feature-icon-large'>🚀</div>
              <h3>Fast & Reliable</h3>
              <p>
                Lightning-fast performance with 99.9% uptime for uninterrupted
                social experience.
              </p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .home-page {
          min-height: calc(100vh - 120px);
        }

        .hero-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 4rem 0;
          min-height: 600px;
        }

        .hero-content {
          max-width: 500px;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.2;
          color: #1e293b;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #1e293b, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.125rem;
          color: #64748b;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-btn {
          padding: 0.875rem 2rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .hero-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .feature-cards {
          display: grid;
          gap: 1.5rem;
          max-width: 400px;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .features-section {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          padding: 5rem 0;
          margin-top: 4rem;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .feature-item {
          text-align: center;
          padding: 2rem;
        }

        .feature-icon-large {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .feature-item h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .feature-item p {
          color: #64748b;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .hero-section {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
            padding: 3rem 0;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-actions {
            justify-content: center;
          }

          .feature-cards {
            grid-template-columns: 1fr;
            max-width: 300px;
          }

          .features-section {
            padding: 3rem 0;
          }

          .section-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
