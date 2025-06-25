import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const [userStats, setUserStats] = useState({
    postCount: 0,
    followers: 0,
    verified: false,
    name: '',
  });
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const profileResponse = await api.get('/api/profile');
      const feedResponse = await api.get('/api/feed');
      if (feedResponse.status === 200 && profileResponse.status == 200) {
        const allPosts = feedResponse.data;
        const profile = profileResponse.data;
        setRecentPosts(allPosts.slice(0, 6)); // Show 6 most recent posts

        // Calculate user stats (this would ideally come from a user profile endpoint)
        setUserStats({
          postCount: profile.postCount,
          followers: profile.followers.length,
          verified: profile.verified,
          name: profile.name,
        });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text='Loading your profile...' />;
  }

  return (
    <div className='profile-page'>
      <div className='profile-container'>
        <div className='profile-header'>
          <div className='profile-cover'>
            <div className='cover-gradient'></div>
          </div>

          <div className='profile-info'>
            <div className='profile-avatar-section'>
              <div className='profile-avatar'>
                <span className='avatar-text'>ME</span>
              </div>
              <div className='profile-details'>
                <h1 className='profile-name'>
                  {userStats.name}
                  {userStats.verified && (
                    <span className='verified-badge' title='Verified Account'>
                      ✓
                    </span>
                  )}
                </h1>
                <p className='profile-bio'>
                  Welcome to your social media profile! This is where you can
                  see your activity and manage your account.
                </p>
              </div>
            </div>

            <div className='profile-stats'>
              <div className='stat-item'>
                <div className='stat-number'>{userStats.postCount}</div>
                <div className='stat-label'>Posts</div>
              </div>
              <div className='stat-item'>
                <div className='stat-number'>{userStats.followers}</div>
                <div className='stat-label'>Followers</div>
              </div>
              <div className='stat-item'>
                <div className='stat-number'>42</div>
                <div className='stat-label'>Following</div>
              </div>
            </div>

            <div className='profile-actions'>
              <Link to='/create-post' className='btn btn-primary'>
                Create New Post
              </Link>
              <button className='btn btn-outline' onClick={fetchUserData}>
                Refresh Profile
              </button>
            </div>
          </div>
        </div>

        <div className='profile-content'>
          <div className='content-tabs'>
            <div className='tab-item active'>Recent Posts</div>
          </div>

          <div className='posts-section'>
            {recentPosts.length === 0 ? (
              <div className='empty-posts'>
                <div className='empty-icon'>📝</div>
                <h3>No posts yet</h3>
                <p>Start sharing your thoughts with the community!</p>
                <Link to='/create-post' className='btn btn-primary'>
                  Create Your First Post
                </Link>
              </div>
            ) : (
              <div className='posts-grid'>
                {recentPosts.map((post, index) => (
                  <div key={index} className='post-preview'>
                    <div className='post-preview-header'>
                      <h3 className='post-preview-title'>{post.title}</h3>
                      <span className='post-preview-date'>
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className='post-preview-description'>
                      {post.description.length > 100
                        ? `${post.description.substring(0, 100)}...`
                        : post.description}
                    </p>
                    {post.image && (
                      <div className='post-preview-image'>
                        <img src={post.image} alt={post.title} />
                      </div>
                    )}
                    <div className='post-preview-footer'>
                      <span className='post-stat'>👍 {post.likes || 0}</span>
                      <span className='post-stat'>👎 {post.dislikes || 0}</span>
                      <span className='post-stat'>
                        💬 {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .profile-container {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .profile-header {
          position: relative;
        }

        .profile-cover {
          height: 200px;
          position: relative;
          overflow: hidden;
        }

        .cover-gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .profile-info {
          padding: 2rem;
          position: relative;
        }

        .profile-avatar-section {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 2rem;
          border: 4px solid white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          margin-top: -60px;
          flex-shrink: 0;
        }

        .profile-details {
          flex: 1;
        }

        .profile-name {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .verified-badge {
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .profile-bio {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
        }

        .profile-stats {
          display: flex;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
        }

        .profile-content {
          border-top: 1px solid #e5e7eb;
        }

        .content-tabs {
          display: flex;
          padding: 0 2rem;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .tab-item {
          padding: 1rem 0;
          color: #64748b;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-item.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .posts-section {
          padding: 2rem;
        }

        .empty-posts {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .empty-posts h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .empty-posts p {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .post-preview {
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .post-preview:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .post-preview-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .post-preview-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          flex: 1;
          margin-right: 1rem;
        }

        .post-preview-date {
          color: #6b7280;
          font-size: 0.75rem;
          white-space: nowrap;
        }

        .post-preview-description {
          color: #4b5563;
          line-height: 1.5;
          margin: 0 0 1rem;
        }

        .post-preview-image {
          margin-bottom: 1rem;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .post-preview-image img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .post-preview-footer {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .post-stat {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .profile-container {
            margin: 0 -0.5rem;
            border-radius: 0.5rem;
          }

          .profile-cover {
            height: 150px;
          }

          .profile-info {
            padding: 1.5rem;
          }

          .profile-avatar-section {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .profile-avatar {
            width: 100px;
            height: 100px;
            font-size: 1.75rem;
            margin-top: -50px;
          }

          .profile-name {
            font-size: 1.75rem;
            justify-content: center;
          }

          .profile-stats {
            justify-content: center;
            gap: 2rem;
          }

          .profile-actions {
            justify-content: center;
            flex-wrap: wrap;
          }

          .posts-section {
            padding: 1.5rem;
          }

          .posts-grid {
            grid-template-columns: 1fr;
          }

          .content-tabs {
            padding: 0 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;
