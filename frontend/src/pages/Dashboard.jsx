// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { createMeeting, getMyMeetings } from "../services/meeting.api.js";
import "../styles/dashboard.css";
import Loader from "../components/common/Loader.jsx";
import Button from "../components/common/Button.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [meetings, setMeetings] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const result = await getMyMeetings();
      setMeetings(result.data);
    } catch (err) {
      setError("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const result = await createMeeting({
        title: title || "Untitled Meeting",
      });
      navigate(`/meeting/${result.data.meetingId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create meeting");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
      </div>

      <div className="dashboard-actions">
        <form onSubmit={handleCreate} className="create-meeting-form">
          <input
            type="text"
            placeholder="Meeting title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button type="submit" variant="primary" disabled={creating}>
            {creating ? "Creating..." : "New Meeting"}
          </Button>
        </form>

        <button onClick={() => navigate("/join")}>Join a Meeting</button>
      </div>

      {error && <p className="auth-error">{error}</p>}

      <p className="dashboard-section-title">Your Meetings</p>

      {loading ? (
        <div className="empty-state">
          <Loader />
        </div>
      ) : meetings.length === 0 ? (
        <p className="empty-state">
          No meetings yet. Create one to get started.
        </p>
      ) : (
        <div className="meeting-grid">
          {meetings.map((meeting) => (
            <div key={meeting._id} className="meeting-card">
              <h3>{meeting.title}</h3>
              <span className="meeting-code">{meeting.meetingId}</span>
              <span className="chip meeting-status">{meeting.status}</span>
              <button onClick={() => navigate(`/meeting/${meeting.meetingId}`)}>
                Open
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
