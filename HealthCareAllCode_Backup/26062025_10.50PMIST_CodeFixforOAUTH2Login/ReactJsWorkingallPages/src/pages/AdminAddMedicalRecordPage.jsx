/*import React, { useState, useEffect } from "react";
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
                onClick={() => navigate("/admin/medical-records")}
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

*/



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE || "http://localhost:8085";
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE || "http://localhost:8081";

const AddMedicalRecordPage = () => {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("jwtToken"));
  const [doctorId, setDoctorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");

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

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        if (!data.id) throw new Error("Doctor ID not found");

        setDoctorId(data.id);
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
      } catch (err) {
        console.error("Profile Error:", err);
        alert("❌ Unable to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
      alert("❌ Doctor ID is missing.");
      return;
    }

    try {
      const response = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, doctorId }),
      });

      if (response.status === 403) {
        alert("❌ You do not have permission to add medical records.");
        return;
      }

      if (response.ok) {
        alert("✅ Medical record added successfully!");
        handleReset();
      } else {
        const errorData = await response.json();
        alert(`❌ Failed to save record: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("❌ Something went wrong while submitting the record.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  return (
    <>
      {/* Profile Dropdown */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              type="button"
            >
              <i className="fas fa-user-circle"></i> Profile
            </button>
            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <div className="dropdown-item-text">
                <strong>Username:</strong> {username} <br />
                <strong>Role:</strong> {role}
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => navigate("/profile")} type="button">
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button className="dropdown-item" onClick={handleLogout} type="button">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>

      {/* Header */}
      <header className="bg-success text-white text-center py-4">
        <h2>📝 Add Medical Record</h2>
        <p>Submit a new patient medical history entry</p>
      </header>

      {/* Form Content */}
      <div className="container my-5">
        {loading ? (
          <div className="alert alert-info">Loading doctor profile...</div>
        ) : (
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
                🔄 Reset Form
              </button>
              <div>
                <button
                  type="button"
                  className="btn btn-outline-dark me-2"
                  onClick={() => navigate("/admin/medical-records")}
                >
                  🔙 Back to Home
                </button>
                <button type="submit" className="btn btn-primary">
                  💾 Save Record
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default AddMedicalRecordPage;
