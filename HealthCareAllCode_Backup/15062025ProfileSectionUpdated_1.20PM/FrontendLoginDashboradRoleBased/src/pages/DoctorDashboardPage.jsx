import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE;

const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const [appointments, setAppointments] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch profile info
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${USER_SERVICE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 401) {
          localStorage.removeItem("jwtToken");
          navigate("/login");
          return;
        }
        const data = await res.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
      } catch (error) {
        console.error("Profile fetch error", error);
      }
    };

    // Fetch doctor appointments
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/doctor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      }
    };

    // Fetch number of patients assigned to doctor
    const fetchPatientsCount = async () => {
      try {
        const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/patients/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setPatientsCount(data.count || 0);
        }
      } catch (error) {
        console.error("Failed to fetch patients count", error);
      }
    };

    fetchProfile();
    fetchAppointments();
    fetchPatientsCount();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              type="button"
              style={{ textDecoration: "none" }}
            >
              <i className="fas fa-user-circle"></i> Profile
            </button>
            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <div className="dropdown-item-text">
                <strong>Username:</strong> {username} <br />
                <strong>Role:</strong> {role}
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => navigate("/profile")} type="button">
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button className="dropdown-item" onClick={handleLogout} type="button">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>

      <header className="bg-primary text-white text-center py-4">
        <h1>Doctor Dashboard</h1>
        <p>Manage your appointments and patients efficiently</p>
      </header>

      <div className="container my-5">
        <div className="mb-4">
          <h3>Summary</h3>
          <p><strong>Number of patients assigned:</strong> {patientsCount}</p>
          <p><strong>Upcoming Appointments:</strong> {appointments.length}</p>
        </div>

        <div className="card mb-4 shadow">
          <div className="card-header">
            <h4>Your Appointments</h4>
          </div>
          <div className="card-body">
            {appointments.length === 0 ? (
              <p>No upcoming appointments.</p>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id}>
                      <td>{appt.patientName}</td>
                      <td>{new Date(appt.dateTime).toLocaleString()}</td>
                      <td>{appt.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <button className="btn btn-success" onClick={() => navigate("/add-medical-record")}>
          Add Medical Record
        </button>
      </div>
    </>
  );
};

export default DoctorDashboardPage;
