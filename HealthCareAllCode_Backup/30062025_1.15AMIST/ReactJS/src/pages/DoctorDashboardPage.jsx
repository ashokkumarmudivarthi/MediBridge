
/*import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE || "http://localhost:8082";
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE || "http://localhost:8083";
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE || "http://localhost:8085";
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE || "http://localhost:8081";
const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE || "http://localhost:8084";

const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);

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
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  }, [token, navigate]);

  const fetchDoctorProfile = useCallback(async () => {
    try {
      const res = await fetch(`${DOCTOR_SERVICE_URL}/api/doctors/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setDoctorProfile(data);
        setDoctorId(data.id);
      } else {
        console.warn("Doctor profile fetch failed with status", res.status);
      }
    } catch (err) {
      console.error("Doctor profile fetch failed", err);
    }
  }, [token]);

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
    fetchDoctorProfile();
    fetchPatientsCount();
  }, [token, fetchProfile, fetchDoctorProfile, fetchPatientsCount, navigate]);

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
              type="button"
            >
              <i className="fas fa-user-circle"></i> Profile
            </button>
            <div className="dropdown-menu dropdown-menu-end">
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
        <p>Welcome, {doctorProfile?.doctor_name || "Doctor"} — Manage your appointments & patients</p>
      </header>

      <div className="container my-4">
        {doctorProfile && (
          <div className="mb-4 p-3 border bg-light rounded shadow-sm">
            <h4>👨‍⚕️ Doctor Info</h4>
            <p><strong>Name:</strong> {doctorProfile.doctor_name}</p>
            <p><strong>Specialization:</strong> {doctorProfile.specialization}</p>
            <p><strong>Hospital:</strong> {doctorProfile.hospital_name}</p>
            <p><strong>Availability:</strong> {doctorProfile.availability}</p>
          </div>
        )}

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
                      <td>
                        <Link to={`/doctor/patient/${appt.patientId}`} className="text-decoration-none text-primary">
                          {appt.patientId}
                        </Link>
                      </td>
                      <td>{appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleString() : "N/A"}</td>
                      <td>{appt.status || "Pending"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
// Medical Records Section 
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
                      <td>
                        <Link to={`/doctor/patient/${record.patientId}`} className="text-decoration-none text-primary">
                          {record.patientId}
                        </Link>
                      </td>
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
      </div>
    </>
  );
};

export default DoctorDashboardPage;
*/

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE || "http://localhost:8082";
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE || "http://localhost:8083";
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE || "http://localhost:8085";
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE || "http://localhost:8081";
const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE || "http://localhost:8084";

const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patientsCount, setPatientsCount] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [showStats, setShowStats] = useState(false);

  const fetchData = useCallback(async () => {
    if (!token) return navigate("/login");

    try {
      const profileRes = await fetch(`${USER_SERVICE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileData = await profileRes.json();
      setUsername(profileData.username || "N/A");
      setRole(profileData.role || "N/A");

      const doctorRes = await fetch(`${DOCTOR_SERVICE_URL}/api/doctors/my-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const doctorData = await doctorRes.json();
      setDoctorProfile(doctorData);
      setDoctorId(doctorData.id);

      const patientRes = await fetch(`${PATIENT_SERVICE_URL}/api/patients/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const patientData = await patientRes.json();
      setPatientsCount(patientData.count || 0);
    } catch (err) {
      console.error("Error fetching profile/doctor/patients", err);
    }
  }, [token, navigate]);

  const fetchAppointments = useCallback(async () => {
    if (!doctorId) return;

    try {
      const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/doctor?doctorId=${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(data || []);
    } catch (err) {
      console.error("Error fetching appointments", err);
    }
  }, [token, doctorId]);

  const fetchMedicalRecords = useCallback(async () => {
    if (!doctorId) return;

    try {
      const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/doctor/${doctorId}/assigned-patients-records`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMedicalRecords(data.data || []);
    } catch (err) {
      console.error("Error fetching medical records", err);
    }
  }, [token, doctorId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleAddRecord = () => navigate("/medical-records/new");

  const statsData = {
    labels: ['Patients', 'Appointments', 'Medical Records'],
    datasets: [
      {
        label: 'Count',
        data: [patientsCount, appointments.length, medicalRecords.length],
        backgroundColor: ['#007bff', '#ffc107', '#28a745'],
      },
    ],
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown" type="button">
              <i className="fas fa-user-circle"></i> Profile
            </button>
            <div className="dropdown-menu dropdown-menu-end">
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
        <p>Welcome, {doctorProfile?.doctor_name || "Doctor"} — Manage your appointments & patients</p>
      </header>

      <div className="container my-4">
        {doctorProfile && (
          <div className="mb-4 p-3 border bg-light rounded shadow-sm">
            <h4>👨‍⚕️ Doctor Info</h4>
            <p><strong>Name:</strong> {doctorProfile.doctor_name}</p>
            <p><strong>Specialization:</strong> {doctorProfile.specialization}</p>
            <p><strong>Hospital:</strong> {doctorProfile.hospital_name}</p>
            <p><strong>Availability:</strong> {doctorProfile.availability}</p>
          </div>
        )}

        <div className="mb-4">
          <h3>Summary</h3>
          <p><strong>Number of patients assigned:</strong> {patientsCount}</p>
          <p><strong>Upcoming Appointments:</strong> {appointments.length}</p>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <button className="btn btn-success" onClick={handleAddRecord}>
            <i className="fas fa-notes-medical me-2"></i> Add Medical Record
          </button>
          <button className="btn btn-outline-info" onClick={() => setShowStats(!showStats)}>
            📊 {showStats ? 'Hide Statistics' : 'View Statistics'}
          </button>
        </div>

        {showStats && (
          <div className="card mb-4 p-3 shadow">
            <h4 className="mb-3">📈 Dashboard Statistics</h4>
            <Bar data={statsData} />
          </div>
        )}

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
                      <td>
                        <Link to={`/doctor/patient/${appt.patientId}`} className="text-decoration-none text-primary">
                          {appt.patientId}
                        </Link>
                      </td>
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
                      <td>
                        <Link to={`/doctor/patient/${record.patientId}`} className="text-decoration-none text-primary">
                          {record.patientId}
                        </Link>
                      </td>
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
      </div>
    </>
  );
};

export default DoctorDashboardPage;

