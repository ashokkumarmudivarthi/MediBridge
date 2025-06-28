// Description: Component for uploading patient documents with visit selection and file management
// Dependencies: React, axios, react-router-dom
// Note: Ensure environment variables REACT_APP_PATIENT_SERVICE and REACT_APP_AUTH_SERVICE are set in your .env file

/*
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadPatientDocument = () => {
  const [patientId, setPatientId] = useState("");
  const [visitId, setVisitId] = useState("");
  const [file, setFile] = useState(null);
  const [visits, setVisits] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState({});
  const [patient, setPatient] = useState({});
  const [documents, setDocuments] = useState([]);

  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const PATIENT_SERVICE = process.env.REACT_APP_PATIENT_SERVICE;
  const AUTH_SERVICE = process.env.REACT_APP_AUTH_SERVICE;

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setUser(data);

        const patientRes = await fetch(`${PATIENT_SERVICE}/api/patients/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (patientRes.ok) {
          const patientData = await patientRes.json();
          setPatient(patientData);
          setPatientId(patientData.id);
        }
      } catch (err) {
        console.error("Error fetching profile/patient:", err);
      }
    };

    fetchProfile();
  }, [token, AUTH_SERVICE, PATIENT_SERVICE]);

  useEffect(() => {
    if (patientId) {
      axios
        .get(`${PATIENT_SERVICE}/api/patient-visits/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setVisits(res.data || []))
        .catch((err) => {
          console.error("Failed to fetch visits", err);
          setVisits([]);
        });
    } else {
      setVisits([]);
    }
  }, [patientId, PATIENT_SERVICE, token]);

  useEffect(() => {
    if (patientId) {
      axios
        .get(`${PATIENT_SERVICE}/api/documents/by-patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setDocuments(res.data))
        .catch((err) => console.error("Failed to load documents", err));
    }
  }, [patientId, PATIENT_SERVICE, token]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!patientId || !file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("visitId", visitId || "");
    formData.append("file", file);
    formData.append("uploadedBy", user.username || "unknown");

    setUploading(true);

    try {
      await axios.post(`${PATIENT_SERVICE}/api/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Document uploaded successfully!");
      setFile(null);

      const res = await axios.get(`${PATIENT_SERVICE}/api/documents/by-patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data);

    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (docId, fileName) => {
    try {
      const res = await axios.get(`${PATIENT_SERVICE}/api/documents/download/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Download error:", err);
      alert("Download failed!");
    }
  };

  const handlePreview = async (docId, fileType) => {
    try {
      const res = await axios.get(`${PATIENT_SERVICE}/api/documents/download/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: fileType });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error("❌ Preview error:", err);
      alert("Preview failed!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  return (
    <>
      // Navbar 
      <nav className="navbar navbar-light bg-light px-3">
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3"><strong>User:</strong> {user.username}</span>
          <span className="me-3"><strong>Patient:</strong> {patient.name || "N/A"} (ID: {patientId || "N/A"})</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      // Header Banner 
      <header className="bg-info text-white text-center py-4">
        <h2>Upload Patient Documents</h2>
        <p className="lead">Securely upload reports, prescriptions or scans</p>
      </header>

      // Form Section 
      <div className="container bg-white p-4 shadow mt-4" style={{ maxWidth: "600px" }}>
        <h4 className="text-success mb-3">📎 Upload Form</h4>

        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Patient ID:</label>
            <input type="number" className="form-control" value={patientId} disabled />
          </div>

          {visits.length > 0 && (
            <div className="form-group">
              <label>Select Visit (optional):</label>
              <select className="form-control" value={visitId} onChange={(e) => setVisitId(e.target.value)}>
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
            <label>Choose File:</label>
            <input type="file" className="form-control-file" onChange={handleFileChange} required />
          </div>

          {file && <p>📄 Selected File: {file.name}</p>}

          <div className="d-flex justify-content-between mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/patients")}>
              ⬅️ Back to Home
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>

        // Document List 
        {documents.length > 0 && (
          <div className="mt-5">
            <h5>🗂️ Uploaded Documents</h5>
            <ul className="list-group">
              {documents.map((doc) => (
                <li key={doc.documentId} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{doc.fileName}</span>
                  <div>
                    <button className="btn btn-sm btn-outline-info me-2" onClick={() => handlePreview(doc.documentId, doc.fileType)}>👁️ Preview</button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleDownload(doc.documentId, doc.fileName)}>⬇️ Download</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadPatientDocument;
*/


import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout"; // Adjust path based on your folder structure
//import useTokenExpiryRedirect from "../hooks/useTokenExpiryRedirect"; // Custom hook for token expiry handling


const UploadPatientDocument = () => {
  const [patientId, setPatientId] = useState("");
  const [visitId, setVisitId] = useState("");
  const [file, setFile] = useState(null);
  const [visits, setVisits] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState({});
  const [patient, setPatient] = useState({});
  const [documents, setDocuments] = useState([]);

  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  //useTokenExpiryRedirect();// token expiry handling hook

  const PATIENT_SERVICE = process.env.REACT_APP_PATIENT_SERVICE;
  const AUTH_SERVICE = process.env.REACT_APP_AUTH_SERVICE;

  useEffect(() => {
   if (!token) return;

  
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setUser(data);

        const patientRes = await fetch(`${PATIENT_SERVICE}/api/patients/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (patientRes.ok) {
          const patientData = await patientRes.json();
          setPatient(patientData);
          setPatientId(patientData.id);
        }
      } catch (err) {
        console.error("Error fetching profile/patient:", err);
      }
    };

    fetchProfile();
  }, [token, AUTH_SERVICE, PATIENT_SERVICE]);

  useEffect(() => {
    if (patientId) {
      axios
        .get(`${PATIENT_SERVICE}/api/patient-visits/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setVisits(res.data || []))
        .catch((err) => {
          console.error("Failed to fetch visits", err);
          setVisits([]);
        });
    } else {
      setVisits([]);
    }
  }, [patientId,PATIENT_SERVICE, token]);

  useEffect(() => {
    if (patientId) {
      axios
        .get(`${PATIENT_SERVICE}/api/documents/by-patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setDocuments(res.data))
        .catch((err) => console.error("Failed to load documents", err));
    }
  }, [patientId, PATIENT_SERVICE, token]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!patientId || !file) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("visitId", visitId || "");
    formData.append("file", file);
    formData.append("uploadedBy", user.username || "unknown");

    setUploading(true);

    try {
      await axios.post(`${PATIENT_SERVICE}/api/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Document uploaded successfully!");
      setFile(null);

      const res = await axios.get(`${PATIENT_SERVICE}/api/documents/by-patient/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data);

    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (docId, fileName) => {
    try {
      const res = await axios.get(`${PATIENT_SERVICE}/api/documents/download/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Download error:", err);
      alert("Download failed!");
    }
  };

  const handlePreview = async (docId, fileType) => {
    try {
      const res = await axios.get(`${PATIENT_SERVICE}/api/documents/download/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: fileType });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error("❌ Preview error:", err);
      alert("Preview failed!");
    }
  };

  return (
    <Layout
      user={user}
      patient={patient}
      title="Upload Patient Documents"
      subtitle="Securely upload reports, prescriptions or scans"
    >
      <div className="bg-white p-4 shadow rounded" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h4 className="text-success mb-3">📎 Upload required documents</h4>

        <form onSubmit={handleUpload}>
          <div className="form-group mb-3">
            <label>Patient ID:</label>
            <input type="number" className="form-control" value={patientId} disabled />
          </div>

          {visits.length > 0 && (
            <div className="form-group mb-3">
              <label>Select Visit (optional):</label>
              <select className="form-control" value={visitId} onChange={(e) => setVisitId(e.target.value)}>
                <option value="">-- None --</option>
                {visits.map((v) => (
                  <option key={v.visitId} value={v.visitId}>
                    {v.visitType} | {v.admissionDate?.substring(0, 10)} - {v.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group mb-3">
            <label>Choose File:</label>
            <input type="file" className="form-control-file" onChange={handleFileChange} required />
          </div>

          {file && <p>📄 Selected File: {file.name}</p>}

          <div className="d-flex justify-content-between mt-4">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/patients")}>
              ⬅️ Back to Home
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>

        {documents.length > 0 && (
          <div className="mt-5">
            <h5>🗂️ Uploaded Documents</h5>
            <ul className="list-group">
              {documents.map((doc) => (
                <li key={doc.documentId} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>{doc.fileName}</span>
                  <div>
                    <button className="btn btn-sm btn-outline-info me-2" onClick={() => handlePreview(doc.documentId, doc.fileType)}>👁️ Preview</button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleDownload(doc.documentId, doc.fileName)}>⬇️ Download</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UploadPatientDocument;
