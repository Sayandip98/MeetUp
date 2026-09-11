// src/hooks/useSocket.js
import { useEffect, useState } from "react";
import useAuth from "./useAuth.js";
import { connectSocket, disconnectSocket } from "../socket/socket.js";

const useSocket = () => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      disconnectSocket();
      setSocket(null);
      setConnected(false);
      return;
    }

    const socketInstance = connectSocket(token);
    setSocket(socketInstance);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleConnectError = (err) => {
      console.error("Socket connection error:", err.message);
      setConnected(false);
    };

    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("connect_error", handleConnectError);

    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("connect_error", handleConnectError);
    };
  }, [token, user]);

  return { socket, connected };
};

export default useSocket;
