// src/context/MeetingContext.jsx
import { createContext, useState, useEffect, useRef } from "react";
import useSocket from "../hooks/useSocket.js";
import useMediaStream from "../hooks/useMediaStream.js";
import useWebRTC from "../hooks/useWebRTC.js";
import SOCKET_EVENTS from "../socket/socketEvents.js";
import useScreenShare from "../hooks/useScreenShare.js";

const MeetingContext = createContext();

const MeetingProvider = ({ meetingId, children }) => {
  const { socket, connected } = useSocket();
  const {
    stream: localStream,
    error: mediaError,
    toggleAudio,
    toggleVideo,
    audioEnabled,
    videoEnabled,
  } = useMediaStream();
  const {
    remoteStreams,
    callUser,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    removePeer,
    peerConnections,
  } = useWebRTC(socket, localStream);

  const { isSharing, screenStream, startScreenShare, stopScreenShare } =
    useScreenShare(peerConnections, localStream);

  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [waitingUsers, setWaitingUsers] = useState([]);
  const [waitingForApproval, setWaitingForApproval] = useState(false);
  const [status, setStatus] = useState(""); // e.g. "denied", "removed"

  const hasJoinedRef = useRef(false);

  // Join the room once socket is connected and local media is ready
  useEffect(() => {
    if (!socket || !connected || !localStream || hasJoinedRef.current) return;

    hasJoinedRef.current = true;
    socket.emit(SOCKET_EVENTS.JOIN_ROOM, { meetingId });
  }, [socket, connected, localStream, meetingId]);

  // Register all socket event listeners
  useEffect(() => {
    if (!socket) return;

    const onRoomJoined = ({ participants: existing, isHost: hostFlag }) => {
      setParticipants(existing);
      setIsHost(hostFlag);
      existing.forEach((p) => callUser(p.socketId));
    };

    const onUserJoined = ({ participant }) => {
      setParticipants((prev) => [...prev, participant]);
      // The existing participant does NOT call the new joiner —
      // the new joiner calls them (handled in onRoomJoined on their side)
    };

    const onUserLeft = ({ socketId }) => {
      setParticipants((prev) => prev.filter((p) => p.socketId !== socketId));
      removePeer(socketId);
    };

    const onWaitingForApproval = (data) => {
      if (data?.requester) {
        // we're the host, seeing someone else waiting
        setWaitingUsers((prev) => [...prev, data.requester]);
      } else {
        // we're the one waiting
        setWaitingForApproval(true);
      }
    };

    const onParticipantAdmitted = () => {
      setWaitingForApproval(false);
    };

    const onParticipantDenied = () => {
      setStatus("denied");
    };

    const onForceMuted = () => {
      toggleAudio();
    };

    const onRemovedFromMeeting = () => {
      setStatus("removed");
    };

    const onNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on(SOCKET_EVENTS.ROOM_JOINED, onRoomJoined);
    socket.on(SOCKET_EVENTS.USER_JOINED, onUserJoined);
    socket.on(SOCKET_EVENTS.USER_LEFT, onUserLeft);
    socket.on(SOCKET_EVENTS.OFFER, handleOffer);
    socket.on(SOCKET_EVENTS.ANSWER, handleAnswer);
    socket.on(SOCKET_EVENTS.ICE_CANDIDATE, handleIceCandidate);
    socket.on(SOCKET_EVENTS.WAITING_FOR_APPROVAL, onWaitingForApproval);
    socket.on(SOCKET_EVENTS.PARTICIPANT_ADMITTED, onParticipantAdmitted);
    socket.on(SOCKET_EVENTS.PARTICIPANT_DENIED, onParticipantDenied);
    socket.on(SOCKET_EVENTS.FORCE_MUTED, onForceMuted);
    socket.on(SOCKET_EVENTS.REMOVED_FROM_MEETING, onRemovedFromMeeting);
    socket.on(SOCKET_EVENTS.NEW_MESSAGE, onNewMessage);

    return () => {
      socket.off(SOCKET_EVENTS.ROOM_JOINED, onRoomJoined);
      socket.off(SOCKET_EVENTS.USER_JOINED, onUserJoined);
      socket.off(SOCKET_EVENTS.USER_LEFT, onUserLeft);
      socket.off(SOCKET_EVENTS.OFFER, handleOffer);
      socket.off(SOCKET_EVENTS.ANSWER, handleAnswer);
      socket.off(SOCKET_EVENTS.ICE_CANDIDATE, handleIceCandidate);
      socket.off(SOCKET_EVENTS.WAITING_FOR_APPROVAL, onWaitingForApproval);
      socket.off(SOCKET_EVENTS.PARTICIPANT_ADMITTED, onParticipantAdmitted);
      socket.off(SOCKET_EVENTS.PARTICIPANT_DENIED, onParticipantDenied);
      socket.off(SOCKET_EVENTS.FORCE_MUTED, onForceMuted);
      socket.off(SOCKET_EVENTS.REMOVED_FROM_MEETING, onRemovedFromMeeting);
      socket.off(SOCKET_EVENTS.NEW_MESSAGE, onNewMessage);
    };
  }, [
    socket,
    callUser,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    removePeer,
    toggleAudio,
  ]);

  const sendMessage = (text) => {
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, { meetingId, text });
  };

  const admitParticipant = (socketId) => {
    socket.emit(SOCKET_EVENTS.ADMIT_PARTICIPANT, { socketId });
    setWaitingUsers((prev) => prev.filter((u) => u.socketId !== socketId));
  };

  const denyParticipant = (socketId) => {
    socket.emit(SOCKET_EVENTS.DENY_PARTICIPANT, { socketId });
    setWaitingUsers((prev) => prev.filter((u) => u.socketId !== socketId));
  };

  const muteParticipant = (socketId) => {
    socket.emit(SOCKET_EVENTS.MUTE_PARTICIPANT, { socketId });
  };

  const removeParticipant = (socketId) => {
    socket.emit(SOCKET_EVENTS.REMOVE_PARTICIPANT, { socketId });
  };

  const leaveMeeting = () => {
    socket.emit(SOCKET_EVENTS.LEAVE_ROOM);
  };

  return (
    <MeetingContext.Provider
      value={{
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
        screenStream,
        startScreenShare,
        stopScreenShare,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

export { MeetingContext, MeetingProvider };
