import SOCKET_EVENTS from "./socketEvents.js";

const registerWebRTCHandlers = (io, socket) => {
  // Peer A sends an offer targeted at one specific peer (by socketId)
  socket.on(SOCKET_EVENTS.OFFER, ({ to, offer }) => {
    io.to(to).emit(SOCKET_EVENTS.OFFER, {
      from: socket.id,
      offer,
    });
  });

  // Peer B replies with an answer, also targeted at one specific peer
  socket.on(SOCKET_EVENTS.ANSWER, ({ to, answer }) => {
    io.to(to).emit(SOCKET_EVENTS.ANSWER, {
      from: socket.id,
      answer,
    });
  });

  // Both sides exchange multiple ICE candidates as they're discovered
  socket.on(SOCKET_EVENTS.ICE_CANDIDATE, ({ to, candidate }) => {
    io.to(to).emit(SOCKET_EVENTS.ICE_CANDIDATE, {
      from: socket.id,
      candidate,
    });
  });
};

export default registerWebRTCHandlers;
