import { io, Socket } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(BASE_URL, { withCredentials: true });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
