import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;

const PatientManagement = () => {
  const [searchParams, setSearchParams] = useState({
    id: "",
    name: "",
    contact: "",
    startDate: "",
    endDate: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("jwtToken");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setSearchParams({
      id: "",
      name: "",
      contact: "",
      startDate: "",
      endDate: "",
    });
    setResults([]);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let searchUrl = "";
      const { id, name, contact, startDate, endDate } = searchParams;

      if (id.trim() !== "") {
        searchUrl = `${PATIENT_SERVICE_URL}/api/patients/id/${id}`;
      } else {
        const queryParams = new URLSearchParams();
        if (name.trim()) queryParams.append("name", name);
        if (contact.trim()) queryParams.append("contact", contact);
        if (startDate) queryParams.append("startDate", startDate);
        if (endDate) queryParams.append("endDate", endDate);

        searchUrl = `${PATIENT_SERVICE_URL}/api/patients/search?${queryParams.toString()}`;
      }

      const response = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Unauthorized or error fetching data");

      const data = await response.json();
      setResults(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching patients:", error);
      alert("❌ Failed to fetch patients. Check authorization and filters.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("✅ Patient deleted successfully.");
        setResults((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("❌ Delete failed. Try again.");
      }
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("❌ Server error while deleting.");
    }
  };

  const handleUpdate = (id) => {
    //navigate(`/api/patients/update/${id}`);
    navigate(`/patients/update/${id}`);
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4">Patient Management</h2>

      {/* Search Filters */}
      <div className="row mb-3">
        {["id", "name", "contact"].map((key) => (
          <div className="col-md-3 mb-2" key={key}>
            <input
              type="text"
              className="form-control"
              name={key}
              placeholder={`Search by ${key}`}
              value={searchParams[key]}
              onChange={handleInputChange}
            />
          </div>
        ))}
        <div className="col-md-3 mb-2">
          <label>Date From:</label>
          <input
            type="date"
            className="form-control"
            name="startDate"
            value={searchParams.startDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-3 mb-2">
          <label>Date To:</label>
          <input
            type="date"
            className="form-control"
            name="endDate"
            value={searchParams.endDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-3 d-flex align-items-end gap-2 mb-2">
          <button className="btn btn-primary w-100 me-2" onClick={handleSearch}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-3 d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
          🔙 Back to Home
        </button>
        <button className="btn btn-warning" onClick={handleReset}>
          🔄 Reset Filters
        </button>
      </div>

      {/* Results Table */}
      {results.length > 0 ? (
        <table className="table table-bordered mt-3">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Gender</th>
              <th>DOB</th>
              <th>Email</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.contact}</td>
                <td>{patient.gender}</td>
                <td>{patient.dob}</td>
                <td>{patient.email}</td>
                <td>{patient.city}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleUpdate(patient.id)}
                  >
                    ✏️ Update
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(patient.id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-center text-muted mt-4">No results found.</p>
      )}
    </div>
  );
};

export default PatientManagement;
