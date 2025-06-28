import React, { useState, useEffect } from "react";
import axios from "axios";

const UploadPatientDocument = () => {
  const [patientId, setPatientId] = useState("");
  const [visitId, setVisitId] = useState("");
  const [file, setFile] = useState(null);
  const [visits, setVisits] = useState([]);
  const [uploading, setUploading] = useState(false);

  const PATIENT_SERVICE = process.env.REACT_APP_PATIENT_SERVICE;

  // 🔄 Load visits when patient ID changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (patientId) {
      axios
        .get(`${PATIENT_SERVICE}/api/patient-visits/patient/${patientId}`)
        .then((res) => {
          setVisits(res.data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch visits", err);
          setVisits([]);
        });
    } else {
      setVisits([]);
    }
  }, [patientId,PATIENT_SERVICE]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!patientId || !file) {
      alert("Please select a Patient ID and file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("visitId", visitId || "");
    formData.append("file", file);

    setUploading(true);

    try {
      await axios.post(`${PATIENT_SERVICE}/api/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Document uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container bg-white p-4 shadow mt-4" style={{ maxWidth: "600px" }}>
      <h4 className="text-success mb-3">📎 Upload Patient Document</h4>

      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label>Patient ID:</label>
          <input
            type="number"
            className="form-control"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
          />
        </div>

        {visits.length > 0 && (
          <div className="form-group">
            <label>Select Visit (optional):</label>
            <select
              className="form-control"
              value={visitId}
              onChange={(e) => setVisitId(e.target.value)}
            >
              <option value="">-- None --</option>
              {visits.map((v) => (
                <option key={v.visitId} value={v.visitId}>
                  {v.visitType} | {v.admissionDate?.substring(0, 10)} - {v.status}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Choose File (PDF, Image, etc.):</label>
          <input type="file" className="form-control-file" onChange={handleFileChange} required />
        </div>

        {file && <p>📄 Selected File: {file.name}</p>}

        <button type="submit" className="btn btn-primary mt-3" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </div>
  );
};

export default UploadPatientDocument;
