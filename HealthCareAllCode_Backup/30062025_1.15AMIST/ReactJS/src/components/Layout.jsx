import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



const Layout = ({ user, patient, children }) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-white");
  };

  const getRoleBadge = (role) => {
    if (!role) return null;
    const colorMap = {
      admin: "primary",
      doctor: "success",
      patient: "info",
      staff: "secondary",
    };
    return (
      <span className={`badge bg-${colorMap[role] || "dark"} ms-2 text-capitalize`}>
        👤 {role}
      </span>
    );
  };

  return (
    <>
      {/* ✅ Top Info Bar */}
      <div className={`bg-light text-dark px-3 py-2 d-flex justify-content-between align-items-center border-bottom ${darkMode ? "bg-dark text-white" : ""}`}>
        <div>
          <strong>Patient:</strong>{" "}
          {patient?.name || "N/A"} (ID: {patient?.id || "N/A"})
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* 🔔 Notification Icon (Optional Badge) */}
          <div className="position-relative me-2">
            <i className="fas fa-bell fa-lg" style={{ cursor: "pointer" }}></i>
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              3
            </span>
          </div>

          {/* 🌗 Theme Toggle */}
          <button className="btn btn-sm btn-outline-secondary me-2" onClick={toggleTheme}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* 👤 Profile Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle btn-sm d-flex align-items-center"
              type="button"
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="avatar"
                  className="rounded-circle me-2"
                  style={{ width: "28px", height: "28px", objectFit: "cover" }}
                />
              ) : (
                <i className="fas fa-user-circle me-2 fa-lg"></i>
              )}
              {user?.username || "User"}
              {getRoleBadge(user?.role)}
            </button>

            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li className="dropdown-item-text">
                <strong>User:</strong> {user?.username || "N/A"} <br />
                <strong>Role:</strong> {user?.role || "N/A"}
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item" onClick={() => navigate("/profile")}>
                  ✏️ Edit Profile
                </button>
              </li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  🔒 Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ✅ Header */}
      <header className={`text-center py-4 ${darkMode ? "bg-secondary text-white" : "bg-info text-white"}`}>
        <h2>Welcome to WellnessWave, {patient?.name || user?.username}</h2>
        <p className="lead">Your personal healthcare dashboard</p>
      </header>

      {/* ✅ Main Content */}
      <main className="container mt-5">{children}</main>
    </>
  );
};

export default Layout;
