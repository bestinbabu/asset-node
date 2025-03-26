// src/pages/AdminLoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Import Firestore DB
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Firestore Methods

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user is in the "admin" collection
      const adminRef = doc(db, "admin", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        throw new Error("Access Denied: You are not an admin.");
      }

      console.log("Admin logged in successfully!");
      navigate("/admin-dashboard"); // Redirect to Admin Dashboard
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>Back</button>
      <h2>Admin Login</h2>
      {error && <p style={styles.error}>{error}</p>}
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
    textAlign: 'center',
    position: 'relative'
  },
  backButton: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    padding: '0.5rem 1rem',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    margin: '1rem 0'
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
