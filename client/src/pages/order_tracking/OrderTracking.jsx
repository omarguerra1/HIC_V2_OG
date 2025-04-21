import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Notification from '../notifications/Notification';

const OrderTracking = () => {
  const [order_id, setOrderId] = useState('');
  const [orderMsgOpen, setOrderMsg] = useState(false);
  const [orderData, setOrderData] = useState(null);

  //Datos de usuario para corroborar ID
  const [currentUser, setCurrentUser] = useState(null);

  useEffect( () => {
      const user = JSON.parse(localStorage.getItem("usuarioActual"));
      setCurrentUser(user);
  }, [] );

  const handleTrackOrder = async() => {
    try{
      const response = await axios.get(`http://localhost:3000/order/find_order/${order_id}`);
      if(response.data.success){
        if(response.data.order.user_id === currentUser.user_id){
          setOrderData(response.data.order);
          setOrderMsg(true);
        } else{
          alert("No se enconctro una orden con el ID especificado");
        }
      } else{
        alert("No se encontro una orden con el ID especificado");
      }
    } catch(error){
      alert("Error al buscar la orden");
    }
  };

  const handleCloseOrderMsg = () => {
    setOrderMsg(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Seguimiento de Pedido</h2>
      <input
        type="text"
        value={order_id}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Introduce tu ID de pedido"
        className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
      />
      <button onClick={handleTrackOrder} className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-blue-500">
        Rastrear Pedido
      </button>
      {orderMsgOpen && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
          <div className="relative top-1/4 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white"> 
            <button 
              onClick={handleCloseOrderMsg} 
              className="absolute top-0 right-0 m-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Aceptar
            </button> 
            {orderData && ( 
              <div> 
                <h3 className="text-xl font-bold mb-4">
                  Detalles del Pedido:
                </h3> 
                <p><strong>Orden ID:</strong> {orderData.order_id}</p> 
                <p><strong>Paciente:</strong> {orderData.username}</p> 
                <p><strong>Estado:</strong> {orderData.state}</p> 
                <p><strong>Fecha de Pedido:</strong> {orderData.order_date}</p> 
                <p><strong>Horario de Entrega:</strong> {orderData.delivery_schedule}</p> 
              </div> )} 
            </div> 
          </div>
      )}
    </div>
  );
};

export default OrderTracking;
