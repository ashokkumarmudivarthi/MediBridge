/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Environment variables for service URLs
const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [user, setUser] = useState({});
  const [patient, setPatient] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  // Fetch profile and patient details
  useEffect(() => {
    if (!token) return;

    const fetchProfileAndPatient = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setUser(data);

        const patientRes = await fetch(`${PATIENT_SERVICE_URL}/api/patients/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (patientRes.ok) {
          const patientData = await patientRes.json();
          setPatient(patientData);
        } else {
          console.warn("No patient found for this user.");
        }
      } catch (err) {
        console.error("Error fetching profile or patient info:", err);
      }
    };

    fetchProfileAndPatient();
  }, [token]);

  // Fetch appointments
  useEffect(() => {
    if (!token || !patient.id) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/patients/${patient.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [token, patient.id]);

  // Fetch medical records
  useEffect(() => {
  if (!token || !patient.id) return;

  const fetchRecords = async () => {
    console.log("➡️ fetchRecords for patient.id =", patient.id);
    try {
      const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient/${patient.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📦 fetchRecords status:", res.status);

      const data = await res.json();
      console.log("📝 medical Records raw data:", data);

      // ✅ Correct data extraction
      setMedicalRecords(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching medical records:", err);
    }
  };

  fetchRecords();
}, [token, patient.id]);


//Download medical records as PDF
const handleDirectDownload = async () => {
  try {
    const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient/${patient.id}/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "medical_records.csv"); // or "file.pdf"
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error("❌ File download error:", err);
    alert("Download failed.");
  }
};




  // Logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  return (
    <>
      //Top nav 
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3"><strong>Username:</strong> {user.username}</span>
          <span className="me-3"><strong>Patient:</strong> {patient.name || "N/A"} (ID: {patient.id || "N/A"})</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-1"></i> Logout
          </button>
        </div>
      </nav>

       //Header 
      <header className="bg-info text-white text-center py-4">
        <h2>Welcome to WellnessWave, {patient.name || user.username}</h2>
        <p className="lead">Your personal healthcare dashboard</p>
      </header>

    //Dashboard 
      <div className="container mt-5">
        <div className="row g-4">

          // Appointments 
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">🗓️ Your Appointments</h5>
              </div>
              <div className="card-body">
                {appointments.length === 0 ? (
                  <p className="text-muted">No appointments scheduled.</p>
                ) : (
                  <ul className="list-group">
                    {appointments.map((appt, idx) => (
                      <li key={idx} className="list-group-item">
                        <strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}<br />
                        <strong>Doctor:</strong> {appt.doctorName}<br />
                        <strong>Status:</strong> {appt.status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/patients-bookappointment")}>
                  ➕ Schedule Appointment
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/appointments")}>
                  📋 View All
                </button>
              </div>
            </div>
          </div>

          // Medical Records 
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">📝 Your Medical Records</h5>
              </div>
              <div className="card-body">
                {medicalRecords.length === 0 ? (
                  <p className="text-muted">No medical records found.</p>
                ) : (
            <ul className="list-group">
  {medicalRecords.map((rec, idx) => {
  console.log("Medical Record Item:", rec);
  return (
    <li key={idx} className="list-group-item">
      <strong>Diagnosis:</strong> {rec.diagnosis}<br />
      <strong>Date:</strong> {new Date(rec.recordDate).toLocaleString()}<br />
      <strong>Doctor:</strong> {rec.doctorName || rec.doctorId}
    </li>
  );
})}

</ul>


                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                
               <button className="btn btn-outline-dark btn-sm" onClick={handleDirectDownload}>
  🖨️ Download
</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PatientDashboardPage;
*/


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [user, setUser] = useState({});
  const [patient, setPatient] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [visitRecords, setVisitRecords] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setUser(data);

        const patientRes = await fetch(`${PATIENT_SERVICE_URL}/api/patients/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (patientRes.ok) {
          const patientData = await patientRes.json();
          setPatient(patientData);
        }
      } catch (err) {
        console.error("Error fetching profile/patient:", err);
      }
    };

    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (!token || !patient.id) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/patients/${patient.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [token, patient.id]);

  useEffect(() => {
    if (!token || !patient.id) return;

    const fetchRecords = async () => {
      try {
        const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient/${patient.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setMedicalRecords(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Error fetching medical records:", err);
      }
    };

    fetchRecords();
  }, [token, patient.id]);

  useEffect(() => {
    if (!token) return;

    const fetchVisits = async () => {
      try {
        const res = await fetch(`${PATIENT_SERVICE_URL}/api/patient-visits/my-visits`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setVisitRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching visit records:", err);
      }
    };

    fetchVisits();
  }, [token]);

  const handleDownloadRecords = async () => {
    try {
      const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient/${patient.id}/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", "medical_records.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert("Download failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-light bg-light px-3">
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3"><strong>User:</strong> {user.username}</span>
          <span className="me-3"><strong>Patient:</strong> {patient.name || "N/A"} (ID: {patient.id || "N/A"})</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Header Section */}
      <header className="bg-info text-white text-center py-4">
        <h2>Welcome to WellnessWave, {patient.name || user.username}</h2>
        <p className="lead">Your personal healthcare dashboard</p>
      </header>

      {/* Main Dashboard Cards */}
      <div className="container mt-5">
        <div className="row g-4">

          {/* Appointments Card */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5>🗓️ Your Appointments</h5>
              </div>
              <div className="card-body">
                {appointments.length === 0 ? (
                  <p>No appointments found.</p>
                ) : (
                  <ul className="list-group">
                    {appointments.map((appt, i) => (
                      <li key={i} className="list-group-item">
                        <strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}<br />
                        <strong>Doctor:</strong> {appt.doctorName}<br />
                        <strong>Status:</strong> {appt.status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/patients-bookappointment")}>➕ Book</button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/appointments")}>📋 View All</button>
              </div>
            </div>
          </div>

          {/* Visit Records Card */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">
                <h5>🏥 In/Out-Patient Visits</h5>
              </div>
              <div className="card-body">
                {visitRecords.length === 0 ? (
                  <p>No visit records found.</p>
                ) : (
                  <ul className="list-group">
                    {visitRecords.map((v, i) => (
                      <li key={i} className="list-group-item">
                        <strong>Visit ID:</strong> {v.visitId}<br />
                        <strong>Visit Type:</strong> {v.visitType}<br />
                        <strong>Status:</strong> {v.status}<br />
                        <strong>Admission:</strong> {v.admissionDate ? new Date(v.admissionDate).toLocaleDateString() : 'N/A'}<br />
                        <strong>Discharge:</strong> {v.dischargeDate ? new Date(v.dischargeDate).toLocaleDateString() : 'N/A'}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-outline-dark btn-sm" onClick={() => navigate("/inpatient-details")}>In-Patient</button>
                <button className="btn btn-outline-dark btn-sm" onClick={() => navigate("/outpatient-details")}>Out-Patient</button>
              </div>
            </div>
          </div>

          {/* Medical Records Card */}
          <div className="col-md-12">
            <div className="card shadow-sm mt-4">
              <div className="card-header bg-success text-white">
                <h5>📝 Medical Records</h5>
              </div>
              <div className="card-body">
                {medicalRecords.length === 0 ? (
                  <p>No medical records found.</p>
                ) : (
                  <ul className="list-group">
                    {medicalRecords.map((rec, i) => (
                      <li key={i} className="list-group-item">
                        <strong>Diagnosis:</strong> {rec.diagnosis}<br />
                        <strong>Date:</strong> {new Date(rec.recordDate).toLocaleString()}<br />
                        <strong>Doctor:</strong> {rec.doctorName || rec.doctorId}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer d-flex justify-content-end">
                <button className="btn btn-outline-dark btn-sm" onClick={handleDownloadRecords}>🖨️ Download</button>
              </div>
            </div>
          </div>

          {/* Upload Document Card */}
          <div className="col-md-12">
            <div className="card shadow-sm mt-4">
              <div className="card-header bg-secondary text-white">
                <h5>📁 Upload Documents</h5>
              </div>
              <div className="card-body">
                <p>You can upload reports, prescriptions, scans, or any other documents related to your healthcare.</p>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate("/upload-document")}
                >
                  ⬆️ Upload Now
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PatientDashboardPage;
