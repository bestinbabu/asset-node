// src/pages/UserDashboard.jsx
import { useState, useEffect } from "react";
import { 
  getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, setDoc 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const UserDashboard = () => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [osTypes, setOsTypes] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceType, setSelectedDeviceType] = useState("");
  const [selectedOsType, setSelectedOsType] = useState("");
  const [userDevices, setUserDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const db = getFirestore();

  // Fetch available device types from the "devices" collection.
  useEffect(() => {
    const fetchDeviceTypes = async () => {
      try {
        const devicesCol = collection(db, "devices");
        const querySnapshot = await getDocs(devicesCol);
        const types = [];
        querySnapshot.forEach((doc) => {
          types.push(doc.id); // Assuming document IDs represent device types (e.g., "laptops", "mobilephones")
        });
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
          querySnapshot.forEach((doc) => {
            osArray.push(doc.id);
          });
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
          // Assuming that under each device type and OS type, there is a subcollection named like "linuxdevices" or similar.
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

  // Fetch the devices currently assigned to the user.
  useEffect(() => {
    if (userId) {
      const fetchUserDevices = async () => {
        try {
          const userDocRef = doc(db, "users", userId);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            // Assuming the user's devices are stored in a field called "devices" (as an array)
            setUserDevices(userSnap.data().devices || []);
          } else {
            setUserDevices([]);
          }
        } catch (error) {
          console.error("Error fetching user devices:", error);
          setUserDevices([]);
        }
      };
      fetchUserDevices();
    }
  }, [db, userId]);

  // Handle a device request: prompt for purpose and add a new document to the "requests" collection.
  // Inside src/pages/UserDashboard.jsx

const handleRequestDevice = async (device) => {
  const purpose = prompt("Please enter the purpose for this request:");
  if (!purpose) return;

  try {
    // Construct the data object
    const data = {
      deviceSpec: {
        id: device.id,
        deviceType: device.deviceType,
        osType: device.osType,
        model: device.configuration?.model || "Device"
      },
      from: userId, // current user's UID
      purpose: purpose
    };

    // Write the JSON document to a specific document path in "requests"
    // Here we use the current user's UID as the document ID for example,
    // which would create a document at /requests/<userId>
    await setDoc(doc(db, "requests", userId), data);

    alert("Request submitted successfully!");
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("Failed to submit request. Please try again.");
  }
};


  // Handle releasing a device: update device availability and remove it from the user's list.
  const handleReleaseDevice = async (device) => {
    if (!window.confirm("Are you sure you want to release this device?")) return;

    try {
      // Update device availability in Firestore.
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

      // Update user's devices array. Assume it's stored in the "users" document as an array field "devices".
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const currentDevices = userSnap.data().devices || [];
        const updatedDevices = currentDevices.filter((d) => d.id !== device.id);
        await updateDoc(userDocRef, { devices: updatedDevices });
        setUserDevices(updatedDevices);
        setAvailableDevices((prev) => [...prev, { ...device, availability: true }]);
      }
      alert("Device released successfully!");
    } catch (error) {
      console.error("Error releasing device:", error);
      alert("Failed to release device. Please try again.");
    }
  };

  return (
    <div className="user-dashboard" style={{ padding: "2rem" }}>
      <h2>Device Management</h2>

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
                    className="request-btn"
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

      {userDevices.length > 0 && (
        <div className="user-devices" style={{ marginTop: "2rem" }}>
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
                  style={{ marginLeft: "1rem" }}
                >
                  Release Device
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;