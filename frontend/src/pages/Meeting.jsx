// src/pages/Meeting.jsx
import "../styles/meeting.css";
import { useParams } from "react-router-dom";
import { MeetingProvider } from "../context/MeetingContext.jsx";
import MeetingRoom from "../components/meeting/MeetingRoom.jsx";

const Meeting = () => {
  const { meetingId } = useParams();

  return (
    <MeetingProvider meetingId={meetingId}>
      <MeetingRoom meetingId={meetingId} />
    </MeetingProvider>
  );
};

export default Meeting;
