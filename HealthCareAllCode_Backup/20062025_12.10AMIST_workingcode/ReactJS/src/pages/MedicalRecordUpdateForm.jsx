import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;

const MedicalRecordUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing record by ID
  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRecord(data.data);
      } catch (err) {
        console.error("Error fetching record:", err);
        alert("❌ Failed to load medical record.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(record),
      });

      if (res.ok) {
        alert("✅ Medical record updated successfully.");
        navigate("/medical-records");
      } else {
        alert("❌ Update failed.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("❌ Server error during update.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading medical record...</div>;
  if (!record) return <div className="text-center mt-5">Record not found.</div>;

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4">Update Medical Record</h2>
      <form onSubmit={handleUpdate}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Diagnosis</label>
            <input
              type="text"
              name="diagnosis"
              value={record.diagnosis || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Treatment</label>
            <input
              type="text"
              name="treatment"
              value={record.treatment || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Doctor ID</label>
            <input
              type="number"
              name="doctorId"
              value={record.doctorId || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Record Date</label>
            <input
              type="date"
              name="recordDate"
              value={record.recordDate || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-12 mt-3 d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              ✅ Update
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/medical-records")}>
              🔙 Back
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MedicalRecordUpdateForm;
