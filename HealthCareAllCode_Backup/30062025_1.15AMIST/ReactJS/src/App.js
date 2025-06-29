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
import PatientInvoices from "./pages/PatientInvoices";
import AdminBillingDashboard from "./pages/AdminBillingDashboard"; // adjust path as needed
import CreateInvoice from "./pages/CreateInvoice"; // adjust path as needed
import ViewInvoices from "./pages/ViewInvoices"; // adjust path as needed
import UpdateInvoice from "./pages/UpdateInvoice"; // adjust path as needed
import DeleteInvoice from "./pages/DeleteInvoice"; // adjust path as needed
import SearchInvoice from "./pages/SearchInvoice"; // adjust path as needed
import AppointmentsHistory from "./pages/history/AppointmentsHistory"; // adjust path as needed
import VisitsHistory from "./pages/history/VisitsHistory"; // adjust path as needed
import MedicalRecordsHistory from "./pages/history/MedicalRecordsHistory"; // adjust path as needed
import InvoicesHistory from "./pages/history/InvoicesHistory"; // adjust path as needed
import DocumentsHistory from "./pages/history/DocumentsHistory"; // adjust path as needed 
import PatientHistoryPage from "./pages/history/PatientHistoryPage";
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
       

  <Route path="/admin/billing-dashboard" element={<AdminBillingDashboard />} />
  <Route path="/admin/billing/create" element={<CreateInvoice />} />
  <Route path="/admin/billing/list" element={<ViewInvoices />} />
  <Route path="/admin/billing/update" element={<UpdateInvoice />} />
  <Route path="/admin/billing/delete" element={<DeleteInvoice />} />
  <Route path="/admin/billing/search" element={<SearchInvoice />} /> {/* optional */}
  <Route path="/admin/billing/update/:id" element={<UpdateInvoice />} />
  <Route path="/admin/billing/delete/:id" element={<DeleteInvoice />} />



         
      </Route>

      {/* Patient Routes */}
      <Route element={<ProtectedRoute allowedRoles={["ROLE_PATIENT"]} />}>
        <Route path="/patients" element={<PatientDashboardPage />} />
        <Route path="/patients-bookappointment" element={<PatientScheduleAppointment />} />
        <Route path="/my-invoices" element={<PatientInvoices />} />
        <Route path="/patient/history" element={<PatientHistoryPage />} />
<Route path="/history/appointments" element={<AppointmentsHistory />} />
<Route path="/history/visits" element={<VisitsHistory />} />
<Route path="/history/medical-records" element={<MedicalRecordsHistory />} />
<Route path="/history/invoices" element={<InvoicesHistory />} />
<Route path="/history/documents" element={<DocumentsHistory />} />




        
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




