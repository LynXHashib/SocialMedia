import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../auth/auth';

function Messages() {
  const { user } = useAuth();
  const myUserId = user?._id;
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get('/api/users')
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <>
      <style>
        {`
          @media (max-width: 600px) {
            .messages-page {
              max-width: 100vw !important;
              min-height: 100vh !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              padding: 0 !important;
            }
            .user-list-item {
              flex-direction: row !important;
              padding: 10px 8px !important;
              margin: 8px 0 !important;
            }
            .user-list-item .user-avatar {
              width: 36px !important;
              height: 36px !important;
              font-size: 18px !important;
              margin-right: 10px !important;
            }
            .user-list-item a {
              font-size: 18px !important;
            }
          }
        `}
      </style>
      <div
        className='messages-page'
        style={{
          maxWidth: 600,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 8px #eee',
          minHeight: 400,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 28, marginBottom: 24 }}>Start a Conversation</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {users
            .filter((u) => u._id !== myUserId)
            .map((u) => (
              <li
                key={u._id}
                className='user-list-item'
                style={{
                  margin: '12px 0',
                  padding: '12px 18px',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f3f4f6',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  boxShadow: '0 1px 4px #e0e7ef33',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#e0e7ef';
                  e.currentTarget.style.boxShadow = '0 2px 8px #e0e7ef66';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.boxShadow = '0 1px 4px #e0e7ef33';
                }}
              >
                <div
                  className='user-avatar'
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#3b82f6',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    marginRight: 18,
                    flexShrink: 0,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {u.name?.[0] || '?'}
                </div>
                <Link
                  to={`/conversation/${u._id}`}
                  style={{
                    textDecoration: 'none',
                    color: '#222',
                    fontWeight: 600,
                    fontSize: 20,
                    flex: 1,
                    padding: '8px 0',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#2563eb')}
                  onMouseOut={(e) => (e.currentTarget.style.color = '#222')}
                >
                  {u.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default Messages;
