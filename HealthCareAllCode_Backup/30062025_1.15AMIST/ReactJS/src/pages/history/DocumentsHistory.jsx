import React, { useEffect, useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import { useNavigate } from "react-router-dom";

const PATIENT = process.env.REACT_APP_PATIENT_SERVICE || "http://localhost:8082";
//const AUTH = process.env.REACT_APP_AUTH_SERVICE || "http://localhost:8081";

const DocumentsHistory = () => {
  const [docs, setDocs] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const profileRes = await fetch(`${PATIENT}/api/patients/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error("Unauthorized");

        const patient = await profileRes.json();
        setPatientId(patient.id);
      } catch (err) {
        console.error("❌ Failed to fetch patient profile:", err);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!patientId) return;
    fetch(`${PATIENT}/api/documents/by-patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setDocs(data || []))
      .catch(err => console.error("❌ Failed to load documents:", err));
  }, [patientId, token]);

  return (
    <CommonLayout showEdit={false}>
      <div className="container my-4">
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>
        <h3>📁 Uploaded Documents</h3>
        {docs.length === 0 ? (
          <p>No documents uploaded.</p>
        ) : (
          <ul className="list-group">
            {docs.map(d => (
              <li key={d.documentId} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{d.fileName}</span>
                <a
                  href={`${PATIENT}/api/documents/download/${d.documentId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-dark"
                >
                  📥 Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </CommonLayout>
  );
};

export default DocumentsHistory;
