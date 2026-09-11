// server/config/webrtc.js
// STUN/TURN server config, sent to the frontend so browsers know how to
// establish peer-to-peer connections across different networks.

const webrtcConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    // Add a TURN server here later if needed for strict NAT/firewall cases, e.g.:
    // {
    //   urls: "turn:your-turn-server.com:3478",
    //   username: process.env.TURN_USERNAME,
    //   credential: process.env.TURN_CREDENTIAL,
    // },
  ],
};

export default webrtcConfig;
