/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE; // Correct usage here

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch profile info
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 401) {
          localStorage.removeItem("jwtToken");
          navigate("/login");
          return;
        }
        const data = await res.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
      } catch (error) {
        console.error("Profile fetch error", error);
      }
    };

    // Fetch patient appointments
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/patient`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      }
    };

    // Fetch patient's medical records
    const fetchMedicalRecords = async () => {
      try {
        const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setMedicalRecords(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch medical records", error);
      }
    };

    fetchProfile();
    fetchAppointments();
    fetchMedicalRecords();
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    navigate("/login");
  };

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
              style={{ textDecoration: "none" }}
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
              <button className="dropdown-item" onClick={handleLogout} type="button">
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>

      <header className="bg-info text-white text-center py-4">
        <h1>Patient Dashboard</h1>
        <p>View your appointments and medical records</p>
      </header>

      <div className="container my-5">
        <div className="mb-4">
          <h3>Upcoming Appointments ({appointments.length})</h3>
          {appointments.length === 0 ? (
            <p>No upcoming appointments.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.doctorName}</td>
                    <td>{new Date(appt.dateTime).toLocaleString()}</td>
                    <td>{appt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mb-4">
          <h3>Medical Records</h3>
          {medicalRecords.length === 0 ? (
            <p>No medical records available.</p>
          ) : (
            <ul className="list-group">
              {medicalRecords.map((record) => (
                <li key={record.id} className="list-group-item">
                  <strong>Date:</strong> {new Date(record.recordDate).toLocaleDateString()} <br />
                  <strong>Description:</strong> {record.description} <br />
                  <strong>Doctor:</strong> {record.doctorName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="btn btn-primary" onClick={() => navigate("/book-appointment")}>
          Book New Appointment
        </button>
      </div>
    </>
  );
};

export default PatientDashboardPage;
*/






/*
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("jwtToken"));
  const [username, setUsername] = useState("N/A");
  const [role, setRole] = useState("N/A");
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  // Fetch profile info
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setUsername(data.username || "N/A");
        setRole(data.role || "N/A");
      } catch (err) {
        console.error("Profile fetch failed", err);
        setUsername("N/A");
        setRole("N/A");
      }
    };

    fetchProfile();
  }, [token]);

  // Fetch appointments
  useEffect(() => {
    if (!token) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
       // setAppointments(data || []);
       setAppointments(Array.isArray(data.data) ? data.data : []);

      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchAppointments();
  }, [token]);

  // Fetch medical records
  useEffect(() => {
    if (!token) return;

    const fetchRecords = async () => {
      try {
        const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/medical-records/{id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
       // setMedicalRecords(data || []);
       setMedicalRecords(Array.isArray(data.data) ? data.data : []);

      } catch (err) {
        console.error("Failed to fetch medical records", err);
      }
    };

    fetchRecords();
  }, [token]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
    navigate("/logout");
  };

  // Token expired listener
  useEffect(() => {
    const handleTokenExpired = () => {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("jwtToken");
      setToken(null);
      navigate("/login");
    };

    window.addEventListener("tokenExpired", handleTokenExpired);
    return () => window.removeEventListener("tokenExpired", handleTokenExpired);
  }, [navigate]);

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
              style={{ textDecoration: "none" }}
            >
              <i className="fas fa-user-circle"></i> Profile
            </button>
            <div className="dropdown-menu dropdown-menu-end">
              <div className="dropdown-item-text">
                <strong>Username:</strong> {username} <br />
                <strong>Role:</strong> {role}
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={() => navigate("/profile")}>
                <i className="fas fa-user-edit"></i> Edit Profile
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>

      <header className="bg-info text-white text-center py-4">
        <h1>Welcome, {username}</h1>
        <p>Patient Dashboard - WellnessWave</p>
      </header>

      <div className="container my-5">
        <div className="row">
          <div className="col-md-6">
            <h3>Your Appointments</h3>
            {appointments.length === 0 ? (
              <p>No appointments scheduled.</p>
            ) : (
              <ul className="list-group">
                {appointments.map((appt, idx) => (
                  <li key={idx} className="list-group-item">
                    <strong>Date:</strong> {appt.date} <br />
                    <strong>Doctor:</strong> {appt.doctorName} <br />
                    <strong>Status:</strong> {appt.status}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-md-6">
            <h3>Your Medical Records</h3>
            {medicalRecords.length === 0 ? (
              <p>No medical records available.</p>
            ) : (
              <ul className="list-group">
                {medicalRecords.map((rec, idx) => (
                  <li key={idx} className="list-group-item">
                    <strong>Diagnosis:</strong> {rec.diagnosis} <br />
                    <strong>Date:</strong> {rec.date} <br />
                    <strong>Notes:</strong> {rec.notes}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-5 text-center">
          <button className="btn btn-primary mx-2" onClick={() => navigate("/schedule-appointment")}>
            Schedule New Appointment
          </button>
          <button className="btn btn-secondary mx-2" onClick={() => navigate("/view-records")}>
            View All Records
          </button>
        </div>
      </div>
    </>
  );
};

export default PatientDashboardPage;
*/












/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [user, setUser] = useState({});
  const [patient, setPatient] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  // Fetch logged-in user info
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setUser(data);

        // Now fetch corresponding patient by userId
        const patientRes = await fetch(`${PATIENT_SERVICE_URL}/api/patients/user/${data.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (patientRes.ok) {
          const patientData = await patientRes.json();
          setPatient(patientData.data);
        }

      } catch (err) {
        console.error("Error fetching user/patient info:", err);
      }
    };

    fetchProfile();
  }, [token]);

  // Appointments
  useEffect(() => {
    if (!token) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setAppointments(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      }
    };

    fetchAppointments();
  }, [token]);

  // Medical Records
  useEffect(() => {
    if (!token || !patient.id) return;

    const fetchRecords = async () => {
      try {
        const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient/${patient.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setMedicalRecords(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch medical records", err);
      }
    };

    fetchRecords();
  }, [token, patient.id]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3"><strong>Username:</strong> {user.username}</span>
          <span className="me-3"><strong>Patient:</strong> {patient.name || "N/A"} (ID: {patient.id || "N/A"})</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-1"></i> Logout
          </button>
        </div>
      </nav>

      <header className="bg-info text-white text-center py-4">
        <h2>Welcome to WellnessWave, {patient.name || user.username}</h2>
        <p className="lead">Your personal healthcare dashboard</p>
      </header>

      <div className="container mt-5">
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">🗓️ Your Appointments</h5>
              </div>
              <div className="card-body">
                {appointments.length === 0 ? (
                  <p className="text-muted">No appointments scheduled.</p>
                ) : (
                  <ul className="list-group">
                    {appointments.map((appt, idx) => (
                      <li key={idx} className="list-group-item">
                        <strong>Date:</strong> {appt.date}<br />
                        <strong>Doctor:</strong> {appt.doctorName}<br />
                        <strong>Status:</strong> {appt.status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/schedule-appointment")}>
                  ➕ Schedule Appointment
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/appointments")}>
                  📋 View All
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">📝 Your Medical Records</h5>
              </div>
              <div className="card-body">
                {medicalRecords.length === 0 ? (
                  <p className="text-muted">No medical records found.</p>
                ) : (
                  <ul className="list-group">
                    {medicalRecords.map((rec, idx) => (
                      <li key={idx} className="list-group-item">
                        <strong>Diagnosis:</strong> {rec.diagnosis}<br />
                        <strong>Date:</strong> {rec.recordDate}<br />
                        <strong>Doctor ID:</strong> {rec.doctorId}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-outline-success btn-sm" onClick={() => navigate("/view-records")}>
                  📄 View All Records
                </button>
                <button className="btn btn-outline-dark btn-sm" onClick={() => window.print()}>
                  🖨️ Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDashboardPage;

*/


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Environment variables for service URLs
const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE;
const APPOINTMENT_SERVICE_URL = process.env.REACT_APP_APPOINTMENT_SERVICE;
const MEDICAL_RECORD_SERVICE_URL = process.env.REACT_APP_MEDICAL_RECORD_SERVICE;
const AUTH_SERVICE_URL = process.env.REACT_APP_AUTH_SERVICE;

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  const [user, setUser] = useState({});
  const [patient, setPatient] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  // Fetch profile and patient details
  useEffect(() => {
    if (!token) return;

    const fetchProfileAndPatient = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setUser(data);

        const patientRes = await fetch(`${PATIENT_SERVICE_URL}/api/patients/my-profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (patientRes.ok) {
          const patientData = await patientRes.json();
          setPatient(patientData);
        } else {
          console.warn("No patient found for this user.");
        }
      } catch (err) {
        console.error("Error fetching profile or patient info:", err);
      }
    };

    fetchProfileAndPatient();
  }, [token]);

  // Fetch appointments
  useEffect(() => {
    if (!token || !patient.id) return;

    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${APPOINTMENT_SERVICE_URL}/api/appointments/patients/${patient.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          window.dispatchEvent(new Event("tokenExpired"));
          return;
        }

        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };

    fetchAppointments();
  }, [token, patient.id]);

  // Fetch medical records
  useEffect(() => {
  if (!token || !patient.id) return;

  const fetchRecords = async () => {
    console.log("➡️ fetchRecords for patient.id =", patient.id);
    try {
      const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient/${patient.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📦 fetchRecords status:", res.status);

      const data = await res.json();
      console.log("📝 medical Records raw data:", data);

      // ✅ Correct data extraction
      setMedicalRecords(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching medical records:", err);
    }
  };

  fetchRecords();
}, [token, patient.id]);


//Download medical records as PDF
const handleDirectDownload = async () => {
  try {
    const res = await fetch(`${MEDICAL_RECORD_SERVICE_URL}/api/medical-records/patient/${patient.id}/export`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "medical_records.csv"); // or "file.pdf"
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (err) {
    console.error("❌ File download error:", err);
    alert("Download failed.");
  }
};




  // Logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/logout");
  };

  return (
    <>
      {/* Top nav */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3"><strong>Username:</strong> {user.username}</span>
          <span className="me-3"><strong>Patient:</strong> {patient.name || "N/A"} (ID: {patient.id || "N/A"})</span>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt me-1"></i> Logout
          </button>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-info text-white text-center py-4">
        <h2>Welcome to WellnessWave, {patient.name || user.username}</h2>
        <p className="lead">Your personal healthcare dashboard</p>
      </header>

      {/* Dashboard */}
      <div className="container mt-5">
        <div className="row g-4">

          {/* Appointments */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">🗓️ Your Appointments</h5>
              </div>
              <div className="card-body">
                {appointments.length === 0 ? (
                  <p className="text-muted">No appointments scheduled.</p>
                ) : (
                  <ul className="list-group">
                    {appointments.map((appt, idx) => (
                      <li key={idx} className="list-group-item">
                        <strong>Date:</strong> {new Date(appt.appointmentDate).toLocaleString()}<br />
                        <strong>Doctor:</strong> {appt.doctorName}<br />
                        <strong>Status:</strong> {appt.status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/patients-bookappointment")}>
                  ➕ Schedule Appointment
                </button>
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/appointments")}>
                  📋 View All
                </button>
              </div>
            </div>
          </div>

          {/* Medical Records */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">📝 Your Medical Records</h5>
              </div>
              <div className="card-body">
                {medicalRecords.length === 0 ? (
                  <p className="text-muted">No medical records found.</p>
                ) : (
            <ul className="list-group">
  {medicalRecords.map((rec, idx) => {
  console.log("Medical Record Item:", rec);
  return (
    <li key={idx} className="list-group-item">
      <strong>Diagnosis:</strong> {rec.diagnosis}<br />
      <strong>Date:</strong> {new Date(rec.recordDate).toLocaleString()}<br />
      <strong>Doctor:</strong> {rec.doctorName || rec.doctorId}
    </li>
  );
})}

</ul>


                )}
              </div>
              <div className="card-footer d-flex justify-content-between">
                {/*<button className="btn btn-outline-success btn-sm" onClick={() => navigate("/view-records")}>
                  📄 View All Records
                </button>*/}
               <button className="btn btn-outline-dark btn-sm" onClick={handleDirectDownload}>
  🖨️ Download
</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PatientDashboardPage;

