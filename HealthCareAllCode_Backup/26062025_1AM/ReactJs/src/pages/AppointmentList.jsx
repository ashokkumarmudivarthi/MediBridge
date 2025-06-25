import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const AppointmentList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ status: '', reason: '', patientId: '' });

  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");

  const pageSize = 10;

  // Fetch user profile info
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          window.dispatchEvent(new Event('tokenExpired'));
          return;
        }

        const data = await response.json();
        setUsername(data.username || 'N/A');
        setRole(data.role || 'N/A');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  useEffect(() => {
    fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/list`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAppointments(data);
        setFilteredAppointments(data);
      })
      .catch((error) => console.error('Error fetching appointments:', error));
  }, [token]);

  const handleFilterChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    const filtered = appointments.filter((appt) => {
      return (
        (!form.status || appt.status?.toLowerCase().includes(form.status.toLowerCase())) &&
        (!form.reason || appt.reason?.toLowerCase().includes(form.reason.toLowerCase())) &&
        (!form.patientId || String(appt.patientId)?.includes(form.patientId))
      );
    });
    setFilteredAppointments(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setForm({ status: '', reason: '', patientId: '' });
    setFilteredAppointments(appointments);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredAppointments.length / pageSize);
  const pageData = filteredAppointments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const exportToExcel = () => {
    let csv = "ID,Date,Doctor ID,Patient ID,Reason,Status\n";
    filteredAppointments.forEach((appt) => {
      csv += `${appt.id},${appt.date},${appt.doctorId},${appt.patientId},${appt.reason},${appt.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'Appointments_List.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Appointments List - Wellness Wave", 20, 10);
    const tableColumn = ["ID", "Date", "Doctor ID", "Patient ID", "Reason", "Status"];
    const tableRows = [];

    filteredAppointments.forEach(appt => {
      tableRows.push([
        appt.id,
        appt.date,
        appt.doctorId,
        appt.patientId,
        appt.reason,
        appt.status
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });
    doc.save("Appointments_List.pdf");
  };

  const goToPage = (type) => {
    switch (type) {
      case 'first':
        setCurrentPage(1);
        break;
      case 'prev':
        setCurrentPage((prev) => Math.max(prev - 1, 1));
        break;
      case 'next':
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
        break;
      case 'last':
        setCurrentPage(totalPages);
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  return (
    <>
      {/* Header Navigation with Profile */}
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

      <div className="container my-4">
        <div className="header bg-success text-white p-3 text-center rounded">
          🏥 Appointment History List - Wellness Wave
        </div>

        {/* Filter Section */}
        <form className="my-3 d-flex flex-wrap align-items-center gap-2" onSubmit={applyFilters}>
          <label htmlFor="status" className="mr-2">Status:</label>
          <input type="text" name="status" value={form.status} onChange={handleFilterChange} />

          <label htmlFor="reason" className="ml-3 mr-2">Reason:</label>
          <input type="text" name="reason" value={form.reason} onChange={handleFilterChange} />

          <label htmlFor="patientId" className="ml-3 mr-2">Patient ID:</label>
          <input type="text" name="patientId" value={form.patientId} onChange={handleFilterChange} />

          <button type="submit" className="ml-3">🔍 Search</button>
          <button type="button" onClick={clearFilters}>❌ Clear</button>
        </form>

        {/* Export & Navigation */}
        <div className="buttons mb-3 d-flex gap-3">
          <button onClick={() => navigate('/admin/appointments')}>🏠 Back to Home</button>
          <button onClick={exportToPDF}>📄 Export to PDF</button>
          <button onClick={exportToExcel}>📊 Export to Excel</button>
        </div>

        {/* Appointment Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-striped" id="appointmentTable">
            <thead className="bg-success text-white text-center">
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Doctor ID</th>
                <th>Patient ID</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No Appointments Found</td></tr>
              ) : (
                pageData.map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.id}</td>
                    <td>{appt.date}</td>
                    <td>{appt.doctorId}</td>
                    <td>{appt.patientId}</td>
                    <td>{appt.reason}</td>
                    <td>{appt.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination text-center mt-4">
          <button onClick={() => goToPage('first')} disabled={currentPage === 1}>⏮️ First</button>
          <button onClick={() => goToPage('prev')} disabled={currentPage === 1}>◀️ Previous</button>
          <span className="mx-3">Page {currentPage} of {totalPages}</span>
          <button onClick={() => goToPage('next')} disabled={currentPage === totalPages}>▶️ Next</button>
          <button onClick={() => goToPage('last')} disabled={currentPage === totalPages}>⏭️ Last</button>
        </div>
      </div>
    </>
  );
};

export default AppointmentList;
