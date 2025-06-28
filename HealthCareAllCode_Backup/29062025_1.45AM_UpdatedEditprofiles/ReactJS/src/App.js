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

// working version of App.js
// src/App.js
/*import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


import TokenCatcher from "./components/TokenCatcher";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import PatientRegistrationPage from "./pages/PatientRegistration";
import TokenChecker from "./components/TokenChecker";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import AddMedicalRecordPage from "./pages/AddMedicalRecordPage";
import PatientList from "./pages/PatientList";
import PatientManagement from "./pages/PatientManagement";
import PatientUpdateForm from "./pages/PatientUpdateForm"; // <-- import this
import AppointmentList from './pages/AppointmentList';
import ScheduleAppointment from './pages/ScheduleAppointment';
import AddDoctor from './pages/AddDoctor';
import DoctorViewList from './pages/DoctorViewList';
import DoctorUpdateForm from "./pages/DoctorUpdateForm"; // ✅ Add this
import DoctorManagement from "./pages/DoctorManagement"; // ✅
import AdminAddMedicalRecordPage from "./pages/AdminAddMedicalRecordPage";
import MedicalRecordsManagement from "./pages/MedicalRecordsManagement";
import MedicalRecordUpdateForm from "./pages/MedicalRecordUpdateForm"; // ✅ New import
import PatientScheduleAppointment from "./pages/PatientScheduleAppointment";
import InPatientDetailsPage from "./pages/InPatientDetailsPage";
import OutPatientDetailsPage from "./pages/OutPatientDetailsPage";
import AdminPatientDashboardPage from "./pages/AdminPatientDashboardPage"; // adjust path as needed
import AdminAppointmentPage from "./pages/AdminAppointmentPage";
import AdminDoctorPage from "./pages/AdminDoctorPage";
import AdminMedicalRecordsPage from "./pages/AdminMedicalRecordsPage";
import InPatientForm from "./pages/InPatientForm"; // adjust path as needed
import PatientVisitForm from "./pages/PatientVisitForm"; // adjust path as needed









import "./App.css";

const App = () => (
  <Router>
    <TokenChecker />
    <Routes>
      // Public Routes 
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-patient" element={<PatientRegistrationPage />} />
      
      <Route path="/logout" element={<Logout />} />

       Protected Routes 
       Admin can access dashboard 
      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/update-patient" element={<PatientManagement mode="update" />} />
       <Route path="/patients/update/:id" element={<PatientUpdateForm />} />
        <Route path="/delete-patient" element={<PatientManagement mode="delete" />} />
        <Route path="/search-patient" element={<PatientManagement mode="search" />} />
        <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
         <Route path="doctorsviewlist" element={<DoctorViewList />} />
         <Route path="/doctor/update/:id" element={<DoctorUpdateForm />} /> 
         <Route path="/search-doctor" element={<DoctorManagement mode="search"/>} />
          <Route path="/delete-doctor" element={<DoctorManagement mode="delete"/>} />
          <Route path="/update-doctor" element={<DoctorManagement mode="update"/>} />
          <Route path="/admin/medical-records/new" element={<AdminAddMedicalRecordPage />} />
          <Route path="/medical-records" element={<MedicalRecordsManagement />} />
<Route path="/medical-record/update/:id" element={<MedicalRecordUpdateForm />} />
<Route path="/admin/patients" element={<AdminPatientDashboardPage />} />
<Route path="/admin/appointments" element={<AdminAppointmentPage />} />
<Route path="/admin/doctors" element={<AdminDoctorPage />} />
<Route path="/admin/medical-records" element={<AdminMedicalRecordsPage />} />



      </Route>

      
    // Patient can access patients page 
    
<Route element={<ProtectedRoute allowedRoles={["ROLE_PATIENT"]} />}>
  <Route path="/patients" element={
    <>
      <TokenCatcher />
      <PatientDashboardPage />
    </>
  } />
  <Route path="/patients-bookappointment" element={<PatientScheduleAppointment />} />
</Route>

  //Admin + Doctor → View patient list 
<Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_DOCTOR"]} />}>
  <Route path="/patient-list" element={<PatientList />} />
  <Route path="/appointments-list" element={<AppointmentList />} />
  <Route path="/inpatient-form" element={<InPatientForm />} />
  <Route path="/add-patient-visit" element={<PatientVisitForm />} />
  
  
</Route>

      // Doctor can access appointments page 
   <Route element={<ProtectedRoute allowedRoles={["ROLE_DOCTOR"]} />}>
  <Route path="/doctors" element={<DoctorDashboardPage />} />
  <Route path="/medical-records/new" element={<AddMedicalRecordPage />} />
</Route>

// All can access In_patient and Out-Patient page 
   <Route element={<ProtectedRoute allowedRoles={["ROLE_DOCTOR","ROLE_ADMIN","ROLE_PATIENT"]} />}>
  <Route path="/inpatient-details" element={<InPatientDetailsPage />} />
  <Route path="/outpatient-details" element={<OutPatientDetailsPage />} />
</Route>

     // Catch all route: redirect unknown to login 
      <Route path="*" element={<Navigate to="/login" replace />} />
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
import AdminDashboardPage from "./pages/AdminDashboardPage";
import PatientRegistrationPage from "./pages/PatientRegistration";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import AddMedicalRecordPage from "./pages/AddMedicalRecordPage";
import PatientList from "./pages/PatientList";
import PatientManagement from "./pages/PatientManagement";
import PatientUpdateForm from "./pages/PatientUpdateForm";
import AppointmentList from "./pages/AppointmentList";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import AddDoctor from "./pages/AddDoctor";
import DoctorViewList from "./pages/DoctorViewList";
import DoctorUpdateForm from "./pages/DoctorUpdateForm";
import DoctorManagement from "./pages/DoctorManagement";
import AdminAddMedicalRecordPage from "./pages/AdminAddMedicalRecordPage";
import MedicalRecordsManagement from "./pages/MedicalRecordsManagement";
import MedicalRecordUpdateForm from "./pages/MedicalRecordUpdateForm";
import PatientScheduleAppointment from "./pages/PatientScheduleAppointment";
import InPatientDetailsPage from "./pages/InPatientDetailsPage";
import OutPatientDetailsPage from "./pages/OutPatientDetailsPage";
import AdminPatientDashboardPage from "./pages/AdminPatientDashboardPage";
import AdminAppointmentPage from "./pages/AdminAppointmentPage";
import AdminDoctorPage from "./pages/AdminDoctorPage";
import AdminMedicalRecordsPage from "./pages/AdminMedicalRecordsPage";
import InPatientForm from "./pages/InPatientForm";
import PatientVisitForm from "./pages/PatientVisitForm";
import TokenCatcher from "./components/TokenCatcher"; // ✅ Used to catch OAuth2 token
import LaunchPatientRegistrationPage from "./pages/LaunchPatientRegistrationPage";
import LaunchPatientBookAppointment from "./pages/LaunchPatientBookAppointment";
import UploadPatientDocument from "./pages/UploadPatientDocument"; // adjust path
//import Layout from "./components/Layout";
import TokenExpiryWatcher from "./components/TokenExpiryWatcher";
import EditProfilePage from "./pages/EditProfilePage";
import AdminEditUserPage from "./pages/AdminEditUserPage";
import PatientProfile from "./pages/PatientProfile";






import "./App.css";

const App = () => (
  <Router>
    {/* ✅ TokenCatcher must run outside Routes to catch token from URL */}
    <TokenCatcher />
    <TokenExpiryWatcher /> 

    <Routes>
      {/* Public Routes */}
     
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-patient" element={<PatientRegistrationPage />} />
      <Route path="/launch-register-patient" element={<LaunchPatientRegistrationPage />} />
      <Route path="/launch-book-appointment" element={<LaunchPatientBookAppointment />} />
      <Route path="/upload-document" element={<UploadPatientDocument />} />
      <Route path="/logout" element={<Logout />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        <Route path="/update-patient" element={<PatientManagement mode="update" />} />
        <Route path="/patients/update/:id" element={<PatientUpdateForm />} />
        <Route path="/delete-patient" element={<PatientManagement mode="delete" />} />
        <Route path="/search-patient" element={<PatientManagement mode="search" />} />
        <Route path="/schedule-appointment" element={<ScheduleAppointment />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/doctorsviewlist" element={<DoctorViewList />} />
        <Route path="/doctor/update/:id" element={<DoctorUpdateForm />} />
        <Route path="/search-doctor" element={<DoctorManagement mode="search" />} />
        <Route path="/delete-doctor" element={<DoctorManagement mode="delete" />} />
        <Route path="/update-doctor" element={<DoctorManagement mode="update" />} />
        <Route path="/admin/medical-records/new" element={<AdminAddMedicalRecordPage />} />
        <Route path="/medical-records" element={<MedicalRecordsManagement />} />
        <Route path="/medical-record/update/:id" element={<MedicalRecordUpdateForm />} />
        <Route path="/admin/patients" element={<AdminPatientDashboardPage />} />
        <Route path="/admin/appointments" element={<AdminAppointmentPage />} />
        <Route path="/admin/doctors" element={<AdminDoctorPage />} />
        <Route path="/admin/medical-records" element={<AdminMedicalRecordsPage />} />
         <Route path="/admin/edit-user/:id" element={<AdminEditUserPage />} />
         
      </Route>

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_PATIENT"]} />}>
        <Route path="/patients" element={<PatientDashboardPage />} />
        <Route path="/patients-bookappointment" element={<PatientScheduleAppointment />} />
        
      </Route>

      {/* Admin + Doctor Shared Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_DOCTOR"]} />}>
        <Route path="/patient-list" element={<PatientList />} />
        <Route path="/appointments-list" element={<AppointmentList />} />
        <Route path="/inpatient-form" element={<InPatientForm />} />
        <Route path="/add-patient-visit" element={<PatientVisitForm />} />
      </Route>

      {/* Doctor Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_DOCTOR"]} />}>
        <Route path="/doctors" element={<DoctorDashboardPage />} />
        <Route path="/medical-records/new" element={<AddMedicalRecordPage />} />
        <Route path="/doctor/patient/:id" element={<PatientProfile />} />
      </Route>

      {/* Shared by all roles */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_DOCTOR", "ROLE_ADMIN", "ROLE_PATIENT"]} />}>
        <Route path="/inpatient-details" element={<InPatientDetailsPage />} />
        <Route path="/outpatient-details" element={<OutPatientDetailsPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/profile" element={<EditProfilePage />} />
          <Route path="/doctor/patient/:id" element={<PatientProfile />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Router>
);

export default App;




