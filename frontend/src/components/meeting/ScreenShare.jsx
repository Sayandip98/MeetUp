// src/components/meeting/ScreenShare.jsx
const ScreenShare = ({ isSharing }) => {
  if (!isSharing) return null;

  return <span className="chip chip-live">You are sharing your screen</span>;
};

export default ScreenShare;
