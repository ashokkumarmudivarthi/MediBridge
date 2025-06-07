/*import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      localStorage.setItem("jwtToken", urlToken);
      setToken(urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  const navigateTo = async (path, method = "GET") => {
    const url = path.startsWith("http") ? path : `http://localhost:8081${path}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
       // credentials: "include",
      });

      const contentType = response.headers.get("content-type");

      if (response.ok) {
        const data = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();

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
    window.location.href = "/logout";
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






/*
//without token validation as failing while validating token even though token is valid
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");

    if (urlToken) {
      localStorage.setItem("jwtToken", urlToken);
      setToken(urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const navigateTo = async (path, method = "GET") => {
    const url = path.startsWith("http") ? path : `http://localhost:8081${path}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    };

    try {
      const options = {
        method,
        headers,
        credentials: "include",
      };
      if (method !== "GET") {
        options.body = JSON.stringify({ token });
      }

      const response = await fetch(url, options);

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      if (response.ok) {
        console.log("API Response:", data);
        alert("Action completed successfully!");
      } else {
        console.warn("API responded with error but allowing access (debug mode).");
        alert(`Partial error: ${data}`);
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
        <p>{token ? "Authenticated access" : "Guest mode (no token detected)"}</p>
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






// DashboardPage.jsx
// src/pages/DashboardPage.jsx  Working code for DashboardPage.jsx 07/06/2025 Token validation navigation
/*import React, { useEffect, useState } from "react";

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
*/

/*
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const refreshToken = localStorage.getItem("refreshToken");

  useEffect(() => {
    if (!token) {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      const urlRefresh = urlParams.get("refresh");

      if (urlToken && urlRefresh) {
        localStorage.setItem("jwtToken", urlToken);
        localStorage.setItem("refreshToken", urlRefresh);
        setToken(urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        window.location.href = "/login";
      }
    }
  }, [token]);

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("http://localhost:8081/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("jwtToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        setToken(data.accessToken);
        return data.accessToken;
      } else {
        throw new Error("Refresh failed");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return null;
    }
  };

  const navigateTo = async (path, method = "GET") => {
    const url = path.startsWith("http") ? path : `http://localhost:8081${path}`;

    const sendRequest = async (tokenToUse) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenToUse}`,
        "Cache-Control": "no-cache",
      };

      const options = {
        method,
        headers,
        credentials: "include",
      };

      if (method !== "GET") {
        options.body = JSON.stringify({ token: tokenToUse });
      }

      return fetch(url, options);
    };

    try {
      let response = await sendRequest(token);

      // Try refreshing token on 401
      if (response.status === 401) {
        console.warn("Token expired, trying to refresh...");
        const newToken = await refreshAccessToken();
        if (newToken) {
          response = await sendRequest(newToken);
        }
      }

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        const data = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();
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
    localStorage.removeItem("refreshToken");
    window.location.href = "/logout";
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
*/

/*import React, { useEffect, useState, useCallback } from "react";

const DashboardPage = () => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken"));

  // Helper to parse query params or hash params (OAuth2 often uses hash)
  const getParams = () => {
    // First try URL query params
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has("token") && queryParams.has("refresh")) {
      return {
        token: queryParams.get("token"),
        refresh: queryParams.get("refresh"),
      };
    }

    // Then try hash params like #access_token=xxx&refresh_token=yyy
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1)); // remove '#'
      if (hashParams.has("access_token") && hashParams.has("refresh_token")) {
        return {
          token: hashParams.get("access_token"),
          refresh: hashParams.get("refresh_token"),
        };
      }
      // Or generic 'token' and 'refresh' keys in hash
      if (hashParams.has("token") && hashParams.has("refresh")) {
        return {
          token: hashParams.get("token"),
          refresh: hashParams.get("refresh"),
        };
      }
    }

    return null;
  };

  useEffect(() => {
    if (!token) {
      const params = getParams();

      if (params && params.token && params.refresh) {
        // Save tokens to localStorage and React state
        localStorage.setItem("jwtToken", params.token);
        localStorage.setItem("refreshToken", params.refresh);
        setToken(params.token);
        setRefreshToken(params.refresh);

        // Clean URL to remove tokens from address bar
        if (window.history.replaceState) {
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      } else {
        // No tokens found, redirect to login
        window.location.href = "/login";
      }
    }
  }, [token]);

  // Function to check if token expired (same as before)
  const isTokenExpired = (jwt) => {
    if (!jwt) return true;
    try {
      const payload = JSON.parse(atob(jwt.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (e) {
      console.error("Token parse error:", e);
      return true;
    }
  };

  // Refresh token function wrapped with useCallback
  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8081/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("jwtToken", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
          setRefreshToken(data.refreshToken);
        }
        setToken(data.accessToken);
        return data.accessToken;
      } else {
        throw new Error("Refresh failed");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    }
  }, [refreshToken]);

  // Token refresh interval check (unchanged)
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentToken = localStorage.getItem("jwtToken");
      if (isTokenExpired(currentToken)) {
        console.warn("Access token expired. Attempting refresh...");
        const newToken = await refreshAccessToken();
        if (!newToken) {
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [refreshAccessToken]);

  // navigateTo, handleLogout, UI code... remain the same as you had

  // -- Your component UI code here (modules etc.)

  return (
    <>
      
    </>
  );
};

export default DashboardPage;
*/



//fully working code for DashboardPage.jsx with token validation and navigation

//newer update:
/*
import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (!token) {
      // Try to get token from URL query param
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        // Save token to localStorage and update state
        localStorage.setItem("jwtToken", urlToken);
        setToken(urlToken);
        setIsAuthenticated(true);

        // Remove token from URL without reloading the page
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        // No token anywhere — user is not authenticated
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(true);
    }
  }, [token]);

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
    localStorage.removeItem("jwtToken");
    setToken(null);
    setIsAuthenticated(false);
    // Instead of redirecting, just show the unauthenticated UI below
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

  if (!isAuthenticated) {
    // Show a simple message if user is not logged in
    return (
      <div className="container text-center my-5">
        <h2>You are not logged in.</h2>
        <p>Please <a href="/login">login here</a> to access the dashboard.</p>
      </div>
    );
  }

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

 /* if (!isAuthenticated) {
    return (
      <div className="container text-center my-5">
        <h2>You are not logged in.</h2>
        <p>Please <a href="/login">login here</a> to access the dashboard.</p>
      </div>
    );
  }*/

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