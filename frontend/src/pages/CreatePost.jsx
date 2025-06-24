import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Handle image preview
    if (name === 'image') {
      setPreviewImage(value);
    }
  };

  const handleImageError = () => {
    setPreviewImage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please fill in title and description');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        ...(formData.image.trim() && { image: formData.image.trim() }),
      };

      const response = await api.post('/api/post', postData);

      if (response.status === 201) {
        toast.success('Post created successfully!');
        navigate('/feed');
      } else {
        toast.error(response.data.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Create post error:', error);
      toast.error(error.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/feed');
  };

  return (
    <div className='create-post-page'>
      <div className='create-post-container'>
        <div className='create-post-header'>
          <h1 className='page-title'>Create New Post</h1>
          <p className='page-subtitle'>
            Share your thoughts with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className='create-post-form'>
          <div className='form-section'>
            <div className='form-group'>
              <label htmlFor='title' className='form-label'>
                Title *
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
                className='form-input'
                placeholder="What's your post about?"
                maxLength='100'
                required
              />
              <div className='character-count'>
                {formData.title.length}/100 characters
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='description' className='form-label'>
                Description *
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                className='form-input form-textarea'
                placeholder='Share your thoughts, experiences, or ideas...'
                rows='6'
                maxLength='1000'
                required
              />
              <div className='character-count'>
                {formData.description.length}/1000 characters
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='image' className='form-label'>
                Image URL (Optional)
              </label>
              <input
                type='url'
                id='image'
                name='image'
                value={formData.image}
                onChange={handleChange}
                className='form-input'
                placeholder='https://example.com/image.jpg'
              />
              <div className='input-help'>
                Paste a link to an image to include it in your post
              </div>
            </div>

            {previewImage && (
              <div className='image-preview-section'>
                <label className='form-label'>Image Preview</label>
                <div className='image-preview-container'>
                  <img
                    src={previewImage}
                    alt='Preview'
                    className='image-preview'
                    onError={handleImageError}
                  />
                </div>
              </div>
            )}
          </div>

          <div className='form-actions'>
            <button
              type='button'
              onClick={handleCancel}
              className='btn btn-secondary'
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={
                isSubmitting ||
                !formData.title.trim() ||
                !formData.description.trim()
              }
            >
              {isSubmitting ? (
                <>
                  <div className='spinner'></div>
                  Creating Post...
                </>
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .create-post-page {
          max-width: 700px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .create-post-container {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .create-post-header {
          padding: 2rem 2rem 1rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          text-align: center;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }

        .page-subtitle {
          font-size: 1.125rem;
          opacity: 0.9;
          margin: 0;
        }

        .create-post-form {
          padding: 2rem;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .character-count {
          text-align: right;
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .input-help {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .image-preview-section {
          margin-top: 0.5rem;
        }

        .image-preview-container {
          border: 2px dashed #d1d5db;
          border-radius: 0.5rem;
          padding: 1rem;
          text-align: center;
        }

        .image-preview {
          max-width: 100%;
          max-height: 300px;
          border-radius: 0.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .form-actions .btn {
          min-width: 120px;
        }

        @media (max-width: 768px) {
          .create-post-container {
            margin: 0 -0.5rem;
            border-radius: 0.5rem;
          }

          .create-post-header {
            padding: 1.5rem;
          }

          .page-title {
            font-size: 1.75rem;
          }

          .page-subtitle {
            font-size: 1rem;
          }

          .create-post-form {
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .form-actions .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CreatePost;
