// src/pages/Profile.jsx
import "../styles/auth.css";
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth.js";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../services/user.api.js";
import Loader from "../components/common/Loader.jsx";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const result = await getProfile();
      setProfile(result.data);
      setName(result.data.name);
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateProfile({ name });
      setProfile(result.data);
      setSuccess("Name updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update name");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const result = await uploadAvatar(file);
      setProfile((prev) => ({ ...prev, avatar: result.data.avatar }));
      setSuccess("Avatar updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="auth-page">
        <Loader size={32} />
      </div>
    );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Profile</h1>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <div
          style={{
            margin: "1rem 0",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {profile?.avatar?.url ? (
            <img
              src={profile.avatar.url}
              alt="Avatar"
              width="72"
              height="72"
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid var(--color-border)",
              }}
            />
          ) : (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "var(--color-surface-high)",
              }}
            />
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
            />
            {uploading && (
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Uploading...
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleUpdateName} className="auth-form">
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </form>

        <p
          style={{
            marginTop: "1rem",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          Email: {profile?.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;