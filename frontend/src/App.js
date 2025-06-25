import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Load username from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('chat_username');
    if (savedUser) setUsername(savedUser);
  }, []);

  const handleLogin = (user) => {
    setUsername(user);
    localStorage.setItem('chat_username', user);
  };

  const handleLogout = () => {
    setUsername('');
    localStorage.removeItem('chat_username');
  };

  return (
    <div className={`App ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {!username ? (
        <Login onLogin={handleLogin} isDarkTheme={isDarkTheme} />
      ) : (
        <Chat 
          username={username} 
          onLogout={handleLogout} 
          isDarkTheme={isDarkTheme}
          setIsDarkTheme={setIsDarkTheme}
        />
      )}
    </div>
  );
}

export default App;
