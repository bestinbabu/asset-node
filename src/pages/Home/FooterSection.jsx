// src/pages/Home/FooterSection.js
import React from 'react';

const FooterSection = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Asset Management System. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    padding: '1rem',
    backgroundColor: '#282c34',
    color: '#fff',
    textAlign: 'center'
  }
};

export default FooterSection;
