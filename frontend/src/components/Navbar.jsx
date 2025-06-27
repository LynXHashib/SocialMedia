import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/auth';
import { toast } from 'react-toastify';
import logo from '/logo.svg';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = () => setMenuOpen(false);

  return (
    <nav className='navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-brand' onClick={handleMenuClose}>
          <img
            src={logo}
            alt='Logo'
            style={{ height: '60px', width: '100px' }}
          />
          <h1>SocialMedia</h1>
        </Link>

        {/* Hamburger Icon */}
        <button
          className={`navbar-toggle${menuOpen ? ' open' : ''}`}
          onClick={handleMenuToggle}
          aria-label='Toggle menu'
        >
          <span />
          <span />
          <span />
        </button>

        {/* Responsive Menu */}
        <div className={`navbar-menu${menuOpen ? ' open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link
                to='/feed'
                className={`navbar-link ${isActive('/feed') ? 'active' : ''}`}
                onClick={handleMenuClose}
              >
                Feed
              </Link>
              <Link
                to='/create-post'
                className={`navbar-link ${
                  isActive('/create-post') ? 'active' : ''
                }`}
                onClick={handleMenuClose}
              >
                Create Post
              </Link>
              <Link
                to='/profile'
                className={`navbar-link ${
                  isActive('/profile') ? 'active' : ''
                }`}
                onClick={handleMenuClose}
              >
                Profile
              </Link>
              <Link
                to='/messages'
                className={`navbar-link ${
                  isActive('/messages') ? 'active' : ''
                }`}
                onClick={handleMenuClose}
              >
                Messenger
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  handleMenuClose();
                }}
                className='btn btn-outline'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                onClick={handleMenuClose}
              >
                Login
              </Link>
              <Link
                to='/register'
                className='btn btn-primary'
                onClick={handleMenuClose}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
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
          position: relative;
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

        .navbar-toggle {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          cursor: pointer;
          z-index: 200;
        }
        .navbar-toggle span {
          display: block;
          width: 28px;
          height: 3px;
          margin: 4px 0;
          background: #3b82f6;
          border-radius: 2px;
          transition: 0.3s;
        }
        .navbar-toggle.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .navbar-toggle.open span:nth-child(2) {
          opacity: 0;
        }
        .navbar-toggle.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
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

        @media (max-width: 1024px) {
          .navbar-toggle {
            display: flex;
          }
          .navbar-menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
            padding: 2.5rem 0 1rem 0;
            border-bottom-left-radius: 1rem;
            border-bottom-right-radius: 1rem;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            display: none;
            z-index: 999;
          }
          .navbar-menu.open {
            display: flex;
          }
          .navbar-link,
          .btn {
            width: 100%;
            text-align: left;
            padding: 0.75rem 1.5rem;
            font-size: 1.1rem;
          }
          .navbar-container {
            padding: 0 0.75rem;
          }
          .navbar-brand h1 {
            font-size: 1.25rem;
          }
          .navbar-brand img {
            height: 32px !important;
            width: 48px !important;
          }
        }

        @media (max-width: 600px) {
          .navbar-menu {
            padding-top: 3.5rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
