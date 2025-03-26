// src/pages/UserDashboard.jsx
import { useState, useEffect } from "react";
import { 
  getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, increment 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const UserDashboard = () => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [osTypes, setOsTypes] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState("");
  const [selectedOsType, setSelectedOsType] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allocatedDevices, setAllocatedDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const db = getFirestore();

  // If no user is logged in, show a loading message
  if (!userId) {
    return <p>Loading user...</p>;
  }

  // Fetch available device types from the "devices" collection.
  useEffect(() => {
    const fetchDeviceTypes = async () => {
      try {
        const devicesCol = collection(db, "devices");
        const querySnapshot = await getDocs(devicesCol);
        const types = [];
        querySnapshot.forEach((docSnap) => {
          types.push(docSnap.id); // e.g., "laptops", "mobilephones"
        });
        console.log("Fetched device types:", types);
        setDeviceTypes(types);
      } catch (error) {
        console.error("Error fetching device types:", error);
      }
    };
    fetchDeviceTypes();
  }, [db]);

  // When a device type is selected, fetch the OS types under that type.
  useEffect(() => {
    if (selectedDeviceType) {
      const fetchOsTypes = async () => {
        try {
          const osCol = collection(db, "devices", selectedDeviceType, "types");
          const querySnapshot = await getDocs(osCol);
          const osArray = [];
          querySnapshot.forEach((docSnap) => {
            osArray.push(docSnap.id);
          });
          console.log(`Fetched OS types for ${selectedDeviceType}:`, osArray);
          setOsTypes(osArray);
          // Reset OS type and available devices on device type change
          setSelectedOsType("");
          setAvailableDevices([]);
        } catch (error) {
          console.error("Error fetching OS types:", error);
          setOsTypes([]);
        }
      };
      fetchOsTypes();
    }
  }, [db, selectedDeviceType]);

  // When both device type and OS type are selected, fetch available devices.
  useEffect(() => {
    if (selectedDeviceType && selectedOsType) {
      const fetchAvailableDevices = async () => {
        setLoading(true);
        try {
          // Path: /devices/{deviceType}/types/{osType}/{osType}devices
          const devicesCol = collection(
            db,
            "devices",
            selectedDeviceType,
            "types",
            selectedOsType,
            `${selectedOsType}devices`
          );
          const querySnapshot = await getDocs(devicesCol);
          const available = [];
          querySnapshot.forEach((docSnap) => {
            const device = docSnap.data();
            if (device.availability) {
              available.push({
                id: docSnap.id,
                ...device,
                deviceType: selectedDeviceType,
                osType: selectedOsType,
              });
            }
          });
          console.log(`Fetched available devices for ${selectedDeviceType}/${selectedOsType}:`, available);
          setAvailableDevices(available);
        } catch (error) {
          console.error("Error fetching available devices:", error);
          setAvailableDevices([]);
        }
        setLoading(false);
      };
      fetchAvailableDevices();
    }
  }, [db, selectedDeviceType, selectedOsType]);

  // Fetch the pending requests for the current user from the "requests" collection.
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const requestsCol = collection(db, "requests");
        const querySnapshot = await getDocs(requestsCol);
        const userRequests = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // Only include requests from current user with pending status (or no status)
          if (data.from === userId && (!data.status || data.status === "pending")) {
            userRequests.push({ id: docSnap.id, status: data.status || "pending", ...data });
          }
        });
        console.log("Fetched pending requests for user:", userRequests);
        setPendingRequests(userRequests);
      } catch (error) {
        console.error("Error fetching pending requests:", error);
      }
    };
    fetchPendingRequests();
  }, [db, userId]);

  // Fetch the user's allocated devices (currently in use) from the "users" collection.
  useEffect(() => {
    const fetchAllocatedDevices = async () => {
      try {
        const userDocRef = doc(db, "users", userId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          console.log("Fetched allocated devices:", userSnap.data().allocatedDevices);
          setAllocatedDevices(userSnap.data().allocatedDevices || []);
        } else {
          setAllocatedDevices([]);
        }
      } catch (error) {
        console.error("Error fetching allocated devices:", error);
        setAllocatedDevices([]);
      }
    };
    fetchAllocatedDevices();
  }, [db, userId]);

  // Handle a device request: prompt for purpose and add a new document to the "requests" collection.
  const handleRequestDevice = async (device) => {
    const purpose = prompt("Please enter the purpose for this request:");
    if (!purpose) return;

    try {
      const data = {
        deviceSpec: {
          id: device.id,
          deviceType: device.deviceType,
          osType: device.osType,
          model: device.configuration?.model || "Device",
        },
        from: userId,
        purpose: purpose,
        status: "pending",
      };
      console.log("Submitting request with data:", data);
      await addDoc(collection(db, "requests"), data);
      alert("Request submitted successfully!");
      // Optionally, refetch pending requests here.
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    }
  };

  // Handle releasing a device (if still needed; optional section).
  const handleReleaseDevice = async (device) => {
    if (!window.confirm("Are you sure you want to release this device?")) return;

    try {
      const deviceDocRef = doc(
        db,
        "devices",
        device.deviceType,
        "types",
        device.osType,
        `${device.osType}devices`,
        device.id
      );
      await updateDoc(deviceDocRef, { availability: true });
      console.log(`Device ${device.id} availability set to true.`);

      // Update user's devices array (if stored in the "devices" field; optional).
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const currentDevices = userSnap.data().devices || [];
        const updatedDevices = currentDevices.filter((d) => d.id !== device.id);
        await updateDoc(userDocRef, { devices: updatedDevices });
        console.log("User document updated with new devices list.");
      }
      alert("Device released successfully!");
    } catch (error) {
      console.error("Error releasing device:", error);
      alert("Failed to release device. Please try again.");
    }
  };

  // Handle deallocation of an allocated device.
  const handleDeallocateDevice = async (device) => {
    if (!window.confirm("Are you sure you want to deallocate this device?")) return;
    try {
      // 1. Update the unique device document: set availability to true.
      const deviceDocRef = doc(
        db,
        "devices",
        device.deviceType,
        "types",
        device.osType,
        `${device.osType}devices`,
        device.deviceId  // allocatedDevices stores deviceId instead of id.
      );
      await updateDoc(deviceDocRef, { availability: true });
      console.log(`Device ${device.deviceId} availability set to true.`);

      // 2. Update the parent OS document's count: increment by 1.
      const osDocRef = doc(
        db,
        "devices",
        device.deviceType,
        "types",
        device.osType
      );
      await updateDoc(osDocRef, { count: increment(1) });
      console.log(`Count in ${device.deviceType}/types/${device.osType} increased by 1.`);

      // 3. Update the user's document: remove the device from allocatedDevices.
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
      let currentAllocated = [];
      if (userSnap.exists()) {
        currentAllocated = userSnap.data().allocatedDevices || [];
      }
      const updatedAllocated = currentAllocated.filter(
        (d) => d.deviceId !== device.deviceId
      );
      await updateDoc(userDocRef, { allocatedDevices: updatedAllocated });
      console.log("User document updated; device removed from allocatedDevices.");

      // 4. Update local state.
      setAllocatedDevices(updatedAllocated);
      alert("Device deallocated successfully!");
    } catch (error) {
      console.error("Error deallocating device:", error);
      alert("Failed to deallocate device. Please try again.");
    }
  };

  return (
    <div className="user-dashboard" style={{ padding: "2rem" }}>
      <h2>Device Management</h2>
      
      {/* Device Selector Section */}
      <div className="selection-filters" style={{ marginBottom: "1rem" }}>
        <div className="filter-group">
          <label>Device Type: </label>
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
            <label>OS Type: </label>
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
      
      {/* Available Devices Section */}
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
                    {device.configuration?.model || "Device"} -{" "}
                    {device.configuration?.ram || "8gb"} RAM -{" "}
                    {device.configuration?.storage || "44 tb"} Storage
                  </span>
                  <button
                    onClick={() => handleRequestDevice(device)}
                    style={{ marginLeft: "1rem" }}
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

      {/* Pending Requests Section */}
      <div className="pending-requests" style={{ marginTop: "2rem" }}>
        <h3>Your Pending Requests</h3>
        {pendingRequests.length > 0 ? (
          <ul>
            {pendingRequests.map((req) => (
              <li key={req.id} style={{ border: "1px solid #ccc", padding: "0.5rem", marginBottom: "0.5rem" }}>
                <p>
                  <strong>Device Spec:</strong> {JSON.stringify(req.deviceSpec)}
                </p>
                <p>
                  <strong>Purpose:</strong> {req.purpose}
                </p>
                <p>
                  <strong>Status:</strong> {req.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no pending requests.</p>
        )}
      </div>

      {/* Allocated Devices Section */}
      <div className="allocated-devices" style={{ marginTop: "2rem" }}>
        <h3>Currently Allocated Devices</h3>
        {allocatedDevices.length > 0 ? (
          <ul>
            {allocatedDevices.map((device, index) => (
              <li key={index} style={{ border: "1px solid #ccc", padding: "0.5rem", marginBottom: "0.5rem" }}>
                <span>
                  Device ID: {device.deviceId} ({device.deviceType} / {device.osType}) - Model: {device.model}
                </span>
                <button
                  onClick={() => handleDeallocateDevice(device)}
                  style={{ marginLeft: "1rem" }}
                >
                  Deallocate
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No allocated devices found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
