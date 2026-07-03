import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function UserDashboard() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/requests/my/${user.username}`,
        {
          headers: {

            "Authorization": `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError("Could not load your requests. Please try again!");
        return;
      }

      setRequests(data);
      setLoading(false);

    } catch (err) {
      setError("Could not connect to server. Please try again!");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === "New") return "#8e44ad";
    if (status === "In Progress") return "#3498db";
    if (status === "Pending") return "#e67e22";
    if (status === "Resolved") return "#27ae60";
    return "#95a5a6";
  };

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#f5f6fa" }}>

      <Navbar />

      <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>

        <h2>My Facility Requests</h2>
        <p style={{ color: "#666" }}>
          Here you can see all the facility requests you have submitted
        </p>

        {loading && <p>Loading your requests...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && requests.length === 0 && (
          <p style={{ color: "#666" }}>
            You have not submitted any requests yet!
          </p>
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
              alignItems: "center"
            }}>

            <div>
            <h3 style={{ margin: "0 0 8px" }}>{request.title}</h3>
            <p style={{ margin: "0 0 8px", color: "#666" }}>
            {request.description}
            </p>
            
            {request.raised_for && (
            <p style={{ margin: "0 0 5px", fontSize: "13px", color: "#2c3e50" }}>
              👤 Raised by staff on your behalf
              </p>
            )}
            
            {request.reason && (
              <p style={{ margin: "0 0 5px", fontSize: "13px", color: "#8e44ad" }}>
                💬 Status Reason: <strong>{request.reason}</strong>
                </p>
              )}
              
              <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>
                Submitted: {new Date(request.createdAt).toLocaleDateString()}
                </p>
                </div>

              <span style={{
                backgroundColor: getStatusColor(request.status),
                color: "white",
                padding: "5px 12px",
                borderRadius: "12px",
                fontSize: "13px",
                whiteSpace: "nowrap"
              }}>
                {request.status}
              </span>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default UserDashboard;