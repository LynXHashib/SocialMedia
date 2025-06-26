import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';

const PostCard = ({ post, onPostUpdate, showActions = true }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const handleSinglePost = async () => {
    try {
      const response = await api.get(`/api/${post.id}`);
    } catch (err) {
      console.log(err);
    }
  };
  const handleLike = async () => {
    if (isLiking || !post.id) return;

    setIsLiking(true);
    try {
      const response = await api.post(`/api/likepost/${post.id}`);
      if (response.status === 201) {
        toast.success('Post liked!');
        if (onPostUpdate) {
          onPostUpdate();
        }
      }
    } catch (error) {
      toast.error('Failed to like post');
      console.error('Like error:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (isDisliking || !post.id) return;

    setIsDisliking(true);
    try {
      const response = await api.post(`/api/dislikepost/${post.id}`);
      if (response.status === 201) {
        toast.success('Post disliked!');
        if (onPostUpdate) {
          onPostUpdate();
        }
      }
    } catch (error) {
      toast.error('Failed to dislike post');
      console.error('Dislike error:', error);
    } finally {
      setIsDisliking(false);
    }
  };

  return (
    <article className='post-card'>
      <div className='post-header'>
        <div className='post-author-info'>
          <div className='author-avatar'>
            {post.author ? post.author.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className='author-details'>
            <h3 className='author-name'>{post.author || 'Unknown Author'}</h3>
            <p className='post-date'>{formatDate(post.date)}</p>
          </div>
        </div>
      </div>

      <div className='post-content'>
        <Link style={{ textDecoration: 'none' }} to={`/post/${post.id}`}>
          <h2 className='post-title' style={{ textDecoration: 'none' }}>
            {post.title}
          </h2>
        </Link>
        <p className='post-description'>{post.description}</p>
        <Link to={`/post/${post.id}`}>
          {post.image && (
            <div className='post-image-container'>
              <img
                src={post.image}
                alt={post.title}
                className='post-image'
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}{' '}
        </Link>
      </div>

      {showActions && (
        <div className='post-actions'>
          <div className='post-stats'>
            <span className='stat-item'>
              <span className='stat-icon'>👍</span>
              <span className='stat-count'>{post.likes || 0}</span>
            </span>
            <span className='stat-item'>
              <span className='stat-icon'>👎</span>
              <span className='stat-count'>{post.dislikes || 0}</span>
            </span>
            <span className='stat-item'>
              <span className='stat-icon'>💬</span>
              <span className='stat-count'>{post.comments || 0}</span>
            </span>
          </div>

          <div className='action-buttons'>
            <button
              onClick={handleLike}
              disabled={isLiking}
              className='action-btn like-btn'
            >
              {isLiking ? <div className='spinner small'></div> : '👍'} Like
            </button>
            <button
              onClick={handleDislike}
              disabled={isDisliking}
              className='action-btn dislike-btn'
            >
              {isDisliking ? <div className='spinner small'></div> : '👎'}{' '}
              Dislike
            </button>
            {post.id && (
              <Link to={`/post/${post.id}`} className='action-btn comment-btn'>
                💬 Comment
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        .post-card {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition:
            box-shadow 0.2s ease,
            transform 0.2s ease;
        }

        .post-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .post-header {
          padding: 1.5rem 1.5rem 0;
        }

        .post-author-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .author-details {
          flex: 1;
        }

        .author-name {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .post-date {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0.25rem 0 0;
        }

        .post-content {
          padding: 1rem 1.5rem;
        }

        .post-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.75rem;
          line-height: 1.4;
          text-decoration:none;
        }

        .post-description {
          color: #4b5563;
          line-height: 1.6;
          margin: 0 0 1rem;
        }

        .post-image-container {
          margin-top: 1rem;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .post-image {
          width: 100%;
          height: auto;
          max-height: 400px;
          object-fit: cover;
          display: block;
        }

        .post-actions {
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid #f1f5f9;
          background: #fafafa;
        }

        .post-stats {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .stat-icon {
          font-size: 1rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
          color: #6b7280;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #eff6ff;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .like-btn:hover:not(:disabled) {
          border-color: #10b981;
          color: #10b981;
          background: #ecfdf5;
        }

        .dislike-btn:hover:not(:disabled) {
          border-color: #f59e0b;
          color: #f59e0b;
          background: #fffbeb;
        }

        .comment-btn:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
          background: #faf5ff;
        }

        .spinner.small {
          width: 14px;
          height: 14px;
          border-width: 2px;
        }

        @media (max-width: 768px) {
          .post-card {
            margin: 0 -0.5rem;
            border-radius: 0.5rem;
          }

          .post-header,
          .post-content,
          .post-actions {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            justify-content: center;
          }
        }
      `}</style>
    </article>
  );
};

export default PostCard;
