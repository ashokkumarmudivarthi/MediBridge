/*import React, { useEffect, useState } from "react";
import CommonLayout from "../components/CommonLayout";
import { useNavigate } from "react-router-dom";

const ViewInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("");
  const [filterField, setFilterField] = useState("invoiceNumber"); // Default field
  const token = localStorage.getItem("jwtToken");
  const BILLING_URL = process.env.REACT_APP_BILLING_SERVICE || "http://localhost:8087";
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BILLING_URL}/api/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setInvoices(data.data || []))
      .catch(err => console.error("Failed to fetch invoices", err));
  }, [token, BILLING_URL]);

  const handleReset = () => {
    setFilter("");
    setFilterField("invoiceNumber");
  };

  const filtered = invoices.filter(inv => {
    const fieldValue = inv[filterField];
    return fieldValue && fieldValue.toString().toLowerCase().includes(filter.toLowerCase());
  });

  return (
    <CommonLayout>
      <div className="container">
        // Header Buttons 
        <div className="d-flex justify-content-between align-items-center my-3">
          <button className="btn btn-secondary" onClick={() => navigate("/admin/billing-dashboard")}>
            ← Back to Billing Dashboard
          </button>
          <button className="btn btn-outline-warning" onClick={handleReset}>
            Reset Filter
          </button>
        </div>

        <h3 className="text-center mb-4">All Invoices</h3>

        // Filter Controls 
        <div className="row mb-3">
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
            >
              <option value="invoiceNumber">Invoice #</option>
              <option value="patientId">Patient ID</option>
              <option value="doctorId">Doctor ID</option>
              <option value="status">Status</option>
              <option value="dateIssued">Date Issued</option>
            </select>
          </div>
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder={`Search by ${filterField}`}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        // Table 
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Invoice #</th>
              <th>Patient ID</th>
              <th>Doctor ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date Issued</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(inv => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.patientId}</td>
                  <td>{inv.doctorId}</td>
                  <td>₹{inv.amount}</td>
                  <td>{inv.status}</td>
                  <td>{inv.dateIssued}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-1"
                      onClick={() => navigate(`/admin/billing/update/${inv.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => navigate(`/admin/billing/delete/${inv.id}`)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CommonLayout>
  );
};

export default ViewInvoices;
*/

import React, { useEffect, useState } from "react";
import CommonLayout from "../components/CommonLayout";
import { useNavigate } from "react-router-dom";

const ViewInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("");
  const [filterField, setFilterField] = useState("invoiceNumber");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const token = localStorage.getItem("jwtToken");
  const BILLING_URL = process.env.REACT_APP_BILLING_SERVICE || "http://localhost:8087";
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BILLING_URL}/api/invoices`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setInvoices(data.data || []))
      .catch(err => console.error("Failed to fetch invoices", err));
  }, [token, BILLING_URL]);

  const handleReset = () => {
    setFilter("");
    setFilterField("invoiceNumber");
    setCurrentPage(1);
  };

  const filtered = invoices.filter(inv => {
    const fieldValue = inv[filterField];
    return fieldValue && fieldValue.toString().toLowerCase().includes(filter.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / recordsPerPage);
  const currentData = filtered.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
  };

  const handleCSVExport = () => {
    const headers = Object.keys(invoices[0]);
    const csvRows = [
      headers.join(","),
      ...filtered.map(row => headers.map(field => JSON.stringify(row[field] || "")).join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoices.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <CommonLayout>
      <div className="container">
        {/* Header Buttons */}
        <div className="d-flex justify-content-between align-items-center my-3">
          <button className="btn btn-secondary" onClick={() => navigate("/admin/billing-dashboard")}>
            ← Back to Billing Dashboard
          </button>
          <div>
            <button className="btn btn-outline-success me-2" onClick={handleCSVExport}>
              ⬇️ Download CSV
            </button>
            <button className="btn btn-outline-warning" onClick={handleReset}>
              🔄 Reset Filter
            </button>
          </div>
        </div>

        <h3 className="text-center mb-4">All Invoices</h3>

        {/* Filter Controls */}
        <div className="row mb-3">
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
            >
              <option value="invoiceNumber">Invoice #</option>
              <option value="patientId">Patient ID</option>
              <option value="doctorId">Doctor ID</option>
              <option value="status">Status</option>
              <option value="dateIssued">Date Issued</option>
            </select>
          </div>
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder={`Search by ${filterField}`}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Invoice #</th>
              <th>Patient ID</th>
              <th>Doctor ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date Issued</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map(inv => (
                <tr key={inv.id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.patientId}</td>
                  <td>{inv.doctorId}</td>
                  <td>₹{inv.amount}</td>
                  <td>{inv.status}</td>
                  <td>{inv.dateIssued}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-1"
                      onClick={() => navigate(`/admin/billing/update/${inv.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => navigate(`/admin/billing/delete/${inv.id}`)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center my-4">
          <button
            className="btn btn-outline-primary"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ← Previous
          </button>

          <span>
            Page{" "}
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              style={{ width: "60px", textAlign: "center" }}
            />{" "}
            / {totalPages}
          </span>

          <button
            className="btn btn-outline-primary"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      </div>
    </CommonLayout>
  );
};

export default ViewInvoices;
