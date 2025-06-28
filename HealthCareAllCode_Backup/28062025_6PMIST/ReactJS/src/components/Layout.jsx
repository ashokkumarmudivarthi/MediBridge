import React from "react";
import { useNavigate } from "react-router-dom";
//import useTokenExpiryRedirect from "../hooks/useTokenExpiryRedirect";

const Layout = ({ user, patient, children }) => {
 // useTokenExpiryRedirect(); // ✅ This will apply to all pages under this layout
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-light px-3">
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3"><strong>User:</strong> {user?.username || "N/A"}</span>
          <span className="me-3"><strong>Patient:</strong> {patient?.name || "N/A"} (ID: {patient?.id || "N/A"})</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-info text-white text-center py-4">
        <h2>Welcome to WellnessWave, {patient?.name || user?.username}</h2>
        <p className="lead">Your personal healthcare dashboard</p>
      </header>

      {/* Page Content */}
      <main className="container mt-5">
        {children}
      </main>
    </>
  );
};

export default Layout;
