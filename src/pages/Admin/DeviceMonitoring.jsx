// src/pages/Admin/DeviceMonitoring.jsx
import React from 'react';

const DeviceMonitoring = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Device Monitoring</h2>
      <p>Graphical overview of device allocation, usage, and available stock.</p>
      {/* Future: Integrate a chart library (e.g., Chart.js, Recharts) */}
      <div style={{
        border: '1px solid #ccc', 
        padding: '1rem', 
        marginTop: '1rem',
        textAlign: 'center'
      }}>
        [Graph or Chart Placeholder]
      </div>
    </div>
  );
};

export default DeviceMonitoring;
