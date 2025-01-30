import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CalendarClass from './components/ClassComponents/CalendarClass';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated on component mount
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <nav style={{ 
            padding: '20px', 
            textAlign: 'right',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <span style={{ marginRight: '20px', color: '#666' }}>
              Welcome, {JSON.parse(localStorage.getItem('user'))?.username || 'User'}!
            </span>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </nav>
        )}
        <Routes>
          <Route path="/login" element={
            <div className="auth-page">
              {!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
            </div>
          } />
          <Route path="/signup" element={
            <div className="auth-page">
              {!isAuthenticated ? <Signup setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
            </div>
          } />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CalendarClass />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
