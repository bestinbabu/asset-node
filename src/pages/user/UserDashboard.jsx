import { useState, useEffect } from 'react'
import { getDatabase, ref, get } from 'firebase/database'

const UserDashboard = () => {
  const [deviceTypes, setDeviceTypes] = useState([])
  const [osTypes, setOsTypes] = useState([])
  const [availableDevices, setAvailableDevices] = useState([])
  const [selectedDeviceType, setSelectedDeviceType] = useState('')
  const [selectedOsType, setSelectedOsType] = useState('')
  const [requestedDevices, setRequestedDevices] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase()
      const deviceTypesRef = ref(db, 'deviceTypes')
      const osTypesRef = ref(db, 'osTypes')

      const deviceTypesSnap = await get(deviceTypesRef)
      const osTypesSnap = await get(osTypesRef)

      setDeviceTypes(deviceTypesSnap.exists() ? deviceTypesSnap.val() : [])
      setOsTypes(osTypesSnap.exists() ? osTypesSnap.val() : [])
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (selectedDeviceType && selectedOsType) {
      const fetchDevices = async () => {
        const db = getDatabase()
        const devicesRef = ref(
          db,
          `devices/${selectedDeviceType}/${selectedOsType}`
        )
        const devicesSnap = await get(devicesRef)
        setAvailableDevices(devicesSnap.exists() ? devicesSnap.val() : [])
      }
      fetchDevices()
    }
  }, [selectedDeviceType, selectedOsType])

  const handleRequestDevice = (deviceId) => {
    const purpose = prompt('Please enter the purpose for this request:')
    if (!purpose) return

    setRequestedDevices([
      ...requestedDevices,
      {
        id: deviceId,
        purpose,
        requestDate: new Date().toLocaleString(),
      },
    ])
  }

  return (
    <div className="user-dashboard">
      <h2>Device Management</h2>

      <div className="selection-filters">
        <div className="filter-group">
          <label>Device Type:</label>
          <select
            value={selectedDeviceType}
            onChange={(e) => setSelectedDeviceType(e.target.value)}
          >
            <option value="">Select Device Type</option>
            {deviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {selectedDeviceType && (
          <div className="filter-group">
            <label>OS Type:</label>
            <select
              value={selectedOsType}
              onChange={(e) => setSelectedOsType(e.target.value)}
            >
              <option value="">Select OS Type</option>
              {osTypes.map((os) => (
                <option key={os} value={os}>
                  {os}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedDeviceType && selectedOsType && (
        <div className="available-devices">
          <h3>
            Available {selectedDeviceType} Devices ({selectedOsType})
          </h3>
          <ul>
            {availableDevices.map((device) => (
              <li key={device.id}>
                <span>
                  {device.name} - {device.specs?.ram || 'N/A'} RAM
                </span>
                <button
                  onClick={() => handleRequestDevice(device.id)}
                  className="request-btn"
                >
                  Request Device
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {requestedDevices.length > 0 && (
        <div className="requested-devices">
          <h3>Your Requested Devices</h3>
          <ul>
            {requestedDevices.map((device) => (
              <li key={device.id}>
                <strong>Device ID:</strong> {device.id}
                <br />
                <strong>Purpose:</strong> {device.purpose}
                <br />
                <strong>Request Date:</strong> {device.requestDate}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
