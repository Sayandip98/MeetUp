// src/hooks/useWebRTC.js
import { useRef, useState, useCallback } from "react";
import SOCKET_EVENTS from "../socket/socketEvents.js";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const useWebRTC = (socket, localStream) => {
  const [remoteStreams, setRemoteStreams] = useState({}); // { socketId: MediaStream }
  const peerConnections = useRef({}); // { socketId: RTCPeerConnection }

  const createPeerConnection = useCallback(
    (targetSocketId) => {
      const pc = new RTCPeerConnection(ICE_SERVERS);

      // Attach our local tracks so the other side can receive them
      localStream?.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      // When the other side's tracks arrive, save that stream for the UI
      pc.ontrack = (event) => {
        setRemoteStreams((prev) => ({
          ...prev,
          [targetSocketId]: event.streams[0],
        }));
      };

      // Send discovered ICE candidates to the other peer via the server
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(SOCKET_EVENTS.ICE_CANDIDATE, {
            to: targetSocketId,
            candidate: event.candidate,
          });
        }
      };

      peerConnections.current[targetSocketId] = pc;
      return pc;
    },
    [localStream, socket],
  );

  // Called when we learn about an existing participant and want to call them
  const callUser = useCallback(
    async (targetSocketId) => {
      const pc = createPeerConnection(targetSocketId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit(SOCKET_EVENTS.OFFER, { to: targetSocketId, offer });
    },
    [createPeerConnection, socket],
  );

  // Called when we receive an offer from someone else
  const handleOffer = useCallback(
    async ({ from, offer }) => {
      const pc = createPeerConnection(from);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit(SOCKET_EVENTS.ANSWER, { to: from, answer });
    },
    [createPeerConnection, socket],
  );

  // Called when we receive an answer to our earlier offer
  const handleAnswer = useCallback(async ({ from, answer }) => {
    const pc = peerConnections.current[from];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }, []);

  // Called when we receive an ICE candidate from someone else
  const handleIceCandidate = useCallback(async ({ from, candidate }) => {
    const pc = peerConnections.current[from];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }, []);

  // Called when a participant leaves — clean up their connection
  const removePeer = useCallback((socketId) => {
    peerConnections.current[socketId]?.close();
    delete peerConnections.current[socketId];

    setRemoteStreams((prev) => {
      const updated = { ...prev };
      delete updated[socketId];
      return updated;
    });
  }, []);

  return {
    remoteStreams,
    callUser,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    removePeer,
    peerConnections,
  };
};

export default useWebRTC;
