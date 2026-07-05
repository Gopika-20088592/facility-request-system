import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {

      const response = await fetch("https://facility-request-system.vercel.app/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setError("Could not connect to server. Please try again!");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      <div style={{
        flex: 1,
        backgroundImage: "url('/facility.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "40px"
      }}>

        <div style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.65)"
        }}/>

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{
            color: "white",
            fontSize: "28px",
            fontWeight: "500",
            margin: "0 0 8px"
          }}>
            Facility Request System
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "15px",
            margin: 0
          }}>
            Submit, track and resolve facility requests
          </p>
        </div>
      </div>

      <div style={{
        width: "420px",
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "50px 40px",
        boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.3)"
      }}>

        <p style={{
          fontSize: "13px",
          color: "#888",
          letterSpacing: "1px",
          margin: "0 0 8px"
        }}>
          🏢 CREATE ACCOUNT
        </p>

        <h2 style={{
          fontSize: "26px",
          color: "#2c3e50",
          margin: "0 0 8px",
          fontWeight: "500"
        }}>
          Register
        </h2>

        <p style={{
          fontSize: "14px",
          color: "#888",
          margin: "0 0 30px"
        }}>
          Fill in your details to create an account
        </p>

        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label>Password (at least 6 characters)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              required
            />
          </div>

          <div className="form-group">
            <label>Select Your Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2c3e50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              cursor: "pointer",
              marginTop: "5px"
            }}
          >
            Create Account
          </button>

        </form>

        <p style={{
          textAlign: "center",
          fontSize: "14px",
          color: "#888",
          marginTop: "20px"
        }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#3498db" }}>
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
}
export default Register;