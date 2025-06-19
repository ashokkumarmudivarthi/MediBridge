import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;

const PatientUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/id/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPatient(data);
      } catch (err) {
        console.error("Error fetching patient:", err);
        alert("❌ Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/${id}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(patient),
      });

      if (res.ok) {
        alert("✅ Patient updated successfully.");
        navigate("/search-patient"); // Or wherever your patient list is
      } else {
        alert("❌ Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Server error during update.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading patient details...</div>;
  if (!patient) return <div className="text-center mt-5">Patient not found.</div>;

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4">Update Patient</h2>
      <form onSubmit={handleUpdate}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Name</label>
            <input type="text" name="name" value={patient.name || ""} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-6 mb-3">
            <label>Contact</label>
            <input type="text" name="contact" value={patient.contact || ""} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-6 mb-3">
            <label>Age</label>
            <input type="number" name="age" value={patient.age || ""} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-6 mb-3">
            <label>Gender</label>
            <select name="gender" value={patient.gender || ""} onChange={handleChange} className="form-control">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Add more fields as needed */}
          <div className="col-md-6 mb-3">
            <label>Email</label>
            <input type="email" name="email" value={patient.email || ""} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-6 mb-3">
            <label>City</label>
            <input type="text" name="city" value={patient.city || ""} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-12 mt-3 d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              ✅ Update
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
              🔙 Back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientUpdateForm;
