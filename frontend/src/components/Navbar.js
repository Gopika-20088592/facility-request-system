import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };
  
  return (
  <nav className="navbar">
    <h2>🏢 Facility Request System</h2>
    <div className="navbar-right">
      <span>Welcome, <strong>{user?.username}</strong></span>
      <span className="role-badge">{user?.role}</span>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
        </button>
        </div>
        </nav>
        );
      }

export default Navbar;