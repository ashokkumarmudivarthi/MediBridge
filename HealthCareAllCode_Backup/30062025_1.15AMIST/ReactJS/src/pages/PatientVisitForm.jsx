// File: PatientVisitForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_VISIT_URL = process.env.REACT_APP_PATIENT_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const PatientVisitForm = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    visitType: "out-patient",
    admissionDate: "",
    dischargeDate: "",
    roomNumber: "",
    assignedDoctorId: "",
    status: "checkup",
  });

  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
      } catch (err) {
        console.error("Profile Error", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${PATIENT_VISIT_URL}/api/patient-visits/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Patient Visit Created Successfully");
        setFormData({
          patientId: "",
          visitType: "out-patient",
          admissionDate: "",
          dischargeDate: "",
          roomNumber: "",
          assignedDoctorId: "",
          status: "checkup",
        });
      } else {
        alert("❌ Failed to create patient visit");
      }
    } catch (err) {
      console.error("Submit Error", err);
      alert("❌ Server Error");
    }
  };

  return (
    <div className="container mt-4">
      {/* Header and User Profile */}
      <nav className="navbar navbar-light bg-light justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <button className="btn btn-link dropdown-toggle" data-bs-toggle="dropdown">
              👤 Profile
            </button>
            <div className="dropdown-menu dropdown-menu-end">
              <div className="dropdown-item-text">
                <strong>Username:</strong> {username}<br />
                <strong>Role:</strong> {role}
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => navigate("/profile")}>Edit Profile</button>
              <button className="dropdown-item" onClick={() => navigate("/logout")}>Logout</button>
            </div>
          </li>
        </ul>
      </nav>

      <h3 className="text-center text-success my-4">Create In-Patient / Out-Patient Visit</h3>

      <form className="card p-4 shadow" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Patient ID</label>
            <input className="form-control" name="patientId" value={formData.patientId} onChange={handleChange} required />
          </div>
          <div className="col-md-6 mb-3">
            <label>Visit Type</label>
            <select className="form-control" name="visitType" value={formData.visitType} onChange={handleChange}>
              <option value="in-patient">In-Patient</option>
              <option value="out-patient">Out-Patient</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label>Admission Date</label>
            <input type="datetime-local" className="form-control" name="admissionDate" value={formData.admissionDate} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Discharge Date (Optional)</label>
            <input type="datetime-local" className="form-control" name="dischargeDate" value={formData.dischargeDate} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Room Number</label>
            <input className="form-control" name="roomNumber" value={formData.roomNumber} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Assigned Doctor ID</label>
            <input className="form-control" name="assignedDoctorId" value={formData.assignedDoctorId} onChange={handleChange} />
          </div>
          <div className="col-md-12 mb-3">
            <label>Status</label>
            <input className="form-control" name="status" value={formData.status} onChange={handleChange} />
          </div>
        </div>
        <div className="text-end">
          <button type="submit" className="btn btn-success">➕ Create Visit</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/admin/patients")}>Back to Dashboard</button>
        </div>
      </form>
    </div>
  );
};

export default PatientVisitForm;
