// src/socketClient.js
import { io } from "socket.io-client";

// no autoConnect, lo haremos manualmente desde App.jsx
const socket = io("http://localhost:3000", {
  autoConnect: false,
  //transports: ["websocket"],
});

export default socket;
