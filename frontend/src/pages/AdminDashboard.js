// This is the Admin Dashboard page
// Admin can see all requests, update status and delete requests
// Admin also sees a summary of total pending and resolved requests

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function AdminDashboard() {

  // Store all requests
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get logged in user details
  const token = localStorage.getItem("token");

  // This runs when the page loads
  useEffect(() => {
    fetchAllRequests();
  }, []);

  // Get ALL requests from backend
  const fetchAllRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/requests", {
        headers: {
          // Send login token so backend knows we are admin
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        setError("Could not load requests. Please try again!");
        return;
      }

      setRequests(data);
      setLoading(false);

    } catch (err) {
      setError("Could not connect to server. Please try again!");
      setLoading(false);
    }
  };

  // Update the status of any request
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      // Refresh the list after update
      fetchAllRequests();

    } catch (err) {
      setError("Could not update request!");
    }
  };

  // Delete a request permanently
  const handleDelete = async (id) => {

    // Ask admin to confirm before deleting
    const confirmed = window.confirm(
      "Are you sure you want to delete this request? This cannot be undone!"
    );

    if (!confirmed) return;

    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      // Refresh the list after delete
      fetchAllRequests();

    } catch (err) {
      setError("Could not delete request!");
    }
  };

  // Show different colors for different statuses
  const getStatusColor = (status) => {
    if (status === "Pending") return "#e67e22";
    if (status === "In Progress") return "#3498db";
    if (status === "Resolved") return "#27ae60";
    return "#95a5a6";
  };

  // Count requests by status for the summary cards
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === "Pending").length;
  const inProgressRequests = requests.filter(r => r.status === "In Progress").length;
  const resolvedRequests = requests.filter(r => r.status === "Resolved").length;

  return (
    <div style={{
      fontFamily: "Arial",
      minHeight: "100vh",
      backgroundColor: "#f5f6fa"
    }}>

      {/* Navbar at top */}
      <Navbar />

      <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>

        <h2>Admin Dashboard</h2>
        <p style={{ color: "#666" }}>
          Manage all facility requests from all users and staff
        </p>

        {/* Summary Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          marginBottom: "30px"
        }}>

          {/* Total Requests Card */}
          <div style={{
            backgroundColor: "#2c3e50",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{ margin: "0 0 5px", fontSize: "13px" }}>Total Requests</p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
              {totalRequests}
            </p>
          </div>

          {/* Pending Card */}
          <div style={{
            backgroundColor: "#e67e22",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{ margin: "0 0 5px", fontSize: "13px" }}>Pending</p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
              {pendingRequests}
            </p>
          </div>

          {/* In Progress Card */}
          <div style={{
            backgroundColor: "#3498db",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{ margin: "0 0 5px", fontSize: "13px" }}>In Progress</p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
              {inProgressRequests}
            </p>
          </div>

          {/* Resolved Card */}
          <div style={{
            backgroundColor: "#27ae60",
            color: "white",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{ margin: "0 0 5px", fontSize: "13px" }}>Resolved</p>
            <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
              {resolvedRequests}
            </p>
          </div>

        </div>

        {/* All Requests List */}
        <h3>All Facility Requests</h3>

        {loading && <p>Loading all requests...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && requests.length === 0 && (
          <p style={{ color: "#666" }}>No requests found in the system!</p>
        )}

        {requests.map((request) => (
          <div
            key={request._id}
            style={{
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "15px"
            }}
          >
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px"
            }}>

              <div>
                <h4 style={{ margin: "0 0 5px" }}>{request.title}</h4>
                <p style={{ margin: "0 0 5px", color: "#666" }}>
                  {request.description}
                </p>
                <p style={{ margin: "0 0 3px", fontSize: "13px", color: "#999" }}>
                  Submitted by: <strong>{request.created_by}</strong> ({request.created_by_role})
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>
                  Date: {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap"
              }}>

                {/* Status badge */}
                <span style={{
                  backgroundColor: getStatusColor(request.status),
                  color: "white",
                  padding: "5px 12px",
                  borderRadius: "12px",
                  fontSize: "13px"
                }}>
                  {request.status}
                </span>

                {/* Update status dropdown */}
                <select
                  value={request.status}
                  onChange={(e) => handleUpdateStatus(request._id, e.target.value)}
                  style={{ padding: "5px", borderRadius: "5px" }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(request._id)}
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    padding: "7px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "13px"
                  }}
                >
                  Delete
                </button>

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default AdminDashboard;