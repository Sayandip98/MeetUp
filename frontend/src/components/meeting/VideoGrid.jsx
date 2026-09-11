// src/components/meeting/VideoGrid.jsx
import VideoTile from "./VideoTile.jsx";

const VideoGrid = ({ localStream, participants, remoteStreams }) => {
  return (
    <div className="video-stage">
      <VideoTile stream={localStream} label="You" muted={true} />
      {participants.map((p) => (
        <VideoTile
          key={p.socketId}
          stream={remoteStreams[p.socketId]}
          label={p.name}
          muted={false}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
