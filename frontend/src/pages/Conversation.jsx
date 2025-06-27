import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../api';
import { useAuth } from '../auth/auth';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  withCredentials: true,
});

const Conversation = () => {
  const { id: otherUserId } = useParams();
  const { user, loading } = useAuth();
  const myUserId = user._id;
  if (loading || !myUserId) {
    return <div>Loading...</div>;
  }

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  // Fetch conversation history
  useEffect(() => {
    if (!otherUserId) return;
    api
      .get(`/api/messages/${otherUserId}`)
      .then((res) => setMessages(res.data.messages))
      .catch(() => setMessages([]));
  }, [otherUserId]);

  // Register user and listen for messages
  useEffect(() => {
    if (!myUserId) return;
    socket.emit('register-user', myUserId);

    const handler = (msg) => {
      if (
        (msg.sender === myUserId && msg.recipient === otherUserId) ||
        (msg.sender === otherUserId && msg.recipient === myUserId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('private-message', handler);

    return () => {
      socket.off('private-message', handler);
    };
  }, [myUserId, otherUserId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      _id: Date.now(), // Temporary ID
      sender: myUserId,
      recipient: otherUserId,
      text: input,
    };
    setMessages((prev) => [...prev, newMsg]);
    socket.emit('private-message', {
      toUserId: otherUserId,
      fromUserId: myUserId,
      message: input,
    });
    setInput('');
  };

  return (
    <div
      className='conversation-page'
      style={{
        maxWidth: 600,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 8px #eee',
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        height: '70vh',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {messages.map((msg, i) => {
          // Support both string and object for sender
          const senderId =
            typeof msg.sender === 'object'
              ? msg.sender._id || msg.sender.id
              : msg.sender;
          const isMine = String(senderId) === String(myUserId);

          return (
            <div
              key={msg._id || i}
              style={{
                textAlign: isMine ? 'right' : 'left',
                margin: '8px 0',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: isMine ? '#3b82f6' : '#e5e7eb',
                  color: isMine ? 'white' : '#222',
                  borderRadius: 16,
                  padding: '8px 16px',
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div
        style={{
          display: 'flex',
          padding: 8,
          borderTop: '1px solid #eee',
          background: '#fafbfc',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1,
            borderRadius: 20,
            border: '1px solid #d1d5db',
            padding: '10px 16px',
            fontSize: 16,
            outline: 'none',
            background: '#f3f4f6',
            marginRight: 8,
            transition: 'border 0.2s',
          }}
          placeholder='Type a message...'
        />
        <button
          onClick={sendMessage}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 20,
            padding: '0 20px',
            fontSize: 18,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 8px #e0e7ef33',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = '#2563eb')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#3b82f6')}
        >
          <span>Send</span>
          <span role='img' aria-label='send'>
            ✈️
          </span>
        </button>
      </div>
    </div>
  );
};

export default Conversation;
