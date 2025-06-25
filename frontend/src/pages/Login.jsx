import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '', // Can be username or email
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    // Determine if identifier is email or username
    const isEmail = formData.identifier.includes('@');
    const loginData = {
      password: formData.password,
      ...(isEmail
        ? { email: formData.identifier }
        : { name: formData.identifier }),
    };

    const result = await login(loginData);

    if (result.success) {
      toast.success(result.message);
      navigate('/feed');
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <div className='auth-card'>
          <div className='auth-header'>
            <h1 className='auth-title'>Welcome Back</h1>
            <p className='auth-description'>
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className='auth-form'>
            <div className='form-group'>
              <label htmlFor='identifier' className='form-label'>
                Username or Email
              </label>
              <input
                type='text'
                id='identifier'
                name='identifier'
                value={formData.identifier}
                onChange={handleChange}
                className='form-input'
                placeholder='Enter your username or email'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password' className='form-label'>
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='form-input'
                placeholder='Enter your password'
                required
              />
            </div>

            <button
              type='submit'
              className='btn btn-primary auth-submit-btn'
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className='spinner'></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className='auth-footer'>
            <p className='auth-switch'>
              Don't have an account?{' '}
              <Link to='/register' className='auth-link'>
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        <div className='auth-illustration'>
          <div className='illustration-content'>
            <h2>Join the Conversation</h2>
            <p>
              Connect with friends, share your thoughts, and discover amazing
              content in our vibrant community.
            </p>
            <div className='illustration-features'>
              <div className='feature-highlight'>
                <span className='feature-icon'>🔐</span>
                <span>Secure Login</span>
              </div>
              <div className='feature-highlight'>
                <span className='feature-icon'>⚡</span>
                <span>Instant Access</span>
              </div>
              <div className='feature-highlight'>
                <span className='feature-icon'>🌟</span>
                <span>Amazing Experience</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 42px;
        }

        .auth-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1000px;
          width: 100%;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin: 0 1rem;
        }

        .auth-card {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .auth-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .auth-description {
          color: #64748b;
          font-size: 1rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .auth-submit-btn {
          width: 100%;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.875rem;
          margin-top: 0.5rem;
        }

        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .auth-switch {
          color: #64748b;
          margin: 0;
        }

        .auth-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        .auth-illustration {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .illustration-content {
          text-align: center;
          max-width: 400px;
        }

        .illustration-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .illustration-content p {
          font-size: 1.125rem;
          opacity: 0.9;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .illustration-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .feature-highlight {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1rem;
          font-weight: 500;
        }

        .feature-icon {
          font-size: 1.25rem;
        }

        @media (max-width: 768px) {
          .auth-container {
            grid-template-columns: 1fr;
            margin: 0 0.5rem;
          }

          .auth-illustration {
            order: -1;
            padding: 2rem;
          }

          .auth-card {
            padding: 2rem;
          }

          .auth-title {
            font-size: 1.75rem;
          }

          .illustration-content h2 {
            font-size: 1.5rem;
          }

          .illustration-content p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
