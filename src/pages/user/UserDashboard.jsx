import { useState, useEffect } from 'react'
import { getDatabase, ref, get, push, set, update } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const UserDashboard = () => {
  const [deviceTypes, setDeviceTypes] = useState([])
  const [osTypes, setOsTypes] = useState([])
  const [availableDevices, setAvailableDevices] = useState([])
  const [selectedDeviceType, setSelectedDeviceType] = useState('')
  const [selectedOsType, setSelectedOsType] = useState('')
  const [userDevices, setUserDevices] = useState([])
  const [loading, setLoading] = useState(false)
  
  const auth = getAuth()
  const userId = auth.currentUser?.uid

  // Fetch available device types from 'devices'
  useEffect(() => {
    const fetchDeviceTypes = async () => {
      const db = getDatabase()
      const deviceTypesRef = ref(db, 'devices')
      const snapshot = await get(deviceTypesRef)
      console.log('iojnijnoijnomomokm+'+snapshot);
      if (snapshot.exists()) {
        // Device types are the keys of the "devices" object (e.g., "laptops", "mobilephones")
        setDeviceTypes(Object.keys(snapshot.val()))
      }
    }
    fetchDeviceTypes()
  }, [])

  // When a device type is selected, fetch the OS types under that type
  useEffect(() => {
    if (selectedDeviceType) {
      const fetchOsTypes = async () => {
        const db = getDatabase()
        const osTypesRef = ref(db, `devices/${selectedDeviceType}/types`)
        const snapshot = await get(osTypesRef)
        if (snapshot.exists()) {
          setOsTypes(Object.keys(snapshot.val()))
        } else {
          setOsTypes([])
        }
        // Reset OS type and available devices on device type change
        setSelectedOsType('')
        setAvailableDevices([])
      }
      fetchOsTypes()
    }
  }, [selectedDeviceType])

  // When both device type and OS type are selected, fetch available devices
  useEffect(() => {
    if (selectedDeviceType && selectedOsType) {
      const fetchAvailableDevices = async () => {
        setLoading(true)
        const db = getDatabase()
        // Construct the path using the OS type; e.g., if selectedOsType is 'linux',
        // the devices are under 'linuxdevices'
        const devicesRef = ref(db, `devices/${selectedDeviceType}/types/${selectedOsType}/${selectedOsType}devices`)
        const snapshot = await get(devicesRef)
        if (snapshot.exists()) {
          const devicesData = snapshot.val()
          const available = Object.entries(devicesData)
            .filter(([key, device]) => device.availability)
            .map(([id, device]) => ({
              id,
              ...device,
              deviceType: selectedDeviceType,
              osType: selectedOsType
            }))
          setAvailableDevices(available)
        } else {
          setAvailableDevices([])
        }
        setLoading(false)
      }
      fetchAvailableDevices()
    }
  }, [selectedDeviceType, selectedOsType])

  // Fetch the devices currently assigned to the user
  useEffect(() => {
    if (userId) {
      const fetchUserDevices = async () => {
        const db = getDatabase()
        const userRef = ref(db, `users/${userId}/devices`)
        const snapshot = await get(userRef)
        if (snapshot.exists()) {
          // We assume the user's devices are stored as an array of objects:
          // e.g., [{ id: 'device123', deviceType: 'laptops', osType: 'linux' }, ...]
          setUserDevices(snapshot.val())
        } else {
          setUserDevices([])
        }
      }
      fetchUserDevices()
    }
  }, [userId])

  // Handle a device request: prompt for purpose and push a new request to the "requests" collection
  const handleRequestDevice = async (device) => {
    const purpose = prompt('Please enter the purpose for this request:')
    if (!purpose) return

    try {
      const db = getDatabase()
      const requestsRef = ref(db, 'requests')
      const newRequestRef = push(requestsRef)
      
      await set(newRequestRef, {
        userId,
        deviceId: device.id,
        deviceType: device.deviceType,
        osType: device.osType,
        purpose,
        requestDate: new Date().toISOString(),
        status: 'pending'
      })

      alert('Request submitted successfully!')
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Failed to submit request. Please try again.')
    }
  }

  // Handle releasing a device: update device availability and remove it from the user's list
  const handleReleaseDevice = async (device) => {
    if (!window.confirm('Are you sure you want to release this device?')) return

    try {
      const db = getDatabase()
      
      // Use the stored deviceType and osType for this device to update the correct path
      const deviceRef = ref(
        db,
        `devices/${device.deviceType}/types/${device.osType}/${device.osType}devices/${device.id}`
      )
      await update(deviceRef, { availability: true })
      
      // Remove the device from the user's list in the database
      const userDevicesRef = ref(db, `users/${userId}/devices`)
      const snapshot = await get(userDevicesRef)
      if (snapshot.exists()) {
        // Filter out the released device based on its id
        const updatedDevices = snapshot.val().filter(d => d.id !== device.id)
        await set(userDevicesRef, updatedDevices)
      }
      
      // Update local state
      setUserDevices(prev => prev.filter(d => d.id !== device.id))
      setAvailableDevices(prev => [...prev, { ...device, availability: true }])
      
      alert('Device released successfully!')
    } catch (error) {
      console.error('Error releasing device:', error)
      alert('Failed to release device. Please try again.')
    }
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

      {loading && <p>Loading devices...</p>}

      {selectedDeviceType && selectedOsType && !loading && (
        <div className="available-devices">
          <h3>
            Available {selectedDeviceType} Devices ({selectedOsType})
          </h3>
          {availableDevices.length > 0 ? (
            <ul>
              {availableDevices.map((device) => (
                <li key={device.id}>
                  <span>
                    {device.configuration?.model || 'Device'} - 
                    {device.configuration?.ram || 'N/A'} RAM - 
                    {device.configuration?.storage || 'N/A'} Storage
                  </span>
                  <button
                    onClick={() => handleRequestDevice(device)}
                    className="request-btn"
                  >
                    Request Device
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No available devices found for the selected criteria.</p>
          )}
        </div>
      )}

      {userDevices.length > 0 && (
        <div className="user-devices">
          <h3>Your Assigned Devices</h3>
          <ul>
            {userDevices.map((device) => (
              <li key={device.id}>
                <span>
                  Device ID: {device.id} ({device.deviceType} / {device.osType})
                </span>
                <button
                  onClick={() => handleReleaseDevice(device)}
                  className="release-btn"
                >
                  Release Device
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default UserDashboard
