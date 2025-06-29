// AddInvoicePage.jsx
import React, { useState } from "react";
const BILLING_SERVICE_URL = process.env.REACT_APP_BILLING_SERVICE;

const AddInvoicePage = () => {
  const [form, setForm] = useState({ patientId: "", doctorId: "", amount: "", dueDate: "", notes: "" });
  const token = localStorage.getItem("jwtToken");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BILLING_SERVICE_URL}/api/invoices/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) alert("Invoice created!");
  };

  return (
    <div className="container my-5">
      <h3>Create Invoice</h3>
      <form onSubmit={handleSubmit}>
        <input name="patientId" placeholder="Patient ID" onChange={handleChange} className="form-control mb-2" />
        <input name="doctorId" placeholder="Doctor ID" onChange={handleChange} className="form-control mb-2" />
        <input name="amount" placeholder="Amount" type="number" onChange={handleChange} className="form-control mb-2" />
        <input name="dueDate" placeholder="Due Date" type="date" onChange={handleChange} className="form-control mb-2" />
        <textarea name="notes" placeholder="Notes" onChange={handleChange} className="form-control mb-2" />
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
};

export default AddInvoicePage;
