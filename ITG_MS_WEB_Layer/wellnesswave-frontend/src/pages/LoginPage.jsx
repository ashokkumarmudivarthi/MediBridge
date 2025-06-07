// Enhanced code with JWT authentication, error handling, and role display 07/06/2025
import React, { useState, useEffect } from "react";
import axios from "axios";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  if (token) {
    localStorage.setItem("jwtToken", token);
    setMessage("OAuth2 Login Successful ✅");
    
    // Optionally remove token from URL for a cleaner look
    const cleanUrl = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }
}, []);

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
      const response = await axios.post("http://localhost:8081/api/auth/login", credentials);
      const { token, role, message } = response.data;

      localStorage.setItem("jwtToken", token);
      setMessage(message);
      setRole(role);
// 🔁 Redirect with token like OAuth2 flow
      setTimeout(() => {
       // window.location.href = "/dashboard?token=${token};
       window.location.href = `/dashboard?token=${token}`;
      }, 1000);
    } catch (err) {
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
                window.location.href = "http://localhost:8081/oauth2/authorization/github";
              }}
            >
              <i className="fab fa-github"></i> GitHub
            </button>

            <button
              type="button"
              className="btn btn-danger btn-sm w-50"
              onClick={() => {
                window.location.href = "http://localhost:8081/oauth2/authorization/google";
              }}
            >
              <i className="fab fa-google"></i> Google
            </button>
          </div>

          <div className="text-center mt-3">
            <a href="/api/patients/register">Don't have an account? Register here</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
