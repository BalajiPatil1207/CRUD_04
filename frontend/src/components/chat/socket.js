import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000"; // Adjust to your backend port

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
