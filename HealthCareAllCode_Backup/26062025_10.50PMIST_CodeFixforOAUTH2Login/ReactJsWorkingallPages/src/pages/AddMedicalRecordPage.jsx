/*import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE || "http://localhost:8085";

const AddMedicalRecordPage = () => {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("jwtToken"));
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    recordDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDoctorProfile = async () => {
      try {
        const profileRes = await fetch("http://localhost:8081/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!profileRes.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profileData = await profileRes.json();

        if (!profileData.id) throw new Error("Doctor ID not found in profile response");

        setDoctorId(profileData.id);
      } catch (err) {
        console.error("Error loading doctor profile:", err);
        setError("Unable to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      patientId: "",
      diagnosis: "",
      treatment: "",
      prescription: "",
      recordDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setMessage(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId) {
      setError("Doctor ID not available.");
      return;
    }

    try {
      const response = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          doctorId: doctorId,
        }),
      });

      if (response.status === 403) {
        setError("You do not have permission to add medical records.");
        return;
      }

      if (response.ok) {
        setMessage("Medical record added successfully.");
        setError(null);
        handleReset();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save record.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="container my-5">
      <h2>Add Medical Record</h2>

      {loading ? (
        <div className="alert alert-info">Loading doctor profile...</div>
      ) : (
        <>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="card shadow p-4">
            <div className="mb-3">
              <label className="form-label">Patient ID</label>
              <input
                type="number"
                className="form-control"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Diagnosis</label>
              <textarea
                className="form-control"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Treatment</label>
              <textarea
                className="form-control"
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Prescription</label>
              <textarea
                className="form-control"
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Record Date</label>
              <input
                type="date"
                className="form-control"
                name="recordDate"
                value={formData.recordDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                Reset Form
              </button>
              <div>
                <button type="button" className="btn btn-outline-dark me-2" onClick={() => navigate("/doctors")}>
                  Back to Home
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Record
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AddMedicalRecordPage;
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MEDICAL_RECORD_SERVICE_URL =
  process.env.REACT_APP_MEDICAL_RECORD_SERVICE || "http://localhost:8085";

const AddMedicalRecordPage = () => {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("jwtToken"));
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    patientId: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    recordDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDoctorProfile = async () => {
      try {
        const profileRes = await fetch("http://localhost:8081/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!profileRes.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profileData = await profileRes.json();

        if (!profileData.id) throw new Error("Doctor ID not found");

        setDoctorId(profileData.id);
      } catch (err) {
        console.error("Profile Error:", err);
        window.alert("❌ Unable to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      patientId: "",
      diagnosis: "",
      treatment: "",
      prescription: "",
      recordDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId) {
      window.alert("❌ Doctor ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        `${MEDICAL_RECORD_SERVICE_URL}/api/medical-records`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            doctorId: doctorId,
          }),
        }
      );

      if (response.status === 403) {
        window.alert("❌ You do not have permission to add medical records.");
        return;
      }

      if (response.ok) {
        window.alert("✅ Medical record added successfully!");
        handleReset();
      } else {
        const errorData = await response.json();
        window.alert(`❌ Failed to save record: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      window.alert("❌ Something went wrong while submitting the record.");
    }
  };

  return (
    <div className="container my-5">
      <h2>Add Medical Record</h2>

      {loading ? (
        <div className="alert alert-info mt-3">Loading doctor profile...</div>
      ) : (
        <form onSubmit={handleSubmit} className="card shadow p-4 mt-4">
          <div className="mb-3">
            <label className="form-label">Patient ID</label>
            <input
              type="number"
              className="form-control"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Diagnosis</label>
            <textarea
              className="form-control"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Treatment</label>
            <textarea
              className="form-control"
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Prescription</label>
            <textarea
              className="form-control"
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Record Date</label>
            <input
              type="date"
              className="form-control"
              name="recordDate"
              value={formData.recordDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Notes</label>
            <textarea
              className="form-control"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset Form
            </button>
            <div>
              <button
                type="button"
                className="btn btn-outline-dark me-2"
                onClick={() => navigate("/doctors")}
              >
                Back to Home
              </button>
              <button type="submit" className="btn btn-primary">
                Save Record
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddMedicalRecordPage;

