/*// File: src/pages/LaunchPatientBookAppointment.jsx
// This file is used to book appointments for patients by selecting a doctor and specialization.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Add navigate for routing

const LaunchPatientBookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const navigate = useNavigate(); // ✅ For navigation

  const [formData, setFormData] = useState({
    patientId: '',
    specialization: '',
    doctorId: '',
    doctorName: '',
    appointmentDate: '',
    reason: '',
    status: ''
  });

  const DOCTOR_SERVICE = process.env.REACT_APP_DOCTOR_SERVICE;
  const APPOINTMENT_SERVICE = process.env.REACT_APP_APPOINTMENT_SERVICE;

  useEffect(() => {
    axios.get(`${DOCTOR_SERVICE}/api/doctors/list`)
      .then(res => {
        const doctorList = res.data.data || [];
        setDoctors(doctorList);
        const uniqueSpecs = [...new Set(doctorList.map(doc => doc.specialist_in).filter(Boolean))];
        setSpecializations(uniqueSpecs);
      })
      .catch(err => {
        console.error("❌ Failed to load doctors:", err);
        alert("Unable to load doctor list.");
      });
  }, [DOCTOR_SERVICE]);

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
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "specialization" && { doctorId: '', doctorName: '' })
    }));

    if (name === "doctorId") {
      const selectedDoctor = filteredDoctors.find(doc => doc.id.toString() === value);
      if (selectedDoctor) {
        setFormData(prev => ({
          ...prev,
          doctorName: selectedDoctor.doctor_name
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      doctorName: formData.doctorName || (
        filteredDoctors.find(doc => doc.id.toString() === formData.doctorId)?.doctor_name || ''
      )
    };

    axios.post(`${APPOINTMENT_SERVICE}/api/appointments/public/schedule`, finalData)
      .then(() => {
        alert("✅ Appointment successfully scheduled!");
        setFormData({
          patientId: '',
          specialization: '',
          doctorId: '',
          doctorName: '',
          appointmentDate: '',
          reason: '',
          status: ''
        });
        setFilteredDoctors([]);
      })
      .catch(err => {
        console.error("❌ Scheduling failed:", err);
        alert("Something went wrong while scheduling appointment.");
      });
  };

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow position-relative" style={{ maxWidth: "90%" }}>
      
      // ❌ Close Button 
      <button
        onClick={() => navigate("/")}
        className="btn btn-sm btn-danger position-absolute"
        style={{ top: "10px", right: "10px", zIndex: 999 }}
        title="Close"
      >
        ❌
      </button>

      <h2 className="text-center mb-4">🩺 Book Your Appointment</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">

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
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
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
            />
          </div>

          <div className="form-group col-12">
            <button type="submit" className="btn btn-success btn-block mt-3">
              ✅ Book Appointment
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default LaunchPatientBookAppointment;
*/


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LaunchPatientBookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientId: '',
    specialization: '',
    doctorId: '',
    doctorName: '',
    appointmentDate: '',
    reason: '',
    status: ''
  });

  const DOCTOR_SERVICE = process.env.REACT_APP_DOCTOR_SERVICE;
  const APPOINTMENT_SERVICE = process.env.REACT_APP_APPOINTMENT_SERVICE;

  useEffect(() => {
    axios.get(`${DOCTOR_SERVICE}/api/doctors/list`)
      .then(res => {
        const doctorList = res.data.data || [];
        setDoctors(doctorList);
        const uniqueSpecs = [...new Set(doctorList.map(doc => doc.specialist_in).filter(Boolean))];
        setSpecializations(uniqueSpecs);
      })
      .catch(err => {
        console.error("❌ Failed to load doctors:", err);
        alert("Unable to load doctor list.");
      });
  }, [DOCTOR_SERVICE]);

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

    // 🕒 Time validation logic for appointment time
    if (name === "appointmentDate") {
      const selected = new Date(value);
      const hours = selected.getHours();

      if (hours < 9 || hours > 18) {
        alert("❌ Appointment cannot be booked outside working hours (9 AM - 6 PM). Please choose a valid time.");
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === "specialization" && { doctorId: '', doctorName: '' })
    }));

    if (name === "doctorId") {
      const selectedDoctor = filteredDoctors.find(doc => doc.id.toString() === value);
      if (selectedDoctor) {
        setFormData(prev => ({
          ...prev,
          doctorName: selectedDoctor.doctor_name
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedTime = new Date(formData.appointmentDate);
    const hours = selectedTime.getHours();

    // ✅ Double-check before submitting
    if (hours < 9 || hours > 18) {
      alert("❌ Time selected is outside of working hours (9 AM - 6 PM). Please choose another.");
      return;
    }

    const finalData = {
      ...formData,
      doctorName: formData.doctorName || (
        filteredDoctors.find(doc => doc.id.toString() === formData.doctorId)?.doctor_name || ''
      )
    };

    axios.post(`${APPOINTMENT_SERVICE}/api/appointments/public/schedule`, finalData)
      .then(() => {
        alert("✅ Appointment successfully scheduled!");
        setFormData({
          patientId: '',
          specialization: '',
          doctorId: '',
          doctorName: '',
          appointmentDate: '',
          reason: '',
          status: ''
        });
        setFilteredDoctors([]);
      })
      .catch(err => {
        console.error("❌ Scheduling failed:", err);
        alert("Something went wrong while scheduling appointment.");
      });
  };

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow position-relative" style={{ maxWidth: "90%" }}>
      
      {/* ❌ Close Button */}
      <button
        onClick={() => navigate("/")}
        className="btn btn-sm btn-danger position-absolute"
        style={{ top: "10px", right: "10px", zIndex: 999 }}
        title="Close"
      >
        ❌
      </button>

      <h2 className="text-center mb-4">🩺 Book Your Appointment</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">

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

          <div className="form-group col-md-6">
            <label>Appointment Date & Time:</label>
            <input
              type="datetime-local"
              name="appointmentDate"
              className="form-control"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().slice(0, 16)}
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
              <option value="Completed">Completed</option>
              <option value="Rescheduled">Rescheduled</option>
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
            />
          </div>

          <div className="form-group col-12">
            <button type="submit" className="btn btn-success btn-block mt-3">
              ✅ Book Appointment
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default LaunchPatientBookAppointment;
