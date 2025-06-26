import React, { useState } from 'react';
import axios from 'axios';

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [description, setDescription] = useState('');
  const token = localStorage.getItem("jwtToken");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);
    formData.append('doctorId', doctorId);
    formData.append('description', description);

    try {
      await axios.post(`${process.env.REACT_APP_DOC_SERVICE}/api/documents/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Uploaded successfully!");
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="container">
      <h3>Upload Document</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input type="text" placeholder="Patient ID" onChange={(e) => setPatientId(e.target.value)} />
      <input type="text" placeholder="Doctor ID" onChange={(e) => setDoctorId(e.target.value)} />
      <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadDocument;
