import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ScheduleAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [csrf, setCsrf] = useState({ token: '', headerName: '' });

  const [formData, setFormData] = useState({
    patientId: '',
    specialization: '',
    doctorId: '',
    doctorName: '',
    appointmentDate: '',
    reason: '',
    status: ''
  });

  const token = localStorage.getItem("jwtToken");

  const DOCTOR_SERVICE = process.env.REACT_APP_DOCTOR_SERVICE;
  const APPOINTMENT_SERVICE = process.env.REACT_APP_APPOINTMENT_SERVICE;
  const PATIENT_SERVICE = process.env.REACT_APP_PATIENT_SERVICE;

  // Load patient profile, doctor list, and CSRF token
  useEffect(() => {
    if (!token) {
      alert("Session expired or token not found. Please log in again.");
      return;
    }

    // 1. Load patient profile
    axios.get(`${PATIENT_SERVICE}/api/patients/my-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const patient = res.data;
        setFormData(prev => ({ ...prev, patientId: patient.id }));
      })
      .catch(err => {
        console.error("❌ Failed to fetch patient profile:", err);
        alert("Failed to load patient details. Try re-logging in.");
      });

    // 2. Load doctor list
    axios.get(`${DOCTOR_SERVICE}/api/doctors/list`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const doctorList = res.data.data;
        setDoctors(doctorList);
        const uniqueSpecs = [...new Set(doctorList.map(doc => doc.specialist_in).filter(Boolean))];
        setSpecializations(uniqueSpecs);
      })
      .catch(err => {
        console.error("❌ Failed to load doctors:", err);
        alert("Failed to load doctors. Try again later.");
      });

    // 3. Load CSRF token (if required)
    axios.get('/api/csrf-token')
      .then(res => {
        setCsrf({ token: res.data.token, headerName: res.data.headerName });
      })
      .catch(() => {
        // Do nothing if CSRF token is not required
      });

  }, [DOCTOR_SERVICE, PATIENT_SERVICE, token]);

  // Filter doctors based on selected specialization
  useEffect(() => {
    if (formData.specialization) {
      const filtered = doctors.filter(doc => doc.specialist_in === formData.specialization);
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
  }, [formData.specialization, doctors]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Auto-fill doctorName when doctorId changes
    if (name === "doctorId") {
      const selectedDoctor = filteredDoctors.find(doc => doc.id.toString() === value);
      setFormData(prev => ({
        ...prev,
        doctorId: value,
        doctorName: selectedDoctor ? selectedDoctor.doctor_name : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(name === "specialization" && { doctorId: '', doctorName: '' }) // Reset doctor if specialization changes
      }));
    }
  };

  const resetForm = () => {
    setFormData(prev => ({
      patientId: prev.patientId,
      specialization: '',
      doctorId: '',
      doctorName: '',
      appointmentDate: '',
      reason: '',
      status: ''
    }));
    setFilteredDoctors([]);
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
        console.error("❌ Scheduling failed:", err);
        alert("Failed to schedule appointment. Please try again.");
      });
  };

  return (
    <div className="container mt-4 p-4 bg-white rounded shadow">
      <div className="mb-3 d-flex justify-content-between">
        <a href="/patients" className="btn btn-primary">← Back to Home</a>
        <button className="btn btn-danger" onClick={resetForm}>Reset Form</button>
      </div>

      <h2 className="text-center mb-4">🗓️ Schedule Appointment</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">

          {/* Patient ID (Disabled) */}
          <div className="form-group col-md-6">
            <label>Patient ID:</label>
            <input
              type="text"
              name="patientId"
              className="form-control"
              value={formData.patientId}
              disabled
              readOnly
            />
          </div>

          {/* Specialization */}
          <div className="form-group col-md-6">
            <label>Select Specialization:</label>
            <select
              name="specialization"
              className="form-control"
              value={formData.specialization}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Specialization --</option>
              {specializations.map((spec, i) => (
                <option key={i} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div className="form-group col-md-6">
            <label>Select Doctor:</label>
            <select
              name="doctorId"
              className="form-control"
              value={formData.doctorId}
              onChange={handleChange}
              required
              disabled={!formData.specialization}
            >
              <option value="">-- Select Doctor --</option>
              {filteredDoctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.doctor_name} ({doc.specialist_in})
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Date & Time */}
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

          {/* Status */}
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
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>

          {/* Reason */}
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

          {/* Submit Button */}
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
