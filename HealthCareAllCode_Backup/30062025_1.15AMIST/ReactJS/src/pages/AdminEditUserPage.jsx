/*import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";

const AdminEditUserPage = () => {
  const { id: paramId } = useParams(); // optional param
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState(paramId || "");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const AUTH_SERVICE = process.env.REACT_APP_AUTH_SERVICE;
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    if (paramId) {
      const fetchUser = async () => {
        setLoading(true);
        setMessage("");
        try {
          const res = await fetch(`${AUTH_SERVICE}/api/admin/users/${paramId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("User not found or failed to load.");
          }

          const data = await res.json();
          setUser(data);
        } catch (error) {
          setUser(null);
          setMessage("⚠️ User not found or failed to load.");
          console.error("❌ Error:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [paramId, AUTH_SERVICE, token]);

  const handleManualSearch = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${AUTH_SERVICE}/api/admin/users/${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("User not found or failed to load.");
      }

      const data = await res.json();
      setUser(data);
    } catch (error) {
      setUser(null);
      setMessage("⚠️ User not found or failed to load.");
      console.error("❌ Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${AUTH_SERVICE}/api/profile/admin-edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      setMessage("✅ User profile updated successfully!");
    } catch (error) {
      setMessage("❌ Failed to update user.");
      console.error("❌ Error:", error);
    }
  };

  return (
    <Layout title="Admin Edit User" subtitle="Search and update any user by ID or username">
      <div className="container mt-4" style={{ maxWidth: "720px" }}>
        // 🔙 Back to Home 
        <div className="mb-3">
          <Link to="/admin/dashboard" className="btn btn-outline-primary">
            🔙 Back to Home
          </Link>
        </div>

        // 🔍 Search Form 
        <div className="card p-3 shadow-sm mb-4">
          <label>Enter User ID or Username to Edit:</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. 3 or admin"
            />
            <button
              className="btn btn-success"
              onClick={handleManualSearch}
              disabled={loading || !searchId.trim()}
            >
              🔍 Search
            </button>
          </div>
        </div>

        // 🧾 Edit Form 
        {user && (
          <div className="card p-4 shadow">
            <h5 className="mb-3 text-primary">👤 Editing User: {user.username}</h5>

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Username:</label>
                <input type="text" className="form-control" value={user.username} disabled />
              </div>

              <div className="form-group mb-3">
                <label>Role:</label>
                <input type="text" className="form-control" value={user.role} disabled />
              </div>

              <div className="form-group mb-3">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={user.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success">
                  💾 Update User
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                  ⬅️ Back
                </button>
              </div>

              {message && (
                <div className="alert alert-info mt-3" role="alert">
                  {message}
                </div>
              )}
            </form>
          </div>
        )}

         ⚠️ Message 
        {!user && message && (
          <div className="alert alert-warning mt-4" role="alert">
            {message}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminEditUserPage;
*/



import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CommonLayout from "../components/CommonLayout";

const AdminEditUserPage = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState(paramId || "");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const AUTH_SERVICE = process.env.REACT_APP_AUTH_SERVICE;
  const token = localStorage.getItem("jwtToken");

  const handleManualSearch = useCallback(async (searchKey = searchId) => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${AUTH_SERVICE}/api/admin/users/${searchKey}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("User not found");

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Fetch error:", error);
      setUser(null);
      setMessage("⚠️ User not found or failed to load.");
    } finally {
      setLoading(false);
    }
  }, [searchId, AUTH_SERVICE, token]);

  useEffect(() => {
    if (paramId) {
      handleManualSearch(paramId);
    }
  }, [paramId, handleManualSearch]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = window.confirm("Are you sure you want to update this user's details?");
    if (!confirm) return;

    try {
      const res = await fetch(`${AUTH_SERVICE}/api/profile/admin-edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      setMessage("✅ User profile updated successfully!");
      setUser(null);
      setSearchId("");
    } catch (error) {
      console.error("Update error:", error);
      setMessage("❌ Failed to update user.");
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm(`⚠️ Are you sure you want to permanently delete user "${user.username}"?`);
    if (!confirm) return;

    try {
      const res = await fetch(`${AUTH_SERVICE}/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setMessage("🗑️ User deleted successfully.");
      setUser(null);
      setSearchId("");
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("❌ Failed to delete user.");
    }
  };

  return (
    <CommonLayout title="Admin Edit User" subtitle="Search and update any user by ID or username">
      <div className="container mt-4" style={{ maxWidth: "720px" }}>
        {/* Back to Home & Message */}
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <Link to="/dashboard" className="btn btn-outline-primary">
            🔙 Back to Home
          </Link>
          {message && (
            <div className="alert alert-info mb-0 py-2 px-3" role="alert">
              {message}
            </div>
          )}
        </div>

        {/* Search Box */}
        <div className="card p-3 shadow-sm mb-4">
          <label>Enter User ID or Username to Edit:</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value);
                setMessage("");
              }}
              placeholder="e.g. 3 or admin"
            />
            <button
              className="btn btn-success"
              onClick={() => handleManualSearch()}
              disabled={loading || !searchId.trim()}
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {user && (
          <div className="card p-4 shadow">
            <h5 className="mb-3 text-primary">👤 Editing User: {user.username}</h5>

            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Username:</label>
                <input type="text" className="form-control" value={user.username} disabled />
              </div>

              <div className="form-group mb-3">
                <label>Role:</label>
                <input type="text" className="form-control" value={user.role} disabled />
              </div>

              <div className="form-group mb-3">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={user.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success">
                  💾 Update User
                </button>

                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  🗑️ Delete User
                </button>

                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                  ⬅️ Back
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </CommonLayout>
  );
};

export default AdminEditUserPage;

