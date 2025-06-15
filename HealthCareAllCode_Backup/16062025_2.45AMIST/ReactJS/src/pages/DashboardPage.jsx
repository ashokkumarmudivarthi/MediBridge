/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE; // Correct usage here

const DashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Profile info states
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch user profile on token change
  useEffect(() => {
    if (!token) {
      setUsername("N/A");
      setRole("N/A");
      return;
    }

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

        if (!response.ok) {
          console.error("Profile fetch error", response.statusText);
          return;
        }

        const data = await response.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
      } catch (error) {
        console.error("Failed to fetch profile", error);
        setUsername("N/A");
        setRole("N/A");
      }
    };

    fetchProfile();
  }, [token]);

  // Fetch dashboard data on mount or token change
  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const DASHBOARD_API = `${AUTH_SERVICE_URL}/auth/dashboard`;
        const response = await fetch(DASHBOARD_API, {
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
        if (!response.ok) {
          console.error("Dashboard fetch error", response.statusText);
          return;
        }
        const data = await response.json();
        setDashboardData(data);
        console.log("Dashboard data loaded:", data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Listen to localStorage changes for jwtToken (multi-tab sync)
  useEffect(() => {
    const onStorageChange = (event) => {
      if (event.key === "jwtToken") {
        setToken(event.newValue);
        setIsAuthenticated(!!event.newValue);
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Handle token expiry event
  useEffect(() => {
    const handleTokenExpired = () => {
      alert("Session expired. Please login again.");
      localStorage.removeItem("jwtToken");
      setToken(null);
      setIsAuthenticated(false);
      navigate("/login");
    };
    window.addEventListener("tokenExpired", handleTokenExpired);
    return () => window.removeEventListener("tokenExpired", handleTokenExpired);
  }, [navigate]);

  // Helper: Map API path prefixes to base URLs
  const getBaseUrl = (path) => {
    if (path.startsWith("/api/patients")) return PATIENT_SERVICE_URL;
    if (path.startsWith("/api/appointments")) return APPOINTMENT_SERVICE_URL;
    if (path.startsWith("/api/doctors")) return DOCTOR_SERVICE_URL;
    if (path.startsWith("/medical-records")) return MEDICAL_RECORD_SERVICE_URL;
    return "";
  };

  // Generic action handler: redirect or call API
  const navigateTo = async (path, method = "GET", actionType = "api") => {
    if (!isAuthenticated || !token) {
      alert("You must be logged in to perform this action.");
      navigate("/login");
      return;
    }

    if (actionType === "redirect") {
      navigate(path);
      return;
    }

    const baseUrl = getBaseUrl(path);
    const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    };

    try {
      const fetchOptions = {
        method,
        headers,
        credentials: "include",
      };

      if (method !== "GET") {
        fetchOptions.body = JSON.stringify({});
      }

      const response = await fetch(url, fetchOptions);

      if (response.status === 401) {
        window.dispatchEvent(new Event("tokenExpired"));
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        alert(`API error: ${response.status} ${response.statusText}`);
        return;
      }

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      console.log("API Response:", data);
      alert("Action completed successfully!");
    } catch (error) {
      console.error("Request failed:", error);
      alert("Failed to connect to server.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    setIsAuthenticated(false);
    navigate("/logout");
  };

  const modules = [
    {
      icon: "fa-user-plus",
      title: "Patient Management",
      desc: "Manage patient registration and records.",
      actions: [
        { label: "Register New Patient", path: "/register-patient", style: "success", method: "GET", type: "redirect" },
        { label: "View Patient List", path: "/patient-list", style: "primary", method: "GET", type: "api" },
      ],
    },
    {
      icon: "fa-calendar-check",
      title: "Appointment Management",
      desc: "Schedule and manage appointments.",
      actions: [
        { label: "Schedule Appointment", path: "/schedule-appointment", style: "success", method: "GET", type: "redirect" },
        { label: "View Appointments", path: "/api/appointments/list", style: "primary", method: "GET", type: "api" },
      ],
    },
    {
      icon: "fa-user-md",
      title: "Doctor Management",
      desc: "Manage doctor profiles and schedules.",
      actions: [
        { label: "Add Doctor", path: "/add-doctor", style: "success", method: "GET", type: "redirect" },
        { label: "View Doctors", path: "/api/doctors/view", style: "primary", method: "GET", type: "api" },
      ],
    },
    {
      icon: "fa-file-medical",
      title: "Medical Records Management",
      desc: "Access and update patient medical history.",
      actions: [
        { label: "Add Medical Record", path: "/add-medical-record", style: "success", method: "GET", type: "redirect" },
        { label: "Search Records", path: "/medical-records/search", style: "primary", method: "GET", type: "api" },
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
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              style={{ textDecoration: "none" }}
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

      <header className="bg-success text-white text-center py-4">
        <h1>Welcome to WellnessWave Healthcare</h1>
        <p>Your one-stop solution for healthcare management</p>
      </header>

      <div className="container my-5">
       {dashboardData && (
          <div className="mb-4">
            <h3>Dashboard Summary:</h3>
            <pre>{JSON.stringify(dashboardData, null, 2)}</pre>
          </div>
        )} 

       





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
                      onClick={() => navigateTo(action.path, action.method, action.type)}
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
*/

// issue with view patient list

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const DashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));

  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const [dashboardData, setDashboardData] = useState(null);

  // Fetch user profile
  useEffect(() => {
    if (!token) {
      setUsername("N/A");
      setRole("N/A");
         localStorage.setItem("userRole", "N/A");  // Just set as "N/A" directly  /// debugging line
      return;
    }
   

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

        if (!response.ok) {
          console.error("Profile fetch error", response.statusText);
          return;
        }

        const data = await response.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");

          // ✅ Store the role in localStorage correctly
      localStorage.setItem("userRole", data.role || "N/A");

      // Optional: Add console.log for debugging
      console.log("User role set in localStorage:", data.role);

      } catch (error) {
        console.error("Failed to fetch profile", error);
        setUsername("N/A");
        setRole("N/A");
        localStorage.setItem("userRole", "N/A"); // Ensure role is set to "N/A" on error
      }
    };

    fetchProfile();
  }, [token]);

  // Fetch dashboard data
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

        if (!response.ok) {
          console.error("Dashboard fetch error", response.statusText);
          return;
        }

        const data = await response.json();
        setDashboardData(data);
        console.log("Dashboard data loaded:", data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Sync token between tabs
  useEffect(() => {
    const onStorageChange = (event) => {
      if (event.key === "jwtToken") {
        setToken(event.newValue);
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  // Handle token expiration
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

  // Resolve base URL from path
  const getBaseUrl = (path) => {
    if (path.startsWith("/api/patients")) return PATIENT_SERVICE_URL;
    if (path.startsWith("/api/appointments")) return APPOINTMENT_SERVICE_URL;
    if (path.startsWith("/api/doctors")) return DOCTOR_SERVICE_URL;
    if (path.startsWith("/medical-records")) return MEDICAL_RECORD_SERVICE_URL;
    return "";
  };

  // Handle button actions
  const navigateTo = async (path, method = "GET", type = "api") => {
    if (!token) {
      alert("You must be logged in to perform this action.");
      navigate("/login");
      return;
    }

    if (type === "redirect") {
      navigate(path);
      return;
    }

    const baseUrl = getBaseUrl(path);
    const url = path.startsWith("http") ? path : `${baseUrl}${path}`;

    try {
      const options = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        credentials: "include",
      };

      if (method !== "GET") {
        options.body = JSON.stringify({});
      }

      const response = await fetch(url, options);

      if (response.status === 401) {
        window.dispatchEvent(new Event("tokenExpired"));
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        alert(`API error: ${response.status} ${response.statusText}`);
        return;
      }

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      console.log("API Response:", data);
      alert("Action completed successfully!");
    } catch (error) {
      console.error("Request failed:", error);
      alert("Failed to connect to server.");
    }
  };

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
        { label: "Register New Patient", path: "/register-patient", style: "success", method: "GET", type: "redirect" },
        { label: "View Patient List", path: "/patient-list", style: "primary", method: "GET", type: "redirect" },
      ],
    },
    {
      icon: "fa-calendar-check",
      title: "Appointment Management",
      desc: "Schedule and manage appointments.",
      actions: [
        { label: "Schedule Appointment", path: "/schedule-appointment", style: "success", method: "GET", type: "redirect" },
        { label: "View Appointments", path: "/api/appointments/list", style: "primary", method: "GET", type: "api" },
      ],
    },
    {
      icon: "fa-user-md",
      title: "Doctor Management",
      desc: "Manage doctor profiles and schedules.",
      actions: [
        { label: "Add Doctor", path: "/add-doctor", style: "success", method: "GET", type: "redirect" },
        { label: "View Doctors", path: "/api/doctors/view", style: "primary", method: "GET", type: "api" },
      ],
    },
    {
      icon: "fa-file-medical",
      title: "Medical Records Management",
      desc: "Access and update patient medical history.",
      actions: [
        { label: "Add Medical Record", path: "/add-medical-record", style: "success", method: "GET", type: "redirect" },
        { label: "Search Records", path: "/medical-records/search", style: "primary", method: "GET", type: "api" },
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

      <header className="bg-success text-white text-center py-4">
        <h1>Welcome to WellnessWave Healthcare</h1>
        <p>Your one-stop solution for healthcare management</p>
      </header>

      <div className="container my-5">
        <div className="mb-4">
          <h3>Dashboard Summary:</h3>
          {dashboardData ? (
            Object.keys(dashboardData).length > 0 ? (
              <pre className="bg-light p-3 border rounded">{JSON.stringify(dashboardData, null, 2)}</pre>
            ) : (
              <p className="text-muted">No data available yet.</p>
            )
          ) : (
            <p className="text-muted">Loading dashboard data...</p>
          )}
        </div>

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
                      onClick={() => navigateTo(action.path, action.method, action.type)}
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
