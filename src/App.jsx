// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/Home/HomePage';
import UserLoginPage from './pages/UserLoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import SignupPage from './pages/SignupPage';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import FooterSection from './pages/Home/FooterSection';

function App() {
  return (
    <Router>
      <div style={styles.appContainer}>
        <Header />
        <div style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user-login" element={<UserLoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
        <FooterSection />
      </div>
    </Router>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // Full viewport height
  },
  mainContent: {
    flex: 1, // Takes up remaining space
  },
};

export default App;
