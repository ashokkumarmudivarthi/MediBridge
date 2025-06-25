import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const AdminPatientDashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
        localStorage.setItem("userRole", data.role || "N/A");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        setUsername("N/A");
        setRole("N/A");
        localStorage.setItem("userRole", "N/A");
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    navigate("/logout");
  };

  const patientActions = [
    {
      label: "Register New Patient",
      path: "/register-patient",
      icon: "fa-user-plus",
      color: "success",
    },
    {
      label: "View Patient List",
      path: "/patient-list",
      icon: "fa-list",
      color: "primary",
    },
    {
      label: "Delete Patient",
      path: "/delete-patient",
      icon: "fa-user-times",
      color: "danger",
    },
    {
      label: "Search Patient",
      path: "/search-patient",
      icon: "fa-search",
      color: "info",
    },
    {
    label: "In-Patient Visit",
    path: "/inpatient-form",
    icon: "fa-procedures",
    color: "warning", // Add this new action
  },
  {
  label: "Add Patient Visit",
  path: "/add-patient-visit",
  icon: "fa-hospital-user",
  color: "warning",
},
  ];

  return (
    <>
      {/* Navbar with user profile dropdown */}
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
      <header className="bg-success text-white text-center py-4">
        <h1>Patient Management Dashboard</h1>
        <p>Admin access to all patient-related features</p>
      </header>

      <div className="container my-5">
        <div className="row">
          {patientActions.map((action, idx) => (
            <div className="col-md-3 mb-4" key={idx}>
              <div className={`card shadow border-${action.color} h-100`}>
                <div className="card-body text-center">
                  <i className={`fas ${action.icon} fa-2x text-${action.color}`}></i>
                  <h5 className="mt-3">{action.label}</h5>
                  <button
                    className={`btn btn-${action.color} mt-2`}
                    onClick={() => navigate(action.path)}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center mt-4">
          <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
            <i className="fas fa-arrow-left"></i> Back to Main Dashboard
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminPatientDashboardPage;
