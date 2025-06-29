import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE || "http://localhost:8082";
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE || "http://localhost:8085";

const PatientProfile = () => {
  const { id } = useParams(); // patientId from URL
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("jwtToken"));
  const [username] = useState(localStorage.getItem("username") || "User");
  const [role] = useState(localStorage.getItem("userRole") || "user");
  const [patient, setPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch patient info
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/id/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPatient(data);
        } else {
          setPatient(null);
        }
      } catch (err) {
        console.error("Patient fetch error:", err);
      }
    };

    const fetchMedicalRecords = async () => {
      try {
        const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMedicalRecords(data.data || []);
        } else {
          setMedicalRecords([]);
        }
      } catch (err) {
        console.error("Medical record fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
    fetchMedicalRecords();
  }, [id, token]);

  const content = loading ? (
    <div className="container my-5">Loading patient data...</div>
  ) : !patient ? (
    <div className="container my-5 alert alert-danger">Patient not found.</div>
  ) : (
    <div className="container my-5">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        ⬅ Back to Dashboard
      </button>

      <div className="card p-4 shadow-sm">
        <h3 className="mb-3">🧑‍⚕️ Patient Profile: {patient.name} (ID: {patient.id})</h3>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Email:</strong> {patient.email || "N/A"}</p>
        <p><strong>Contact:</strong> {patient.phone || "N/A"}</p>
      </div>

      <div className="card mt-4 shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4 className="mb-0">📁 Medical History</h4>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => navigate(`/medical-records/new?patientId=${patient.id}`)}
          >
            ➕ Add Record
          </button>
        </div>
        <div className="card-body">
          {medicalRecords.length === 0 ? (
            <div className="alert alert-warning">No medical records available.</div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Diagnosis</th>
                  <th>Record Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {medicalRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.diagnosis}</td>
                    <td>{record.recordDate}</td>
                    <td>{record.notes || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <CommonLayout username={username} role={role}>
      {content}
    </CommonLayout>
  );
};

export default PatientProfile;
