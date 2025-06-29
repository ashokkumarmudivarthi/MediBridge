/*// src/pages/j.jsx/AdminBillingDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";

const AdminBillingDashboard = () => {
  const navigate = useNavigate();

  const billingActions = [
    { label: "➕ Create Invoice", path: "/admin/billing/create", style: "primary" },
    { label: "📄 View All Invoices", path: "/admin/billing/list", style: "success" },
    { label: "🔍 Search Invoice", path: "/admin/billing/search", style: "info" },
    //{ label: "✏️ Update Invoice", path: "/admin/billing/update", style: "warning" },
    //{ label: "🗑️ Delete Invoice", path: "/admin/billing/delete", style: "danger" },
  ];

  return (
    <CommonLayout>
      <div className="container my-5">
        <h2 className="mb-4 text-center">Billing Management</h2>
        <div className="row">
          {billingActions.map((action, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <div className="card shadow h-100">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <h5 className="card-title">{action.label}</h5>
                  <button
                    className={`btn btn-${action.style} mt-3`}
                    onClick={() => navigate(action.path)}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CommonLayout>
  );
};

export default AdminBillingDashboard;
*/

// src/pages/j.jsx/AdminBillingDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";

const AdminBillingDashboard = () => {
  const navigate = useNavigate();

  const billingActions = [
    { label: "➕ Create Invoice", path: "/admin/billing/create", style: "primary" },
    { label: "📄 View All Invoices", path: "/admin/billing/list", style: "success" },
    { label: "🔍 Search Invoice", path: "/admin/billing/search", style: "info" },
  ];

  return (
    <CommonLayout>
      <div className="container my-5">
        <h2 className="mb-4 text-center">Billing Management</h2>

        {/* Back to Home Button */}
        <div className="mb-4 text-center">
          <button className="btn btn-outline-secondary" onClick={() => navigate("/dashboard")}>
            ⬅️ Back to Home
          </button>
        </div>

        <div className="row">
          {billingActions.map((action, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <div className="card shadow h-100">
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <h5 className="card-title">{action.label}</h5>
                  <button
                    className={`btn btn-${action.style} mt-3`}
                    onClick={() => navigate(action.path)}
                  >
                    Go
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CommonLayout>
  );
};

export default AdminBillingDashboard;
