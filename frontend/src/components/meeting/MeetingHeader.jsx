// src/components/meeting/MeetingHeader.jsx
import { useState } from "react";
import { copyMeetingLink } from "../../utils/meetingUtils.js";

const MeetingHeader = ({ meetingId, participantCount }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyMeetingLink(meetingId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err.message);
    }
  };

  return (
    <div className="meeting-header">
      <h1>{meetingId}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span className="chip">{participantCount} participants</span>
        <button onClick={handleCopy}>{copied ? "Copied!" : "Copy link"}</button>
      </div>
    </div>
  );
};

export default MeetingHeader;
