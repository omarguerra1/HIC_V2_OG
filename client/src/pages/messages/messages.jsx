import React, { useState, useEffect } from "react";
import axios from "axios"; 

const Messages = () => {

    const [writingMsg, setWriting] = useState(false);
    const [sentMsgs, setSentMsgs] = useState([]);
    const [receivedMsgs, setReceivedMsgs] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [receiverName, setReceiver] = useState("");
    const [receiverID, setReceiverID] = useState(null);
    const [respondingTo, setResponding] = useState(null);
    const [msgContent, setContent] = useState("");
    const maxLength = 200;
  
    useEffect( () => {
        const user = JSON.parse(localStorage.getItem("usuarioActual"));
        setCurrentUser(user);
    }, []);

    useEffect( () => {
        if(currentUser){
            getMessages();
        }
    }, [currentUser])

    const updateMessages = async () => {
        try{
            const updatedMsgs = receivedMsgs.map(msg => ({
                ...msg,
                hasBeenSeen: "true"
            }));

            const updatePromises = updatedMsgs.map( msg => axios.put(`http://localhost:3000/message/update_msg/${msg.msg_id}`, msg));
            await Promise.all(updatePromises);
            console.log("Mensajes actualizados");
        } catch(error){
            console.error("Error al actualizar mensajes");
        }
    };

    useEffect( () => {
        return() => {
            updateMessages();
        };
    }, [receivedMsgs]);

    const getMessages = async() => {
        if(currentUser.role === "general"){
            try{
                const response = await axios.get("http://localhost:3000/message/");
                if(response.data.messages){
                    const sent = response.data.messages.filter( (msg) => msg.sender_id === currentUser.user_id);
                    const received = response.data.messages.filter( (msg) => msg.receiver_id === currentUser.user_id);
                    setSentMsgs(sent);
                    setReceivedMsgs(received);
                }
            } catch(error){
                alert("No se pudo obtener la informacion de los mensajes");
                console.log("Error al obtener mensajes");
            }
        } else if(currentUser.role === "hic_admin"){
            try{
                const response = await axios.get("http://localhost:3000/message/");
                const msgWithNames = await Promise.all(response.data.messages.map(async (msg) => {
                    const patientDetails = await getPatientName(msg.sender_id);
                    return {...msg, patient_name: patientDetails ? patientDetails.user.name_: "Desconocido"};
                }));
                const received = msgWithNames.filter( (msg) => msg.receiver_id === null);
                setReceivedMsgs(received);
                setSentMsgs(msgWithNames);
            } catch(error){
                alert("No se pudo obtener la informacion de los mensajes");
                console.log("Error al obtener mensajes");
            }
        }
    }; 

    const getPatientName = async (userId) => {
        try{
          const response = await axios.get(`http://localhost:3000/user/get_user/${userId}`);
          return response.data;
        } catch(error){
          console.error("Error al obtener nombre de usuario");
          return null;
        }
      };

    const handleNewMessage = () => {
        setWriting(true);
    };

    const handleSendMsg = async() => {
        if(msgContent === ""){
            alert("Debe escribir un mensaje primero");
            return;
        }
        try{
            const response = await axios.post('http://localhost:3000/message/new_msg', {
                sender_id: currentUser.user_id,
                receiver_id: receiverID,
                msg_content: msgContent,
                respondingTo: respondingTo,
            });
            if (response.data.success){
                alert("Mensaje Enviado");
            }
            setResponding(null);
            window.location.reload();
        } catch(error){
            alert("El mensaje no pudo ser enviado");
        }
        setWriting(false);
    };

    const handleRespondMsg = async(msgID, receiverID, receiverName) => {
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
                        className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                        Escribir Nuevo Mensaje
                    </button>
                    <div className="text-left">
                        {sentMsgs.length > 0 ?(
                            <ul className="w-full max-w bg-white shadow-md rounded-lg p-4">
                                {sentMsgs.map((msg) => (
                                    <li key={msg.msg_id} className="border-b last:border-0 p-2">
                                        <p><strong>De: </strong>{currentUser.name_}</p>
                                        <p><strong>Para: </strong>Administrador</p>
                                        <p><strong>Fecha: </strong>{msg.msg_date}</p>
                                        <p><strong>Mensaje: </strong>{msg.msg_content}</p>
                                        {receivedMsgs.filter(m => m.respondingTo === msg.msg_id).map(response => (
                                            <div key={response.msg_id} className="text-right">
                                                {response.hasBeenSeen === "false" ? (
                                                    <div>
                                                        <strong style={{color: "red"}}>Mensaje Nuevo</strong>
                                                    </div>
                                                ) : null }
                                                <strong>Respuesta: </strong>
                                                <p><strong>De: </strong>Administrador</p>
                                                <p><strong>Para: </strong>{currentUser.name_}</p>
                                                <p><strong>Fecha: </strong>{response.msg_date}</p>
                                                <p><strong>Mensaje: </strong>{response.msg_content}</p>
                                            </div>
                                        ))}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <label className="font-bold mb-4">No tiene mensajes enviados</label>
                        )}
                    </div>
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
                                                <strong style={{color: "red"}}>Mensaje Nuevo</strong>
                                            </div>
                                        ) : null }
                                        <p><strong>De: </strong>{msg.patient_name}</p>
                                        <p><strong>Para: </strong>Administrador</p>
                                        <p><strong>Fecha: </strong>{msg.msg_date}</p>
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
                                            onClick={ () => handleRespondMsg(msg.msg_id, msg.sender_id, msg.patient_name) }
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
                            onClick={ () => setWriting(false) }
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
                            onChange={ (e) => setContent(e.target.value) }
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