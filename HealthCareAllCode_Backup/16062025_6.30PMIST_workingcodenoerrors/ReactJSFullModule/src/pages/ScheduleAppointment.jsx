import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    reason: '',
    status: ''
  });

  const [csrf, setCsrf] = useState({ token: '', headerName: '' });
  const token = localStorage.getItem("jwtToken");
  const DOCTOR_SERVICE = process.env.REACT_APP_DOCTOR_SERVICE;
  const APPOINTMENT_SERVICE = process.env.REACT_APP_APPOINTMENT_SERVICE;

  // Load Doctors + CSRF Token
  useEffect(() => {
    if (!token) {
      alert("Session expired or token not found. Please log in again.");
      return;
    }

    // Fetch doctors list with JWT
    axios.get(`${DOCTOR_SERVICE}/api/doctors/list`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setDoctors(res.data.data); // ✅ use only the doctors array

        console.log("Doctors loaded:", res.data);
      })
      .catch(err => {
        console.error("Failed to load doctors:", err);
        alert("❌ Failed to load doctors. Check token or backend.");
      });

    // Get CSRF token (optional depending on your backend setup)
    axios.get('/api/csrf-token')
      .then(res => {
        setCsrf({ token: res.data.token, headerName: res.data.headerName });
      })
      .catch(err => {
        console.warn("No CSRF token found or not required:", err);
      });
  }, [DOCTOR_SERVICE,token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctorId: '',
      appointmentDate: '',
      reason: '',
      status: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login again.");
      return;
    }

    axios.post(`${APPOINTMENT_SERVICE}/api/appointments/schedule`, formData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(csrf.token && { [csrf.headerName]: csrf.token })
      }
    })
      .then(() => {
        alert("✅ Appointment Scheduled Successfully!");
        resetForm();
      })
      .catch(err => {
        console.error("Appointment scheduling failed:", err);
        alert("❌ Failed to schedule appointment.");
      });
  };

  return (
    <div className="container mt-4 p-4 bg-white rounded shadow">
      <div className="mb-3 d-flex justify-content-between">
        <a href="/dashboard" className="btn btn-primary">← Back to Home</a>
        <button className="btn btn-danger" onClick={resetForm}>Reset Form</button>
      </div>

      <h2 className="text-center mb-4">🗓️ Schedule Appointment</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Patient ID:</label>
            <input
              type="text"
              name="patientId"
              className="form-control"
              value={formData.patientId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group col-md-6">
            <label>Select Doctor:</label>
            <select
              name="doctorId"
              className="form-control"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Doctor --</option>
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} ({doc.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-6">
            <label>Appointment Date & Time:</label>
            <input
              type="datetime-local"
              name="appointmentDate"
              className="form-control"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group col-md-6">
            <label>Status:</label>
            <select
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Status --</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group col-12">
            <label>Reason for Appointment:</label>
            <textarea
              name="reason"
              className="form-control"
              rows="2"
              value={formData.reason}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group col-12">
            <button type="submit" className="btn btn-success btn-block mt-3">
              ✅ Submit Appointment
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ScheduleAppointment;
