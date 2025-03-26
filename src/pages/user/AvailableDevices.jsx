const AvailableDevices = ({ devices }) => {
  return (
    <div className="section">
      <h2>Available Devices ({devices.length})</h2>
      <div className="device-list">
        {devices.map((device) => (
          <div key={device.id} className="device-card">
            <h3>{device.name}</h3>
            <p>Type: {device.type}</p>
            <p>Status: {device.status}</p>
            <button>Request Device</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AvailableDevices
