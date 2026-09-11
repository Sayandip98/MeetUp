// src/socket/socket.js
import { io } from "socket.io-client";

let socket = null;

const connectSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
    auth: { token },
  });

  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

const getSocket = () => socket;

export { connectSocket, disconnectSocket, getSocket };
