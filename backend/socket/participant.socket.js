import SOCKET_EVENTS from "./socketEvents.js";
import { joinRoom } from "./meeting.socket.js";

const registerParticipantHandlers = (io, socket) => {
  // --- Host admits a waiting participant ---
  socket.on(SOCKET_EVENTS.ADMIT_PARTICIPANT, ({ socketId }) => {
    if (!socket.isHost) return; // silently ignore if not host

    const targetSocket = io.sockets.sockets.get(socketId);
    if (!targetSocket) return;

    targetSocket.emit(SOCKET_EVENTS.PARTICIPANT_ADMITTED);
    joinRoom(io, targetSocket, socket.meetingId);
  });

  // --- Host denies a waiting participant ---
  socket.on(SOCKET_EVENTS.DENY_PARTICIPANT, ({ socketId }) => {
    if (!socket.isHost) return;

    const targetSocket = io.sockets.sockets.get(socketId);
    if (!targetSocket) return;

    targetSocket.emit(SOCKET_EVENTS.PARTICIPANT_DENIED);
  });

  // --- Host mutes a participant ---
  socket.on(SOCKET_EVENTS.MUTE_PARTICIPANT, ({ socketId }) => {
    if (!socket.isHost) return;

    io.to(socketId).emit(SOCKET_EVENTS.FORCE_MUTED);
  });

  // --- Host removes a participant ---
  socket.on(SOCKET_EVENTS.REMOVE_PARTICIPANT, ({ socketId }) => {
    if (!socket.isHost) return;

    const targetSocket = io.sockets.sockets.get(socketId);
    if (!targetSocket) return;

    targetSocket.emit(SOCKET_EVENTS.REMOVED_FROM_MEETING);
    targetSocket.disconnect(true); // forcibly disconnects; triggers their "disconnect" cleanup
  });
};

export default registerParticipantHandlers;
