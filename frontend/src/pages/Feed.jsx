import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get('/api/feed');
      if (response.status === 200) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchPosts(true);
  };

  if (loading) {
    return <LoadingSpinner text='Loading your feed...' />;
  }

  return (
    <div className='feed-page'>
      <div className='feed-header'>
        <div className='feed-title-section'>
          <h1 className='feed-title'>Your Feed</h1>
          <p className='feed-subtitle'>
            Discover what's happening in your community
          </p>
        </div>

        <div className='feed-actions'>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className='btn btn-outline refresh-btn'
          >
            {refreshing ? (
              <>
                <div className='spinner small'></div>
                Refreshing...
              </>
            ) : (
              <>🔄 Refresh</>
            )}
          </button>
          <Link to='/create-post' className='btn btn-primary'>
            ✏️ Create Post
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className='empty-feed'>
          <div className='empty-feed-icon'>📝</div>
          <h3 className='empty-feed-title'>No posts yet</h3>
          <p className='empty-feed-message'>
            Be the first to share something with the community!
          </p>
          <Link to='/create-post' className='btn btn-primary'>
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className='posts-grid'>
          {posts.map((post, index) => (
            <PostCard
              key={post._id || index}
              post={post}
              onPostUpdate={handleRefresh}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .feed-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .feed-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .feed-title-section {
          flex: 1;
        }

        .feed-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem;
        }

        .feed-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }

        .feed-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spinner.small {
          width: 14px;
          height: 14px;
          border-width: 2px;
        }

        .posts-grid {
          display: grid;
          gap: 1.5rem;
        }

        .empty-feed {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .empty-feed-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .empty-feed-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.75rem;
        }

        .empty-feed-message {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          .feed-header {
            flex-direction: column;
            gap: 1.5rem;
            align-items: stretch;
          }

          .feed-actions {
            justify-content: space-between;
          }

          .feed-title {
            font-size: 1.75rem;
          }

          .posts-grid {
            gap: 1rem;
          }

          .empty-feed {
            padding: 3rem 1.5rem;
          }

          .empty-feed-title {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Feed;
