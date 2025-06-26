/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE;

const DoctorManagement = () => {
  const [searchParams, setSearchParams] = useState({
    id: "",
    name: "",
    contact: "",
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
    });
    setResults([]);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let searchUrl = "";
      const { id, name, contact } = searchParams;

      if (id.trim() !== "") {
        searchUrl = `${DOCTOR_SERVICE_URL}/api/doctors/${id}`;
      } else {
        const queryParams = new URLSearchParams();
        if (name.trim()) queryParams.append("name", name);
        if (contact.trim()) queryParams.append("contact", contact);

        searchUrl = `${DOCTOR_SERVICE_URL}/api/doctors/search?${queryParams.toString()}`;
      }

      const response = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Unauthorized or error fetching data");

   //   const data = await response.json();
  //    setResults(Array.isArray(data) ? data : [data]);

      const responseData = await response.json();
const doctorData = responseData.data;
setResults(Array.isArray(doctorData) ? doctorData : [doctorData]);

    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("❌ Failed to fetch doctors. Check authorization and filters.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const res = await fetch(`${DOCTOR_SERVICE_URL}/api/doctors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("✅ Doctor deleted successfully.");
        setResults((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert("❌ Delete failed. Try again.");
      }
    } catch (err) {
      console.error("Error deleting doctor:", err);
      alert("❌ Server error while deleting.");
    }
  };

  const handleUpdate = (id) => {
    navigate(`doctor/update/${id}`);
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4">Doctor Management</h2>

       //Search Filters 
      <div className="row mb-3">
        {["id", "name", "contact"].map((key) => (
          <div className="col-md-4 mb-2" key={key}>
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
        <div className="col-md-4 d-flex align-items-end gap-2 mb-2">
          <button className="btn btn-primary w-100 me-2" onClick={handleSearch}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      // Action Buttons 
      <div className="mb-3 d-flex justify-content-between">
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
          🔙 Back to Home
        </button>
        <button className="btn btn-warning" onClick={handleReset}>
          🔄 Reset Filters
        </button>
      </div>

      // Results Table 
      {results.length > 0 ? (
        <table className="table table-bordered mt-3">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Specialist</th>
              <th>Experience</th>
              <th>Email</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>{doctor.doctor_name}</td>
                <td>{doctor.contact_number}</td>
                <td>{doctor.specialist_in}</td>
                <td>{doctor.experience_years} yrs</td>
                <td>{doctor.email}</td>
                <td>{doctor.city}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleUpdate(doctor.id)}
                  >
                    ✏️ Update
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(doctor.id)}
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

export default DoctorManagement;
*/


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE;

const DoctorManagement = () => {
  const [searchParams, setSearchParams] = useState({
    id: "",
    name: "",
    contact: "",
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
    });
    setResults([]);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let searchUrl = "";
      const { id, name, contact } = searchParams;

      if (id.trim() !== "") {
        searchUrl = `${DOCTOR_SERVICE_URL}/api/doctors/${id}`;
      } else {
        const queryParams = new URLSearchParams();
        if (name.trim()) queryParams.append("name", name);
        if (contact.trim()) queryParams.append("contact", contact);

        searchUrl = `${DOCTOR_SERVICE_URL}/api/doctors/search?${queryParams.toString()}`;
      }

      const response = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Unauthorized or error fetching data");

      const responseData = await response.json();
      const doctorData = responseData.data;
      setResults(Array.isArray(doctorData) ? doctorData : [doctorData]);

    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("❌ The enyered Doctor ID is not available in the records/ Please check and search with valid ID.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const res = await fetch(`${DOCTOR_SERVICE_URL}/api/doctors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("✅ Doctor deleted successfully.");
        setResults((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert("❌ Delete failed. Try again.");
      }
    } catch (err) {
      console.error("Error deleting doctor:", err);
      alert("❌ Server error while deleting.");
    }
  };

  const handleUpdate = (id) => {
    // ✅ Correct: navigate to frontend route, NOT backend
    navigate(`/doctor/update/${id}`);
  };

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4">Doctor Management</h2>

      {/* Search Filters */}
      <div className="row mb-3">
        {["id"].map((key) => (                          //{["id", "name", "contact"].map((key) => ( 
          <div className="col-md-4 mb-2" key={key}>
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
        <div className="col-md-4 d-flex align-items-end gap-2 mb-2">
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
              <th>Specialist</th>
              <th>Experience</th>
              <th>Email</th>
              <th>City</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((doctor) => (
              <tr key={doctor.id}>
                <td>{doctor.id}</td>
                <td>{doctor.doctor_name}</td>
                <td>{doctor.contact_number}</td>
                <td>{doctor.specialist_in}</td>
                <td>{doctor.experience_years} yrs</td>
                <td>{doctor.email}</td>
                <td>{doctor.city}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleUpdate(doctor.id)}
                  >
                    ✏️ Update
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(doctor.id)}
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

export default DoctorManagement;
