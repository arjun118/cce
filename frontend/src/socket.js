import { io } from "socket.io-client";
const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3500";
const socket = io(URL);

export { socket, io };
