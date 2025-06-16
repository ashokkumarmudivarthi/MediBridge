import React, { useEffect, useState, useCallback } from "react";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;

const PatientList = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filters, setFilters] = useState({ city: "", disease: "", hospital: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const pageSize = 10;

  const token = localStorage.getItem("jwtToken");

  const fetchPatients = useCallback(async () => {
    try {
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const response = await fetch(`${PATIENT_SERVICE_URL}/api/patients/list-json`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setAllPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const applyFilters = (e) => {
    e.preventDefault();
    const { city, disease, hospital } = filters;

    const filtered = allPatients.filter((p) =>
      (!city || p.city?.toLowerCase().includes(city.toLowerCase())) &&
      (!disease || p.disease?.toLowerCase().includes(disease.toLowerCase())) &&
      (!hospital || p.hospital?.toLowerCase().includes(hospital.toLowerCase()))
    );

    setFilteredPatients(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ city: "", disease: "", hospital: "" });
    setFilteredPatients(allPatients);
    setCurrentPage(1);
  };

  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      const response = await fetch(`${PATIENT_SERVICE_URL}/api/patients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Deleted successfully.");
        const updatedList = allPatients.filter((p) => p.id !== id);
        setAllPatients(updatedList);
        setFilteredPatients(updatedList);
      } else {
        alert("Failed to delete patient.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const exportToCSV = () => {
    let csv = "Name,Age,Gender,City,Disease,Hospital\n";
    filteredPatients.forEach((p) => {
      csv += `"${p.name}","${p.age}","${p.gender}","${p.city}","${p.disease}","${p.hospital}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Patient_List.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  const changePage = (delta) => {
    const maxPage = Math.ceil(filteredPatients.length / pageSize);
    setCurrentPage((prev) => Math.max(1, Math.min(prev + delta, maxPage)));
  };

  const pageData = filteredPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container py-4">
      <h2 className="text-center text-white bg-primary p-3 rounded">🏥 Patient List - Wellness Wave</h2>

      {/* Filters */}
      <form onSubmit={applyFilters} className="row g-2 my-3">
        <div className="col-md-3">
          <input
            className="form-control"
            type="text"
            placeholder="City"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            type="text"
            placeholder="Disease"
            value={filters.disease}
            onChange={(e) => setFilters({ ...filters, disease: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            type="text"
            placeholder="Hospital"
            value={filters.hospital}
            onChange={(e) => setFilters({ ...filters, hospital: e.target.value })}
          />
        </div>
        <div className="col-md-3 d-flex gap-2">
          <button type="submit" className="btn btn-success">🔍 Search</button>
          <button type="button" className="btn btn-secondary" onClick={clearFilters}>❌ Clear</button>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between my-3 flex-wrap gap-2">
        <button className="btn btn-outline-primary" onClick={() => window.location.href = '/dashboard'}>
          🏠 Back to Home
        </button>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={exportToPDF}>📄 Export to PDF</button>
          <button className="btn btn-outline-success" onClick={exportToCSV}>📊 Export to Excel</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-primary text-center">
            <tr>
              <th>👤 Name</th>
              <th>🔢 Age</th>
              <th>⚥ Gender</th>
              <th>🌆 City</th>
              <th>🩺 Disease</th>
              <th>🏨 Hospital</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">No patients found.</td>
              </tr>
            ) : (
              pageData.map((patient, index) => (
                <tr
                  key={patient.id}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={hoveredRow === index ? "fw-bold table-info" : ""}
                >
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.city}</td>
                  <td>{patient.disease}</td>
                  <td>{patient.hospital}</td>
                  <td>
                    <button
                      style={{ backgroundColor: "#FF2400", color: "white", border: "none" }}
                       className="btn btn-sm"

                      onClick={() => deletePatient(patient.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
        <button className="btn btn-outline-secondary" onClick={() => changePage(-1)} disabled={currentPage === 1}>
          ⬅ Prev
        </button>
        <span>Page {currentPage}</span>
        <button
          className="btn btn-outline-secondary"
          onClick={() => changePage(1)}
          disabled={currentPage * pageSize >= filteredPatients.length}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default PatientList;
