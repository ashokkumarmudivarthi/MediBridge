import React, { useEffect, useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import { useNavigate } from "react-router-dom";

//const AUTH = process.env.REACT_APP_AUTH_SERVICE || "http://localhost:8081";
const APPOINTMENT = process.env.REACT_APP_APPOINTMENT_SERVICE || "http://localhost:8083";
const PATIENT_SERVICE = process.env.REACT_APP_PATIENT_SERVICE || "http://localhost:8082";

const AppointmentsHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  // ✅ Step 1: Get actual patientId from /api/patients/my-profile
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${PATIENT_SERVICE}/api/patients/my-profile`, {
          headers: { Authorization: `Bearer ${token}` }
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

  // ✅ Step 2: Fetch appointments with correct patientId
  useEffect(() => {
    if (!patientId) return;

    fetch(`${APPOINTMENT}/api/appointments/patients/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const today = new Date();
        const past = data.filter(app => new Date(app.appointmentDate) < today);
        setAppointments(past);
      })
      .catch(err => {
        console.error("Error fetching appointments:", err);
      });
  }, [patientId, token]);

  return (
    <CommonLayout showEdit={false}>
      <div className="container my-4">
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>← Back</button>
        <h3>📅 Past Appointments</h3>

        {appointments.length === 0 ? (
          <p>No past appointments.</p>
        ) : (
          <ul className="list-group">
            {appointments.map(a => (
              <li key={a.id} className="list-group-item">
                <strong>Date:</strong> {new Date(a.appointmentDate).toLocaleString()}<br />
                <strong>Doctor:</strong> {a.doctorName} (ID: {a.doctorId})<br />
                <strong>Reason:</strong> {a.reason}<br />
                <strong>Status:</strong> {a.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </CommonLayout>
  );
};

export default AppointmentsHistory;
