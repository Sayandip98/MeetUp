// src/components/meeting/MeetingRoom.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useMeeting from "../../hooks/useMeeting.js";
import MeetingHeader from "./MeetingHeader.jsx";
import VideoGrid from "./VideoGrid.jsx";
import WaitingRoom from "./WaitingRoom.jsx";
import ParticipantList from "./ParticipantList.jsx";
import ChatPanel from "./ChatPanel.jsx";
import MeetingControls from "./MeetingControls.jsx";
import ScreenShare from "./ScreenShare.jsx";
import Loader from "../common/Loader.jsx";
import Sidebar from "../layout/Sidebar.jsx";

const MeetingRoom = ({ meetingId }) => {
  const {
    localStream,
    remoteStreams,
    mediaError,
    toggleAudio,
    toggleVideo,
    audioEnabled,
    videoEnabled,
    participants,
    messages,
    sendMessage,
    isHost,
    waitingUsers,
    waitingForApproval,
    status,
    admitParticipant,
    denyParticipant,
    muteParticipant,
    removeParticipant,
    leaveMeeting,
    isSharing,
    startScreenShare,
    stopScreenShare,
  } = useMeeting();

  const navigate = useNavigate();

  useEffect(() => {
    if (status === "denied") {
      alert("The host denied your request to join.");
      navigate("/dashboard");
    }
    if (status === "removed") {
      alert("You were removed from the meeting.");
      navigate("/dashboard");
    }
  }, [status, navigate]);

  const handleLeave = () => {
    leaveMeeting();
    navigate("/dashboard");
  };

  if (waitingForApproval) {
    return (
      <div
        className="waiting-screen"
        style={{ flexDirection: "column", gap: "1rem" }}
      >
        <Loader size={32} />
        <span>Waiting for the host to admit you...</span>
      </div>
    );
  }

  return (
    <div className="meeting-shell">
      <MeetingHeader
        meetingId={meetingId}
        participantCount={participants.length + 1}
      />

      {mediaError && (
        <p style={{ color: "var(--color-destructive)", padding: "0 24px" }}>
          {mediaError}
        </p>
      )}

      <div className="meeting-body">
        <VideoGrid
          localStream={localStream}
          participants={participants}
          remoteStreams={remoteStreams}
        />

        <Sidebar>
          <ScreenShare isSharing={isSharing} />
          <WaitingRoom
            waitingUsers={isHost ? waitingUsers : []}
            onAdmit={admitParticipant}
            onDeny={denyParticipant}
          />
          <ParticipantList
            participants={participants}
            isHost={isHost}
            onMute={muteParticipant}
            onRemove={removeParticipant}
          />
          <ChatPanel messages={messages} onSend={sendMessage} />
        </Sidebar>
      </div>

      <MeetingControls
        audioEnabled={audioEnabled}
        videoEnabled={videoEnabled}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        isSharing={isSharing}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
        onLeave={handleLeave}
      />
    </div>
  );
};

export default MeetingRoom;
