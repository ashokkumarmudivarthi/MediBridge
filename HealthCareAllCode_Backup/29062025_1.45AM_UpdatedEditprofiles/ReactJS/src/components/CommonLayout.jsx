import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CommonLayout = ({ children, showEdit = true }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("Loading...");
  const [role, setRole] = useState("Loading...");

  const AUTH_SERVICE = process.env.REACT_APP_AUTH_SERVICE;
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUsername(data.username || "Unknown");
        setRole(data.role || "Unknown");
      } catch (error) {
        console.error("❌ Error loading profile info:", error);
        setUsername("Guest");
        setRole("N/A");
      }
    };

    fetchProfile();
  }, [AUTH_SERVICE, token]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  return (
    <>
      {/* ✅ Top Nav */}
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
              {showEdit && (
                <button className="dropdown-item" onClick={() => navigate("/profile")} type="button">
                  <i className="fas fa-user-edit"></i> Edit Profile
                </button>
              )}
              <button className="dropdown-item" onClick={handleLogout} type="button">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>

      {/* ✅ Page Header */}
      <header className="bg-success text-white text-center py-4">
        <h1>Welcome to WellnessWave Healthcare</h1>
        <p>Your one-stop solution for healthcare management</p>
      </header>

      {/* ✅ Page Content */}
      <main className="container my-4">{children}</main>
    </>
  );
};

export default CommonLayout;
