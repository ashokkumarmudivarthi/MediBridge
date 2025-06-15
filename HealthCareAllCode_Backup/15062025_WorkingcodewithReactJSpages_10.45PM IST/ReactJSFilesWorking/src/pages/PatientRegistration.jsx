/*import React, { useEffect, useState } from "react";

//const PATIENT_SERVICE_URL = "http://patientservice:8082";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
//const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
//const DOCTOR_SERVICE_URL = process.env.REACT_APP_DOCTOR_SERVICE;
//const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;

const hospitalData = {
  Dallas: ["Parkland Hospital", "Dallas Medical Center", "Baylor University Medical Center"],
  Houston: ["Houston Methodist Hospital", "St. Luke's Health", "Memorial Hermann"],
  Austin: ["Dell Seton Medical Center", "St. David's Medical Center", "Ascension Seton"],
};

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
  const [diseases, setDiseases] = useState([]);
  const [illnesses, setIllnesses] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState({
    country: false,
    state: false,
    city: false,
  });

  useEffect(() => {
    fetch(`${PATIENT_SERVICE_URL}/api/countries`)
      .then((res) => res.json())
      .then(setCountries);

    fetch(`${PATIENT_SERVICE_URL}/api/diseases`)
      .then((res) => res.json())
      .then(setDiseases);

    fetch(`${PATIENT_SERVICE_URL}/api/existing-illnesses`)
      .then((res) => res.json())
      .then(setIllnesses);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((option) => option.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "country") {
      setStates([]);
      setCities([]);
      setFormData((prev) => ({ ...prev, state: "", city: "", hospital: "" }));
      setLoading((prev) => ({ ...prev, state: true }));

      fetch(`${PATIENT_SERVICE_URL}/api/states?country=${value}`)
        .then((res) => res.json())
        .then((data) => {
          setStates(data);
          setLoading((prev) => ({ ...prev, state: false }));
        });
    }

    if (name === "state") {
      setCities([]);
      setFormData((prev) => ({ ...prev, city: "", hospital: "" }));
      setLoading((prev) => ({ ...prev, city: true }));

      fetch(`${PATIENT_SERVICE_URL}/api/cities?state=${value}`)
        .then((res) => res.json())
        .then((data) => {
          setCities(data);
          setLoading((prev) => ({ ...prev, city: false }));
        });
    }

    if (name === "city") {
      const cityHospitals = hospitalData[value] || ["No hospitals found"];
      setHospitals(cityHospitals);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");

    fetch(`${PATIENT_SERVICE_URL}/api/patients/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          alert("Registration Successful!");
          resetForm();
        } else {
          alert("Registration Failed. Try again.");
        }
      })
      .catch(() => alert("Server error. Try again."));
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
  };

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: "90%" }}>
      <div className="d-flex justify-content-between mb-3">
        <a href="/dashboard" className="btn btn-primary">← Back to Home</a>
        <button type="button" className="btn btn-danger" onClick={resetForm}>Reset Form</button>
      </div>
      <h2 className="text-center mb-4">Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {[
            { id: "name", label: "Name", type: "text" },
            { id: "dob", label: "Date of Birth", type: "date" },
            { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
            { id: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
            { id: "country", label: "Country", type: "selectData", options: countries.map(c => ({ name: c.name, value: c.code })), loading: loading.country },
            { id: "state", label: "State", type: "selectData", options: states.map(s => ({ name: s.name, value: s.code })), loading: loading.state, disabled: states.length === 0 },
            { id: "city", label: "City", type: "selectData", options: cities.map(c => ({ name: c.name, value: c.code })), loading: loading.city, disabled: cities.length === 0 },
            { id: "hospital", label: "Hospital", type: "select", options: hospitals, disabled: hospitals.length === 0 },
            { id: "disease", label: "Disease", type: "select", options: diseases },
            { id: "existingIllnesses", label: "Existing Illnesses", type: "multi", options: illnesses },
            { id: "address", label: "Full Address", type: "textarea", fullWidth: true },
            { id: "pincode", label: "Pincode", type: "text" },
            { id: "contact", label: "Contact Number", type: "text" },
            { id: "email", label: "Email", type: "email" },
          ].map((field) => (
            <div className={`form-group ${field.fullWidth ? "col-12" : "col-md-6"}`} key={field.id}>
              <label htmlFor={field.id}>{field.label}:</label>
              {field.type === "text" || field.type === "date" || field.type === "email" ? (
                <input
                  type={field.type}
                  className="form-control"
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  required
                />
              ) : field.type === "textarea" ? (
                <textarea
                  className="form-control"
                  id={field.id}
                  name={field.id}
                  rows="2"
                  value={formData[field.id]}
                  onChange={handleChange}
                  required
                />
              ) : field.type === "select" ? (
                <select
                  className="form-control"
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  disabled={field.disabled}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.type === "selectData" ? (
                <select
                  className="form-control"
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  disabled={field.disabled}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.name}</option>
                  ))}
                </select>
              ) : (
                <select
                  multiple
                  className="form-control"
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                >
                  {field.options.map((opt) => (
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


import React, { useEffect, useState } from "react";
import { authFetch } from "../pages/authFetch"; // Update path as needed

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;

const hospitalData = {
  Dallas: ["Parkland Hospital", "Dallas Medical Center", "Baylor University Medical Center"],
  Houston: ["Houston Methodist Hospital", "St. Luke's Health", "Memorial Hermann"],
  Austin: ["Dell Seton Medical Center", "St. David's Medical Center", "Ascension Seton"],
};

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
  const [diseases, setDiseases] = useState([]);
  const [illnesses, setIllnesses] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState({ country: false, state: false, city: false });

  useEffect(() => {
    console.log("[useEffect] Loading initial data...");

    authFetch(`${PATIENT_SERVICE_URL}/api/countries`)
      .then((data) => {
        console.log("[Countries Loaded]", data);
        setCountries(data);
      })
      .catch((err) => console.error("Error loading countries:", err));

    authFetch(`${PATIENT_SERVICE_URL}/api/diseases`)
      .then((data) => {
        console.log("[Diseases Loaded]", data);
        setDiseases(data);
      })
      .catch((err) => console.error("Error loading diseases:", err));

    authFetch(`${PATIENT_SERVICE_URL}/api/existing-illnesses`)
      .then((data) => {
        console.log("[Illnesses Loaded]", data);
        setIllnesses(data);
      })
      .catch((err) => console.error("Error loading existing illnesses:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;

    if (type === "select-multiple") {
      const values = Array.from(selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "country") {
      console.log("[Country Selected]", value);
      setStates([]);
      setCities([]);
      setFormData((prev) => ({ ...prev, state: "", city: "", hospital: "" }));
      setLoading((prev) => ({ ...prev, state: true }));

      authFetch(`${PATIENT_SERVICE_URL}/api/states?country=${value}`)
        .then((data) => {
          console.log("[States Loaded]", data);
          setStates(data);
          setLoading((prev) => ({ ...prev, state: false }));
        })
        .catch((err) => {
          console.error("Error loading states:", err);
          setLoading((prev) => ({ ...prev, state: false }));
        });
    }

    if (name === "state") {
      console.log("[State Selected]", value);
      setCities([]);
      setFormData((prev) => ({ ...prev, city: "", hospital: "" }));
      setLoading((prev) => ({ ...prev, city: true }));

      authFetch(`${PATIENT_SERVICE_URL}/api/cities?state=${value}`)
        .then((data) => {
          console.log("[Cities Loaded]", data);
          setCities(data);
          setLoading((prev) => ({ ...prev, city: false }));
        })
        .catch((err) => {
          console.error("Error loading cities:", err);
          setLoading((prev) => ({ ...prev, city: false }));
        });
    }

    if (name === "city") {
      console.log("[City Selected]", value);
      const cityHospitals = hospitalData[value] || ["No hospitals found"];
      console.log("[Hospitals Loaded]", cityHospitals);
      setHospitals(cityHospitals);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("[Form Submit] Sending registration data:", formData);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("Token missing. Please log in again.");
      return;
    }

    fetch(`${PATIENT_SERVICE_URL}/api/patients/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        console.log("[Submit Response]", res.status);
        if (res.ok) {
          alert("✅ Registration Successful!");
          resetForm();
        } else {
          alert("❌ Registration Failed.");
        }
      })
      .catch((err) => {
        console.error("❌ Error submitting form:", err.message);
        alert("❌ Server Error. Try again.");
      });
  };

  const resetForm = () => {
    console.log("[Form Reset]");
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
  };

  return (
    <div className="container mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: "90%" }}>
      <div className="d-flex justify-content-between mb-3">
        <a href="/dashboard" className="btn btn-primary">← Back to Home</a>
        <button type="button" className="btn btn-danger" onClick={resetForm}>Reset Form</button>
      </div>
      <h2 className="text-center mb-4">Patient Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {[{ id: "name", label: "Name", type: "text" },
            { id: "dob", label: "Date of Birth", type: "date" },
            { id: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
            { id: "bloodGroup", label: "Blood Group", type: "select", options: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] },
            { id: "country", label: "Country", type: "selectData", options: countries.map(c => ({ name: c.name, value: c.code })), loading: loading.country },
            { id: "state", label: "State", type: "selectData", options: states.map(s => ({ name: s.name, value: s.code })), loading: loading.state, disabled: states.length === 0 },
            { id: "city", label: "City", type: "selectData", options: cities.map(c => ({ name: c.name, value: c.code })), loading: loading.city, disabled: cities.length === 0 },
            { id: "hospital", label: "Hospital", type: "select", options: hospitals, disabled: hospitals.length === 0 },
            { id: "disease", label: "Disease", type: "select", options: diseases },
            { id: "existingIllnesses", label: "Existing Illnesses", type: "multi", options: illnesses },
            { id: "address", label: "Full Address", type: "textarea", fullWidth: true },
            { id: "pincode", label: "Pincode", type: "text" },
            { id: "contact", label: "Contact Number", type: "text" },
            { id: "email", label: "Email", type: "email" }
          ].map((field) => (
            <div className={`form-group ${field.fullWidth ? "col-12" : "col-md-6"}`} key={field.id}>
              <label htmlFor={field.id}>{field.label}:</label>
              {field.type === "text" || field.type === "date" || field.type === "email" ? (
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

