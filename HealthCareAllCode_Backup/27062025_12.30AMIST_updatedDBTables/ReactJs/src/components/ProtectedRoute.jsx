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
