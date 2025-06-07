/*import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Logout from "./pages/Logout";


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      <Route path="/patients" element={<div>Patients Page</div>} />
      <Route path="/appointments" element={<div>Appointments Page</div>} />
      <Route path="/doctors" element={<div>Doctors Page</div>} />
      <Route path="/medical-records" element={<div>Medical Records Page</div>} />
      <Route path="/billing" element={<div>Billing Page</div>} />
      <Route path="/login" element={<div>Login Page</div>} />
      <Route path="/dashboard" element={<DashboardPage />} />


      <Route path="/logout" element={<Logout />} />
    </Routes>
  </Router>
);

export default App;
*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
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
      <Route path="/logout" element={<Logout />} />
    </Routes>
  </Router>
);

export default App;

