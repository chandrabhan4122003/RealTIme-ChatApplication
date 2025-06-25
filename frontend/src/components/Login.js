import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, isDarkTheme }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className={`login-container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <div className="login-card">
        <h1>Welcome to Chat App</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 