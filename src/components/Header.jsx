// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={styles.header}>
      <h1>Asset Management System</h1>
      <nav>
        <ul style={styles.navList}>
          <li style={styles.navItem}>
            <Link to="/user-login" style={styles.navLink}>User Login</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/admin-login" style={styles.navLink}>Admin Login</Link>
          </li>
          <li style={styles.navItem}>
            <Link to="/signup" style={styles.navLink}>Sign Up</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    padding: '1rem',
    backgroundColor: '#282c34',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    margin: 0,
    padding: 0
  },
  navItem: {
    marginLeft: '1rem'
  },
  navLink: {
    color: '#61dafb',
    textDecoration: 'none'
  }
};

export default Header;
