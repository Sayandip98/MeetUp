// src/components/meeting/VideoTile.jsx
import { useRef, useEffect } from "react";

const VideoTile = ({ stream, label, muted }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video-tile">
      <video ref={videoRef} autoPlay playsInline muted={muted} />
      <span className="tile-label">{label}</span>
    </div>
  );
};

export default VideoTile;
