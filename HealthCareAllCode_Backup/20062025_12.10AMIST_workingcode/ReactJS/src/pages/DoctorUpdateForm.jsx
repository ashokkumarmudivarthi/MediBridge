import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DOCTOR_SERVICE = process.env.REACT_APP_DOCTOR_SERVICE;

const DoctorUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`${DOCTOR_SERVICE}/api/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        setDoctor(result.data); // ✅ Correct: using "data" inside response
      } catch (err) {
        console.error("Error fetching doctor:", err);
        alert("❌ Failed to load doctor data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${DOCTOR_SERVICE}/api/doctors/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(doctor),
      });

      if (res.ok) {
        alert("✅ Doctor updated successfully.");
        navigate("/search-doctor");
      } else {
        alert("❌ Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Server error during update.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading doctor details...</div>;
  if (!doctor) return <div className="text-center mt-5">Doctor not found.</div>;

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4">Update Doctor</h2>
      <form onSubmit={handleUpdate}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Doctor Name</label>
            <input
              type="text"
              name="doctor_name"
              value={doctor.doctor_name || ""}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={doctor.email || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={doctor.phone_number || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Contact Number</label>
            <input
              type="text"
              name="contact_number"
              value={doctor.contact_number || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Gender</label>
            <select
              name="gender"
              value={doctor.gender || ""}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label>Specialization</label>
            <input
              type="text"
              name="specialization"
              value={doctor.specialization || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Specialist In</label>
            <input
              type="text"
              name="specialist_in"
              value={doctor.specialist_in || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Qualifications</label>
            <input
              type="text"
              name="qualifications"
              value={doctor.qualifications || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Experience (Years)</label>
            <input
              type="number"
              name="experience_years"
              value={doctor.experience_years || ""}
              onChange={handleChange}
              className="form-control"
              min={0}
              max={100}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={doctor.country || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={doctor.state || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={doctor.city || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Hospital Name</label>
            <input
              type="text"
              name="hospital_name"
              value={doctor.hospital_name || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Availability</label>
            <input
              type="text"
              name="availability"
              value={doctor.availability || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Status</label>
            <select
              name="status"
              value={doctor.status || ""}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option>Active</option>
              <option>On Leave</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="col-12 mt-4 d-flex justify-content-between">
            <button type="submit" className="btn btn-success">
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

export default DoctorUpdateForm;
