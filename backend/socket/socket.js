import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import registerMeetingHandlers from "./meeting.socket.js";
import registerWebRTCHandlers from "./webrtc.socket.js";
import registerChatHandlers from "./chat.socket.js";
import registerParticipantHandlers from "./participant.socket.js";

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // --- Auth handshake middleware ---
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Not authorized, no token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("Not authorized, user no longer exists"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Not authorized, token failed or expired"));
    }
  });

  // --- Connection handler ---
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.user.name})`);

    registerMeetingHandlers(io, socket);
    registerWebRTCHandlers(io, socket);
    registerChatHandlers(io, socket);
    registerParticipantHandlers(io, socket);
  });

  return io;
};

export default initSocket;
