// src/components/ProtectedRoute.jsx
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
