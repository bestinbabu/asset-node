// src/pages/user/UserDashboard.js
import { useState, useEffect } from 'react'
import AvailableDevices from './AvailableDevices'
import RequestedDevices from './RequestedDevices'
import ReportFaulty from './ReportFaulty'
import AllocatedResources from './AllocatedResources'
import ReturnDevice from './ReturnDevice'

// Sample JSON data structure (could be moved to separate file)
const initialDeviceData = {
  available: [
    { id: 1, name: 'Laptop', type: 'MacBook Pro', status: 'available' },
    { id: 2, name: 'Tablet', type: 'iPad Pro', status: 'available' },
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

  // Load from JSON file (example using useEffect - replace with actual API call)
  useEffect(() => {
    // In real app, you would fetch from API or import JSON file
    // fetch('/data/devices.json').then(res => res.json()).then(setDeviceData)
  }, [])

  const sections = {
    available: <AvailableDevices devices={deviceData.available} />,
    requested: <RequestedDevices requests={deviceData.requested} />,
    allocated: <AllocatedResources allocated={deviceData.allocated} />,
    report: <ReportFaulty onReport={handleReportFaulty} />,
    return: (
      <ReturnDevice allocated={deviceData.allocated} onReturn={handleReturn} />
    ),
  }

  function handleReportFaulty(deviceId, reason) {
    // Update device status logic
    setDeviceData((prev) => ({
      ...prev,
      faulty: [...prev.faulty, { id: Date.now(), deviceId, reason }],
    }))
  }

  function handleReturn(deviceId) {
    // Move device from allocated to available
    setDeviceData((prev) => {
      const returned = prev.allocated.find((d) => d.id === deviceId)
      return {
        ...prev,
        allocated: prev.allocated.filter((d) => d.id !== deviceId),
        available: [...prev.available, returned],
      }
    })
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
