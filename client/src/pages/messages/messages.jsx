
import { useState, useEffect } from "react";
import axios from "axios";

const Messages = () => {

    const [writingMsg, setWriting] = useState(false);//:p
    const [sentMsgs, setSentMsgs] = useState([]);
    const [receivedMsgs, setReceivedMsgs] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [receiverName, setReceiver] = useState("");
    const [receiverID, setReceiverID] = useState(null);
    const [respondingTo, setResponding] = useState(null);
    const [msgContent, setContent] = useState("");
    const maxLength = 200;

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("usuarioActual"));
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        if (currentUser) {
            getMessages();
        }
    }, [currentUser])

    const updateMessages = async () => {
        try {
            const updatedMsgs = receivedMsgs.map(msg => ({
                ...msg,
                hasBeenSeen: "true"
            }));

            const updatePromises = updatedMsgs.map(msg => axios.put(`http://localhost:3000/message/update_msg/${msg.msg_id}`, msg));
            await Promise.all(updatePromises);
            console.log("Mensajes actualizados");
        } catch (error) {
            console.error("Error al actualizar mensajes->", error);
        }
    };

    useEffect(() => {
        return () => {
            updateMessages();
        };
    }, [receivedMsgs]);

    const getMessages = async () => {
        if (currentUser.role === "general") {
            try {
                const response = await axios.get("http://localhost:3000/message/");
                if (response.data.messages) {
                    const sent = response.data.messages.filter((msg) => msg.sender_id === currentUser.user_id);
                    const received = response.data.messages.filter((msg) => msg.receiver_id === currentUser.user_id);
                    setSentMsgs(sent);
                    setReceivedMsgs(received);
                }
            } catch (error) {
                alert("No se pudo obtener la informacion de los mensajes");
                console.log("Error al obtener mensajes", error);
            }
        } else if (currentUser.role === "hic_admin") {
            try {
                const response = await axios.get("http://localhost:3000/message/");
                const msgWithNames = await Promise.all(response.data.messages.map(async (msg) => {
                    const patientDetails = await getPatientName(msg.sender_id);
                    return { ...msg, patient_name: patientDetails ? patientDetails.user.name_ : "Desconocido" };
                }));
                const received = msgWithNames.filter((msg) => msg.receiver_id === null);
                setReceivedMsgs(received);
                setSentMsgs(msgWithNames);
            } catch (error) {
                alert("No se pudo obtener la informacion de los mensajes");
                console.log("Error al obtener mensajes ->", error);
            }
        }
    };

    const getPatientName = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3000/user/get_user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener nombre de usuario");
            return null;
        }
    };

    const handleNewMessage = () => {
        setWriting(true);
    };

    const handleSendMsg = async () => {
        if (msgContent === "") {
            alert("Debe escribir un mensaje primero");
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/message/new_msg', {
                sender_id: currentUser.user_id,
                receiver_id: receiverID,
                msg_content: msgContent,
                respondingTo: respondingTo,
            });
            if (response.data.success) {
                alert("Mensaje Enviado");
            }
            setResponding(null);
            window.location.reload();
        } catch (error) {
            alert("El mensaje no pudo ser enviado");
            console.error(error);
        }
        setWriting(false);
    };

    const handleRespondMsg = async (msgID, receiverID, receiverName) => {
        setResponding(msgID);
        setReceiverID(receiverID);
        setReceiver(receiverName)
        setWriting(true);
    }

    return (
        <div className="login-form max-w mx-auto bg-white shadow-lg rounded-lg p-6">
            {currentUser === null || currentUser.role === "general" ? (
                <div>
                    <h2 className="text-2xl font-bold mb-4 my-2">Mensajes</h2>
                    <button
                        onClick={handleNewMessage}
                        className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                    >
                        Escribir Nuevo Mensaje
                    </button>

                    {/* 1) Lista de mensajes enviados */}
                    <section className="mt-6">
                        <h3 className="font-semibold mb-2">Mensajes Enviados</h3>
                        {sentMsgs.length > 0 ? (
                            <ul className="space-y-4">
                                {sentMsgs.map((msg) => (
                                    <li key={msg.msg_id} className="border-b pb-2">
                                        <p><strong>De:</strong> {currentUser.name_}</p>
                                        <p><strong>Para:</strong> Administrador</p>
                                        <p><strong>Fecha:</strong> {new Date(msg.msg_date).toLocaleString("es-MX")}</p>
                                        <p><strong>Mensaje:</strong> {msg.msg_content}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Aún no has enviado ningún mensaje.</p>
                        )}
                    </section>

                    {/* 2) Lista de mensajes recibidos (respuestas del admin) */}
                    <section className="mt-6">
                        <h3 className="font-semibold mb-2">Mensajes Recibidos</h3>
                        {receivedMsgs.length > 0 ? (
                            <ul className="space-y-4">
                                {receivedMsgs.map((msg) => (
                                    <li key={msg.msg_id} className="border-b pb-2">
                                        {msg.hasBeenSeen === "false" && (
                                            <p className="text-red-600 font-semibold">¡Nuevo mensaje!</p>
                                        )}
                                        <p><strong>De:</strong> Administrador</p>
                                        <p><strong>Para:</strong> {currentUser.name_}</p>
                                        <p><strong>Fecha:</strong> {new Date(msg.msg_date).toLocaleString("es-MX")}</p>
                                        <p><strong>Mensaje:</strong> {msg.msg_content}</p>
                                        <button
                                            onClick={() => handleRespondMsg(
                                                msg.msg_id,
                                                null,               // receiver_id = null enviará al admin
                                                "Administrador"     // receiverName para el textarea
                                            )}
                                            className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-700"
                                        >
                                            Responder
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No tienes mensajes de respuesta.</p>
                        )}
                    </section>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold mb-4 my-2">Mensajes en el Sistema</h2>
                    <div className="text-left">
                        {receivedMsgs.length > 0 ? (
                            <ul className="w-full max-w bg-white shadow-md rounded-lg p-4">
                                {receivedMsgs.map((msg) => (
                                    <li key={msg.msg_id} className="border-b last:border-0 p-2">
                                        {msg.hasBeenSeen === "false" ? (
                                            <div>
                                                <strong style={{ color: "red" }}>Mensaje Nuevo</strong>
                                            </div>
                                        ) : null}
                                        <p><strong>De: </strong>{msg.patient_name}</p>
                                        <p><strong>Para: </strong>Administrador</p>
                                        <p><strong>Fecha: </strong>{new Date(msg.msg_date).toLocaleDateString()}</p>
                                        <p><strong>Hora: </strong>{new Date(msg.msg_date).toLocaleTimeString()}</p>
                                        <p><strong>Mensaje: </strong>{msg.msg_content}</p>
                                        {sentMsgs.filter(m => m.respondingTo === msg.msg_id).map(response => (
                                            <div key={response.msg_id} className="text-right">
                                                <strong>Respuesta: </strong>
                                                <p><strong>De: </strong>Administrador</p>
                                                <p><strong>Para: </strong>{currentUser.name_}</p>
                                                <p><strong>Fecha: </strong>{response.msg_date}</p>
                                                <p><strong>Mensaje: </strong>{response.msg_content}</p>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => handleRespondMsg(msg.msg_id, msg.sender_id, msg.patient_name)}
                                            className="p-2 bg-green-500 text-white rounded-md hover:bg-green-700 my-1">
                                            Responder
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <label className="font-bold mb-4">No tiene mensajes recibidos</label>
                        )}
                    </div>
                </div>
            )}

            {writingMsg && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex justify-center">
                    <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto h-auto max-h-screen my-48">
                        <button
                            onClick={() => setWriting(false)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-md">
                            X
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Nuevo Mensaje</h2>
                        <p>
                            <strong>De: </strong>
                            {currentUser.role === "general" ? (
                                currentUser.name_
                            ) : (
                                "Administrador"
                            )}
                        </p>
                        <p>
                            <strong>Para: </strong>
                            {currentUser.role === "general" ? (
                                "Administrador"
                            ) : (
                                receiverName
                            )}
                        </p>
                        <textarea
                            value={msgContent}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={maxLength}
                            placeholder="Escriba su mensaje"
                            className="w-full max-w-lg p-4 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white my-2"
                            rows="10">
                        </textarea>
                        <div className="mt-2 text-gray-500">
                            {msgContent.length}/{maxLength} caracteres
                        </div>
                        <button
                            onClick={handleSendMsg}
                            className="ml-2 p-2 bg-green-500 text-white rounded-md my-2">
                            Enviar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
