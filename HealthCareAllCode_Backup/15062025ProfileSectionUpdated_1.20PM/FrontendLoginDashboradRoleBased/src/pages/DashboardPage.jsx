/*// DashboardPage.jsx
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Log current token and authentication state for debugging
  console.log("DashboardPage render - token:", token, "isAuthenticated:", isAuthenticated);

  useEffect(() => {
    // This effect handles OAuth2 token from URL query param only on mount or token change
    if (!token) {
      console.log("No token found in state, checking URL params for token...");
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        console.log("OAuth2 token found in URL:", urlToken);

        localStorage.setItem("jwtToken", urlToken);
        setToken(urlToken);
        setIsAuthenticated(true);

        // Remove token from URL without reload
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        console.log("No token found in URL params.");
        setIsAuthenticated(false);
      }
    } else {
      console.log("Token already exists in state/localStorage.");
      setIsAuthenticated(true);
    }
  }, [token]);

  // Listen for localStorage changes (in case token is updated/removed from elsewhere)
  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === "jwtToken") {
        console.log("localStorage jwtToken changed:", event.newValue);
        setToken(event.newValue);
        setIsAuthenticated(!!event.newValue);
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Handle token expiration - listen to a custom event or use polling if TokenChecker emits one
  useEffect(() => {
    function handleTokenExpired() {
      console.log("Token expired - logging out user.");
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("jwtToken");
      alert("Session expired. Please login again.");
    }
    
    // Example: if TokenChecker dispatches 'tokenExpired' event on window
    window.addEventListener("tokenExpired", handleTokenExpired);

    return () => {
      window.removeEventListener("tokenExpired", handleTokenExpired);
    };
  }, []);

  const navigateTo = async (path, method = "GET") => {
    if (!isAuthenticated) {
      alert("You must be logged in to perform this action.");
      return;
    }

    const url = path.startsWith("http") ? path : `http://localhost:8081${path}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    };

    console.log(`Making API call: ${method} ${url} with token:`, token);

    try {
      let response;
      if (method === "GET") {
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
    //console.log("Logging out user...");
    localStorage.removeItem("jwtToken");
    //setToken(null);
    //setIsAuthenticated(false);
	window.location.href = "/logout";
    // optionally redirect to login page: window.location.href = "/login";
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
              data-bs-toggle="dropdown"
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
*/

/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;

const DashboardPage = () => {
  const navigate = useNavigate(); // ✅ React Router navigation
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        localStorage.setItem("jwtToken", urlToken);
        setToken(urlToken);
        setIsAuthenticated(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(true);
    }
  }, [token]);

  useEffect(() => {
    function handleStorageChange(event) {
      if (event.key === "jwtToken") {
        setToken(event.newValue);
        setIsAuthenticated(!!event.newValue);
      }
    }
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    function handleTokenExpired() {
      setToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem("jwtToken");
      alert("Session expired. Please login again.");
    }

    window.addEventListener("tokenExpired", handleTokenExpired);
    return () => window.removeEventListener("tokenExpired", handleTokenExpired);
  }, []);

  const navigateTo = async (path, method = "GET", actionType = "api") => {
    if (!isAuthenticated) {
      alert("You must be logged in to perform this action.");
      return;
    }

    if (actionType === "redirect") {
      navigate(path);
      return;
    }

    let baseUrl = "";
    if (path.startsWith("/api/patients")) {
      baseUrl = PATIENT_SERVICE_URL;
    } else if (path.startsWith("/api/appointments")) {
      baseUrl = APPOINTMENT_SERVICE_URL;
    } else if (path.startsWith("/api/doctors")) {
      baseUrl = DOCTOR_SERVICE_URL;
    } else if (path.startsWith("/medical-records")) {
      baseUrl = MEDICAL_RECORD_SERVICE_URL;
    }

    const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    };

    try {
      let response;
      if (method === "GET") {
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
        const contentType = response.headers.get("content-type");
        const data = contentType?.includes("application/json") ? await response.json() : await response.text();
        alert("Action completed successfully!");
        console.log("API Response:", data);
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
    window.location.href = "/logout";
  };

  const modules = [
    {
      icon: "fa-user-plus",
      title: "Patient Management",
      desc: "Manage patient registration and records.",
      actions: [
        { label: "Register New Patient", path: "/register-patient", style: "success", method: "GET", type: "redirect" }, // ✅ redirect to form
        { label: "View Patient List", path: "/api/patients/list", style: "primary", method: "GET", type: "api" },
      ],
    },
    {
      icon: "fa-calendar-check",
      title: "Appointment Management",
      desc: "Schedule and manage appointments.",
      actions: [
        { label: "Schedule Appointment", path: "/schedule-appointment", style: "success", method: "GET", type: "redirect" }, // ✅
        { label: "View Appointments", path: "/api/appointments/list", style: "primary", method: "GET", type: "api" },
      ],
    },
    {
      icon: "fa-user-md",
      title: "Doctor Management",
      desc: "Manage doctor profiles and schedules.",
      actions: [
        { label: "Add Doctor", path: "/add-doctor", style: "success", method: "GET", type: "redirect" }, // ✅
        { label: "View Doctors", path: "/api/doctors/view", style: "primary", method: "GET", type: "api" },
      ],
    },
    {
      icon: "fa-file-medical",
      title: "Medical Records Management",
      desc: "Access and update patient medical history.",
      actions: [
        { label: "Add Medical Record", path: "/add-medical-record", style: "success", method: "GET", type: "redirect" }, // ✅
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
                      onClick={() => navigateTo(btn.path, btn.method, btn.type)}
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
*/


// improved Dashboard.jsx but call is not showing in the network tab but code is working fine date 15/06/2025

/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;

// Add your User Service URL or backend base URL where profile API exists
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE || "";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  
  // New states to hold user profile info
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);

  // On mount, check URL for token param & sync localStorage
  useEffect(() => {
    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      if (urlToken) {
        localStorage.setItem("jwtToken", urlToken);
        setToken(urlToken);
        setIsAuthenticated(true);
        // Clean URL to remove token param
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setIsAuthenticated(false);
      }
    }
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

  // Handle custom token expiry event
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

  // New: Fetch user profile info on mount, to display username and role
  useEffect(() => {
    if (!token) {
      setLoadingProfile(false);
      return;
    }

    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      try {
        // Replace with your actual user profile API path
        const response = await fetch(`${USER_SERVICE_URL}/api/user/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          // Token invalid or expired
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch profile:", errorText);
          setUsername("");
          setRole("");
          return;
        }

        const data = await response.json();
        // Adjust according to your API's response structure
        setUsername(data.username || data.name || "");
        setRole(data.role || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUsername("");
        setRole("");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [token]);

  // Helper: Map API path prefixes to base URLs
  const getBaseUrl = (path) => {
    if (path.startsWith("/api/patients")) return PATIENT_SERVICE_URL;
    if (path.startsWith("/api/appointments")) return APPOINTMENT_SERVICE_URL;
    if (path.startsWith("/api/doctors")) return DOCTOR_SERVICE_URL;
    if (path.startsWith("/medical-records")) return MEDICAL_RECORD_SERVICE_URL;
    return "";
  };

  // Generic action handler: either redirect or call API with token in headers
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

      // Include body only for non-GET requests; if needed, you can customize payload here
      if (method !== "GET") {
        fetchOptions.body = JSON.stringify({});
      }

      const response = await fetch(url, fetchOptions);

      if (response.status === 401) {
        // Unauthorized, token expired or invalid
        window.dispatchEvent(new Event("tokenExpired"));
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        alert(`API error: ${response.status} ${response.statusText}`);
        return;
      }

      // Try parse JSON, fallback to text
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
        { label: "View Patient List", path: "/api/patients/list", style: "primary", method: "GET", type: "api" },
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
              {loadingProfile ? (
                <div className="dropdown-item-text">Loading profile...</div>
              ) : (
                <>
                  <div className="dropdown-item-text">
                    <strong>Username:</strong> {username || "N/A"}
                  </div>
                  <div className="dropdown-item-text">
                    <strong>Role:</strong> {role || "N/A"}
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => navigate("/profile")} type="button">
                    <i className="fas fa-user-edit"></i> Edit Profile
                  </button>
                  <button className="dropdown-item" onClick={handleLogout} type="button">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </>
              )}
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
              <div className="card shadow">
                <div className="card-header bg-primary text-white d-flex align-items-center">
                  <i className={`fas ${mod.icon} fa-lg me-2`}></i>
                  <h5 className="mb-0">{mod.title}</h5>
                </div>
                <div className="card-body">
                  <p>{mod.desc}</p>
                  {mod.actions.map((action, aidx) => (
                    <button
                      key={aidx}
                      className={`btn btn-${action.style} me-2 mb-2`}
                      onClick={() => navigateTo(action.path, action.method, action.type)}
                      type="button"
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

      <footer className="bg-light text-center py-3 border-top">
        &copy; {new Date().getFullYear()} WellnessWave Healthcare. All rights reserved.
      </footer>
    </>
  );
};

export default DashboardPage;
*/


/*// DashboardPage.jsx Roles
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const USER_SERVICE_URL = REACT_APP_AUTH_SERVICE; // Make sure you define this in your env

const DashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Profile info states
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");

  // Dashboard data state (if needed)
  const [dashboardData, setDashboardData] = useState(null);

 

  useEffect(() => {
  if (!token) return;

  // Assuming USER_SERVICE_URL is set correctly
  fetch(`${USER_SERVICE_URL}/api/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status === 401) {
        window.dispatchEvent(new Event("tokenExpired"));
        throw new Error("Unauthorized");
      }
      return res.json();
    })
    .then((data) => {
      // Adjust these property names to your actual API response
      setUsername(data.username || "N/A");
      setRole(data.role || "N/A");
    })
    .catch((err) => {
      console.error("Failed to load profile data", err);
      setUsername("N/A");
      setRole("N/A");
    });
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

  // Fetch user profile on token change
  useEffect(() => {
    if (!token) {
      setUsername("N/A");
      setRole("N/A");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${AUTH_SERVICE_URL}/api/user/profile`, {
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
      }
    };

    fetchProfile();
  }, [token]);

  // Fetch dashboard data on mount or token change
  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        // Replace with your real dashboard API endpoint
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
        { label: "View Patient List", path: "/api/patients/list", style: "primary", method: "GET", type: "api" },
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
     //   {/* Example usage of dashboardData }
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


import React, { useEffect, useState } from "react";
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
        { label: "View Patient List", path: "/api/patients/list", style: "primary", method: "GET", type: "api" },
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
