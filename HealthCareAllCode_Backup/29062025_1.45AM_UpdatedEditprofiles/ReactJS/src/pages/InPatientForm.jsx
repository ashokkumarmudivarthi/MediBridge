// InPatientForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;
const PATIENT_VISIT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE;

const InPatientForm = () => {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patientId: "",
    visitType: "in-patient",
    admissionDate: new Date().toISOString().slice(0, 16),
    dischargeDate: "",
    roomNumber: "",
    assignedDoctorId: "",
    status: "admitted"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
      } catch (err) {
        console.error("Profile error:", err);
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${DOCTOR_SERVICE_URL}/api/doctors/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setDoctors(data.data || []);
      } catch (err) {
        console.error("Doctor load error:", err);
      }
    };

    fetchProfile();
    fetchDoctors();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${PATIENT_VISIT_SERVICE_URL}/api/patient-visits/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, dischargeDate: form.dischargeDate || null })
      });

      if (response.ok) {
        alert("✅ Patient visit recorded successfully!");
        navigate("/inpatient-form");
      } else {
        const error = await response.json();
        alert(`❌ Failed: ${error.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Server error.");
    }
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              id="profileDropdown"
              data-bs-toggle="dropdown"
            >
              👤 Profile
            </button>
            <div className="dropdown-menu dropdown-menu-end">
              <div className="dropdown-item-text">
                <strong>Username:</strong> {username} <br />
                <strong>Role:</strong> {role}
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => navigate("/profile")}>Edit Profile</button>
              <button className="dropdown-item" onClick={() => navigate("/logout")}>Logout</button>
            </div>
          </li>
        </ul>
      </nav>

      <header className="bg-info text-white text-center py-3">
        <h3>🏥 In-Patient Visit Registration</h3>
      </header>

      <div className="container mt-4">
        <form className="card p-4 shadow" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Patient ID</label>
            <input
              type="number"
              className="form-control"
              name="patientId"
              value={form.patientId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Assigned Doctor</label>
            <select
              className="form-control"
              name="assignedDoctorId"
              value={form.assignedDoctorId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.doctor_name} ({doc.specialist_in})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Admission Date & Time</label>
            <input
              type="datetime-local"
              className="form-control"
              name="admissionDate"
              value={form.admissionDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Room Number</label>
            <input
              type="text"
              className="form-control"
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Discharge Date (optional)</label>
            <input
              type="datetime-local"
              className="form-control"
              name="dischargeDate"
              value={form.dischargeDate}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-control"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="admitted">Admitted</option>
              <option value="checkup">Checkup</option>
              <option value="discharged">Discharged</option>
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin/patients")}>🔙 Back to Home</button>
            <button type="submit" className="btn btn-success">✅ Submit Visit</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default InPatientForm;
