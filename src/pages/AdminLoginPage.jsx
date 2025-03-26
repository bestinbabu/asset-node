// src/pages/AdminLoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Integrate Firebase Auth for admin login
    console.log("Admin login:", email, password);
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>Back</button>

      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

const styles = {
  container: { 
    padding: '2rem',
    textAlign: 'center'
  },
  backButton: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    width: '300px'
  },
  button: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer'
  }
};

export default AdminLoginPage;
