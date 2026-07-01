// This file protects dashboard pages from being accessed without logging in
// If a user tries to go directly to /admin or /staff without logging in
// they will be automatically sent back to the login page

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

  // Check if user is logged in by looking for token in browser
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // If no token found - user is not logged in
  // Send them back to login page
  if (!token || !user) {
    return <Navigate to="/" />;
  }

  // If a specific role is required - check if user has that role
  // For example admin page should only be accessed by admin
  if (allowedRole && user.role !== allowedRole) {
    // If wrong role - send them to their correct dashboard
    if (user.role === "admin") return <Navigate to="/admin" />;
    if (user.role === "staff") return <Navigate to="/staff" />;
    return <Navigate to="/user" />;
  }

  // If everything is fine - show the requested page
  return children;
}

export default ProtectedRoute;