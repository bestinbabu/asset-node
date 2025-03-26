import { useState } from 'react'

const AvailableDevices = ({ devices, onRequestDevice }) => {
  const [showPopup, setShowPopup] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [purpose, setPurpose] = useState('')

  const handleRequestClick = (device) => {
    setSelectedDevice(device)
    setShowPopup(true)
  }

  const handleRequestSubmit = () => {
    if (selectedDevice && purpose.trim()) {
      onRequestDevice(selectedDevice.id, purpose)
      setShowPopup(false)
      setPurpose('')
    }
  }

  return (
    <div className="available-devices">
      <h2>Available Devices</h2>
      <table>
        <thead>
          <tr>
            <th>Device</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
              <td>{device.name}</td>
              <td>{device.status}</td>
              <td>
                {device.status === 'Available' ? (
                  <button onClick={() => handleRequestClick(device)}>
                    Request
                  </button>
                ) : (
                  <span>Unavailable</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Request Device</h3>
            <p>Device: {selectedDevice?.name}</p>
            <label>
              Purpose:
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </label>
            <div className="popup-buttons">
              <button onClick={handleRequestSubmit}>Request</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AvailableDevices
