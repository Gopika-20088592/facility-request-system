// This is the Navbar component
// It shows at the top of every dashboard page
// Displays the logged in user's name, role and a logout button

import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Get the logged in user's details from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // This runs when user clicks Logout
  const handleLogout = () => {
    // Remove the token and user info from browser
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Send user back to login page
    navigate("/");
  };

  return (
    <nav style={{
      backgroundColor: "#2c3e50",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white"
    }}>
      {/* Left side - App name */}
      <h2 style={{ margin: 0, fontSize: "18px" }}>
        🏢 Facility Request System
      </h2>

      {/* Right side - Username, Role and Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span>Welcome, <strong>{user?.username}</strong></span>
        <span style={{
          backgroundColor: "#3498db",
          padding: "3px 10px",
          borderRadius: "12px",
          fontSize: "13px"
        }}>
          {user?.role}
        </span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;