// DashboardPage.jsx
// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));

  useEffect(() => {
    if (!token) {
      // Try to get token from URL query param
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        // Save token to localStorage and update state
        localStorage.setItem("jwtToken", urlToken);
        setToken(urlToken);

        // Remove token from URL without reloading the page, keep current path
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // No token anywhere, redirect to login
        window.location.href = "/login";
      }
    }
  }, [token]);

  const navigateTo = async (path, method = "GET") => {
    const url = path.startsWith("http") ? path : `http://localhost:8081${path}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    };

    try {
      let response;
      if (method === "GET") {
        // Remove token from query params; use Authorization header only
        response = await fetch(url, {
          method: "GET",
          headers,
          credentials: "include",
        });
      } else {
        const body = JSON.stringify({ token });
        response = await fetch(url, {
          method: "POST",
          headers,
          body,
          credentials: "include",
        });
      }

      if (response.ok) {
        // Handle JSON and plain text responses gracefully
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = await response.text();
        }
        console.log("API Response:", data);
        alert("Action completed successfully!");
      } else {
        const errText = await response.text();
        console.error("API Error:", errText);
        alert("Authentication failed or API error.");
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("Failed to connect to server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/logout"; // Redirect to login after logout
  };

  const modules = [
    {
      icon: "fa-user-plus",
      title: "Patient Management",
      desc: "Manage patient registration and records.",
      actions: [
        { label: "Register New Patient", path: "/api/patients/register", style: "success", method: "POST" },
        { label: "View Patient List", path: "/api/patients/list", style: "primary", method: "GET" },
      ],
    },
    {
      icon: "fa-calendar-check",
      title: "Appointment Management",
      desc: "Schedule and manage appointments.",
      actions: [
        { label: "Schedule Appointment", path: "/api/appointments/schedule", style: "success", method: "POST" },
        { label: "View Appointments", path: "/api/appointments/list", style: "primary", method: "GET" },
      ],
    },
    {
      icon: "fa-user-md",
      title: "Doctor Management",
      desc: "Manage doctor profiles and schedules.",
      actions: [
        { label: "Add Doctor", path: "/api/doctors/add", style: "success", method: "POST" },
        { label: "View Doctors", path: "/api/doctors/view", style: "primary", method: "GET" },
      ],
    },
    {
      icon: "fa-file-medical",
      title: "Medical Records Management",
      desc: "Access and update patient medical history.",
      actions: [
        { label: "Add Medical Record", path: "/medical-records/add", style: "success", method: "POST" },
        { label: "Search Records", path: "/medical-records/search", style: "primary", method: "GET" },
      ],
    },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              id="navbarDropdown"
              data-bs-toggle="dropdown" // updated for Bootstrap 5
              aria-haspopup="true"
              aria-expanded="false"
              style={{ textDecoration: "none" }}
              type="button"
            >
              <i className="fas fa-user-circle"></i> Profile
            </button>
            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="/profile">
                <i className="fas fa-user-edit"></i> Edit Profile
              </a>
              <button className="dropdown-item" onClick={handleLogout} type="button">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>

      <header className="bg-success text-white text-center py-4">
        <h1>Welcome to WellnessWave Healthcare</h1>
        <p>Your one-stop solution for healthcare management</p>
      </header>

      <div className="container my-5">
        <div className="row">
          {modules.map((mod, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <div className="card shadow p-3 h-100">
                <div className="card-body text-center">
                  <i className={`fas ${mod.icon} fa-2x text-success`}></i>
                  <h4 className="mt-3">{mod.title}</h4>
                  <p>{mod.desc}</p>
                  {mod.actions.map((btn, i) => (
                    <button
                      key={i}
                      className={`btn btn-${btn.style} btn-sm mx-1`}
                      onClick={() => navigateTo(btn.path, btn.method)}
                      type="button"
                    >
                      {btn.label}
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


