import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE;

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

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

    // Fetch patient appointments
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/patient`, {
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

    // Fetch patient's medical records
    const fetchMedicalRecords = async () => {
      try {
        const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setMedicalRecords(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch medical records", error);
      }
    };

    fetchProfile();
    fetchAppointments();
    fetchMedicalRecords();
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

      <header className="bg-info text-white text-center py-4">
        <h1>Patient Dashboard</h1>
        <p>View your appointments and medical records</p>
      </header>

      <div className="container my-5">
        <div className="mb-4">
          <h3>Upcoming Appointments ({appointments.length})</h3>
          {appointments.length === 0 ? (
            <p>No upcoming appointments.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.doctorName}</td>
                    <td>{new Date(appt.dateTime).toLocaleString()}</td>
                    <td>{appt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mb-4">
          <h3>Medical Records</h3>
          {medicalRecords.length === 0 ? (
            <p>No medical records available.</p>
          ) : (
            <ul className="list-group">
              {medicalRecords.map((record) => (
                <li key={record.id} className="list-group-item">
                  <strong>Date:</strong> {new Date(record.recordDate).toLocaleDateString()} <br />
                  <strong>Description:</strong> {record.description} <br />
                  <strong>Doctor:</strong> {record.doctorName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="btn btn-primary" onClick={() => navigate("/book-appointment")}>
          Book New Appointment
        </button>
      </div>
    </>
  );
};

export default PatientDashboardPage;
