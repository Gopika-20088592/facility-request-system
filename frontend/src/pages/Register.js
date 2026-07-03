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

      const response = await fetch("http://localhost:5000/api/register", {
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
    <div style={{
      maxWidth: "350px",
      margin: "80px auto",
      fontFamily: "Arial"
    }}>
      <h2>Facility Request System</h2>
      <h3>Create Account</h3>

      <form onSubmit={handleRegister}>

        <label>Username</label><br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />
        <br />

        <label>Password (at least 6 characters)</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          required
        />
        <br />

        <label>Select Your Role</label><br />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        >
          <option value="user">User</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <br />


        {error && <p style={{ color: "red" }}>{error}</p>}

        {success && <p style={{ color: "green" }}>{success}</p>}

        <button
          type="submit"
          style={{ padding: "10px 20px" }}
        >
          Register
        </button>

      </form>

      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>

    </div>
  );
}

export default Register;