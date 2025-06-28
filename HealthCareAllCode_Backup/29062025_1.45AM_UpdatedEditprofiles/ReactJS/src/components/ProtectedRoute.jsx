/*// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("jwtToken");
  const userRole = localStorage.getItem("userRole");

    console.log("Token:", token);
  console.log("User Role from localStorage:", userRole);
  console.log("Allowed Roles for this route:", allowedRoles);

  if (!token) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Role not authorized
    return <Navigate to="/login" replace />;
  }

  // Authorized, render nested routes/components
  return <Outlet />;
};

export default ProtectedRoute;
*/


//working code for ProtectedRoute component checking token and user role and expiry token

/*
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("jwtToken");
      const storedRole = localStorage.getItem("userRole");

      setToken(storedToken);
      setUserRole(storedRole);
      setLoading(false);
    };

    checkAuth();

    // Optional: Re-check token every time route changes
    const interval = setInterval(checkAuth, 500); // short-lived until we detect

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>🔄 Loading protected route...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
*/


//token expiry check and role based access control 80% working
/*
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
//import jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("jwtToken");
      const role = localStorage.getItem("userRole");

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("userRole");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setUserRole(role);
        }
      } catch (e) {
        console.error("Invalid token format");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userRole");
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>🔐 Checking access...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
*/


//working code for token expirey but google sign in not working in first attempt but second attempt is working
/*
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("jwtToken");
  const userRole = localStorage.getItem("userRole");

  // Check if token is valid and not expired
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userRole");
      alert("⚠️ Session expired. Please login again.");
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    return <Navigate to="/login" replace />;
  }

  // If role is not allowed
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
*/



import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("jwtToken");
      const role = localStorage.getItem("userRole");

      if (!token || !role) {
        setIsAuthorized(false);
      } else if (allowedRoles && !allowedRoles.includes(role)) {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }

      setIsAuthChecked(true); // ✅ Finish auth check
    };

    // Small timeout to allow TokenCatcher to finish storing token
    setTimeout(checkAuth, 200); // ⏳ Delay auth check slightly
  }, [allowedRoles]);

  if (!isAuthChecked) {
    return <div>🔐 Checking authentication...</div>;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
