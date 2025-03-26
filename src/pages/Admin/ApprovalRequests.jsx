// src/pages/Admin/ApprovalRequests.jsx
import React, { useState, useEffect } from "react";
import { 
  getFirestore, collection, getDocs, doc, updateDoc, increment, getDoc, deleteDoc 
} from "firebase/firestore";

const ApprovalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  // Fetch all requests from the "requests" collection (regardless of status)
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      console.log("Starting to fetch requests...");
      try {
        const requestsRef = collection(db, "requests");
        const querySnapshot = await getDocs(requestsRef);
        console.log("Query snapshot received:", querySnapshot);
        const reqs = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          console.log(`Fetched doc ${docSnap.id}:`, data);
          // If there's no status, assume "pending"
          reqs.push({ id: docSnap.id, status: data.status || "pending", ...data });
        });
        console.log("Final requests array:", reqs);
        setRequests(reqs);
      } catch (error) {
        console.error("Error fetching approval requests:", error);
      }
      setLoading(false);
      console.log("Finished fetching requests.");
    };

    fetchRequests();
  }, [db]);

  // Handle approval: update request status, update parent's device count,
  // update unique device's availability, update user's allocatedDevices,
  // and remove the request from Firestore.
  const handleApprove = async (requestId) => {
    console.log(`Attempting to approve request ${requestId}...`);
    try {
      // Find the request object in our local state
      const request = requests.find((req) => req.id === requestId);
      if (!request) {
        console.error("Request not found in state");
        return;
      }

      // 1. Update the request status to "approved"
      const requestDocRef = doc(db, "requests", requestId);
      await updateDoc(requestDocRef, { status: "approved" });
      console.log(`Request ${requestId} status updated to approved.`);

      // 2. Update the parent OS document's count.
      // Example path: /devices/{deviceType}/types/{osType}
      const osDocRef = doc(
        db,
        "devices",
        request.deviceSpec.deviceType,
        "types",
        request.deviceSpec.osType
      );
      await updateDoc(osDocRef, { 
        count: increment(-1) 
      });
      console.log(`Count in ${request.deviceSpec.deviceType}/types/${request.deviceSpec.osType} decreased by 1.`);

      // 3. Update the unique device document's availability to false.
      // Example path: /devices/{deviceType}/types/{osType}/{osType}devices/{deviceId}
      const deviceDocRef = doc(
        db,
        "devices",
        request.deviceSpec.deviceType,
        "types",
        request.deviceSpec.osType,
        `${request.deviceSpec.osType}devices`,
        request.deviceSpec.id
      );
      await updateDoc(deviceDocRef, { 
        availability: false 
      });
      console.log(`Device ${request.deviceSpec.id} availability set to false.`);

      // 4. Update the user's document in "users", adding the device to allocatedDevices
      const userDocRef = doc(db, "users", request.from);
      const userSnap = await getDoc(userDocRef);
      let allocatedDevices = [];
      if (userSnap.exists()) {
        allocatedDevices = userSnap.data().allocatedDevices || [];
      }
      // Add device info along with a timestamp
      allocatedDevices.push({
        deviceId: request.deviceSpec.id,
        deviceType: request.deviceSpec.deviceType,
        osType: request.deviceSpec.osType,
        model: request.deviceSpec.model,
        allocatedAt: new Date().toISOString(),
      });
      await updateDoc(userDocRef, { allocatedDevices });
      console.log(`User ${request.from} updated with new allocated device.`);

      // 5. Remove the request document from Firestore
      await deleteDoc(requestDocRef);
      console.log(`Request ${requestId} deleted from Firestore.`);

      // Remove the approved request from local state
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      alert("Request approved, device allocated, and count updated successfully!");
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Approval Requests</h2>
      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul style={styles.requestList}>
          {requests.map((req) => (
            <li key={req.id} style={styles.requestItem}>
              <p>
                <strong>Device Spec:</strong> {JSON.stringify(req.deviceSpec)}
              </p>
              <p>
                <strong>From:</strong> {req.from}
              </p>
              <p>
                <strong>Purpose:</strong> {req.purpose}
              </p>
              <p>
                <strong>Status:</strong> {req.status}
              </p>
              <button
                onClick={() => handleApprove(req.id)}
                style={styles.approveButton}
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    textAlign: "center",
  },
  requestList: {
    listStyle: "none",
    padding: 0,
  },
  requestItem: {
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "1rem",
    marginBottom: "1rem",
    textAlign: "left",
  },
  approveButton: {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "0.5rem",
  },
};

export default ApprovalRequests;
