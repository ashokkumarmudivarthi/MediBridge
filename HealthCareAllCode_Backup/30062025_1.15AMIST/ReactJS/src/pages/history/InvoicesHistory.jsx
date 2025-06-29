import React, { useEffect, useState } from "react";
import CommonLayout from "../../components/CommonLayout";
import { useNavigate } from "react-router-dom";

const BILL = process.env.REACT_APP_BILLING_SERVICE || "http://localhost:8087";
const PATIENT = process.env.REACT_APP_PATIENT_SERVICE || "http://localhost:8082";

const InvoicesHistory = () => {
  const [invoices, setInvoices] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  // ✅ Correct patient ID fetch from patient profile
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${PATIENT}/api/patients/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch patient profile");
          return;
        }

        const patient = await res.json();
        setPatientId(patient.id);
      } catch (err) {
        console.error("Error fetching patient profile:", err);
      }
    })();
  }, [token]);

  // ✅ Load invoice data after getting patientId
  useEffect(() => {
    if (!patientId) return;

    fetch(`${BILL}/api/invoices/patient/${patientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setInvoices(data.data || []))
      .catch(console.error);
  }, [patientId, token]);

  return (
    <CommonLayout showEdit={false}>
      <div className="container my-4">
        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h3>💳 Invoice History</h3>

        {invoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice #</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Issued</th>
                <th>Due</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.id}</td>
                  <td>{inv.invoiceNumber}</td>
                  <td>₹{inv.amount}</td>
                  <td>{inv.status}</td>
                  <td>{new Date(inv.dateIssued).toLocaleDateString()}</td>
                  <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td>
                    <a
                      className="btn btn-sm btn-outline-dark"
                      href={`${BILL}/api/invoices/${inv.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </CommonLayout>
  );
};

export default InvoicesHistory;
