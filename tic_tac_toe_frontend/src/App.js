import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import './App.css';
import AuthProvider, { useAuth } from './components/AuthProvider';
import Login from './components/Login';
import Signup from './components/Signup';
import GameBoard from './components/GameBoard';
import GameHistory from './components/GameHistory';
import Profile from './components/Profile';

/** Minimal top bar nav */
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-title">Tic Tac Track</Link>
      <div className="navbar-links">
        {user && (
          <>
            <Link to="/">Play</Link>
            <Link to="/history">History</Link>
            <Link to="/profile">Profile</Link>
            <button className="btn btn-logout" onClick={() => {logout(); navigate('/login');}}>Logout</button>
          </>
        )}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

/** App routes and layout */
function AppShell() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch theme`}>
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
      <Router>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<RequireAuth><GameBoard /></RequireAuth>} />
            <Route path="/history" element={<RequireAuth><GameHistory /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

// PUBLIC_INTERFACE
function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// PUBLIC_INTERFACE
function App() {
  // Wrap routes in AuthProvider context
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
