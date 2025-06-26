
/*
import React, { useEffect, useState } from "react";
//import { authFetch } from "../pages/authFetch";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const REFERENCE_DATA_SERVICE = process.env.REACT_APP_Reference_Data_Service;

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    country: "",
    state: "",
    city: "",
    hospital: "",
    disease: "",
    existingIllnesses: [],
    address: "",
    pincode: "",
    contact: "",
    email: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [illnesses, setIllnesses] = useState([]);
  const [loading, setLoading] = useState({ state: false, city: false, hospital: false });

  useEffect(() => {
    fetch(`${REFERENCE_DATA_SERVICE}/api/countries`)
      .then((res) => res.json())
      .then(setCountries)
      .catch((err) => console.error("Error fetching countries:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/diseases`)
      .then((res) => res.json())
      .then(setDiseases)
      .catch((err) => console.error("Error fetching diseases:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/illnesses`)
      .then((res) => res.json())
      .then(setIllnesses)
      .catch((err) => console.error("Error fetching illnesses:", err));
  }, []);

  const handleChange = async (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "country") {
      setFormData((prev) => ({ ...prev, state: "", city: "", hospital: "" }));
      setStates([]);
      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, state: true }));

      try {
        const data = await fetch(`${REFERENCE_DATA_SERVICE}/api/states/by-country/${value}`).then(res => res.json());
        setStates(data);
      } catch (err) {
        console.error("Error loading states:", err);
      } finally {
        setLoading((prev) => ({ ...prev, state: false }));
      }
    }

    if (name === "state") {
      setFormData((prev) => ({ ...prev, city: "", hospital: "" }));
      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, city: true }));

      try {
        const data = await fetch(`${REFERENCE_DATA_SERVICE}/api/cities/by-state/${value}`).then(res => res.json());
        setCities(data);
      } catch (err) {
        console.error("Error loading cities:", err);
      } finally {
        setLoading((prev) => ({ ...prev, city: false }));
      }
    }

    if (name === "city") {
      setFormData((prev) => ({ ...prev, hospital: "" }));
      setHospitals([]);
      setLoading((prev) => ({ ...prev, hospital: true }));

      try {
        const data = await fetch(`${REFERENCE_DATA_SERVICE}/api/hospitals/by-city/${value}`).then(res => res.json());
        setHospitals(data);
      } catch (err) {
        console.error("Error loading hospitals:", err);
      } finally {
        setLoading((prev) => ({ ...prev, hospital: false }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Token missing. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Registration Successful!");
        resetForm();
      } else {
        alert("❌ Registration Failed.");
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err.message);
      alert("❌ Server Error. Try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      dob: "",
      gender: "",
      bloodGroup: "",
      country: "",
      state: "",
      city: "",
      hospital: "",
      disease: "",
      existingIllnesses: [],
      address: "",
      pincode: "",
      contact: "",
      email: "",
    });
    setStates([]);
    setCities([]);
    setHospitals([]);
  };

  const fields = [
    { id: "name", label: "Name", type: "text" },
    { id: "dob", label: "Date of Birth", type: "date" },
    { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { id: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
    { id: "country", label: "Country", type: "selectData", options: Array.isArray(countries) ? countries.map(c => ({ name: c.name, value: c.id })) : [] },
    { id: "state", label: "State", type: "selectData", options: Array.isArray(states) ? states.map(s => ({ name: s.name, value: s.id })) : [], loading: loading.state, disabled: states.length === 0 },
    { id: "city", label: "City", type: "selectData", options: Array.isArray(cities) ? cities.map(c => ({ name: c.name, value: c.id })) : [], loading: loading.city, disabled: cities.length === 0 },
    { id: "hospital", label: "Hospital", type: "selectData", options: Array.isArray(hospitals) ? hospitals.map(h => ({ name: h.name, value: h.name })) : [], loading: loading.hospital, disabled: hospitals.length === 0 },
    { id: "disease", label: "Disease", type: "select", options: Array.isArray(diseases) ? diseases : [] },
    { id: "existingIllnesses", label: "Existing Illnesses", type: "multi", options: Array.isArray(illnesses) ? illnesses : [] },
    { id: "address", label: "Full Address", type: "textarea", fullWidth: true },
    { id: "pincode", label: "Pincode", type: "text" },
    { id: "contact", label: "Contact Number", type: "text" },
    { id: "email", label: "Email", type: "email" }
  ];

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: "90%" }}>
      <div className="d-flex justify-content-between mb-3">
        <a href="/dashboard" className="btn btn-primary">← Back to Home</a>
        <button type="button" className="btn btn-danger" onClick={resetForm}>Reset Form</button>
      </div>
      <h2 className="text-center mb-4">Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {fields.map((field) => (
            <div className={`form-group ${field.fullWidth ? "col-12" : "col-md-6"}`} key={field.id}>
              <label htmlFor={field.id}>{field.label}:</label>
              {["text", "date", "email"].includes(field.type) ? (
                <input type={field.type} className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} required />
              ) : field.type === "textarea" ? (
                <textarea className="form-control" id={field.id} name={field.id} rows="2" value={formData[field.id]} onChange={handleChange} required />
              ) : field.type === "select" ? (
                <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                  <option value="">Select {field.label}</option>
                  {Array.isArray(field.options) && field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "selectData" ? (
                <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                  <option value="">Select {field.label}</option>
                  {Array.isArray(field.options) && field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              ) : (
                <select multiple className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange}>
                  {Array.isArray(field.options) && field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              {field.loading && <div className="spinner-border spinner-border-sm ml-2 text-primary"></div>}
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-success btn-block mt-3">Register</button>
      </form>
    </div>
  );
};

export default PatientRegistration;
*/

/// working code for PatientRegistration component illness and diseases not working

/*import React, { useEffect, useState } from "react";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const REFERENCE_DATA_SERVICE = process.env.REACT_APP_Reference_Data_Service;

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    country: "",
    state: "",
    city: "",
    hospital: "",
    disease: "",
    existingIllnesses: [],
    address: "",
    pincode: "",
    contact: "",
    email: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [illnesses, setIllnesses] = useState([]);
  const [loading, setLoading] = useState({ state: false, city: false, hospital: false });

  useEffect(() => {
    fetch(`${REFERENCE_DATA_SERVICE}/api/countries`)
      .then((res) => res.json())
      .then((data) => setCountries(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching countries:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/diseases`)
  .then((res) => res.json())
  .then((resData) => setDiseases(Array.isArray(resData.data) ? resData.data : []))
  .catch((err) => console.error("Error fetching diseases:", err));

fetch(`${REFERENCE_DATA_SERVICE}/api/illnesses`)
  .then((res) => res.json())
  .then((resData) => setIllnesses(Array.isArray(resData.data) ? resData.data : []))
  .catch((err) => console.error("Error fetching illnesses:", err));
  }, []);

  const handleChange = async (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "country") {
      setFormData((prev) => ({ ...prev, state: "", city: "", hospital: "" }));
      setStates([]);
      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, state: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/states/by-country/${value}`);
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading states:", err);
        setStates([]);
      } finally {
        setLoading((prev) => ({ ...prev, state: false }));
      }
    }

    if (name === "state") {
      setFormData((prev) => ({ ...prev, city: "", hospital: "" }));
      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, city: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/cities/by-state/${value}`);
        const result = await res.json();
        const cityData = result?.data || []; // Assuming response format: { success: true, data: [...] }
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch (err) {
        console.error("Error loading cities:", err);
        setCities([]);
      } finally {
        setLoading((prev) => ({ ...prev, city: false }));
      }
    }

    if (name === "city") {
      setFormData((prev) => ({ ...prev, hospital: "" }));
      setHospitals([]);
      setLoading((prev) => ({ ...prev, hospital: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/hospitals/by-city/${value}`);
        const result = await res.json();
        const hospitalData = result?.data || [];
        setHospitals(Array.isArray(hospitalData) ? hospitalData : []);
      } catch (err) {
        console.error("Error loading hospitals:", err);
        setHospitals([]);
      } finally {
        setLoading((prev) => ({ ...prev, hospital: false }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Token missing. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Registration Successful!");
        resetForm();
      } else {
        alert("❌ Registration Failed.");
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err.message);
      alert("❌ Server Error. Try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      dob: "",
      gender: "",
      bloodGroup: "",
      country: "",
      state: "",
      city: "",
      hospital: "",
      disease: "",
      existingIllnesses: [],
      address: "",
      pincode: "",
      contact: "",
      email: "",
    });
    setStates([]);
    setCities([]);
    setHospitals([]);
  };

  const fields = [
    { id: "name", label: "Name", type: "text" },
    { id: "dob", label: "Date of Birth", type: "date" },
    { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { id: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
    { id: "country", label: "Country", type: "selectData", options: Array.isArray(countries) ? countries.map(c => ({ name: c.name, value: c.id })) : [] },
    { id: "state", label: "State", type: "selectData", options: Array.isArray(states) ? states.map(s => ({ name: s.name, value: s.id })) : [], loading: loading.state, disabled: !Array.isArray(states) || states.length === 0 },
    { id: "city", label: "City", type: "selectData", options: Array.isArray(cities) ? cities.map(c => ({ name: c.name, value: c.id })) : [], loading: loading.city, disabled: !Array.isArray(cities) || cities.length === 0 },
    { id: "hospital", label: "Hospital", type: "selectData", options: Array.isArray(hospitals) ? hospitals.map(h => ({ name: h.name, value: h.name })) : [], loading: loading.hospital, disabled: !Array.isArray(hospitals) || hospitals.length === 0 },
    { id: "disease", label: "Disease", type: "select", options: Array.isArray(diseases) ? diseases : [] },
    { id: "existingIllnesses", label: "Existing Illnesses", type: "multi", options: Array.isArray(illnesses) ? illnesses : [] },
    { id: "address", label: "Full Address", type: "textarea", fullWidth: true },
    { id: "pincode", label: "Pincode", type: "text" },
    { id: "contact", label: "Contact Number", type: "text" },
    { id: "email", label: "Email", type: "email" },
  ];

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: "90%" }}>
      <div className="d-flex justify-content-between mb-3">
        <a href="/dashboard" className="btn btn-primary">← Back to Home</a>
        <button type="button" className="btn btn-danger" onClick={resetForm}>Reset Form</button>
      </div>
      <h2 className="text-center mb-4">Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {fields.map((field) => (
            <div className={`form-group ${field.fullWidth ? "col-12" : "col-md-6"}`} key={field.id}>
              <label htmlFor={field.id}>{field.label}:</label>
              {["text", "date", "email"].includes(field.type) ? (
                <input type={field.type} className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} required />
              ) : field.type === "textarea" ? (
                <textarea className="form-control" id={field.id} name={field.id} rows="2" value={formData[field.id]} onChange={handleChange} required />
              ) : field.type === "select" ? (
                <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                  <option value="">Select {field.label}</option>
                  {Array.isArray(field.options) && field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "selectData" ? (
                <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                  <option value="">Select {field.label}</option>
                  {Array.isArray(field.options) && field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              ) : (
                <select multiple className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange}>
                  {Array.isArray(field.options) && field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
              {field.loading && <div className="spinner-border spinner-border-sm ml-2 text-primary"></div>}
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-success btn-block mt-3">Register</button>
      </form>
    </div>
  );
};

export default PatientRegistration;
*/


/*
// full working code for PatientRegistration component with illness and diseases working need to convert country id before storing in DB as name

import React, { useEffect, useState } from "react";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const REFERENCE_DATA_SERVICE = process.env.REACT_APP_Reference_Data_Service;

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    country: "",
    state: "",
    city: "",
    hospital: "",
    disease: "",
    existingIllnesses: [],
    address: "",
    pincode: "",
    contact: "",
    email: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [illnesses, setIllnesses] = useState([]);
  const [loading, setLoading] = useState({ state: false, city: false, hospital: false });

  useEffect(() => {
    fetch(`${REFERENCE_DATA_SERVICE}/api/countries`)
      .then((res) => res.json())
      .then((data) => setCountries(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching countries:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/diseases`)
      .then((res) => res.json())
      .then((resData) => setDiseases(Array.isArray(resData.data) ? resData.data : []))
      .catch((err) => console.error("Error fetching diseases:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/illnesses`)
      .then((res) => res.json())
      .then((resData) => setIllnesses(Array.isArray(resData.data) ? resData.data : []))
      .catch((err) => console.error("Error fetching illnesses:", err));
  }, []);

  const handleChange = async (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "country") {
      setFormData((prev) => ({ ...prev, state: "", city: "", hospital: "" }));
      setStates([]);
      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, state: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/states/by-country/${value}`);
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading states:", err);
        setStates([]);
      } finally {
        setLoading((prev) => ({ ...prev, state: false }));
      }
    }

    if (name === "state") {
      setFormData((prev) => ({ ...prev, city: "", hospital: "" }));
      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, city: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/cities/by-state/${value}`);
        const result = await res.json();
        const cityData = result?.data || [];
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch (err) {
        console.error("Error loading cities:", err);
        setCities([]);
      } finally {
        setLoading((prev) => ({ ...prev, city: false }));
      }
    }

    if (name === "city") {
      setFormData((prev) => ({ ...prev, hospital: "" }));
      setHospitals([]);
      setLoading((prev) => ({ ...prev, hospital: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/hospitals/by-city/${value}`);
        const result = await res.json();
        const hospitalData = result?.data || [];
        setHospitals(Array.isArray(hospitalData) ? hospitalData : []);
      } catch (err) {
        console.error("Error loading hospitals:", err);
        setHospitals([]);
      } finally {
        setLoading((prev) => ({ ...prev, hospital: false }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Token missing. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
       // body: JSON.stringify(formData),
body: JSON.stringify({
  ...formData,
  existingIllnesses: formData.existingIllnesses.join(", "),
}),

      });

      if (res.ok) {
        alert("✅ Registration Successful!");
        resetForm();
      } else {
        alert("❌ Registration Failed.");
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err.message);
      alert("❌ Server Error. Try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      dob: "",
      gender: "",
      bloodGroup: "",
      country: "",
      state: "",
      city: "",
      hospital: "",
      disease: "",
      existingIllnesses: [],
      address: "",
      pincode: "",
      contact: "",
      email: "",
    });
    setStates([]);
    setCities([]);
    setHospitals([]);
  };

  const fields = [
    { id: "name", label: "Name", type: "text" },
    { id: "dob", label: "Date of Birth", type: "date" },
    { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { id: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
    { id: "country", label: "Country", type: "selectData", options: countries.map(c => ({ name: c.name, value: c.id })) },
    { id: "state", label: "State", type: "selectData", options: states.map(s => ({ name: s.name, value: s.id })), loading: loading.state, disabled: !states.length },
    { id: "city", label: "City", type: "selectData", options: cities.map(c => ({ name: c.name, value: c.id })), loading: loading.city, disabled: !cities.length },
    { id: "hospital", label: "Hospital", type: "selectData", options: hospitals.map(h => ({ name: h.name, value: h.name })), loading: loading.hospital, disabled: !hospitals.length },
    { id: "disease", label: "Disease", type: "select", options: diseases.map(d => typeof d === "string" ? d : d.name || d.id) },
    { id: "existingIllnesses", label: "Existing Illnesses", type: "multi", options: illnesses.map(i => ({ name: i.name || i.id, value: i.name || i.id })) },
    { id: "address", label: "Full Address", type: "textarea", fullWidth: true },
    { id: "pincode", label: "Pincode", type: "text" },
    { id: "contact", label: "Contact Number", type: "text" },
    { id: "email", label: "Email", type: "email" },
  ];

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: "90%" }}>
      <div className="d-flex justify-content-between mb-3">
        <a href="/dashboard" className="btn btn-primary">← Back to Home</a>
        <button type="button" className="btn btn-danger" onClick={resetForm}>Reset Form</button>
      </div>
      <h2 className="text-center mb-4">Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {fields.map((field) => (
            <div className={`form-group ${field.fullWidth ? "col-12" : "col-md-6"}`} key={field.id}>
              <label htmlFor={field.id}>{field.label}:</label>
              {["text", "date", "email"].includes(field.type) ? (
                <input type={field.type} className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} required />
              ) : field.type === "textarea" ? (
                <textarea className="form-control" id={field.id} name={field.id} rows="2" value={formData[field.id]} onChange={handleChange} required />
              ) : field.type === "select" ? (
                <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "selectData" ? (
                <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              ) : (
                <select multiple className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange}>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              )}
              {field.loading && <div className="spinner-border spinner-border-sm ml-2 text-primary"></div>}
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-success btn-block mt-3">Register</button>
      </form>
    </div>
  );
};

export default PatientRegistration;
*/

//Modified code for PatientRegistration component with illness and diseases working need to convert country id before storing in DB as name

/*import React, { useEffect, useState } from "react";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const REFERENCE_DATA_SERVICE = process.env.REACT_APP_Reference_Data_Service;

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    country: "",
    state: "",
    city: "",
    hospital: "",
    disease: "",
    existingIllnesses: [],
    address: "",
    pincode: "",
    contact: "",
    email: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [illnesses, setIllnesses] = useState([]);
  const [loading, setLoading] = useState({ state: false, city: false, hospital: false });

  useEffect(() => {
    fetch(`${REFERENCE_DATA_SERVICE}/api/countries`)
      .then((res) => res.json())
      .then((data) => setCountries(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching countries:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/diseases`)
      .then((res) => res.json())
      .then((resData) => setDiseases(Array.isArray(resData.data) ? resData.data : []))
      .catch((err) => console.error("Error fetching diseases:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/illnesses`)
      .then((res) => res.json())
      .then((resData) => setIllnesses(Array.isArray(resData.data) ? resData.data : []))
      .catch((err) => console.error("Error fetching illnesses:", err));
  }, []);

  const handleChange = async (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
      return;
    }

    if (name === "country") {
      const selected = countries.find((c) => String(c.id) === value);
      const countryName = selected?.name || "";

      setFormData((prev) => ({ ...prev, country: countryName, state: "", city: "", hospital: "" }));
      setStates([]);
      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, state: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/states/by-country/${value}`);
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading states:", err);
        setStates([]);
      } finally {
        setLoading((prev) => ({ ...prev, state: false }));
      }
      return;
    }

    if (name === "state") {
      const selected = states.find((s) => String(s.id) === value);
      const stateName = selected?.name || "";

      setFormData((prev) => ({ ...prev, state: stateName, city: "", hospital: "" }));
      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, city: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/cities/by-state/${value}`);
        const result = await res.json();
        const cityData = result?.data || [];
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch (err) {
        console.error("Error loading cities:", err);
        setCities([]);
      } finally {
        setLoading((prev) => ({ ...prev, city: false }));
      }
      return;
    }

    if (name === "city") {
      const selected = cities.find((c) => String(c.id) === value);
      const cityName = selected?.name || "";

      setFormData((prev) => ({ ...prev, city: cityName, hospital: "" }));
      setHospitals([]);
      setLoading((prev) => ({ ...prev, hospital: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/hospitals/by-city/${value}`);
        const result = await res.json();
        const hospitalData = result?.data || [];
        setHospitals(Array.isArray(hospitalData) ? hospitalData : []);
      } catch (err) {
        console.error("Error loading hospitals:", err);
        setHospitals([]);
      } finally {
        setLoading((prev) => ({ ...prev, hospital: false }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Token missing. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          existingIllnesses: formData.existingIllnesses.join(", "),
        }),
      });

      if (res.ok) {
        alert("✅ Registration Successful!");
        resetForm();
      } else {
        alert("❌ Registration Failed.");
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err.message);
      alert("❌ Server Error. Try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      dob: "",
      gender: "",
      bloodGroup: "",
      country: "",
      state: "",
      city: "",
      hospital: "",
      disease: "",
      existingIllnesses: [],
      address: "",
      pincode: "",
      contact: "",
      email: "",
    });
    setStates([]);
    setCities([]);
    setHospitals([]);
  };

  const fields = [
    { id: "name", label: "Name", type: "text" },
    { id: "dob", label: "Date of Birth", type: "date" },
    { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { id: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
    { id: "country", label: "Country", type: "selectData", options: countries.map(c => ({ name: c.name, value: c.id })) },
    { id: "state", label: "State", type: "selectData", options: states.map(s => ({ name: s.name, value: s.id })), loading: loading.state, disabled: !states.length },
    { id: "city", label: "City", type: "selectData", options: cities.map(c => ({ name: c.name, value: c.id })), loading: loading.city, disabled: !cities.length },
    { id: "hospital", label: "Hospital", type: "selectData", options: hospitals.map(h => ({ name: h.name, value: h.name })), loading: loading.hospital, disabled: !hospitals.length },
    { id: "disease", label: "Disease", type: "select", options: diseases.map(d => typeof d === "string" ? d : d.name || d.id) },
    { id: "existingIllnesses", label: "Existing Illnesses", type: "multi", options: illnesses.map(i => ({ name: i.name || i.id, value: i.name || i.id })) },
    { id: "address", label: "Full Address", type: "textarea", fullWidth: true },
    { id: "pincode", label: "Pincode", type: "text" },
    { id: "contact", label: "Contact Number", type: "text" },
    { id: "email", label: "Email", type: "email" },
  ];

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: "90%" }}>
      <div className="d-flex justify-content-between mb-3">
        <a href="/dashboard" className="btn btn-primary">← Back to Home</a>
        <button type="button" className="btn btn-danger" onClick={resetForm}>Reset Form</button>
      </div>
      <h2 className="text-center mb-4">Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {fields.map((field) => (
            <div className={`form-group ${field.fullWidth ? "col-12" : "col-md-6"}`} key={field.id}>
              <label htmlFor={field.id}>{field.label}:</label>
              {["text", "date", "email"].includes(field.type) ? (
                <input type={field.type} className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} required />
              ) : field.type === "textarea" ? (
                <textarea className="form-control" id={field.id} name={field.id} rows="2" value={formData[field.id]} onChange={handleChange} required />
              ) : field.type === "select" ? (
                <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "selectData" ? (
                <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              ) : (
                <select multiple className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange}>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              )}
              {field.loading && <div className="spinner-border spinner-border-sm ml-2 text-primary"></div>}
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-success btn-block mt-3">Register</button>
      </form>
    </div>
  );
};

export default PatientRegistration;
*/



//Working code  as of 25/06/2025
/*import React, { useEffect, useState } from "react";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const REFERENCE_DATA_SERVICE = process.env.REACT_APP_Reference_Data_Service;

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    country: "",
    state: "",
    city: "",
    hospital: "",
    disease: "",
    existingIllnesses: [],
    address: "",
    pincode: "",
    contact: "",
    email: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [illnesses, setIllnesses] = useState([]);

  const [loading, setLoading] = useState({ state: false, city: false, hospital: false });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    fetch(`${REFERENCE_DATA_SERVICE}/api/countries`)
      .then(res => res.json())
      .then(data => setCountries(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching countries:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/diseases`)
      .then(res => res.json())
      .then(resData => setDiseases(Array.isArray(resData.data) ? resData.data : []))
      .catch(err => console.error("Error fetching diseases:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/illnesses`)
      .then(res => res.json())
      .then(resData => setIllnesses(Array.isArray(resData.data) ? resData.data : []))
      .catch(err => console.error("Error fetching illnesses:", err));
  }, []);

  const handleChange = async (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "country") {
      setFormData((prev) => ({ ...prev, state: "", city: "", hospital: "" }));
      const selected = countries.find((c) => String(c.id) === value);
      setSelectedCountry(selected || null);

      setStates([]);
      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, state: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/states/by-country/${value}`);
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading states:", err);
        setStates([]);
      } finally {
        setLoading((prev) => ({ ...prev, state: false }));
      }
    }

    if (name === "state") {
      setFormData((prev) => ({ ...prev, city: "", hospital: "" }));
      const selected = states.find((s) => String(s.id) === value);
      setSelectedState(selected || null);

      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, city: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/cities/by-state/${value}`);
        const result = await res.json();
        const cityData = result?.data || [];
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch (err) {
        console.error("Error loading cities:", err);
        setCities([]);
      } finally {
        setLoading((prev) => ({ ...prev, city: false }));
      }
    }

    if (name === "city") {
      const selected = cities.find((c) => String(c.id) === value);
      setSelectedCity(selected || null);

      setFormData((prev) => ({ ...prev, hospital: "" }));
      setHospitals([]);
      setLoading((prev) => ({ ...prev, hospital: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/hospitals/by-city/${value}`);
        const result = await res.json();
        const hospitalData = result?.data || [];
        setHospitals(Array.isArray(hospitalData) ? hospitalData : []);
      } catch (err) {
        console.error("Error loading hospitals:", err);
        setHospitals([]);
      } finally {
        setLoading((prev) => ({ ...prev, hospital: false }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("Token missing. Please log in again.");
      return;
    }

    const payload = {
      ...formData,
      existingIllnesses: formData.existingIllnesses.join(", "),
      country: selectedCountry?.name || "",
      state: selectedState?.name || "",
      city: selectedCity?.name || ""
    };

    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Registration Successful!");
        resetForm();
      } else {
        alert("❌ Registration Failed.");
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err.message);
      alert("❌ Server Error. Try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      dob: "",
      gender: "",
      bloodGroup: "",
      country: "",
      state: "",
      city: "",
      hospital: "",
      disease: "",
      existingIllnesses: [],
      address: "",
      pincode: "",
      contact: "",
      email: "",
    });
    setStates([]);
    setCities([]);
    setHospitals([]);
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const fields = [
    { id: "name", label: "Name", type: "text" },
    { id: "dob", label: "Date of Birth", type: "date" },
    { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { id: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
    { id: "country", label: "Country", type: "selectData", options: countries.map(c => ({ name: c.name, value: c.id })) },
    { id: "state", label: "State", type: "selectData", options: states.map(s => ({ name: s.name, value: s.id })), loading: loading.state, disabled: !states.length },
    { id: "city", label: "City", type: "selectData", options: cities.map(c => ({ name: c.name, value: c.id })), loading: loading.city, disabled: !cities.length },
    { id: "hospital", label: "Hospital", type: "selectData", options: hospitals.map(h => ({ name: h.name, value: h.name })), loading: loading.hospital, disabled: !hospitals.length },
    { id: "disease", label: "Disease", type: "select", options: diseases.map(d => typeof d === "string" ? d : d.name || d.id) },
    { id: "existingIllnesses", label: "Existing Illnesses", type: "multi", options: illnesses.map(i => ({ name: i.name || i.id, value: i.name || i.id })) },
    { id: "address", label: "Full Address", type: "textarea", fullWidth: true },
    { id: "pincode", label: "Pincode", type: "text" },
    { id: "contact", label: "Contact Number", type: "text" },
    { id: "email", label: "Email", type: "email" },
  ];

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: "90%" }}>
      <div className="d-flex justify-content-between mb-3">
        <a href="/dashboard" className="btn btn-primary">← Back to Home</a>
        <button type="button" className="btn btn-danger" onClick={resetForm}>Reset Form</button>
      </div>
      <h2 className="text-center mb-4">Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {fields.map((field) => (
            <div className={`form-group ${field.fullWidth ? "col-12" : "col-md-6"}`} key={field.id}>
              <label htmlFor={field.id}>{field.label}:</label>
              {["text", "date", "email"].includes(field.type) ? (
                <input type={field.type} className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} required />
              ) : field.type === "textarea" ? (
                <textarea className="form-control" id={field.id} name={field.id} rows="2" value={formData[field.id]} onChange={handleChange} required />
              ) : field.type === "select" ? (
                <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "selectData" ? (
                <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              ) : (
                <select multiple className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange}>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              )}
              {field.loading && <div className="spinner-border spinner-border-sm ml-2 text-primary"></div>}
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-success btn-block mt-3">Register</button>
      </form>
    </div>
  );
};

export default PatientRegistration;
*/

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const REFERENCE_DATA_SERVICE = process.env.REACT_APP_Reference_Data_Service;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");

  const [formData, setFormData] = useState({
    name: "", dob: "", gender: "", bloodGroup: "", country: "",
    state: "", city: "", hospital: "", disease: "", existingIllnesses: [],
    address: "", pincode: "", contact: "", email: ""
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [illnesses, setIllnesses] = useState([]);
  const [loading, setLoading] = useState({ state: false, city: false, hospital: false });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (response.status === 401) {
        window.dispatchEvent(new Event("tokenExpired"));
        return;
      }
      const data = await response.json();
      setUsername(data.username || "N/A");
      setRole(data.role || "N/A");
      localStorage.setItem("userRole", data.role || "N/A");
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setUsername("N/A");
      setRole("N/A");
      localStorage.setItem("userRole", "N/A");
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${REFERENCE_DATA_SERVICE}/api/countries`, { headers })
      .then(res => res.json())
      .then(data => setCountries(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching countries:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/diseases`, { headers })
      .then(res => res.json())
      .then(resData => setDiseases(Array.isArray(resData.data) ? resData.data : []))
      .catch(err => console.error("Error fetching diseases:", err));

    fetch(`${REFERENCE_DATA_SERVICE}/api/illnesses`, { headers })
      .then(res => res.json())
      .then(resData => setIllnesses(Array.isArray(resData.data) ? resData.data : []))
      .catch(err => console.error("Error fetching illnesses:", err));
  }, [fetchProfile, token]);

  const handleChange = async (e) => {
    const { name, value, type, selectedOptions } = e.target;
    const headers = { Authorization: `Bearer ${token}` };

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "country") {
      setFormData((prev) => ({ ...prev, state: "", city: "", hospital: "" }));
      const selected = countries.find((c) => String(c.id) === value);
      setSelectedCountry(selected || null);
      setStates([]); setCities([]); setHospitals([]);
      setLoading((prev) => ({ ...prev, state: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/states/by-country/${value}`, { headers });
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading states:", err);
        setStates([]);
      } finally {
        setLoading((prev) => ({ ...prev, state: false }));
      }
    }

    if (name === "state") {
      setFormData((prev) => ({ ...prev, city: "", hospital: "" }));
      const selected = states.find((s) => String(s.id) === value);
      setSelectedState(selected || null);
      setCities([]); setHospitals([]);
      setLoading((prev) => ({ ...prev, city: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/cities/by-state/${value}`, { headers });
        const result = await res.json();
        const cityData = result?.data || [];
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch (err) {
        console.error("Error loading cities:", err);
        setCities([]);
      } finally {
        setLoading((prev) => ({ ...prev, city: false }));
      }
    }

    if (name === "city") {
      const selected = cities.find((c) => String(c.id) === value);
      setSelectedCity(selected || null);
      setFormData((prev) => ({ ...prev, hospital: "" }));
      setHospitals([]);
      setLoading((prev) => ({ ...prev, hospital: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/hospitals/by-city/${value}`, { headers });
        const result = await res.json();
        const hospitalData = result?.data || [];
        setHospitals(Array.isArray(hospitalData) ? hospitalData : []);
      } catch (err) {
        console.error("Error loading hospitals:", err);
        setHospitals([]);
      } finally {
        setLoading((prev) => ({ ...prev, hospital: false }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Token missing. Please log in again.");
      return;
    }

    const payload = {
      ...formData,
      existingIllnesses: formData.existingIllnesses.join(", "),
      country: selectedCountry?.name || "",
      state: selectedState?.name || "",
      city: selectedCity?.name || ""
    };

    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Registration Successful!");
        resetForm();
      } else {
        alert("❌ Registration Failed.");
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err.message);
      alert("❌ Server Error. Try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", dob: "", gender: "", bloodGroup: "", country: "",
      state: "", city: "", hospital: "", disease: "", existingIllnesses: [],
      address: "", pincode: "", contact: "", email: ""
    });
    setStates([]); setCities([]); setHospitals([]);
    setSelectedCountry(null); setSelectedState(null); setSelectedCity(null);
  };

  const fields = [
    { id: "name", label: "Name", type: "text" },
    { id: "dob", label: "Date of Birth", type: "date" },
    { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { id: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
    { id: "country", label: "Country", type: "selectData", options: countries.map(c => ({ name: c.name, value: c.id })) },
    { id: "state", label: "State", type: "selectData", options: states.map(s => ({ name: s.name, value: s.id })), loading: loading.state, disabled: !states.length },
    { id: "city", label: "City", type: "selectData", options: cities.map(c => ({ name: c.name, value: c.id })), loading: loading.city, disabled: !cities.length },
    { id: "hospital", label: "Hospital", type: "selectData", options: hospitals.map(h => ({ name: h.name, value: h.name })), loading: loading.hospital, disabled: !hospitals.length },
    { id: "disease", label: "Disease", type: "select", options: diseases.map(d => typeof d === "string" ? d : d.name || d.id) },
    { id: "existingIllnesses", label: "Existing Illnesses", type: "multi", options: illnesses.map(i => ({ name: i.name || i.id, value: i.name || i.id })) },
    { id: "address", label: "Full Address", type: "textarea", fullWidth: true },
    { id: "pincode", label: "Pincode", type: "text" },
    { id: "contact", label: "Contact Number", type: "text" },
    { id: "email", label: "Email", type: "email" },
  ];

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn btn-link"
              id="navbarDropdown"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              type="button"
            >
              <i className="fas fa-user-circle"></i> Profile
            </button>
            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <div className="dropdown-item-text">
                <strong>Username:</strong> {username} <br />
                <strong>Role:</strong> {role}
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => navigate("/profile")} type="button">
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button className="dropdown-item" onClick={() => {
                localStorage.removeItem("jwtToken");
                setToken(null);
                navigate("/logout");
              }} type="button">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>

      <header className="bg-success text-white text-center py-4">
        <h1>Welcome to WellnessWave Healthcare</h1>
        <p>Your one-stop solution for healthcare management</p>
      </header>

      <div className="container mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: "90%" }}>
        <div className="d-flex justify-content-between mb-3">
          <a href="/admin/patients" className="btn btn-primary">← Back to Home</a>
          <button type="button" className="btn btn-danger" onClick={resetForm}>Reset Form</button>
        </div>
        <h2 className="text-center mb-4">Patient Registration</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            {fields.map((field) => (
              <div className={`form-group ${field.fullWidth ? "col-12" : "col-md-6"}`} key={field.id}>
                <label htmlFor={field.id}>{field.label}:</label>
                {["text", "date", "email"].includes(field.type) ? (
                  <input type={field.type} className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} required />
                ) : field.type === "textarea" ? (
                  <textarea className="form-control" id={field.id} name={field.id} rows="2" value={formData[field.id]} onChange={handleChange} required />
                ) : field.type === "select" ? (
                  <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === "selectData" ? (
                  <select className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange} disabled={field.disabled}>
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.name}</option>
                    ))}
                  </select>
                ) : (
                  <select multiple className="form-control" id={field.id} name={field.id} value={formData[field.id]} onChange={handleChange}>
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.name}</option>
                    ))}
                  </select>
                )}
                {field.loading && <div className="spinner-border spinner-border-sm ml-2 text-primary"></div>}
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-success btn-block mt-3">Register</button>
        </form>
      </div>
    </>
  );
};

export default PatientRegistration;
