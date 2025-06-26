import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const InPatientDetailsPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [user, setUser] = useState({});
  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);

  // Fetch profile + patient info
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);

        const patientRes = await fetch(`${PATIENT_SERVICE_URL}/api/patients/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (patientRes.ok) {
          const pdata = await patientRes.json();
          setPatient(pdata);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    fetchProfile();
  }, [token]);

  // Fetch In-Patient Visits
  useEffect(() => {
    if (!token) return;

    const fetchVisits = async () => {
      try {
        const res = await fetch(`${PATIENT_SERVICE_URL}/api/patient-visits/my-visits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const inPatients = data.filter((v) => v.visitType === "in-patient");
        setVisits(inPatients);
      } catch (err) {
        console.error("Error fetching in-patient visits:", err);
      }
    };

    fetchVisits();
  }, [token]);

  // Download CSV of visit history
  const handleDownload = () => {
    const csv = [
      ["Visit ID", "Admission Date", "Discharge Date", "Room Number", "Status", "Doctor ID", "Patient ID"],
      ...visits.map(v => [
        v.visitId,
        v.admissionDate ? new Date(v.admissionDate).toLocaleDateString() : "",
        v.dischargeDate ? new Date(v.dischargeDate).toLocaleDateString() : "",
        v.roomNumber,
        v.status,
        v.assignedDoctorId,
        v.patientId
      ])
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "in_patient_history.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  return (
    <>
      {/* Top nav */}
      <nav className="navbar navbar-light bg-light px-3">
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3"><strong>User:</strong> {user.username}</span>
          <span className="me-3"><strong>Patient:</strong> {patient.name || "N/A"} (ID: {patient.id || "N/A"})</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-info text-white text-center py-4">
        <h2>🏥 In-Patient Visit History - WellnessWave</h2>
        <p className="lead">Review your past in-patient admissions and discharge details</p>
      </header>

      {/* Main Table */}
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>In-Patient Visit Records</h4>
          <div>
            <button className="btn btn-outline-secondary me-2 btn-sm" onClick={() => navigate("/patients")}>⬅️ Back to Dashboard</button>
            <button className="btn btn-outline-dark btn-sm" onClick={handleDownload}>🖨️ Download CSV</button>
          </div>
        </div>

        {visits.length === 0 ? (
          <p className="text-muted">No in-patient visit records found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Visit ID</th>
                  <th>Admission Date</th>
                  <th>Discharge Date</th>
                  <th>Room No</th>
                  <th>Status</th>
                  <th>Doctor ID</th>
                  <th>Patient ID</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((v) => (
                  <tr key={v.visitId}>
                    <td>{v.visitId}</td>
                    <td>{v.admissionDate ? new Date(v.admissionDate).toLocaleDateString() : "--"}</td>
                    <td>{v.dischargeDate ? new Date(v.dischargeDate).toLocaleDateString() : "--"}</td>
                    <td>{v.roomNumber}</td>
                    <td>{v.status}</td>
                    <td>{v.assignedDoctorId}</td>
                    <td>{v.patientId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default InPatientDetailsPage;
