/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import index from "../index.css"; // Ensure this is imported to apply styles

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const REFERENCE_DATA_SERVICE = process.env.REACT_APP_Reference_Data_Service;

const LaunchPatientRegistrationPage = () => {
  const navigate = useNavigate();
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
      setStates([]); setCities([]); setHospitals([]);
      setLoading((prev) => ({ ...prev, state: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/states/by-country/${value}`);
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch {
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
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/cities/by-state/${value}`);
        const result = await res.json();
        const cityData = result?.data || [];
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch {
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
      } catch {
        setHospitals([]);
      } finally {
        setLoading((prev) => ({ ...prev, hospital: false }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      existingIllnesses: formData.existingIllnesses.join(", "),
      country: selectedCountry?.name || "",
      state: selectedState?.name || "",
      city: selectedCity?.name || ""
    };

    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/public/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Registration Successful!\nRedirecting to login page. Please wait and login with your credentials.");
        resetForm();
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
      } else {
        alert("❌ Registration Failed.");
      }
    } catch (err) {
      console.error("❌ Server Error:", err.message);
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
      <header className="bg-success text-white text-center py-4">
        <h1>Welcome to WellnessWave Healthcare</h1>
        <p>Create your patient profile to begin your journey</p>
      </header>

      <div className="container mt-5 p-4 bg-white rounded shadow" style={{ maxWidth: "90%" }}>
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h2 className="mb-0">Patient Registration</h2>
    // ✅ Added Login Redirect 
    <button
  type="button"
  className="btn btn-link text-primary p-0 small"
  onClick={() => navigate("/login")}
>
  Already have an account? Click here to login
</button>

  </div>


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

export default LaunchPatientRegistrationPage;
*/

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const REFERENCE_DATA_SERVICE = process.env.REACT_APP_Reference_Data_Service;

const LaunchPatientRegistrationPage = () => {
  const navigate = useNavigate();
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
      setStates([]); setCities([]); setHospitals([]);
      setLoading((prev) => ({ ...prev, state: true }));

      try {
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/states/by-country/${value}`);
        const data = await res.json();
        setStates(Array.isArray(data) ? data : []);
      } catch {
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
        const res = await fetch(`${REFERENCE_DATA_SERVICE}/api/cities/by-state/${value}`);
        const result = await res.json();
        const cityData = result?.data || [];
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch {
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
      } catch {
        setHospitals([]);
      } finally {
        setLoading((prev) => ({ ...prev, hospital: false }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      existingIllnesses: formData.existingIllnesses.join(", "),
      country: selectedCountry?.name || "",
      state: selectedState?.name || "",
      city: selectedCity?.name || ""
    };

    try {
      const res = await fetch(`${PATIENT_SERVICE_URL}/api/patients/public/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ Registration Successful!\nRedirecting to login page. Please wait and login with your credentials.");
        resetForm();
        setTimeout(() => navigate("/login"), 2000);
      } else {
        alert("❌ Registration Failed.");
      }
    } catch (err) {
      console.error("❌ Server Error:", err.message);
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

  const handleClose = () => {
    if (window.confirm("Are you sure you want to close and go back to home? All entered data will be lost.")) {
      navigate("/");
    }
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
      <header className="bg-success text-white text-center py-4">
        <h1>Welcome to WellnessWave Healthcare</h1>
        <p>Create your patient profile to begin your journey</p>
      </header>

      <div className="container mt-5 p-4 bg-white rounded shadow position-relative" style={{ maxWidth: "90%" }}>
        {/* ❌ Close Button */}
        <button
          onClick={handleClose}
          className="btn btn-sm btn-danger position-absolute"
          style={{ top: "10px", right: "10px", zIndex: 999 }}
          title="Close"
        >
          ❌
        </button>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Patient Registration</h2>
          <button
            type="button"
            className="btn btn-link text-primary p-0 small"
            onClick={() => navigate("/login")}
          >
            Already have an account? Click here to login
          </button>
        </div>

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

export default LaunchPatientRegistrationPage;
