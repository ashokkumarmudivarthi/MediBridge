/*import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PatientRegistrationPage from './pages/PatientRegistration';
import TokenChecker from './components/TokenChecker'; 
import './App.css';
import Logout from "./pages/Logout";

const App = () => (
  <Router>
    <TokenChecker />
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/patients" element={<div>Patients Page</div>} />
      <Route path="/appointments" element={<div>Appointments Page</div>} />
      <Route path="/doctors" element={<div>Doctors Page</div>} />
      <Route path="/medical-records" element={<div>Medical Records Page</div>} />
      <Route path="/billing" element={<div>Billing Page</div>} />
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register-patient" element={<PatientRegistrationPage />} />
      <Route path="/logout" element={<Logout />} />
    </Routes>
  </Router>
);

export default App;
*/


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PatientRegistrationPage from "./pages/PatientRegistration";
import TokenChecker from "./components/TokenChecker";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import AddMedicalRecordPage from "./pages/AddMedicalRecordPage";
import PatientList from "./pages/PatientList";

import "./App.css";

const App = () => (
  <Router>
    <TokenChecker />
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-patient" element={<PatientRegistrationPage />} />
      
      <Route path="/logout" element={<Logout />} />

      {/* Protected Routes */}
      {/* Admin can access dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      {/* Patient can access patients page */}
    {/* Patient can access patients page */}
<Route element={<ProtectedRoute allowedRoles={["ROLE_PATIENT"]} />}>
  <Route path="/patients" element={<PatientDashboardPage />} />
</Route>

  {/* Admin + Doctor → View patient list */}
<Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_DOCTOR"]} />}>
  <Route path="/patient-list" element={<PatientList />} />
</Route>
      {/* Doctor can access appointments page */}
   <Route element={<ProtectedRoute allowedRoles={["ROLE_DOCTOR"]} />}>
  <Route path="/doctors" element={<DoctorDashboardPage />} />
  <Route path="/medical-records/new" element={<AddMedicalRecordPage />} />
</Route>

      {/* Catch all route: redirect unknown to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;






