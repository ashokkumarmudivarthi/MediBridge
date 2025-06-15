/*import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const navigate = useNavigate();

//Global host:

const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

  

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    localStorage.setItem("authToken", token);
    console.log('OAuth Token saved to localStorage:', token);
    setMessage("OAuth2 Login Successful ✅");
    
    // Optionally remove token from URL for a cleaner look
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
navigate('/dashboard');
  }
}, [navigate]);

// 👇 Manual login: Get token and redirect with query param like OAuth2


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
     // const response = await axios.post("http://localhost:8081/api/auth/login", credentials);
     console.log("AUTH_SERVICE_URL = ", process.env.REACT_APP_AUTH_SERVICE);
     const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, credentials);
      const { token, role, message } = response.data;

if (token) {
      localStorage.setItem("authToken", token);
      console.log("Manual login token saved to localStorage:", token);
      setMessage(message);
      setRole(role);
// 🔁 Redirect with token like OAuth2 flow
      setTimeout(() => {
       // window.location.href = "/dashboard?token=${token};
       window.location.href = `/dashboard?token=${token}`;
      }, 1000);}else {
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
            {role && <strong>Role:</strong>} {role}
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
            <a href={`${process.env.REACT_APP_PATIENT_SERVICE}/api/patients/register`}>Don't have an account? Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
*/
// working code for LoginPage.jsx
/*import React, { useState, useEffect } from "react";
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
  const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;

  // ✅ OAuth2 Login Token Flow
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
      console.log("OAuth Token saved to localStorage:", token);
      setMessage("OAuth2 Login Successful ✅");

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      navigate(`/dashboard?token=${token}`); // ✅ FIXED: use `token`, not jwtToken
    }
  }, [navigate]);

  // ✅ Manual login
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
        localStorage.setItem("jwtToken", token); // ✅ Store in localStorage
        console.log("Manual login token saved to localStorage:", token);
        setMessage(message);
        setRole(role);

        setTimeout(() => {
          navigate(`/dashboard?token=${token}`); // ✅ FIXED: use `token`, not jwtToken
        }, 1000);
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
            {role && <strong>Role:</strong>} {role}
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
            <a href={`${PATIENT_SERVICE_URL}/api/patients/register`}>
              Don't have an account? Register here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
*/


/////// Role based login with OAuth2 and manual login


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
  const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;

  useEffect(() => {
    const redirectByRole = (role) => {
      if (role === "ROLE_ADMIN") {
        navigate(`/dashboard?token=${token}`);
      } else if (role === "ROLE_PATIENT") {
        navigate("/patients");
      } else if (role === "ROLE_DOCTOR") {
        navigate("/appointments");
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
          navigate(`/dashboard?token=${token}`);
        } else if (normalizedRole === "ROLE_PATIENT") {
          navigate("/patients");
        } else if (normalizedRole === "ROLE_DOCTOR") {
          navigate("/appointments");
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
