import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

const Chat = ({ username, onLogout, isDarkTheme, setIsDarkTheme }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState('public');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearedMessages, setClearedMessages] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Load chat history
    loadChatHistory();

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('user_login', username);
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user_joined', (user) => {
      setMessages(prev => [...prev, {
        username: 'System',
        message: `${user} joined the chat`,
        timestamp: new Date(),
        isSystem: true
      }]);
    });

    newSocket.on('user_left', (user) => {
      setMessages(prev => [...prev, {
        username: 'System',
        message: `${user} left the chat`,
        timestamp: new Date(),
        isSystem: true
      }]);
    });

    newSocket.on('user_typing', (user) => {
      setTypingUsers(prev => new Set([...prev, user]));
    });

    newSocket.on('user_stop_typing', (user) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(user);
        return newSet;
      });
    });

    newSocket.on('online_users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.close();
    };
  }, [username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  useEffect(() => {
    if (!socket) return;
    const handleDeleted = ({ messageId }) => {
      setMessages(prev => prev.map(m => m._id === messageId ? { ...m, deleted: true } : m));
    };
    socket.on('message_deleted', handleDeleted);
    return () => socket.off('message_deleted', handleDeleted);
  }, [socket]);

  const loadChatHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      socket.emit('send_message', {
        username: username,
        message: newMessage.trim()
      });
      setNewMessage('');
      
      // Clear typing indicator immediately when message is sent
      socket.emit('stop_typing', username);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', username);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator - increased to 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', username);
      }, 3000);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    handleTyping();
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDateSeparator = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (messageDate > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      return messageDate.toLocaleDateString([], { weekday: 'long' });
    } else {
      return messageDate.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (socket) {
      socket.emit('delete_message', { messageId, username });
    }
  };

  return (
    <div className={`chat-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <div className="chat-header">
        <h2>Real-Time Chat</h2>
        <div className="room-selector">
          <button 
            className={`room-btn ${currentRoom === 'public' ? 'active' : ''}`}
            onClick={() => setCurrentRoom('public')}
          >
            🌍 Public Room
          </button>
          <button 
            className={`room-btn ${currentRoom === 'private' ? 'active' : ''}`}
            onClick={() => setCurrentRoom('private')}
          >
            🔒 Private Room
          </button>
        </div>
        <div className="user-info">
          {clearedMessages && messages.length === 0 && (
            <button className="restore-chat-btn header-restore" onClick={() => setMessages(clearedMessages)}>
              Restore Chat
            </button>
          )}
          <div className="tooltip-container">
            <button 
              className="clear-chat-btn"
              onClick={() => setShowClearConfirm(true)}
              aria-label="Clear chat"
            >
              🧹
            </button>
            <span className="custom-tooltip">Clear chat</span>
            {showClearConfirm && (
              <div className="clear-confirm-dialog">
                <span>Clear your chat?</span>
                <div className="clear-confirm-actions">
                  <button className="confirm-btn" onClick={() => {
                    setClearedMessages(messages);
                    setMessages([]);
                    setShowClearConfirm(false);
                  }}>Yes, clear</button>
                  <button className="cancel-btn" onClick={() => setShowClearConfirm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
          <div className="tooltip-container">
            <button 
              className="theme-toggle-btn"
              onClick={() => setIsDarkTheme(!isDarkTheme)}
              aria-label="Toggle dark/light mode"
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </button>
            <span className="custom-tooltip">{isDarkTheme ? 'Light mode' : 'Dark mode'}</span>
          </div>
          <span className="username">{username}</span>
          <button onClick={onLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      
      <div className="chat-main">
        <div className="sidebar">
          <h3>Online Users ({onlineUsers.length})</h3>
          <div className="online-users-list">
            {onlineUsers.map((user, index) => (
              <div key={index} className="online-user">
                <span className="user-dot"></span>
                {user}
              </div>
            ))}
          </div>
        </div>
        
        <div className="chat-area">
          <div className="messages-container">
            {messages.map((message, index) => {
              const showDateSeparator =
                index === 0 ||
                formatDateSeparator(message.timestamp) !== formatDateSeparator(messages[index - 1].timestamp);
              return (
                <React.Fragment key={index}>
                  {showDateSeparator && (
                    <div className="date-separator">
                      {formatDateSeparator(message.timestamp)}
                    </div>
                  )}
                  <div
                    className={`message ${message.username === username ? 'own-message' : ''} ${message.isSystem ? 'system-message' : ''}`}
                  >
                    {!message.isSystem && (
                      <div className="message-header">
                        <span className="message-username">{message.username}</span>
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                        {message.username === username && !message.deleted && (
                          <button className="delete-btn" title="Delete message" onClick={() => handleDeleteMessage(message._id)}>
                            🗑️
                          </button>
                        )}
                      </div>
                    )}
                    <div className="message-content">
                      {message.deleted ? <span className="deleted-label">This message was deleted</span> : message.message}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          
          {typingUsers.size > 0 && (
            <div className="typing-indicator-container">
              <div className="typing-indicator">
                <span className="typing-text">
                  {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing
                </span>
                <span className="typing-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="message-input-container">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              placeholder="Type your message..."
              className="message-input"
            />
            <button type="submit" className="send-btn">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat; 