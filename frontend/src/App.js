// This is the main file that controls which page is shown
// It uses React Router to switch between pages

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* When URL is just / show the Login page */}
        <Route path="/" element={<Login />} />

        {/* When URL is /register show Register page */}
        <Route path="/register" element={<Register />} />

        {/* When URL is /user show User Dashboard */}
        <Route path="/user" element={<UserDashboard />} />

        {/* When URL is /staff show Staff Dashboard */}
        <Route path="/staff" element={<StaffDashboard />} />

        {/* When URL is /admin show Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;