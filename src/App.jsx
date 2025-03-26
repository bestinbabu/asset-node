// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/Home/HomePage'; // Your existing homepage
import UserLoginPage from './pages/UserLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/user/UserDashboard';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user-login" element={<UserLoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          {/* Admin Dashboard Route */}
          <Route path="/admin-dashboard" element={<div style={{ padding: "2rem", textAlign: "center" }}>Admin Dashboard Page (Under Construction)</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
