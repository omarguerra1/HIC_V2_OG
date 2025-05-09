import io from "socket.io-client";
import React, { useState, useEffect } from "react";

const Notification = () => {
  const [state, setState] = useState({
    currentUser: JSON.parse(localStorage.getItem("usuarioActual")) || null,
    unseenMsgs: 0,
  });

  useEffect(() => {
    if (state.currentUser) {
      const socket = io("http://localhost:3000");
      socket.emit("userLoggedIn", state.currentUser.user_id, state.currentUser.role);
      
      socket.on("msgCount", (unseenCount) => {
        setState((prev) => ({ ...prev, unseenMsgs: unseenCount }));
      });

      return () => {
        socket.off("msgCount");
        socket.disconnect();
      };
    }
  }, [state.currentUser]);

  return (
    <div className="login-form max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 my-2">Notificaciones</h2>
      <div aria-live="polite">
        <h2 className="text-2xl font-bold mb-4 my-2">Mensajes:</h2>
        <p>Tienes <strong>{state.unseenMsgs}</strong> mensajes nuevos</p>
      </div>
    </div>
  );
};

export default Notification;