import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export function createSocketConnection() {
  if (location.hostname === "localhost") {
    return io(BASE_URL, {
      withCredentials: true,
    });
  } else {
    return io("/", { path: "/socket.io", withCredentials: true });
  }
}
