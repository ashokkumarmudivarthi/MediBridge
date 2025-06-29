/*

// ✅ src/pages/j.jsx/SearchInvoice.jsx

import React, { useState } from "react";
import CommonLayout from "../components/CommonLayout";

const BILLING_SERVICE_URL = process.env.REACT_APP_BILLING_SERVICE || "http://localhost:8087";
const token = localStorage.getItem("jwtToken");

const SearchInvoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!invoiceNumber.trim()) {
      setError("⚠️ Please enter an invoice number.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${BILLING_SERVICE_URL}/api/invoices/search?number=${invoiceNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        setError("Invoice not found.");
      } else if (!response.ok) {
        setError("Failed to fetch invoice.");
      } else {
        const data = await response.json();
        setResult(data.data); // assumes { success, message, data }
      }
    } catch (err) {
      setError("🔌 Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <CommonLayout>
      <div className="container mt-5">
        <h2 className="text-center mb-4">🔍 Search Invoice</h2>

        <div className="mb-3">
          <label htmlFor="invoiceNumber" className="form-label">Invoice Number</label>
          <input
            type="text"
            className="form-control"
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="e.g., INV-202506280321"
          />
        </div>

        <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {result && (
          <div className="card mt-4">
            <div className="card-body">
              <h5 className="card-title">{result.invoiceNumber}</h5>
              <p className="card-text">
                <strong>Patient ID:</strong> {result.patientId} <br />
                <strong>Doctor ID:</strong> {result.doctorId} <br />
                <strong>Amount:</strong> ₹{result.amount} <br />
                <strong>Status:</strong> {result.status} <br />
                <strong>Issued:</strong> {result.dateIssued} <br />
                <strong>Due Date:</strong> {result.dueDate}
              </p>
            </div>
          </div>
        )}
      </div>
    </CommonLayout>
  );
};

export default SearchInvoice;
*/

import React, { useState } from "react";
import CommonLayout from "../components/CommonLayout";
import { useNavigate } from "react-router-dom";

const BILLING_SERVICE_URL = process.env.REACT_APP_BILLING_SERVICE || "http://localhost:8087";
const token = localStorage.getItem("jwtToken");

const SearchInvoice = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!invoiceNumber.trim()) {
      setError("⚠️ Please enter an invoice number.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `${BILLING_SERVICE_URL}/api/invoices/search?number=${invoiceNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 404) {
        setError("Invoice not found.");
      } else if (!response.ok) {
        setError("Failed to fetch invoice.");
      } else {
        const data = await response.json();
        setResult(data.data); // assumes { success, message, data }
      }
    } catch (err) {
      setError("🔌 Server error. Please try again.");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setInvoiceNumber("");
    setResult(null);
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this invoice?")) return;

    try {
      const res = await fetch(`${BILLING_SERVICE_URL}/api/invoices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("✅ Invoice deleted successfully.");
        handleReset();
      } else {
        const data = await res.json();
        alert(data.message || "❌ Failed to delete invoice.");
      }
    } catch (err) {
      alert("❌ Server error during deletion.");
    }
  };

  return (
    <CommonLayout>
      <div className="container mt-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin/billing-dashboard")}
          >
            ← Back to Billing Dashboard
          </button>

          <button className="btn btn-outline-warning" onClick={handleReset}>
            🔄 Reset Form
          </button>
        </div>

        <h2 className="text-center mb-4">🔍 Search Invoice</h2>

        {/* Search Form */}
        <div className="mb-3">
          <label htmlFor="invoiceNumber" className="form-label">Invoice Number</label>
          <input
            type="text"
            className="form-control"
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="e.g., INV-202506280321"
          />
        </div>

        <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {/* Result */}
        {result && (
          <div className="card mt-4">
            <div className="card-header d-flex justify-content-between">
              <h5>{result.invoiceNumber}</h5>
              <span className="badge bg-success">{result.status}</span>
            </div>

            <div className="card-body">
              <p className="card-text">
                <strong>Patient ID:</strong> {result.patientId} <br />
                <strong>Doctor ID:</strong> {result.doctorId} <br />
                <strong>Amount:</strong> ₹{result.amount} <br />
                <strong>Issued Date:</strong> {result.dateIssued} <br />
                <strong>Due Date:</strong> {result.dueDate} <br />
                <strong>Notes:</strong> {result.notes || "N/A"}
              </p>

              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-warning"
                  onClick={() => navigate(`/admin/billing/update/${result.id}`)}
                >
                  ✏️ Update
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(result.id)}
                >
                  🗑️ Delete
                </button>

                {/* Future Ready Feature */}
                {/* 
                <button className="btn btn-outline-secondary">
                  🖨️ Print
                </button>
                <button className="btn btn-outline-dark">
                  📄 Export PDF
                </button>
                */}
              </div>
            </div>
          </div>
        )}
      </div>
    </CommonLayout>
  );
};

export default SearchInvoice;
