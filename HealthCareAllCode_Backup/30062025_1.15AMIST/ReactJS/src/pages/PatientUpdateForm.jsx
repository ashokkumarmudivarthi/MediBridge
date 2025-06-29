/*import React, { useEffect, useState } from "react";
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

          // Add more fields as needed 
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

*/


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const PatientUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");

  // Fetch profile for header
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }
        const data = await res.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [token]);

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(patient),
      });

      if (res.ok) {
        alert("✅ Patient updated successfully.");
        navigate("/search-patient");
      } else {
        alert("❌ Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Server error during update.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  if (loading) return <div className="text-center mt-5">Loading patient details...</div>;
  if (!patient) return <div className="text-center mt-5">Patient not found.</div>;

  return (
    <>
      {/* Top Navbar with Profile */}
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

      {/* Page Header */}
      <header className="bg-primary text-white text-center py-4">
        <h2>Update Patient Details</h2>
        <p className="lead">Manage personal information securely and accurately.</p>
      </header>

      {/* Form */}
      <div className="container mt-5 p-4 bg-light rounded shadow">
        <form onSubmit={handleUpdate}>
          <div className="row">
            {/* Patient ID */}
            <div className="col-md-6 mb-3">
              <label>Patient ID</label>
              <input
                type="text"
                name="id"
                className="form-control"
                value={patient.id || ""}
                readOnly
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={patient.name || ""}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Contact</label>
              <input
                type="text"
                name="contact"
                value={patient.contact || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={patient.age || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Gender</label>
              <select
                name="gender"
                value={patient.gender || ""}
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
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={patient.email || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={patient.city || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* Actions */}
            <div className="col-12 mt-3 d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                ✅ Update
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                🔙 Back to Dashboard
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default PatientUpdateForm;

