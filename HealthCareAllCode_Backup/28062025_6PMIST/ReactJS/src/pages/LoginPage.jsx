/*/////// Role based login with OAuth2 and manual login and disabling of OAuth2 login buttons for GitHub///////


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import PatientDashboardPage from "./PatientDashboardPage";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;
  const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;

  useEffect(() => {
    const redirectByRole = (role) => {
      if (role === "ROLE_ADMIN") {
        navigate(`/dashboard?token=${token}`);
      } else if (role === "ROLE_PATIENT") {
        navigate("/patients");
      } else if (role === "ROLE_DOCTOR") {
        navigate("/doctors");
      } else {
        navigate("/login");
      }
    };

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
      console.log("OAuth Token saved to localStorage:", token);
      setMessage("OAuth2 Login Successful ✅");

      // Decode role from JWT token:
      const roleFromToken = getUserRoleFromToken(token) || "ROLE_ADMIN";
      localStorage.setItem("userRole", roleFromToken);
      setRole(roleFromToken);

      redirectByRole(roleFromToken);

      // Clean URL query params
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [navigate]);

  // Helper to decode role from token
  const getUserRoleFromToken = (token) => {
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload.role || null;
    } catch {
      return null;
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      console.log("AUTH_SERVICE_URL =", AUTH_SERVICE_URL);
      const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, credentials);
      const { token, role, message } = response.data;

      if (token) {
        localStorage.setItem("jwtToken", token);

        // Always store role with prefix "ROLE_"
        const normalizedRole = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
        localStorage.setItem("userRole", normalizedRole);
        setRole(normalizedRole);

        setMessage(message || "Login successful!");

        // Redirect by role
        if (normalizedRole === "ROLE_ADMIN") {
          navigate("/dashboard");
        } else if (normalizedRole === "ROLE_PATIENT") {
          navigate("/patients");
        } else if (normalizedRole === "ROLE_DOCTOR") {
          navigate("/doctors");
        } else {
          navigate("/login");
        }
      } else {
        console.error("Token missing in response.");
        setError("Login successful, but token is missing.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Login failed. Please try again later.");
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="login-container bg-white p-4 rounded shadow" style={{ maxWidth: 400 }}>
        <h2 className="text-success text-center mb-4">Welcome to WellnessWave</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && (
          <div className="alert alert-success">
            {message} <br />
            {role && (
              <>
                <strong>Role:</strong> {role}
              </>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              required
              className="form-control"
              value={credentials.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="form-control"
                value={credentials.password}
                onChange={handleChange}
              />
              <div className="input-group-append">
                <span
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-success btn-block">
            Sign In
          </button>

          <div className="d-flex justify-content-between mt-3">
            <button
              type="button"
              className="btn btn-dark btn-sm w-50 mr-2"
              onClick={() => {
                window.location.href = `${AUTH_SERVICE_URL}/oauth2/authorization/github`;
              }}
            >
              <i className="fab fa-github"></i> GitHub
            </button>

            <button
              type="button"
              className="btn btn-danger btn-sm w-50"
              onClick={() => {
                window.location.href = `${AUTH_SERVICE_URL}/oauth2/authorization/google`;
              }}
            >
              <i className="fab fa-google"></i> Google
            </button>
          </div>

          <div className="text-center mt-3">
            <a href={`${PATIENT_SERVICE_URL}/api/patients/register`}>Don't have an account? Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
*/


/*
// // LoginPage.jsx working with OAuth2 and manual login
// This code handles both OAuth2 login and manual login, with role-based redirection. as of 2025-06-27

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;
  //const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;

  useEffect(() => {
    const redirectByRole = (role) => {
      if (role === "ROLE_ADMIN") {
        navigate(`/dashboard?token=${token}`);
      } else if (role === "ROLE_PATIENT") {
        navigate("/patients");
      } else if (role === "ROLE_DOCTOR") {
        navigate("/doctors");
      } else {
        navigate("/login");
      }
    };

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
      console.log("OAuth Token saved to localStorage:", token);
      setMessage("OAuth2 Login Successful ✅");

      const roleFromToken = getUserRoleFromToken(token) || "ROLE_ADMIN";
      localStorage.setItem("userRole", roleFromToken);
      setRole(roleFromToken);

      redirectByRole(roleFromToken);

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [navigate]);

  const getUserRoleFromToken = (token) => {
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload.role || null;
    } catch {
      return null;
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      console.log("AUTH_SERVICE_URL =", AUTH_SERVICE_URL);
      const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, credentials);
      const { token, role, message } = response.data;

      if (token) {
        localStorage.setItem("jwtToken", token);

        const normalizedRole = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
        localStorage.setItem("userRole", normalizedRole);
        setRole(normalizedRole);

        setMessage(message || "Login successful!");

        if (normalizedRole === "ROLE_ADMIN") {
          navigate("/dashboard");
        } else if (normalizedRole === "ROLE_PATIENT") {
          navigate("/patients");
        } else if (normalizedRole === "ROLE_DOCTOR") {
          navigate("/doctors");
        } else {
          navigate("/login");
        }
      } else {
        console.error("Token missing in response.");
        setError("Login successful, but token is missing.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response && err.response.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Login failed. Please try again later.");
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="login-container bg-white p-4 rounded shadow" style={{ maxWidth: 400 }}>
        <h2 className="text-success text-center mb-4">Welcome to WellnessWave</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && (
          <div className="alert alert-success">
            {message} <br />
            {role && (
              <>
                <strong>Role:</strong> {role}
              </>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              required
              className="form-control"
              value={credentials.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="form-control"
                value={credentials.password}
                onChange={handleChange}
              />
              <div className="input-group-append">
                <span
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-success btn-block mt-3">
            Sign In
          </button>

          // Social OAuth Buttons 
          <div className="d-flex justify-content-between mt-4">
             ❌ GitHub OAuth temporarily disabled due to email issue 
            {/*
            <button
              type="button"
              className="btn btn-dark btn-sm w-50 mr-2"
              onClick={() => {
                window.location.href = `${AUTH_SERVICE_URL}/oauth2/authorization/github`;
              }}
            >
              <i className="fab fa-github"></i> GitHub
            </button>
            //}

            <button
              type="button"
              className="btn btn-danger btn-sm w-100"
              onClick={() => {
                window.location.href = `${AUTH_SERVICE_URL}/oauth2/authorization/google`;
              }}
            >
              <i className="fab fa-google"></i> Google
            </button>
          </div>

          <div className="text-center mt-3">
            <a href={`/launch-register-patient`}>Don't have an account? Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
// Note: The GitHub OAuth button is temporarily disabled due to email issues.
// Uncomment the button code when the issue is resolved.

*/

// Design modified with a new layout and improved user experience
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

  
useEffect(() => {
  const navigateByRole = (role) => {
    if (role === "ROLE_ADMIN") navigate("/dashboard");
    else if (role === "ROLE_PATIENT") navigate("/patients");
    else if (role === "ROLE_DOCTOR") navigate("/doctors");
    else navigate("/login");
  };

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    localStorage.setItem("jwtToken", token);
    setMessage("OAuth2 Login Successful ✅");

    const roleFromToken = getUserRoleFromToken(token) || "ROLE_ADMIN";
    localStorage.setItem("userRole", roleFromToken);
    setRole(roleFromToken);

    navigateByRole(roleFromToken);
    window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
  }
}, [navigate]);



  const getUserRoleFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role || null;
    } catch {
      return null;
    }
  };

  const navigateByRole = (role) => {
    if (role === "ROLE_ADMIN") navigate("/dashboard");
    else if (role === "ROLE_PATIENT") navigate("/patients");
    else if (role === "ROLE_DOCTOR") navigate("/doctors");
    else navigate("/login");
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError(""); setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, credentials);
      const { token, role: userRole, message } = res.data;

      if (token) {
        const normalized = userRole.startsWith("ROLE_") ? userRole : `ROLE_${userRole}`;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("userRole", normalized);
        setMessage(message || "Login successful!");
        setRole(normalized);
        navigateByRole(normalized);
      } else {
        setError("Login succeeded but no token returned.");
      }
    } catch (err) {
      if (err.response?.status === 401) setError("Invalid credentials");
      else setError("Login failed. Try again.");
    }
  };

  return (
    <>
      <header className="bg-success text-white text-center py-3 mb-4">
        <h2>WellnessWave Healthcare Portal 🌊</h2>
      </header>

      <div className="container-fluid d-flex flex-column flex-md-row justify-content-center align-items-center vh-100">
        {/* Left Section */}
        <div className="w-100 w-md-50 text-center px-4 mb-5 mb-md-0">
          <h1 className="text-success mb-3">Welcome to WellnessWave</h1>
          <p className="lead mb-4">
            Empowering health through technology. Book appointments, manage profiles, and more.
          </p>

          <button
            className="btn btn-outline-primary btn-lg"
            onClick={() => navigate("/launch-book-appointment")}
          >
            📅 Schedule Appointment (Public)
          </button>

          <div className="mt-4">
            <img
              src="/healthcare-banner.svg"
              alt="Healthcare"
              className="img-fluid"
              style={{ maxWidth: "80%" }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>

        {/* Right/Login Section */}
        <div className="bg-white shadow rounded p-4 w-100 w-md-25">
          <h4 className="text-center text-success mb-4">Login to Continue</h4>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && (
            <div className="alert alert-success">
              {message} {role && <> | <strong>{role}</strong></>}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                required
                className="form-control"
                value={credentials.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mt-3">
              <label>Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="form-control"
                  value={credentials.password}
                  onChange={handleChange}
                />
                <div className="input-group-append">
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </span>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-success w-100 mt-4">
              Sign In
            </button>

            <div className="text-center mt-3">
              <a href="/launch-register-patient">Don't have an account? Register</a>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <button
                type="button"
                className="btn btn-danger btn-sm w-100"
                onClick={() =>
                  window.location.href = `${AUTH_SERVICE_URL}/oauth2/authorization/google`
                }
              >
                <i className="fab fa-google"></i> Sign in with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
