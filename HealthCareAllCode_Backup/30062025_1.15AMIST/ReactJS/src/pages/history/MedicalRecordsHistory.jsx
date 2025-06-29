import React, { useEffect, useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import { useNavigate } from "react-router-dom";

const MED = process.env.REACT_APP_MEDICAL_RECORD_SERVICE || "http://localhost:8085";
const PATIENT = process.env.REACT_APP_PATIENT_SERVICE || "http://localhost:8082";

const MedicalRecordsHistory = () => {
  const [records, setRecords] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  // ✅ Fetch correct patient ID from patient profile
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${PATIENT}/api/patients/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch patient profile.");
          return;
        }

        const patient = await res.json();
        setPatientId(patient.id);
      } catch (err) {
        console.error("Error fetching patient ID:", err);
      }
    })();
  }, [token]);

  // ✅ Fetch medical records using patientId
  useEffect(() => {
    if (!patientId) return;

    fetch(`${MED}/api/medical-records/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setRecords(data.data || []))
      .catch(console.error);
  }, [patientId, token]);

  // ✅ Download single record by ID
  const download = (id) => {
    fetch(`${MED}/api/medical-records/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `record-${id}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(console.error);
  };

  return (
    <CommonLayout showEdit={false}>
      <div className="container my-4">
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h3>📋 Medical Records</h3>
        {records.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <ul className="list-group">
            {records.map((r) => (
              <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>Date:</strong> {new Date(r.recordDate).toLocaleDateString()} <br />
                  <strong>Diagnosis:</strong> {r.diagnosis}
                </span>
                <button className="btn btn-sm btn-outline-dark" onClick={() => download(r.id)}>
                  ⬇️ Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </CommonLayout>
  );
};

export default MedicalRecordsHistory;
