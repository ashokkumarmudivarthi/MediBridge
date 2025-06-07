import React, { useEffect } from 'react';
import ModuleCard from '../components/ModuleCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // CSRF Token setup
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
      axios.defaults.headers.common['X-XSRF-TOKEN'] = csrfToken;
      console.log("✅ CSRF Token attached.");
    }

    // JWT Token (example: you can store it from login response)
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      console.log("✅ JWT Token present:", jwtToken);
    } else {
      console.warn("⚠️ No JWT Token found.");
    }
  }, []);

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  return (
    <div className="container py-5">
      <h2 className="text-center mb-5">Healthcare Web Application</h2>
      <div className="row">
        <ModuleCard title="Patient Module" iconClass="fa-user-injured" onClick={() => navigate("/patients")} />
        <ModuleCard title="Appointment Module" iconClass="fa-calendar-check" onClick={() => navigate("/appointments")} />
        <ModuleCard title="Doctor Module" iconClass="fa-user-md" onClick={() => navigate("/doctors")} />
        <ModuleCard title="Medical Record Module" iconClass="fa-file-medical" onClick={() => navigate("/medical-records")} />
        <ModuleCard title="Billing Module" iconClass="fa-file-invoice-dollar" onClick={() => navigate("/billing")} />
        <ModuleCard title="Login / Auth" iconClass="fa-sign-in-alt" onClick={() => navigate("/login")} />
      </div>
    </div>
  );
};

export default Home;
