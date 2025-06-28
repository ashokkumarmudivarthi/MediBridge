// src/pages/EditProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";

const EditProfilePage = () => {
  const [user, setUser] = useState({
    username: "",
    fullName: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const AUTH_SERVICE = process.env.REACT_APP_AUTH_SERVICE;
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${AUTH_SERVICE}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load profile.");

        const data = await res.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        setLoading(false);
        setMessage("Failed to load profile.");
      }
    };

    fetchProfile();
  }, [AUTH_SERVICE, token]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${AUTH_SERVICE}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: user.fullName,
          email: user.email,
        }),
      });

      if (!res.ok) throw new Error("Update failed.");
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <CommonLayout username={user.username} role={user.role}>
      <h4 className="mb-4 text-primary">👤 Edit Your Profile</h4>

      {loading ? (
        <div>Loading profile...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded" style={{ maxWidth: 600 }}>
          <div className="form-group mb-3">
            <label>Username (read-only):</label>
            <input type="text" className="form-control" value={user.username} disabled />
          </div>

          <div className="form-group mb-3">
            <label>Role (read-only):</label>
            <input type="text" className="form-control" value={user.role} disabled />
          </div>

          <div className="form-group mb-3">
            <label>Full Name:</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>Email:</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-success me-2">
            💾 Save Changes
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            ⬅️ Cancel
          </button>

          {message && (
            <div className="alert alert-info mt-3" role="alert">
              {message}
            </div>
          )}
        </form>
      )}
    </CommonLayout>
  );
};

export default EditProfilePage;
