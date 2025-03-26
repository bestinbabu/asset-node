import { useState, useEffect } from 'react'
import { getDatabase, ref, get } from 'firebase/database'

const UserDashboard = () => {
  const [deviceTypes, setDeviceTypes] = useState([])
  const [osTypes, setOsTypes] = useState([])
  const [availableDevices, setAvailableDevices] = useState([])
  const [selectedDeviceType, setSelectedDeviceType] = useState('')
  const [selectedOsType, setSelectedOsType] = useState('')
  const [requestedDevices, setRequestedDevices] = useState([])
  const [allocatedDevices, setAllocatedDevices] = useState([])
  const [faultyDevices, setFaultyDevices] = useState([])

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

  const handleRequestDevice = (deviceId, purpose) => {
    console.log(`Requesting device ${deviceId} for purpose: ${purpose}`)
    setRequestedDevices([
      ...requestedDevices,
      { id: deviceId, purpose, requestDate: new Date().toISOString() },
    ])
  }

  const handleReportFaulty = (deviceId, reason) => {
    setFaultyDevices([...faultyDevices, { id: Date.now(), deviceId, reason }])
  }

  const handleReturnDevice = (deviceId) => {
    setAllocatedDevices(
      allocatedDevices.filter((device) => device.id !== deviceId)
    )
    setAvailableDevices([
      ...availableDevices,
      { id: deviceId, status: 'Available' },
    ])
  }

  return (
    <div className="user-dashboard">
      <h2>Device Management</h2>
      <label>Device Type:</label>
      <select onChange={(e) => setSelectedDeviceType(e.target.value)}>
        <option value="">Select Device Type</option>
        {deviceTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {selectedDeviceType && (
        <>
          <label>OS Type:</label>
          <select onChange={(e) => setSelectedOsType(e.target.value)}>
            <option value="">Select OS Type</option>
            {osTypes.map((os) => (
              <option key={os} value={os}>
                {os}
              </option>
            ))}
          </select>
        </>
      )}

      {selectedDeviceType && selectedOsType && (
        <div>
          <h3>Available Devices</h3>
          <ul>
            {availableDevices.map((device) => (
              <li key={device.id}>
                {device.name} - {device.type}
                <button
                  onClick={() => handleRequestDevice(device.id, 'General Use')}
                >
                  Request
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3>Requested Devices</h3>
      <ul>
        {requestedDevices.map((device) => (
          <li key={device.id}>
            {device.id} - Requested on {device.requestDate}
          </li>
        ))}
      </ul>

      <h3>Allocated Devices</h3>
      <ul>
        {allocatedDevices.map((device) => (
          <li key={device.id}>
            {device.id}
            <button onClick={() => handleReturnDevice(device.id)}>
              Return
            </button>
          </li>
        ))}
      </ul>

      <h3>Report Faulty Device</h3>
      <button onClick={() => handleReportFaulty(1, 'Screen Issue')}>
        Report Faulty
      </button>

      <h3>Faulty Devices</h3>
      <ul>
        {faultyDevices.map((device) => (
          <li key={device.id}>
            {device.deviceId} - {device.reason}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserDashboard
