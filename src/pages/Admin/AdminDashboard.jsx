// src/pages/Admin/AdminDashboard.jsx
import React, { useState } from 'react';
import DeviceRegistration from './DeviceRegistration';
import ApprovalRequests from './ApprovalRequests';
import DeviceMonitoring from './DeviceMonitoring';
import MaintenanceSection from './MaintenanceSection';
import DeviceDeregistration from './DeviceDeregistration';

const AdminDashboard = () => {
  // Set the default active section (for example, Device Registration)
  const [activeSection, setActiveSection] = useState('registration');

  // Function to render the active component
  const renderSection = () => {
    switch (activeSection) {
      case 'registration':
        return <DeviceRegistration />;
      case 'approval':
        return <ApprovalRequests />;
      case 'monitoring':
        return <DeviceMonitoring />;
      case 'maintenance':
        return <MaintenanceSection />;
      case 'deregistration':
        return <DeviceDeregistration />;
      default:
        return <DeviceRegistration />;
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <aside style={styles.sidebar}>
        <h2>Admin Dashboard</h2>
        <nav>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <button
                style={activeSection === 'registration' ? styles.activeButton : styles.button}
                onClick={() => setActiveSection('registration')}
              >
                Device Registration
              </button>
            </li>
            <li style={styles.navItem}>
              <button
                style={activeSection === 'approval' ? styles.activeButton : styles.button}
                onClick={() => setActiveSection('approval')}
              >
                Approval Requests
              </button>
            </li>
            <li style={styles.navItem}>
              <button
                style={activeSection === 'monitoring' ? styles.activeButton : styles.button}
                onClick={() => setActiveSection('monitoring')}
              >
                Device Monitoring
              </button>
            </li>
            <li style={styles.navItem}>
              <button
                style={activeSection === 'maintenance' ? styles.activeButton : styles.button}
                onClick={() => setActiveSection('maintenance')}
              >
                Maintenance
              </button>
            </li>
            <li style={styles.navItem}>
              <button
                style={activeSection === 'deregistration' ? styles.activeButton : styles.button}
                onClick={() => setActiveSection('deregistration')}
              >
                Device Deregistration
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main style={styles.mainContent}>
        {renderSection()}
      </main>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f7f7f7',
    padding: '1rem',
    borderRight: '1px solid #ccc',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  navItem: {
    marginBottom: '1rem',
  },
  button: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  activeButton: {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#282c34',
    color: '#fff',
    border: '1px solid #282c34',
    borderRadius: '4px',
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
  },
};

export default AdminDashboard;
