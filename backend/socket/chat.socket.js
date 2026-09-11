import Message from "../models/Message.model.js";
import Meeting from "../models/Meeting.model.js";
import SOCKET_EVENTS from "./socketEvents.js";

const registerChatHandlers = (io, socket) => {
  socket.on(SOCKET_EVENTS.SEND_MESSAGE, async ({ meetingId, text }) => {
    try {
      if (!text || !text.trim()) return;

      const meeting = await Meeting.findOne({ meetingId });

      if (!meeting) {
        socket.emit("error", { message: "Meeting not found" });
        return;
      }

      const message = await Message.create({
        meeting: meeting._id,
        sender: socket.user._id,
        text: text.trim(),
      });

      io.to(meetingId).emit(SOCKET_EVENTS.NEW_MESSAGE, {
        id: message._id,
        text: message.text,
        sender: {
          id: socket.user._id,
          name: socket.user.name,
        },
        createdAt: message.createdAt,
      });
    } catch (err) {
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};

export default registerChatHandlers;
