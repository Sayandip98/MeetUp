// server/socket/meeting.socket.js
import Meeting from "../models/Meeting.model.js";
import SOCKET_EVENTS from "./socketEvents.js";
import {
  addParticipant,
  removeParticipant,
  getParticipants,
} from "../utils/roomManager.js";

const registerMeetingHandlers = (io, socket) => {
  socket.on(SOCKET_EVENTS.JOIN_ROOM, async ({ meetingId }) => {
    try {
      const meeting = await Meeting.findOne({ meetingId });

      if (!meeting) {
        socket.emit("error", { message: "Meeting not found" });
        return;
      }

      const isHost = meeting.host.toString() === socket.user._id.toString();

      // remember details needed for later, regardless of host/waiting
      socket.meetingId = meetingId;
      socket.isHost = isHost;

      if (!isHost) {
        socket.emit(SOCKET_EVENTS.WAITING_FOR_APPROVAL);
        io.to(meetingId).emit(SOCKET_EVENTS.WAITING_FOR_APPROVAL, {
          requester: {
            socketId: socket.id,
            userId: socket.user._id,
            name: socket.user.name,
          },
        });
        return;
      }

      joinRoom(io, socket, meetingId);
    } catch (err) {
      socket.emit("error", { message: "Failed to join room" });
    }
  });

  socket.on(SOCKET_EVENTS.LEAVE_ROOM, () => {
    handleLeave(io, socket);
  });

  socket.on("disconnect", () => {
    handleLeave(io, socket);
  });
};

// exported so participant.socket.js can call this once host admits someone
const joinRoom = (io, socket, meetingId) => {
  socket.join(meetingId);

  const participant = {
    socketId: socket.id,
    userId: socket.user._id,
    name: socket.user.name,
  };

  addParticipant(meetingId, participant);

  socket.emit(SOCKET_EVENTS.ROOM_JOINED, {
    participants: getParticipants(meetingId).filter(
      (p) => p.socketId !== socket.id,
    ),
    isHost: socket.isHost,
  });

  socket.to(meetingId).emit(SOCKET_EVENTS.USER_JOINED, { participant });

  socket.currentMeetingId = meetingId;

  console.log(`${socket.user.name} joined room ${meetingId}`);
};

const handleLeave = (io, socket) => {
  const meetingId = socket.currentMeetingId;
  if (!meetingId) return;

  removeParticipant(meetingId, socket.id);
  socket.leave(meetingId);

  socket.to(meetingId).emit(SOCKET_EVENTS.USER_LEFT, {
    socketId: socket.id,
    name: socket.user?.name,
  });

  console.log(`${socket.user?.name} left room ${meetingId}`);
};

export default registerMeetingHandlers;
export { joinRoom };
