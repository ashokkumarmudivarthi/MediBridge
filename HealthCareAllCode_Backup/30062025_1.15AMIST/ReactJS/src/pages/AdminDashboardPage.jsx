// File: src/pages/AdminDashboardPage.jsx
// This file is part of the WellnessWave Healthcare Management System.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const [userId, setUserId] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await response.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
        setUserId(data.id || null);
        localStorage.setItem("userRole", data.role || "N/A");
      } catch (error) {
        console.error("Failed to fetch profile", error);
        setUsername("N/A");
        setRole("N/A");
        setUserId(null);
        localStorage.setItem("userRole", "N/A");
      }
    };

    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${AUTH_SERVICE_URL}/auth/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await response.json();
        setDashboardData(data); // Currently not rendered, but retained for future use
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    const onStorageChange = (event) => {
      if (event.key === "jwtToken") {
        setToken(event.newValue);
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  useEffect(() => {
    const handleTokenExpired = () => {
      alert("Session expired. Please login again.");
      localStorage.removeItem("jwtToken");
      setToken(null);
      navigate("/login");
    };

    window.addEventListener("tokenExpired", handleTokenExpired);
    return () => window.removeEventListener("tokenExpired", handleTokenExpired);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    navigate("/logout");
  };

  const modules = [
    {
      icon: "fa-user-plus",
      title: "Patient Management",
      desc: "Manage patient registration and records.",
      actions: [
        {
          label: "Go to Patient Dashboard",
          path: "/admin/patients",
          style: "primary",
        },
      ],
    },
    {
      icon: "fa-calendar-check",
      title: "Appointment Management",
      desc: "Schedule and manage appointments.",
      actions: [
        {
          label: "Go to Appointment Dashboard",
          path: "/admin/appointments",
          style: "primary",
        },
      ],
    },
    {
      icon: "fa-user-md",
      title: "Doctor Management",
      desc: "Manage doctor profiles and schedules.",
      actions: [
        {
          label: "Go to Doctor Dashboard",
          path: "/admin/doctors",
          style: "primary",
        },
      ],
    },
    {
      icon: "fa-file-medical",
      title: "Medical Records Management",
      desc: "Access and update patient medical history.",
      actions: [
        {
          label: "Go to Medical Records",
          path: "/admin/medical-records",
          style: "primary",
        },
      ],
    },
    {
      icon: "fa-user-edit",
      title: "Edit Users Profile",
      desc: "Update personal profile information.",
      actions: [
        {
          label: "Edit User Profile",
          path: userId ? `/admin/edit-user/${userId}` : "#",
          style: "warning",
        },
      ],
    },

{
  icon: "fa-file-invoice-dollar",
  title: "Billing Management",
  desc: "Manage patient billing and invoices.",
  actions: [
    {
      label: "Go to Billing Dashboard",
      path: "/admin/billing-dashboard",
      style: "success",
    },
  ],
}


  ];

  return (
    <>
      {/* Navbar */}
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
        <h1>Welcome to WellnessWave Healthcare</h1>
        <p>Your one-stop solution for healthcare management</p>
      </header>

      {/* Cards Grid */}
      <div className="container my-5">
        <div className="row">
          {modules.map((mod, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <div className="card shadow p-3 h-100">
                <div className="card-body text-center">
                  <i className={`fas ${mod.icon} fa-2x text-success`}></i>
                  <h4 className="mt-3">{mod.title}</h4>
                  <p>{mod.desc}</p>
                  {mod.actions.map((action, index) => (
                    <button
                      key={index}
                      className={`btn btn-${action.style} mx-1`}
                      onClick={() => navigate(action.path)}
                      disabled={action.path === "#"}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

