import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const AdminAppointmentPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");

  // Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await response.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    navigate("/logout");
  };

  return (
    <>
      {/* Profile Dropdown */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              type="button"
            >
              <i className="fas fa-user-circle"></i> Profile
            </button>
            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <div className="dropdown-item-text">
                <strong>Username:</strong> {username} <br />
                <strong>Role:</strong> {role}
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => navigate("/profile")} type="button">
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button className="dropdown-item" onClick={handleLogout} type="button">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>

      {/* Header */}
      <header className="bg-primary text-white text-center py-4">
        <h2>Appointment Management</h2>
        <p>Admin access to all appointment-related operations</p>
      </header>

      {/* 🔙 Back to Home Button */}
      <div className="container my-3">
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
          🔙 Back to Home
        </button>
      </div>

      {/* Main Content */}
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-4 mb-4">
            <div className="card shadow p-3 h-100 text-center">
              <i className="fas fa-calendar-plus fa-2x text-success"></i>
              <h5 className="mt-3">Schedule Appointment</h5>
              <p>Create a new appointment for patients.</p>
              <button
                className="btn btn-success"
                onClick={() => navigate("/schedule-appointment")}
              >
                Schedule Now
              </button>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card shadow p-3 h-100 text-center">
              <i className="fas fa-calendar-alt fa-2x text-primary"></i>
              <h5 className="mt-3">View Appointments</h5>
              <p>View the list of scheduled appointments.</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/appointments-list")}
              >
                View List
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAppointmentPage;
