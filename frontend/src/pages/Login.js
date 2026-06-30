// This is the Login page
// User enters username and password, we check it with the backend

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // Store what the user types
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // This runs when user clicks the Login button
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Send username and password to backend
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      // If login failed, show the error message
      if (!response.ok) {
        setError(data.message);
        return;
      }

      // Save the login token and user info so we stay logged in
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Send user to the correct dashboard based on their role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "staff") {
        navigate("/staff");
      } else {
        navigate("/user");
      }

    } catch (err) {
      setError("Could not connect to server. Please try again!");
    }
  };

  return (
    <div style={{ maxWidth: "350px", margin: "80px auto", fontFamily: "Arial" }}>
      <h2>Facility Request System</h2>
      <h3>Login</h3>

      <form onSubmit={handleLogin}>

        <label>Username</label><br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />
        <br />

        <label>Password</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={{ padding: "10px 20px" }}>
          Login
        </button>

      </form>

      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>

    </div>
  );
}

export default Login;