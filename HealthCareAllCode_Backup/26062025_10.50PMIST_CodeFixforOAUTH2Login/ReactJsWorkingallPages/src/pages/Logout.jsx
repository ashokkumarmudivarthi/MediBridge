// src/pages/Logout.jsx
import React from "react";
import axios from "axios";

const Logout = () => {
    
  const handleLogout = async () => {
    try {
      // Call your logout API endpoint if needed (invalidate token server-side)
      await axios.post(
        "http://localhost:8081/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
        }
      );

      // Clear JWT token locally
      localStorage.removeItem("jwtToken");

      // Redirect to login or home page after logout
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally show an error message here
    }
  };

  return (
    <div
      className="logout-page d-flex align-items-center justify-content-center vh-100 bg-light"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="logout-container text-center p-4 bg-white rounded shadow"
        style={{ maxWidth: 400 }}
      >
        <h2 className="text-success font-weight-bold mb-4">Logout Successful</h2>
        <p>You have successfully logged out from WellnessWave.</p>

        <button
          className="btn btn-primary"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt"></i> Logout Again
        </button>

        <br />
        <a href="/" className="btn btn-secondary mt-3">
          <i className="fas fa-home"></i> Go to Launch Page
        </a>
      </div>
    </div>
  );
};

export default Logout;
