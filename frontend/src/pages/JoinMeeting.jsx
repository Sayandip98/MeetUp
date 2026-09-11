// src/pages/JoinMeeting.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMeetingByMeetingId } from "../services/meeting.api.js";
import { isValidMeetingId } from "../utils/validators.js";

const JoinMeeting = () => {
  const [meetingId, setMeetingId] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isValidMeetingId(meetingId)) {
      setError("Enter a valid meeting code (e.g. abcd-1234-efgh)");
      return;
    }

    setChecking(true);

    try {
      await getMeetingByMeetingId(meetingId.trim());
      navigate(`/meeting/${meetingId.trim()}`);
    } catch (err) {
      setError(err.response?.data?.message || "Meeting not found");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Join a Meeting</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter meeting code"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          required
        />
        <button type="submit" disabled={checking}>
          {checking ? "Checking..." : "Join"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default JoinMeeting;
