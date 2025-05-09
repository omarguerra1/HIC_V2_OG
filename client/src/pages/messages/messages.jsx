import { useState, useEffect } from "react";
import axios from "axios";

const Messages = () => {
  const [state, setState] = useState({
    writingMsg: false,
    sentMsgs: [],
    receivedMsgs: [],
    currentUser: JSON.parse(localStorage.getItem("usuarioActual")) || null,
    receiverName: "",
    receiverID: null,
    respondingTo: null,
    msgContent: "",
  });

  const maxLength = 200;

  useEffect(() => {
    if (state.currentUser) getMessages();
  }, [state.currentUser]);

  useEffect(() => {
    return () => updateMessages();
  }, [state.receivedMsgs]);

  const updateMessages = async () => {
    try {
      const updatedMsgs = state.receivedMsgs.map((msg) => ({ ...msg, hasBeenSeen: "true" }));
      await Promise.all(updatedMsgs.map((msg) => axios.put(`http://localhost:3000/message/update_msg/${msg.msg_id}`, msg)));
      console.log("Mensajes actualizados");
    } catch (error) {
      console.warn("Error al actualizar mensajes:", error);
    }
  };

  const getMessages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/message/");
      const messages = response.data.messages || [];

      if (state.currentUser.role === "general") {
        setState((prev) => ({
          ...prev,
          sentMsgs: messages.filter((msg) => msg.sender_id === state.currentUser.user_id),
          receivedMsgs: messages.filter((msg) => msg.receiver_id === state.currentUser.user_id),
        }));
      } else if (state.currentUser.role === "hic_admin") {
        const msgWithNames = await Promise.all(messages.map(async (msg) => {
          const patientDetails = await getPatientName(msg.sender_id);
          return { ...msg, patient_name: patientDetails?.user?.name_ || "Desconocido" };
        }));

        setState((prev) => ({
          ...prev,
          sentMsgs: msgWithNames,
          receivedMsgs: msgWithNames.filter((msg) => msg.receiver_id === null),
        }));
      }
    } catch (error) {
      alert("No se pudo obtener la información de los mensajes");
      console.warn("Error al obtener mensajes:", error);
    }
  };

  const getPatientName = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/user/get_user/${userId}`);
      return response.data;
    } catch (error) {
      console.warn("Error al obtener nombre de usuario:", error);
      return null;
    }
  };

  const handleNewMessage = () => setState((prev) => ({ ...prev, writingMsg: true }));

  const handleSendMsg = async () => {
    if (!state.msgContent.trim()) {
      alert("Debe escribir un mensaje primero");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/message/new_msg', {
        sender_id: state.currentUser.user_id,
        receiver_id: state.receiverID,
        msg_content: state.msgContent,
        respondingTo: state.respondingTo,
      });

      if (response.data.success) {
        alert("Mensaje Enviado");
        setState((prev) => ({
          ...prev,
          writingMsg: false,
          msgContent: "",
          respondingTo: null,
        }));
      }
    } catch (error) {
      alert("El mensaje no pudo ser enviado");
      console.error(error);
    }
  };

  const handleRespondMsg = (msgID, receiverID, receiverName) => {
    setState((prev) => ({
      ...prev,
      respondingTo: msgID,
      receiverID,
      receiverName,
      writingMsg: true,
    }));
  };

  return (
    <div className="login-form max-w mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 my-2">{state.currentUser?.role === "general" ? "Mensajes" : "Mensajes en el Sistema"}</h2>

      <button onClick={handleNewMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
        Escribir Nuevo Mensaje
      </button>

      <div className="text-left">
        {state.receivedMsgs.length > 0 ? (
          <ul className="w-full max-w bg-white shadow-md rounded-lg p-4">
            {state.receivedMsgs.map((msg) => (
              <li key={msg.msg_id} className="border-b last:border-0 p-2">
                {msg.hasBeenSeen === "false" && <strong className="text-red-500">Mensaje Nuevo</strong>}
                <p><strong>De:</strong> {msg.patient_name || "Administrador"}</p>
                <p><strong>Para:</strong> Administrador</p>
                <p><strong>Fecha:</strong> {new Date(msg.msg_date).toLocaleDateString("es-MX")}</p>
                <p><strong>Hora:</strong> {new Date(msg.msg_date).toLocaleTimeString("es-MX")}</p>
                <p><strong>Mensaje:</strong> {msg.msg_content}</p>
                <button onClick={() => handleRespondMsg(msg.msg_id, msg.sender_id, msg.patient_name)} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-700 my-1">
                  Responder
                </button>
              </li>
            ))}
          </ul>
        ) : <label className="font-bold mb-4">No tiene mensajes recibidos</label>}
      </div>

      {state.writingMsg && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex justify-center">
          <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto h-auto max-h-screen my-48">
            <button onClick={() => setState((prev) => ({ ...prev, writingMsg: false }))} className="absolute top-2 right-2 bg-red-500 text-white rounded-md">
              X
            </button>
            <h2 className="text-2xl font-bold mb-4">Nuevo Mensaje</h2>
            <p><strong>De:</strong> {state.currentUser.role === "general" ? state.currentUser.name_ : "Administrador"}</p>
            <p><strong>Para:</strong> {state.currentUser.role === "general" ? "Administrador" : state.receiverName}</p>
            <textarea value={state.msgContent} onChange={(e) => setState((prev) => ({ ...prev, msgContent: e.target.value }))} maxLength={maxLength} placeholder="Escriba su mensaje" className="w-full max-w-lg p-4 border border-gray-300 rounded-md bg-white my-2" rows="10" />
            <div className="mt-2 text-gray-500">{state.msgContent.length}/{maxLength} caracteres</div>
            <button onClick={handleSendMsg} className="ml-2 p-2 bg-green-500 text-white rounded-md my-2">Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;