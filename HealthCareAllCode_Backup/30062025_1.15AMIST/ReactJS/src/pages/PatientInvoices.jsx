// src/pages/PatientInvoices.jsx
import React, { useEffect, useState } from "react";
import { fetchInvoicesByPatientId } from "./invoiceService";
import CommonLayout from "../components/CommonLayout";

function PatientInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    // Simulate fetching patientId from JWT or profile API
    const fetchPatientId = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await fetch(`${process.env.REACT_APP_AUTH_SERVICE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load user profile");

        const data = await res.json();
        setPatientId(data.id); // Make sure your backend returns patientId as `id`
      } catch (err) {
        setError("Failed to identify patient");
      }
    };

    fetchPatientId();
  }, []);

  useEffect(() => {
    if (!patientId) return;

    const loadInvoices = async () => {
      try {
        const result = await fetchInvoicesByPatientId(patientId);
        setInvoices(result.data || []);
      } catch (err) {
        setError("Unable to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [patientId]);

  return (
    <CommonLayout>
      <div className="container mt-4">
        <h2 className="mb-3">My Invoices</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : invoices.length === 0 ? (
          <div className="alert alert-info">No invoices found.</div>
        ) : (
          <ul className="list-group">
            {invoices.map((inv) => (
              <li key={inv.id} className="list-group-item">
                <strong>{inv.invoiceNumber}</strong> | ₹{inv.amount} |{" "}
                <span className="badge bg-secondary">{inv.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </CommonLayout>
  );
}

export default PatientInvoices;
