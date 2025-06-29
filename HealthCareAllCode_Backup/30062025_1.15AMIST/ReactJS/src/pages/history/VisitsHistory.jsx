// src/pages/history/VisitsHistory.jsx
import React, { useEffect, useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import { useNavigate } from "react-router-dom";

const PATIENT = process.env.REACT_APP_PATIENT_SERVICE || "http://localhost:8082";
const AUTH = process.env.REACT_APP_AUTH_SERVICE || "http://localhost:8081";

const VisitsHistory = () => {
  const [visits, setVisits] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const pr = await fetch(`${AUTH}/api/profile`, { headers: { Authorization: `Bearer ${token}` }});
      const profile = await pr.json();
      setPatientId(profile.id);
    })();
  }, [token]);

  useEffect(() => {
    if (!patientId) return;
    fetch(`${PATIENT}/api/patient-visits/my-visits`, { headers: { Authorization: `Bearer ${token}` }})
      .then(r => r.json())
      .then(data => setVisits(data.filter(v => new Date(v.admissionDate) < new Date())))  // past visits
      .catch(console.error);
  }, [patientId, token]);

  return (
    <CommonLayout showEdit={false}>
      <div className="container my-4">
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>
        <h3>🏥 Past Visit Records</h3>
        {visits.length === 0
          ? <p>No past visits.</p>
          : <ul className="list-group">
              {visits.map(v => (
                <li key={v.visitId} className="list-group-item">
                  {v.visitType} — Adm: {new Date(v.admissionDate).toLocaleDateString()} / Dis: {v.dischargeDate ? new Date(v.dischargeDate).toLocaleDateString() : 'N/A'}
                </li>
              ))}
            </ul>
        }
      </div>
    </CommonLayout>
  );
};

export default VisitsHistory;
