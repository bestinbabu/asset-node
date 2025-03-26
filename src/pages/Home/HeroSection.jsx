// src/pages/Home/HeroSection.js
import React from 'react';

const HeroSection = () => {
  return (
    <section style={styles.hero}>
      <h2>Welcome to Your Asset Management Hub</h2>
      <p>Track, manage, and optimize your company assets efficiently.</p>
    </section>
  );
};

const styles = {
  hero: {
    padding: '2rem',
    backgroundColor: '#f0f0f0',
    textAlign: 'center'
  }
};

export default HeroSection;
