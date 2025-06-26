//////////////////////////////////////////////////////////////////////////////

// AddDoctor.jsx
// This component allows users to register a new doctor with various details.
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddDoctor = () => {
  const navigate = useNavigate();

  const DOCTOR_SERVICE = process.env.REACT_APP_DOCTOR_SERVICE;
  const REFERENCE_DATA_SERVICE = process.env.REACT_APP_Reference_Data_Service;

  const specialistOptions = [
    "Dermatology", "Cardiology", "Neurology", "Orthopedics", "Pediatrics", "General Medicine"
  ];

  const specializationOptions = [
    "Skin Care", "Heart Specialist", "Brain & Nerves", "Bone Specialist", "Child Specialist", "General Health"
  ];

  const qualificationOptions = ["MBBS", "MD", "MS", "DM", "DO", "PhD"];
  const statusOptions = ["Active", "Inactive"];
  const genderOptions = ["Male", "Female", "Other"];

  const [formData, setFormData] = useState({
    doctor_name: "",
    specialist_in: "",
    specialization: "",
    qualifications: "",
    experience_years: "",
    phone_number: "",
    contact_number: "",
    email: "",
    country: "",
    state: "",
    city: "",
    hospital_name: "",
    availability: "",
    status: "",
    gender: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [loading, setLoading] = useState({ state: false, city: false, hospital: false });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`${REFERENCE_DATA_SERVICE}/api/countries`)
      .then((res) => setCountries(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Error loading countries:", err));
  }, [REFERENCE_DATA_SERVICE]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    if (name === "country") {
      const selectedCountry = countries.find(c => String(c.id) === value);
      const countryName = selectedCountry?.name || "";

      setFormData((prev) => ({
        ...prev,
        country: countryName,
        state: "",
        city: "",
        hospital_name: "",
      }));

      setStates([]);
      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, state: true }));

      try {
        const res = await axios.get(`${REFERENCE_DATA_SERVICE}/api/states/by-country/${value}`);
        setStates(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error loading states:", err);
      } finally {
        setLoading((prev) => ({ ...prev, state: false }));
      }
      return;
    }

    if (name === "state") {
      const selectedState = states.find(s => String(s.id) === value);
      const stateName = selectedState?.name || "";

      setFormData((prev) => ({
        ...prev,
        state: stateName,
        city: "",
        hospital_name: "",
      }));

      setCities([]);
      setHospitals([]);
      setLoading((prev) => ({ ...prev, city: true }));

      try {
        const res = await axios.get(`${REFERENCE_DATA_SERVICE}/api/cities/by-state/${value}`);
        const cityData = res?.data?.data || [];
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch (err) {
        console.error("Error loading cities:", err);
      } finally {
        setLoading((prev) => ({ ...prev, city: false }));
      }
      return;
    }

    if (name === "city") {
      const selectedCity = cities.find(c => String(c.id) === value);
      const cityName = selectedCity?.name || "";

      setFormData((prev) => ({
        ...prev,
        city: cityName,
        hospital_name: "",
      }));

      setHospitals([]);
      setLoading((prev) => ({ ...prev, hospital: true }));

      try {
        const res = await axios.get(`${REFERENCE_DATA_SERVICE}/api/hospitals/by-city/${value}`);
        const hospitalData = res?.data?.data || [];
        setHospitals(Array.isArray(hospitalData) ? hospitalData : []);
      } catch (err) {
        console.error("Error loading hospitals:", err);
      } finally {
        setLoading((prev) => ({ ...prev, hospital: false }));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      doctor_name: "",
      specialist_in: "",
      specialization: "",
      qualifications: "",
      experience_years: "",
      phone_number: "",
      contact_number: "",
      email: "",
      country: "",
      state: "",
      city: "",
      hospital_name: "",
      availability: "",
      status: "",
      gender: "",
    });
    setStates([]);
    setCities([]);
    setHospitals([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      toast.error("❌ Unauthorized. Please login again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${DOCTOR_SERVICE}/api/doctors/register`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(response.data.message || "✅ Doctor registered successfully!");
      resetForm();
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("❌ Server error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5 p-5 shadow rounded bg-white" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={() => navigate("/admin/doctors")}>
          ← Back to Home
        </button>
        <button className="btn btn-danger" type="button" onClick={resetForm}>
          Reset Form
        </button>
      </div>

      <h2 className="text-center mb-4 fw-bold text-primary">Doctor Registration</h2>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {[
            { label: "Doctor Name", name: "doctor_name", type: "text" },
            { label: "Experience (Years)", name: "experience_years", type: "number", min: 0, max: 100 },
            { label: "Phone Number", name: "phone_number", type: "tel", pattern: "[0-9]{10,15}" },
            { label: "Contact Number", name: "contact_number", type: "tel", pattern: "[0-9]{10,15}" },
            { label: "Email", name: "email", type: "email" },
            { label: "Availability", name: "availability", type: "text" },
          ].map((field) => (
            <div className="col-md-6" key={field.name}>
              <label className="form-label fw-semibold">{field.label}</label>
              <input
                {...field}
                className="form-control"
                value={formData[field.name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {[
            { label: "Specialist In", name: "specialist_in", options: specialistOptions },
            { label: "Specialization", name: "specialization", options: specializationOptions },
            { label: "Qualifications", name: "qualifications", options: qualificationOptions },
            { label: "Status", name: "status", options: statusOptions },
            { label: "Gender", name: "gender", options: genderOptions },
          ].map((selectField) => (
            <div className="col-md-6" key={selectField.name}>
              <label className="form-label fw-semibold">{selectField.label}</label>
              <select
                className="form-select"
                name={selectField.name}
                value={formData[selectField.name]}
                onChange={handleChange}
                required
              >
                <option value="">Select {selectField.label}</option>
                {selectField.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          <div className="col-md-6">
            <label className="form-label fw-semibold">Country</label>
            <select
              className="form-select"
              name="country"
              onChange={handleChange}
              required
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">State</label>
            <select
              className="form-select"
              name="state"
              onChange={handleChange}
              disabled={!states.length}
              required
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {loading.state && <div className="text-primary small mt-1">Loading states...</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">City</label>
            <select
              className="form-select"
              name="city"
              onChange={handleChange}
              disabled={!cities.length}
              required
            >
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {loading.city && <div className="text-primary small mt-1">Loading cities...</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-semibold">Hospital</label>
            <select
              className="form-select"
              name="hospital_name"
              value={formData.hospital_name}
              onChange={handleChange}
              disabled={!hospitals.length}
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map((h, idx) => (
                <option key={idx} value={h.name}>{h.name}</option>
              ))}
            </select>
            {loading.hospital && <div className="text-primary small mt-1">Loading hospitals...</div>}
          </div>
        </div>

        <div className="d-grid mt-4">
          <button type="submit" className="btn btn-success fw-bold" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;





