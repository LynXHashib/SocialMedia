import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/${id}`);

      if (response.status === 200 && response.data) {
        const postData = response.data;

        // Validate and set post data
        setPost(postData);

        // Safely handle comments - ensure it's always an array
        const commentsData = postData.postComments;
        if (Array.isArray(commentsData)) {
          setComments(commentsData);
        } else {
          console.warn('Comments data is not an array:', commentsData);
          setComments([]);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);

      // More specific error handling
      if (error.response?.status === 404) {
        toast.error('Post not found');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to load post');
      }

      navigate('/feed');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLiking || !post) return;

    setIsLiking(true);
    try {
      const response = await api.post(`/api/likepost/${id}`);
      if (response.status === 201) {
        toast.success('Post liked!');
        await fetchPost(); // Refresh post data
      }
    } catch (error) {
      console.error('Like error:', error);
      if (error.response?.status === 409) {
        toast.info('You have already liked this post');
      } else {
        toast.error('Failed to like post');
      }
    } finally {
      setIsLiking(false);
    }
  };

  const handleDislike = async () => {
    if (isDisliking || !post) return;

    setIsDisliking(true);
    try {
      const response = await api.post(`/api/dislikepost/${id}`);
      if (response.status === 201) {
        toast.success('Post disliked!');
        await fetchPost(); // Refresh post data
      }
    } catch (error) {
      console.error('Dislike error:', error);
      if (error.response?.status === 409) {
        toast.info('You have already disliked this post');
      } else {
        toast.error('Failed to dislike post');
      }
    } finally {
      setIsDisliking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      toast.error('Please enter a comment');
      return;
    }

    if (trimmedComment.length > 500) {
      toast.error('Comment is too long (max 500 characters)');
      return;
    }

    setSubmittingComment(true);
    try {
      const response = await api.post(`/api/${id}/comment`, {
        comment: trimmedComment,
      });

      if (response.status === 201) {
        toast.success('Comment added successfully!');
        setCommentText('');
        await fetchPost(); // Refresh to get new comments
      }
    } catch (error) {
      console.error('Comment submission error:', error);

      if (error.response?.status === 400) {
        toast.error('Invalid comment data');
      } else if (error.response?.status === 401) {
        toast.error('Please log in to comment');
      } else {
        toast.error('Failed to add comment');
      }
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Unknown date';
    }
  };

  const getAuthorInitial = (author) => {
    if (!author || typeof author !== 'string') return 'U';
    return author.charAt(0).toUpperCase();
  };

  const safeGetNumber = (value) => {
    if (typeof value === 'number') return value;
    if (Array.isArray(value)) return value.length;
    return 0;
  };

  if (loading) {
    return <LoadingSpinner text='Loading post...' />;
  }

  if (!post) {
    return (
      <div className='error-container'>
        <h2>Post not found</h2>
        <p>The post you're looking for doesn't exist or has been removed.</p>
        <Link
          to='/feed'
          style='text-decoration:none;'
          className='btn btn-primary'
        >
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className='post-detail-page'>
      <div className='post-detail-container'>
        <div className='post-header'>
          <Link to='/feed' className='back-link'>
            ← Back to Feed
          </Link>
        </div>

        <article className='post-content'>
          <div className='post-meta'>
            <div className='author-info'>
              <div className='author-avatar'>
                {getAuthorInitial(post.author)}
              </div>
              <div className='author-details'>
                <h3 className='author-name'>
                  {post.author || 'Unknown Author'}
                </h3>
                <p className='post-date'>{formatDate(post.date)}</p>
              </div>
            </div>
          </div>

          <div className='post-body'>
            <h1 className='post-title'>{post.title || 'Untitled Post'}</h1>
            <p className='post-description'>
              {post.description || 'No description available.'}
            </p>

            {post.image && (
              <div className='post-image-container'>
                <img
                  src={post.image}
                  alt={post.title || 'Post image'}
                  className='post-image'
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className='post-engagement'>
            <div className='engagement-stats'>
              <span className='stat-item'>
                <span className='stat-icon'>👍</span>
                <span className='stat-count'>
                  {safeGetNumber(
                    post.likes || (post.likedby && post.likedby.length)
                  )}{' '}
                  likes
                </span>
              </span>
              <span className='stat-item'>
                <span className='stat-icon'>👎</span>
                <span className='stat-count'>
                  {safeGetNumber(
                    post.dislikes || (post.dislikedby && post.dislikedby.length)
                  )}{' '}
                  dislikes
                </span>
              </span>
              <span className='stat-item'>
                <span className='stat-icon'>💬</span>
                <span className='stat-count'>{comments.length} comments</span>
              </span>
            </div>

            <div className='engagement-actions'>
              <button
                onClick={handleLike}
                disabled={isLiking}
                className='engagement-btn like-btn'
                aria-label='Like this post'
              >
                {isLiking ? <div className='spinner small'></div> : '👍'} Like
              </button>
              <button
                onClick={handleDislike}
                disabled={isDisliking}
                className='engagement-btn dislike-btn'
                aria-label='Dislike this post'
              >
                {isDisliking ? <div className='spinner small'></div> : '👎'}{' '}
                Dislike
              </button>
            </div>
          </div>
        </article>

        <section className='comments-section'>
          <h2 className='comments-title'>Comments ({comments.length})</h2>

          <form onSubmit={handleCommentSubmit} className='comment-form'>
            <div className='comment-input-container'>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder='Share your thoughts on this post...'
                className='comment-input'
                rows='3'
                maxLength='500'
                disabled={submittingComment}
                aria-label='Write a comment'
              />
              <div className='comment-form-footer'>
                <span
                  className={`character-count ${
                    commentText.length > 450 ? 'warning' : ''
                  }`}
                >
                  {commentText.length}/500
                </span>
                <button
                  type='submit'
                  disabled={submittingComment || !commentText.trim()}
                  className='btn btn-primary'
                >
                  {submittingComment ? (
                    <>
                      <div className='spinner'></div>
                      Posting...
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className='comments-list'>
            {comments.length === 0 ? (
              <div className='no-comments'>
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <div key={`comment-${index}`} className='comment-item'>
                  <div className='comment-avatar'>
                    {getAuthorInitial(comment.name)}
                  </div>
                  <div className='comment-content'>
                    <div className='comment-author'>
                      {comment.name || 'Anonymous'}
                    </div>
                    <div className='comment-text'>
                      {comment.comment || 'No comment text'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <style>{`
        .post-detail-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .post-detail-container {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .post-header {
          padding: 1.5rem 2rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .back-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: #2563eb;
        }

        .post-content {
          padding: 2rem;
        }

        .post-meta {
          margin-bottom: 1.5rem;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 1.5rem;
        }

        .author-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .post-date {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0.25rem 0 0;
        }

        .post-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 1rem;
          line-height: 1.3;
        }

        .post-description {
          color: #4b5563;
          font-size: 1.125rem;
          line-height: 1.7;
          margin: 0 0 1.5rem;
        }

        .post-image-container {
          margin: 2rem 0;
          text-align: center;
        }

        .post-image {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .post-engagement {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        .engagement-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-icon {
          font-size: 1.25rem;
        }

        .engagement-actions {
          display: flex;
          gap: 1rem;
        }

        .engagement-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
          color: #6b7280;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .engagement-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #eff6ff;
        }

        .engagement-btn:disabled {
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

        .comments-section {
          padding: 2rem;
          border-top: 1px solid #e5e7eb;
          background: #fafafa;
        }

        .comments-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1.5rem;
        }

        .comment-form {
          margin-bottom: 2rem;
        }

        .comment-input-container {
          background: white;
          border-radius: 0.75rem;
          border: 2px solid #e5e7eb;
          overflow: hidden;
          transition: border-color 0.2s ease;
        }

        .comment-input-container:focus-within {
          border-color: #3b82f6;
        }

        .comment-input {
          width: 100%;
          padding: 1rem;
          border: none;
          outline: none;
          resize: vertical;
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.5;
        }

        .comment-form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .character-count {
          font-size: 0.875rem;
          color: #6b7280;
          transition: color 0.2s ease;
        }

        .character-count.warning {
          color: #f59e0b;
          font-weight: 500;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .no-comments {
          text-align: center;
          padding: 3rem 1rem;
          color: #6b7280;
        }

        .comment-item {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          background: white;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .comment-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6b7280, #9ca3af);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .comment-content {
          flex: 1;
        }

        .comment-author {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .comment-text {
          color: #4b5563;
          line-height: 1.6;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner.small {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-container {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 600px;
          margin: 2rem auto;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .error-container h2 {
          color: #dc2626;
          margin-bottom: 1rem;
        }

        .error-container p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
          text-decoration:none;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .post-detail-container {
            margin: 0 -0.5rem;
            border-radius: 0.5rem;
          }

          .post-header,
          .post-content,
          .comments-section {
            padding: 1.5rem;
          }

          .post-title {
            font-size: 1.75rem;
          }

          .engagement-actions {
            flex-direction: column;
          }

          .engagement-btn {
            justify-content: center;
          }

          .comment-form-footer {
            flex-direction: column;
            gap: 0.75rem;
            align-items: stretch;
          }

          .comment-form-footer .btn {
            width: 100%;
          }

          .engagement-stats {
            gap: 1rem;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default PostDetail;
