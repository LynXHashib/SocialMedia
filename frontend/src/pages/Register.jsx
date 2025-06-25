import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../auth/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
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

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.gender
    ) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    const registrationData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
    };

    const result = await register(registrationData);

    if (result.success) {
      toast.success(result.message);
      navigate('/verification');
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className='auth-page'>
      <div className='auth-container'>
        <div className='auth-illustration'>
          <div className='illustration-content'>
            <h2>Start Your Journey</h2>
            <p>
              Join thousands of users sharing their stories, connecting with
              friends, and discovering amazing content every day.
            </p>
            <div className='illustration-features'>
              <div className='feature-highlight'>
                <span className='feature-icon'>🎉</span>
                <span>Free to Join</span>
              </div>
              <div className='feature-highlight'>
                <span className='feature-icon'>👥</span>
                <span>Growing Community</span>
              </div>
              <div className='feature-highlight'>
                <span className='feature-icon'>🔒</span>
                <span>Privacy Protected</span>
              </div>
            </div>
          </div>
        </div>

        <div className='auth-card'>
          <div className='auth-header'>
            <h1 className='auth-title'>Create Account</h1>
            <p className='auth-description'>
              Join our community and start sharing
            </p>
          </div>

          <form onSubmit={handleSubmit} className='auth-form'>
            <div className='form-group'>
              <label htmlFor='name' className='form-label'>
                Username
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='form-input'
                placeholder='Choose a unique username'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='email' className='form-label'>
                Email Address
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='form-input'
                placeholder='Enter your email address'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='gender' className='form-label'>
                Gender
              </label>
              <select
                id='gender'
                name='gender'
                value={formData.gender}
                onChange={handleChange}
                className='form-select'
                required
              >
                <option value=''>Select your gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
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
                placeholder='Create a strong password'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='confirmPassword' className='form-label'>
                Confirm Password
              </label>
              <input
                type='password'
                id='confirmPassword'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                className='form-input'
                placeholder='Confirm your password'
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className='auth-footer'>
            <p className='auth-switch'>
              Already have an account?{' '}
              <Link to='/login' className='auth-link'>
                Sign in here
              </Link>
            </p>
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
          border-radius:35px;
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
          margin-bottom: 2rem;
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
          gap: 1.25rem;
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
          margin-top: 1.5rem;
          padding-top: 1.5rem;
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
          background: linear-gradient(135deg, #10b981, #3b82f6);
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

export default Register;
