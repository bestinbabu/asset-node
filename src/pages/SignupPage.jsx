// src/pages/SignupPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore Methods

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role = user
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Store User Data in Firestore (Different collection for User/Admin)
      const collectionName = role === "admin" ? "admin" : "users"; // Choose collection
      await setDoc(doc(db, collectionName, user.uid), {
        uid: user.uid,
        name,
        email,
        role,
        createdAt: new Date(),
      });

      console.log("User signed up successfully!");
      navigate("/"); // Redirect after successful signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        Back
      </button>

      <h2>Sign Up</h2>
      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSignup} style={styles.form}>
        <input 
          type="text" 
          placeholder="Full Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
          required
        />
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
        
        {/* Role Selection Dropdown */}
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          style={styles.input} 
          required
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={styles.button}>Sign Up</button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/user-login">User Login</Link> or <Link to="/admin-login">Admin Login</Link>
      </p>
    </div>
  );
};

const styles = {
  container: { 
    padding: "2rem", 
    textAlign: "center", 
    position: "relative" 
  },
  backButton: {
    position: "absolute",
    top: "1rem", // Set to 1rem to match AdminLoginPage
    left: "1rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    width: "300px",
  },
  button: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "red",
    margin: "1rem 0",
  },
};

export default SignupPage;
