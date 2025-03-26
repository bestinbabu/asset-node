// src/pages/Home/FeaturesSection.js
import React from 'react';

const FeaturesSection = () => {
  return (
    <section style={styles.features}>
      <h3>Our Key Features</h3>
      <ul>
        <li>Real-time Asset Tracking</li>
        <li>Predictive Maintenance Alerts</li>
        <li>Immutable Asset History with Blockchain</li>
        <li>Seamless HR Integration for Onboarding/Offboarding</li>
      </ul>
    </section>
  );
};

const styles = {
  features: {
    padding: '2rem',
    backgroundColor: '#fff',
    textAlign: 'left'
  }
};

export default FeaturesSection;
