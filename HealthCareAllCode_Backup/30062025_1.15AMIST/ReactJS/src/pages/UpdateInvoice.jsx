// src/pages/UpdateInvoice.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";

const UpdateInvoice = () => {
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

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BILLING_URL}/api/invoices/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(invoice)
      });

      const result = await response.json();
      if (response.ok) {
        alert("Invoice updated successfully!");
        navigate("/admin/billing/list");
      } else {
        alert(result.message || "Update failed");
      }
    } catch (err) {
      alert("Update error occurred.");
      console.error(err);
    }
  };

  if (loading) return <CommonLayout><div className="text-center mt-5">Loading...</div></CommonLayout>;
  if (!invoice) return <CommonLayout><div className="text-center mt-5">Invoice not found.</div></CommonLayout>;

  return (
    <CommonLayout>
      <div className="container">
        <h3 className="mb-4">Update Invoice #{invoice.invoiceNumber}</h3>
        <form onSubmit={handleUpdate} className="row g-3">
          <div className="col-md-6">
            <label>Amount</label>
            <input name="amount" type="number" value={invoice.amount} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label>Due Date</label>
            <input name="dueDate" type="date" value={invoice.dueDate} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-12">
            <label>Status</label>
            <select name="status" className="form-select" value={invoice.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-md-12">
            <label>Notes</label>
            <textarea name="notes" className="form-control" value={invoice.notes || ""} onChange={handleChange} />
          </div>
          <div className="col-12">
            <button className="btn btn-success" type="submit">Update</button>
            <button className="btn btn-secondary ms-2" type="button" onClick={() => navigate("/admin/billing-dashboard")}>Cancel</button>
          </div>
        </form>
      </div>
    </CommonLayout>
  );
};

export default UpdateInvoice;
