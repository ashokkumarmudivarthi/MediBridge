import React, { useEffect, useState, useCallback } from "react";

const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE;

const DoctorViewList = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filters, setFilters] = useState({ city: "", specialist: "", hospital: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);
  const pageSize = 10;

  const token = localStorage.getItem("jwtToken");

  const fetchDoctors = useCallback(async () => {
    try {
      if (!token) {
        alert("Token not found. Please log in again.");
        return;
      }

      const response = await fetch(`${DOCTOR_SERVICE_URL}/api/doctors/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
const doctorList = Array.isArray(data) ? data : data.data || [];
setAllDoctors(doctorList);
setFilteredDoctors(doctorList);

    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const applyFilters = (e) => {
    e.preventDefault();
    const { city, specialist, hospital } = filters;

    const filtered = allDoctors.filter((doc) =>
      (!city || doc.city?.toLowerCase().includes(city.toLowerCase())) &&
      (!specialist || doc.specialist_in?.toLowerCase().includes(specialist.toLowerCase())) &&
      (!hospital || doc.hospital_name?.toLowerCase().includes(hospital.toLowerCase()))
    );

    setFilteredDoctors(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ city: "", specialist: "", hospital: "" });
    setFilteredDoctors(allDoctors);
    setCurrentPage(1);
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const response = await fetch(`${DOCTOR_SERVICE_URL}/api/doctors/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Doctor deleted successfully.");
        const updatedList = allDoctors.filter((d) => d.id !== id);
        setAllDoctors(updatedList);
        setFilteredDoctors(updatedList);
      } else {
        alert("Failed to delete doctor.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const exportToCSV = () => {
    let csv = "Doctor Name,Gender,Phone,Specialist,Qualification,City,Hospital\n";
    filteredDoctors.forEach((d) => {
      csv += `"${d.doctor_name}","${d.gender}","${d.phone_number}","${d.specialist_in}","${d.qualifications}","${d.city}","${d.hospital_name}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Doctor_List.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  const changePage = (delta) => {
    const maxPage = Math.ceil(filteredDoctors.length / pageSize);
    setCurrentPage((prev) => Math.max(1, Math.min(prev + delta, maxPage)));
  };

  const pageData = filteredDoctors.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container py-4">
      <h2 className="text-center text-white bg-primary p-3 rounded">👨‍⚕️ Doctor List - Wellness Wave</h2>

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
            placeholder="Specialist In"
            value={filters.specialist}
            onChange={(e) => setFilters({ ...filters, specialist: e.target.value })}
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
        <button className="btn btn-outline-primary" onClick={() => window.location.href = '/admin/doctors'}>
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
              <th>👨‍⚕️ Name</th>
              <th>⚥ Gender</th>
              <th>📞 Phone</th>
              <th>🩺 Specialist</th>
              <th>🎓 Qualification</th>
              <th>🌆 City</th>
              <th>🏨 Hospital</th>
              <th>⚙️ Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No doctors found.</td>
              </tr>
            ) : (
              pageData.map((doctor, index) => (
                <tr
                  key={doctor.id}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={hoveredRow === index ? "fw-bold table-info" : ""}
                >
                  <td>{doctor.doctor_name}</td>
                  <td>{doctor.gender}</td>
                  <td>{doctor.phone_number}</td>
                  <td>{doctor.specialist_in}</td>
                  <td>{doctor.qualifications}</td>
                  <td>{doctor.city}</td>
                  <td>{doctor.hospital_name}</td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#FF2400", color: "white", border: "none" }}
                      onClick={() => deleteDoctor(doctor.id)}
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
          disabled={currentPage * pageSize >= filteredDoctors.length}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default DoctorViewList;
