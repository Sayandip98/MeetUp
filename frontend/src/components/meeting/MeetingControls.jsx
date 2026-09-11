// src/components/meeting/MeetingControls.jsx
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare as ScreenShareIcon,
  PhoneOff,
} from "lucide-react";

const MeetingControls = ({
  audioEnabled,
  videoEnabled,
  toggleAudio,
  toggleVideo,
  isSharing,
  startScreenShare,
  stopScreenShare,
  onLeave,
}) => {
  return (
    <div className="control-bar">
      <button
        onClick={toggleAudio}
        className={audioEnabled ? "" : "control-off"}
      >
        {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
      </button>
      <button
        onClick={toggleVideo}
        className={videoEnabled ? "" : "control-off"}
      >
        {videoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
      </button>
      <button
        onClick={isSharing ? stopScreenShare : startScreenShare}
        className={isSharing ? "control-active" : ""}
      >
        <ScreenShareIcon size={20} />
      </button>
      <button className="leave-btn" onClick={onLeave}>
        <PhoneOff size={18} /> Leave
      </button>
    </div>
  );
};

export default MeetingControls;
