import io from "socket.io-client";
import React, {useState, useEffect} from 'react';

const Notification = () => {

  const [currentUser, setCurrentUser] = useState(null);
  const [unseenMsgs, setUnseenMsgs] = useState(0);

  useEffect( () => {
      const user = JSON.parse(localStorage.getItem("usuarioActual"));
      setCurrentUser(user);
  }, []);

  useEffect( () => {
    if(currentUser){
      const socket = io("http://localhost:3000");
      socket.emit("userLoggedIn", currentUser.user_id, currentUser.role);
      socket.on("msgCount", (unseenCount) => {
        setUnseenMsgs(unseenCount);
      });
      return () => {
        socket.off("msgCount");
        socket.disconnect();
      };
    }
  }, [currentUser]);

  return (
    <div className="login-form max-w mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 my-2">Notificaciones</h2>
        <div>
          <h2 className="text-2xl font-bold mb-4 my-2">Mensajes: </h2>
          <p>Tienes {unseenMsgs} mensajes nuevos</p>
        </div>
    </div>
  );
};


export default Notification;