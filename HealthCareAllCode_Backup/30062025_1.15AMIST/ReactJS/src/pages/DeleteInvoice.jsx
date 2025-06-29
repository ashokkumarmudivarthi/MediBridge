/*import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";

const DeleteInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const token = localStorage.getItem("jwtToken");
  const BILLING_URL = process.env.REACT_APP_BILLING_SERVICE;

  useEffect(() => {
    const fetchInvoice = async () => {
      const res = await fetch(`${BILLING_URL}/api/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setInvoice(data.data);
      } else {
        alert("Invoice not found.");
        navigate("/admin/billing/view");
      }
    };
    fetchInvoice();
  }, [id, token, navigate, BILLING_URL]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    const res = await fetch(`${BILLING_URL}/api/invoices/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      alert("Invoice deleted successfully.");
      navigate("/admin/billing/view");
    } else {
      alert("Failed to delete invoice.");
    }
  };

  if (!invoice) return <CommonLayout><p>Loading...</p></CommonLayout>;

  return (
    <CommonLayout>
      <div className="container">
        <h3>Delete Invoice</h3>
        <p>Are you sure you want to delete the following invoice?</p>
        <ul>
          <li><strong>Invoice #:</strong> {invoice.invoiceNumber}</li>
          <li><strong>Amount:</strong> ₹{invoice.amount}</li>
          <li><strong>Status:</strong> {invoice.status}</li>
        </ul>
        <button className="btn btn-danger me-2" onClick={handleDelete}>Yes, Delete</button>
        <button className="btn btn-secondary" onClick={() => navigate("/admin/billing/view")}>Cancel</button>
      </div>
    </CommonLayout>
  );
};

export default DeleteInvoice;
*/

// src/pages/DeleteInvoice.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";

const DeleteInvoice = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const BILLING_URL = process.env.REACT_APP_BILLING_SERVICE || "http://localhost:8087";

  useEffect(() => {
    fetch(`${BILLING_URL}/api/invoices/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setInvoice(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token, BILLING_URL]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`${BILLING_URL}/api/invoices/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        alert("Invoice deleted successfully.");
        navigate("/admin/billing/list");
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      alert("Error occurred while deleting.");
      console.error(err);
    }
  };

  if (loading) return <CommonLayout><div className="text-center mt-5">Loading...</div></CommonLayout>;
  if (!invoice) return <CommonLayout><div className="text-center mt-5">Invoice not found.</div></CommonLayout>;

  return (
    <CommonLayout>
      <div className="container mt-5">
        <h3>Delete Invoice</h3>
        <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
        <p><strong>Amount:</strong> ₹{invoice.amount}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p>Are you sure you want to delete this invoice?</p>

        <button className="btn btn-danger me-2" onClick={handleDelete}>Yes, Delete</button>
        <button className="btn btn-secondary" onClick={() => navigate("/admin/billing/list")}>Cancel</button>
      </div>
    </CommonLayout>
  );
};

export default DeleteInvoice;
