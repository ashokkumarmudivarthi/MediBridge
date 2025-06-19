import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ status: '', reason: '', patientId: '' });
  const pageSize = 10;

  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/list`, {
      headers: { Authorization: `Bearer ${token}` }
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

  return (
    <div className="container my-4">
      <div className="header bg-success text-white p-3 text-center rounded">
        🏥 Appointment History List - Wellness Wave
      </div>

      <form className="my-3 d-flex flex-wrap align-items-center gap-2" onSubmit={applyFilters}>
        <label htmlFor="status" className="mr-2">Status:</label>
        <input type="text" name="status" id="status" value={form.status} onChange={handleFilterChange} />

        <label htmlFor="reason" className="ml-3 mr-2">Reason:</label>
        <input type="text" name="reason" id="reason" value={form.reason} onChange={handleFilterChange} />

        <label htmlFor="patientId" className="ml-3 mr-2">Patient ID:</label>
        <input type="text" name="patientId" id="patientId" value={form.patientId} onChange={handleFilterChange} />

        <button type="submit" className="ml-3">🔍 Search</button>
        <button type="button" onClick={clearFilters}>❌ Clear</button>
      </form>

      <div className="buttons mb-3 d-flex gap-3">
        <button onClick={() => window.location.href = '/dashboard'}>🏠 Back to Home</button>
        <button onClick={exportToPDF}>📄 Export to PDF</button>
        <button onClick={exportToExcel}>📊 Export to Excel</button>
      </div>

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

      <div className="pagination text-center mt-4">
        <button onClick={() => goToPage('first')} disabled={currentPage === 1}>⏮️ First</button>
        <button onClick={() => goToPage('prev')} disabled={currentPage === 1}>◀️ Previous</button>
        <span className="mx-3">Page {currentPage} of {totalPages}</span>
        <button onClick={() => goToPage('next')} disabled={currentPage === totalPages}>▶️ Next</button>
        <button onClick={() => goToPage('last')} disabled={currentPage === totalPages}>⏭️ Last</button>
      </div>
    </div>
  );
};

export default AppointmentList;
