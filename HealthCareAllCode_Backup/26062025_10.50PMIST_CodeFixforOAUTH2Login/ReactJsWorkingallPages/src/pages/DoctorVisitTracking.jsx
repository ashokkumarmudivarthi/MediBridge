import React, { useEffect, useState } from "react";

const DOCTOR_VISIT_URL = process.env.REACT_APP_DOCTOR_VISIT_SERVICE;

const DoctorVisitTracking = () => {
  const token = localStorage.getItem("jwtToken");
  const [visitLogs, setVisitLogs] = useState([]);

  useEffect(() => {
    if (!token) return;
    const fetchVisitLogs = async () => {
      try {
        const res = await fetch(`${DOCTOR_VISIT_URL}/api/doctor-visits/my-logs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setVisitLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching doctor visit logs:", err);
      }
    };

    fetchVisitLogs();
  }, [token]);

  return (
    <div className="container mt-5">
      <h3 className="mb-4">📋 Doctor Visit Logs</h3>
      {visitLogs.length === 0 ? (
        <p>No doctor visits found.</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Visit Date</th>
              <th>Doctor</th>
              <th>Notes</th>
              <th>Prescription</th>
            </tr>
          </thead>
          <tbody>
            {visitLogs.map((log, idx) => (
              <tr key={idx}>
                <td>{new Date(log.visitDate).toLocaleString()}</td>
                <td>{log.doctorName}</td>
                <td>{log.notes || "--"}</td>
                <td>{log.prescription || "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorVisitTracking;
