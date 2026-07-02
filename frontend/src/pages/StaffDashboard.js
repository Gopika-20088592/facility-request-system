// This is the Staff Dashboard page
// Staff can create new facility requests and update status of existing ones
// Also shows current weather using OpenWeatherMap API
// Weather helps staff decide if outdoor maintenance work can be carried out

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

function StaffDashboard() {

  // Store all requests
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Store new request form details
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [raisedFor, setRaisedFor] = useState("");

  // Store weather information
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Get logged in user details
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Weather API key from OpenWeatherMap
  const WEATHER_API_KEY = "fca7c0700fb424218de10021a6f278f8";

  // This runs when the page loads
  useEffect(() => {
    fetchAllRequests();
    fetchWeather();
  }, []);

  // Get current weather for Dublin Ireland
  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=Dublin,IE&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
      setWeatherLoading(false);
    } catch (err) {
      setWeatherLoading(false);
    }
  };

  // Get all requests from backend
  const fetchAllRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/requests/my/" + user.username, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      setRequests(data);
      setLoading(false);
    } catch (err) {
      setError("Could not load requests. Please try again!");
      setLoading(false);
    }
  };

  // Create a new facility request
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          created_by: user.username,
          created_by_role: user.role,
          raised_for: raisedFor
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Clear the form
      setTitle("");
      setDescription("");
      setRaisedFor("");
      setSuccess("Request submitted successfully!");

      // Refresh the requests list
      fetchAllRequests();

    } catch (err) {
      setError("Could not submit request. Please try again!");
    }
  };
  
  const handleUpdateStatus = async (id, newStatus) => {
    
    const reason = window.prompt(
      `You are changing status to "${newStatus}". \n\nPlease enter a reason for this change:`
    );
    
    if (!reason || reason.trim() === "") {
      alert("Please provide a reason before updating the status!");
      return;
    }
    
    try {
      
      await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        
        body: JSON.stringify({ status: newStatus, reason: reason })
      });
      
      fetchAllRequests();
    
    } catch (err) {
      setError("Could not update request. Please try again!");
    }
  };

  // Show different colors for different statuses
  const getStatusColor = (status) => {
    if (status === "New") return "#8e44ad";
    if (status === "In Progress") return "#3498db";
    if (status === "Pending") return "#e67e22";
    if (status === "Resolved") return "#27ae60";
    return "#95a5a6";
  };

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", backgroundColor: "#f5f6fa" }}>

      {/* Navbar at top */}
      <Navbar />

      <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>

        <h2>Staff Dashboard</h2>

        {/* Weather Widget - Shows current weather to help plan outdoor maintenance */}
        <div style={{
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "25px"
        }}>
          <h3 style={{ margin: "0 0 10px" }}>🌤️ Current Weather — Dublin</h3>
          <p style={{ margin: 0, fontSize: "13px", color: "#bdc3c7" }}>
            Check weather conditions before planning outdoor facility maintenance work
          </p>

          {weatherLoading && <p>Loading weather...</p>}

          {weather && weather.main && (
            <div style={{ marginTop: "15px", display: "flex", gap: "30px" }}>
              <div>
                <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold" }}>
                  {Math.round(weather.main.temp)}°C
                </p>
                <p style={{ margin: 0, textTransform: "capitalize" }}>
                  {weather.weather[0].description}
                </p>
              </div>
              <div>
                <p style={{ margin: 0 }}>💧 Humidity: {weather.main.humidity}%</p>
                <p style={{ margin: 0 }}>💨 Wind: {weather.wind.speed} m/s</p>
                <p style={{ margin: 0 }}>🌡️ Feels like: {Math.round(weather.main.feels_like)}°C</p>
              </div>
            </div>
          )}
        </div>

        {/* Create New Request Form */}
        <div style={{
          backgroundColor: "white",
          padding: "25px",
          borderRadius: "8px",
          marginBottom: "25px",
          border: "1px solid #ddd"
        }}>
          <h3 style={{ margin: "0 0 15px" }}>Submit New Facility Request</h3>

          <form onSubmit={handleCreateRequest}>

          <label>Raised For (Employee Username)</label><br />
          <input
           type="text"
           value={raisedFor}
           onChange={(e) => setRaisedFor(e.target.value)}
           placeholder="Enter the username of the employee this request is for"
           style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
          />
          <br />

            <label>Request Title</label><br />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Fix broken AC in Room 3"
              style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
              required
            />

            <label>Description</label><br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows="4"
              style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
              required
            />

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <button
              type="submit"
              style={{
                backgroundColor: "#27ae60",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "15px"
              }}
            >
              Submit Request
            </button>

          </form>
        </div>

        {/* List of Requests */}
        <h3>My Submitted Requests</h3>

        {loading && <p>Loading requests...</p>}

        {!loading && requests.length === 0 && (
          <p style={{ color: "#666" }}>No requests submitted yet!</p>
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
                <p style={{ margin: "0 0 5px", color: "#666" }}>{request.description}</p>
                
                {/* Show who this request was raised for */}
                {request.raised_for && (
                  <p style={{ margin: "0 0 5px", fontSize: "13px", color: "#2c3e50" }}>
                    👤 Raised for: <strong>{request.raised_for}</strong>
                    </p>
                  )}
                  
                  {/* Show reason for current status */}
                  {request.reason && (
                    <p style={{ margin: "0 0 5px", fontSize: "13px", color: "#8e44ad" }}>
                      💬 Reason: <strong>{request.reason}</strong>
                      </p>
                    )}
                    
                    <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>
                      Submitted: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

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
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default StaffDashboard;