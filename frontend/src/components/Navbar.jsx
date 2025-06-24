import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import { toast } from 'react-toastify';
import logo from '/logo.svg';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-brand'>
          <img
            src={logo}
            alt='Logo'
            style={{ height: '60px', width: '100px' }}
          />
          <h1>SocialMedia</h1>
        </Link>

        <div className='navbar-menu'>
          {isAuthenticated ? (
            <>
              <Link
                to='/feed'
                className={`navbar-link ${isActive('/feed') ? 'active' : ''}`}
              >
                Feed
              </Link>
              <Link
                to='/create-post'
                className={`navbar-link ${
                  isActive('/create-post') ? 'active' : ''
                }`}
              >
                Create Post
              </Link>
              <Link
                to='/profile'
                className={`navbar-link ${
                  isActive('/profile') ? 'active' : ''
                }`}
              >
                Profile
              </Link>
              <button onClick={handleLogout} className='btn btn-outline'>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link to='/register' className='btn btn-primary'>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background-color: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .navbar-brand {
          text-decoration: none;
          color: #1e293b;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .navbar-brand h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .navbar-link {
          text-decoration: none;
          color: #6b7280;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        .navbar-link:hover {
          color: #3b82f6;
          background-color: #f1f5f9;
        }

        .navbar-link.active {
          color: #3b82f6;
          background-color: #eff6ff;
        }

        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 0.75rem;
          }

          .navbar-menu {
            gap: 0.75rem;
          }

          .navbar-link {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
          }

          .navbar-brand h1 {
            font-size: 1.25rem;
          }
          
          .navbar-brand img {
            height: 32px !important;
            width: 48px !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
