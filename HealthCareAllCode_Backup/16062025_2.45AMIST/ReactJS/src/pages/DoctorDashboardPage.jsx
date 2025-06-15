import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE || "http://localhost:8082";
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE || "http://localhost:8083";
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE || "http://localhost:8085";
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE || "http://localhost:8081";

const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${USER_SERVICE_URL}/api/profile`, {
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
      setDoctorId(data.id); // Set doctorId once profile is fetched
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  }, [token, navigate]);

  const fetchAppointments = useCallback(async () => {
    if (!doctorId) return;

    try {
      const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/doctor?doctorId=${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments(data || []);
      } else {
        console.warn("Appointments fetch failed with status", res.status);
        setAppointments([]);
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    }
  }, [token, doctorId]);

  const fetchPatientsCount = useCallback(async () => {
    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPatientsCount(data.count || 0);
      }
    } catch (error) {
      console.error("Failed to fetch patients count", error);
    }
  }, [token]);

  const fetchMedicalRecords = useCallback(async () => {
    if (!doctorId) return;
    try {
      const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMedicalRecords(data.data || []);
      } else {
        console.warn("Medical records fetch failed with status", res.status);
        setMedicalRecords([]);
      }
    } catch (error) {
      console.error("Failed to fetch medical records", error);
    }
  }, [doctorId, token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchPatientsCount();
  }, [token, fetchProfile, fetchPatientsCount, navigate]);

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
      fetchMedicalRecords();
    }
  }, [doctorId, fetchAppointments, fetchMedicalRecords]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    navigate("/login");
  };

  const handleAddRecord = () => {
    navigate("/medical-records/new");
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
        <p>Manage your appointments, patients, and medical records</p>
      </header>

      <div className="container my-5">
        <div className="mb-4">
          <h3>Summary</h3>
          <p><strong>Number of patients assigned:</strong> {patientsCount}</p>
          <p><strong>Upcoming Appointments:</strong> {appointments.length}</p>
        </div>

        <div className="text-end mt-3">
    <button className="btn btn-success" onClick={handleAddRecord}>
      <i className="fas fa-notes-medical me-2"></i> Add Medical Record
    </button>
  </div>

        <div className="card mb-4 shadow">
          <div className="card-header">
            <h4>Your Appointments</h4>
          </div>
          <div className="card-body">
            {appointments.length === 0 ? (
              <div className="alert alert-info">No upcoming appointments or access denied.</div>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id}>
                      <td>{appt.patientId || "N/A"}</td>
                      <td>{appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleString() : "N/A"}</td>
                      <td>{appt.status || "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card mb-4 shadow">
          <div className="card-header">
            <h4>Your Medical Records</h4>
          </div>
          <div className="card-body">
            {medicalRecords.length === 0 ? (
              <div className="alert alert-warning">No medical records available or access denied.</div>
            ) : (
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Patient ID</th>
                    <th>Diagnosis</th>
                    <th>Date</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.patientId}</td>
                      <td>{record.diagnosis}</td>
                      <td>{record.recordDate || "N/A"}</td>
                      <td>{record.notes || "No notes"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/*
        <div className="text-end">
          <button className="btn btn-success" onClick={handleAddRecord}>
            <i className="fas fa-notes-medical me-2"></i> Add Medical Record
          </button>
        </div>
        */}
      </div> 
    </>
  );
};

export default DoctorDashboardPage;
