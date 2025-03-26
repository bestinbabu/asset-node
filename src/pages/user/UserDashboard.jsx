import { useState, useEffect } from 'react'
import AvailableDevices from './AvailableDevices'
import RequestedDevices from './RequestedDevices'
import ReportFaulty from './ReportFaulty'
import AllocatedResources from './AllocatedResources'
import ReturnDevice from './ReturnDevice'

const initialDeviceData = {
  available: [
    { id: 1, name: 'Laptop', type: 'MacBook Pro', status: 'Available' },
    { id: 2, name: 'Tablet', type: 'iPad Pro', status: 'Available' },
  ],
  allocated: [
    { id: 3, name: 'Phone', type: 'iPhone 15', allocationDate: '2024-03-01' },
  ],
  requested: [
    { id: 4, name: 'Monitor', type: '4K Display', requestDate: '2024-03-10' },
  ],
  faulty: [],
}

const UserDashboard = () => {
  const [deviceData, setDeviceData] = useState(initialDeviceData)
  const [selectedSection, setSelectedSection] = useState('available')

  useEffect(() => {
    // In a real app, you would fetch from API instead of using static data
  }, [])

  const handleRequestDevice = (deviceId, purpose) => {
    setDeviceData((prev) => {
      const updatedDevices = prev.available.map((device) =>
        device.id === deviceId ? { ...device, status: 'Unavailable' } : device
      )

      return {
        ...prev,
        available: updatedDevices,
        requested: [
          ...prev.requested,
          { id: deviceId, purpose, requestDate: new Date().toISOString() },
        ],
      }
    })
  }

  function handleReportFaulty(deviceId, reason) {
    setDeviceData((prev) => ({
      ...prev,
      faulty: [...prev.faulty, { id: Date.now(), deviceId, reason }],
    }))
  }

  function handleReturn(deviceId) {
    setDeviceData((prev) => {
      const returned = prev.allocated.find((d) => d.id === deviceId)
      return {
        ...prev,
        allocated: prev.allocated.filter((d) => d.id !== deviceId),
        available: [...prev.available, { ...returned, status: 'Available' }],
      }
    })
  }

  const sections = {
    available: (
      <AvailableDevices
        devices={deviceData.available}
        onRequestDevice={handleRequestDevice}
      />
    ),
    requested: <RequestedDevices requests={deviceData.requested} />,
    allocated: <AllocatedResources allocated={deviceData.allocated} />,
    report: <ReportFaulty onReport={handleReportFaulty} />,
    return: (
      <ReturnDevice allocated={deviceData.allocated} onReturn={handleReturn} />
    ),
  }

  return (
    <div className="user-dashboard">
      <aside className="sidebar">
        <nav>
          <ul>
            {Object.keys(sections).map((section) => (
              <li key={section} onClick={() => setSelectedSection(section)}>
                <button className={selectedSection === section ? 'active' : ''}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">{sections[selectedSection]}</main>
    </div>
  )
}

export default UserDashboard
