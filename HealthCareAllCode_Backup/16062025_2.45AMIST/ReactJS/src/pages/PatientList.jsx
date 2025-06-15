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
        alert("🔒 Token not found. Please log in again.");
        return;
      }

      const response = await fetch(`${PATIENT_SERVICE_URL}/api/patients/list-json`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setAllPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error("❌ Failed to fetch patients:", error);
      setFilteredPatients([]);
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("✅ Deleted successfully.");
        const updatedList = allPatients.filter((p) => p.id !== id);
        setAllPatients(updatedList);
        setFilteredPatients(updatedList);
      } else {
        alert("❌ Failed to delete patient.");
      }
    } catch (error) {
      console.error("❌ Delete Error:", error);
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
    <div style={styles.container}>
      <div style={styles.header}>🏥 Patient List - Wellness Wave</div>

      {/* Filter Section */}
      <form onSubmit={applyFilters}>
        <label>🌆 City:</label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <label>🩺 Disease:</label>
        <input
          type="text"
          value={filters.disease}
          onChange={(e) => setFilters({ ...filters, disease: e.target.value })}
        />
        <label>🏨 Hospital:</label>
        <input
          type="text"
          value={filters.hospital}
          onChange={(e) => setFilters({ ...filters, hospital: e.target.value })}
        />
        <button type="submit">🔍 Search</button>
        <button type="button" onClick={clearFilters}>❌ Clear</button>
      </form>

      {/* Actions */}
      <div style={styles.buttons}>
        <button onClick={() => window.location.href = '/dashboard'}>🏠 Back to Home</button>
        <button onClick={exportToPDF}>📄 Export to PDF</button>
        <button onClick={exportToCSV}>📊 Export to Excel</button>
      </div>

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeaderCell}>👤 Name</th>
            <th style={styles.tableHeaderCell}>🔢 Age</th>
            <th style={styles.tableHeaderCell}>⚥ Gender</th>
            <th style={styles.tableHeaderCell}>🌆 City</th>
            <th style={styles.tableHeaderCell}>🩺 Disease</th>
            <th style={styles.tableHeaderCell}>🏨 Hospital</th>
            <th style={styles.tableHeaderCell}>⚙️ Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td style={styles.tableCell} colSpan="7">No patients found.</td>
            </tr>
          ) : (
            pageData.map((patient, index) => (
              <tr
                key={patient.id}
                style={{
                  ...(index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate),
                  ...(hoveredRow === index ? styles.tableRowHover : {})
                }}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.tableCell}>{patient.name}</td>
                <td style={styles.tableCell}>{patient.age}</td>
                <td style={styles.tableCell}>{patient.gender}</td>
                <td style={styles.tableCell}>{patient.city}</td>
                <td style={styles.tableCell}>{patient.disease}</td>
                <td style={styles.tableCell}>{patient.hospital}</td>
                <td style={styles.tableCell}>
                  <button onClick={() => deletePatient(patient.id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button onClick={() => changePage(-1)} disabled={currentPage === 1}>⬅ Prev</button>
        <span>Page {currentPage}</span>
        <button onClick={() => changePage(1)} disabled={currentPage * pageSize >= filteredPatients.length}>Next ➡</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '20px',
    textAlign: 'center',
    fontSize: '24px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  buttons: {
    margin: '20px 0',
    display: 'flex',
    gap: '10px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  tableHeaderCell: {
    backgroundColor: '#1976d2',
    color: 'white',
    border: '1px solid #ddd',
    padding: '12px',
    textAlign: 'left'
  },
  tableCell: {
    border: '1px solid #ddd',
    padding: '10px',
    transition: 'all 0.3s ease'
  },
  tableRow: {
    backgroundColor: '#f9f9f9',
    transition: 'background-color 0.3s, font-weight 0.3s'
  },
  tableRowAlternate: {
    backgroundColor: '#e6f2ff',
    transition: 'background-color 0.3s, font-weight 0.3s'
  },
  tableRowHover: {
    backgroundColor: '#d0ebff',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  pagination: {
    marginTop: '20px',
    textAlign: 'center'
  }
};

export default PatientList;
