// src/pages/PatientHistoryPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CommonLayout from "../../components/CommonLayout";

const PatientHistoryPage = () => {
  const navigate = useNavigate();

  return (
    <CommonLayout showEdit={false}>
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center">
          <h3>📜 Patient Full History</h3>
          <button
  className="btn btn-outline-danger btn-sm"
  onClick={() => {
    if (window.opener) {
      window.close();
    } else {
      alert("This tab wasn't opened by a script, so it can't be closed programmatically.");
    }
  }}
>
  ✖️ Close
</button>

        </div>
        <hr />
        <div className="row g-4">
          <div className="col-md-4">
            <button className="btn btn-outline-primary w-100" onClick={() => navigate("/history/appointments")}>
              🗓️ Appointments History
            </button>
          </div>
          <div className="col-md-4">
            <button className="btn btn-outline-warning w-100" onClick={() => navigate("/history/visits")}>
              🏥 Visits History
            </button>
          </div>
          <div className="col-md-4">
            <button className="btn btn-outline-success w-100" onClick={() => navigate("/history/medical-records")}>
              📋 Medical Records
            </button>
          </div>
          <div className="col-md-4">
            <button className="btn btn-outline-dark w-100" onClick={() => navigate("/history/invoices")}>
              💳 Invoices
            </button>
          </div>
          <div className="col-md-4">
            <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/history/documents")}>
              📁 Uploaded Docs
            </button>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
};

export default PatientHistoryPage;
