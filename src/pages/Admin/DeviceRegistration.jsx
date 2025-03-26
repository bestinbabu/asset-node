// src/pages/Admin/DeviceRegistration.jsx
import React, { useState } from 'react';

const DeviceRegistration = () => {
  const [deviceType, setDeviceType] = useState('');
  const [subType, setSubType] = useState('');

  const handleDeviceTypeChange = (e) => {
    setDeviceType(e.target.value);
    setSubType(''); // Reset subtype when device type changes
  };

  const handleSubTypeChange = (e) => {
    setSubType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement Firebase or backend integration to register the device
    console.log("Registering Device:", deviceType, subType);
  };

  const renderSubTypeDropdown = () => {
    if (deviceType === 'laptop') {
      return (
        <select value={subType} onChange={handleSubTypeChange}>
          <option value="">Select Laptop Type</option>
          <option value="mac">Mac</option>
          <option value="linux">Linux</option>
          <option value="windows">Windows</option>
        </select>
      );
    } else if (deviceType === 'mobile') {
      return (
        <select value={subType} onChange={handleSubTypeChange}>
          <option value="">Select Mobile Type</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
        </select>
      );
    } else if (deviceType === 'tablet') {
      return (
        <select value={subType} onChange={handleSubTypeChange}>
          <option value="">Select Tablet Type</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
        </select>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Device Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Device Type: </label>
          <select value={deviceType} onChange={handleDeviceTypeChange}>
            <option value="">Select Device Type</option>
            <option value="laptop">Laptop</option>
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>
        <div style={{ marginTop: '1rem' }}>
          {renderSubTypeDropdown()}
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Register Device</button>
      </form>
    </div>
  );
};

export default DeviceRegistration;
