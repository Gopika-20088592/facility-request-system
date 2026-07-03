import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/" />;
  }

  if (allowedRole && user.role !== allowedRole) {

    if (user.role === "admin") return <Navigate to="/admin" />;
    if (user.role === "staff") return <Navigate to="/staff" />;
    return <Navigate to="/user" />;
  }

  return children;
}

export default ProtectedRoute;