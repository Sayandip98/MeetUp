// src/socket/socketEvents.js
const SOCKET_EVENTS = {
  JOIN_ROOM: "join-room",
  ROOM_JOINED: "room-joined",
  USER_JOINED: "user-joined",
  USER_LEFT: "user-left",
  LEAVE_ROOM: "leave-room",

  OFFER: "webrtc-offer",
  ANSWER: "webrtc-answer",
  ICE_CANDIDATE: "webrtc-ice-candidate",

  SEND_MESSAGE: "send-message",
  NEW_MESSAGE: "new-message",

  WAITING_FOR_APPROVAL: "waiting-for-approval",
  ADMIT_PARTICIPANT: "admit-participant",
  DENY_PARTICIPANT: "deny-participant",
  PARTICIPANT_ADMITTED: "participant-admitted",
  PARTICIPANT_DENIED: "participant-denied",
  MUTE_PARTICIPANT: "mute-participant",
  FORCE_MUTED: "force-muted",
  REMOVE_PARTICIPANT: "remove-participant",
  REMOVED_FROM_MEETING: "removed-from-meeting",
};

export default SOCKET_EVENTS;
