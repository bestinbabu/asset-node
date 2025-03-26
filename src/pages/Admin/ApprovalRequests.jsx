// src/pages/Admin/ApprovalRequests.jsx
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

const ApprovalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  // Fetch all requests from the "requests" collection
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

  // Handle approval: update request status to "approved" and remove it from local state
  const handleApprove = async (requestId) => {
    console.log(`Attempting to approve request ${requestId}...`);
    try {
      const requestDocRef = doc(db, "requests", requestId);
      await updateDoc(requestDocRef, { status: "approved" });
      console.log(`Request ${requestId} approved.`);
      // Remove the approved request from the list
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
      alert("Request approved!");
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
