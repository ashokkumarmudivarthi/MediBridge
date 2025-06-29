/*import React, { useState } from "react";
import CommonLayout from "../components/CommonLayout";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    amount: "",
    dueDate: "",
    notes: ""
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  
  const BILLING_URL = process.env.REACT_APP_BILLING_SERVICE || "http://localhost:8087";

  //const BILLING_URL =process.env.REACT_APP_BILLING_SERVICE


  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.amount || !formData.dueDate) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`${BILLING_URL}/api/invoices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        alert("Invoice created successfully!");
        navigate("/admin/billing/view");
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      alert("Error while creating invoice.");
      console.error(err);
    }
  };

  return (
    <CommonLayout>
      <div className="container">
        <h3>Create Invoice</h3>
        <form onSubmit={handleSubmit} className="row g-3 mt-3">
          <div className="col-md-6">
            <label>Patient ID</label>
            <input name="patientId" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label>Doctor ID</label>
            <input name="doctorId" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label>Amount</label>
            <input name="amount" type="number" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label>Due Date</label>
            <input name="dueDate" type="date" className="form-control" onChange={handleChange} required />
          </div>
          <div className="col-12">
            <label>Notes</label>
            <textarea name="notes" className="form-control" onChange={handleChange}></textarea>
          </div>
          <div className="col-12">
            <button className="btn btn-success" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </CommonLayout>
  );
};

export default CreateInvoice;
*/


import React, { useState } from "react";
import CommonLayout from "../components/CommonLayout";
import { useNavigate } from "react-router-dom";

const CreateInvoice = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    amount: "",
    dueDate: "",
    notes: ""
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const BILLING_URL = process.env.REACT_APP_BILLING_SERVICE || "http://localhost:8087";

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      amount: "",
      dueDate: "",
      notes: ""
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId || !formData.amount || !formData.dueDate) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`${BILLING_URL}/api/invoices`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        alert("Invoice created successfully!");
        navigate("/admin/billing/list");
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      alert("Error while creating invoice.");
      console.error(err);
    }
  };

  return (
    <CommonLayout>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center my-3">
          <button className="btn btn-secondary" onClick={() => navigate("/admin/billing-dashboard")}>
            ← Back to Dashboard
          </button>
          <button className="btn btn-outline-warning" onClick={handleReset}>
            Reset Form
          </button>
        </div>

        <h3 className="text-center mb-4">Create Invoice</h3>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label>Patient ID</label>
            <input
              name="patientId"
              className="form-control"
              value={formData.patientId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label>Doctor ID</label>
            <input
              name="doctorId"
              className="form-control"
              value={formData.doctorId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label>Amount</label>
            <input
              name="amount"
              type="number"
              className="form-control"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label>Due Date</label>
            <input
              name="dueDate"
              type="date"
              className="form-control"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label>Notes</label>
            <textarea
              name="notes"
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="col-12">
            <button className="btn btn-success" type="submit">
              Submit Invoice
            </button>
          </div>
        </form>
      </div>
    </CommonLayout>
  );
};

export default CreateInvoice;
