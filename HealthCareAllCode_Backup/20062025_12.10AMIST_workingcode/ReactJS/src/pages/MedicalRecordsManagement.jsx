import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;

const MedicalRecordsManagement = () => {
  const [patientId, setPatientId] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const handleSearch = async () => {
    if (!patientId.trim()) {
      alert("Please enter a valid Patient ID.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setRecords(data.data || []);
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Failed to fetch medical records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this medical record?")) return;
    try {
      const response = await fetch(
        `${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/${recordId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("✅ Record deleted successfully.");
        setRecords((prev) => prev.filter((rec) => rec.id !== recordId));
      } else {
        alert("❌ Failed to delete record.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Server error while deleting.");
    }
  };

  const handleUpdate = (recordId) => {
    navigate(`/medical-record/update/${recordId}`);
  };

  const handleReset = () => {
    setPatientId("");
    setRecords([]);
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4">Medical Records Management</h2>

      {/* Search Filter */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end gap-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="mb-3 d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
          🔙 Back to Dashboard
        </button>
        <button className="btn btn-warning" onClick={handleReset}>
          🔄 Reset
        </button>
      </div>

      {/* Records Table */}
      {records.length > 0 ? (
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Date</th>
              <th>Doctor ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                <td>{rec.id}</td>
                <td>{rec.diagnosis}</td>
                <td>{rec.treatment}</td>
                <td>{rec.recordDate}</td>
                <td>{rec.doctorId}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleUpdate(rec.id)}
                  >
                    ✏️ Update
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(rec.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-center text-muted mt-4">No records found.</p>
      )}
    </div>
  );
};

export default MedicalRecordsManagement;
