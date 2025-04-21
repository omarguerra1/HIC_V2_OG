import React, { useState, useEffect } from "react";
import axios from "axios";

const VerOrdenes = () => {

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [foundOrder, setFoundOrder] = useState(null);
  const [orderMsgOpen, setOrderMsg] = useState(false);
  const [updatedState, setUpdatedState] = useState("");
  const [updatedDelivery, setUpdatedDelivery] = useState("");

  useEffect( () => {
    getOrders();
  }, [page]);

  const getOrders = async () => {
    try{
      const response = await axios.get("http://localhost:3000/order/", {
        params: {page} 
      });
      const ordersWithNames = await Promise.all(response.data.orders.map(async (order) => {
        const patientDetails = await getPatientName(order.user_id);
        return {...order, patient_name: patientDetails ? patientDetails.user.name_ : "Desconocido"};
      }));
      setOrders(ordersWithNames);
      setTotalPages(response.data.totalPages);
    } catch(error){
      alert("No se pudo obtener la informacion de las ordenes");
      console.log("Error al obtener ordenes");
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

  const handleSearch = (e) => {
    e.preventDefault();
    if(search){
      const foundOrder = orders.find(order => order.order_id.toString() === search);
      if(foundOrder){
        setFoundOrder(foundOrder);
        setOrderMsg(true);
      } else{
        alert("No se encontro una orden con ese ID");
        setFoundOrder(null);
      }
    } else{
      alert("Ingrese un ID para buscar");
      setFoundOrder(null);
    }
  };

  const handleOrderMsg = () => {
    setOrderMsg(false);
  };

  const handleUpdateOrder = (searchId) => {
    const foundOrder = orders.find(order => order.order_id === searchId);
    if(foundOrder){
      setFoundOrder(foundOrder);
      setOrderMsg(true);
    }
  };

  const handleSaveChanges = async (order_id, order) => {
    const updatedOrder = {
        ...order,
        state: updatedState,
        delivery_schedule: new Date(updatedDelivery).toISOString()
    };
    try {
        const response = await axios.put(`http://localhost:3000/order/update/${order_id}`, updatedOrder);
        if (response.data.success) {
            alert("Orden actualizada");
            setOrders(prevOrders => prevOrders.map(o => 
                o.order_id === order_id ? { ...o, state: updatedState, delivery_schedule: updatedOrder.delivery_schedule } : o
            ));
            setOrderMsg(false);
        }
    } catch (error) {
        alert("Error al actualizar pedido");
    }
};

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-bold mb-8">Lista de Ordenes en el Sistema</h2>

        <form onSubmit={handleSearch}
          className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Ingrese una ID de orden"
              className="p-2 border border-gray-300 rounded-md bg-white">
            </input>
            <button
              type="submit"
              className="ml-2 p-2 bg-blue-500 text-white rounded-md">
              Buscar
            </button>
        </form>

        <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
          {orders.map((order) => (
            <li key={order.order_id} className="border-b last:border-0 p-2">
                <p><strong>ID: </strong>{order.order_id}</p>
                <p><strong>Paciente: </strong>{order.patient_name}</p>
                <p><strong>Estado: </strong>{order.state}</p>
                <p><strong>Fecha de pedido: </strong>{order.order_date}</p>
                <p><strong>Fecha de entrega: </strong>{order.delivery_schedule}</p>
                <button
                  onClick={ () => handleUpdateOrder(order.order_id) }
                  className="ml-4 p-2 my-1 bg-green-600 text-white rounded-md hover:bg-green-800 transition">
                  Actualizar Orden
                </button>
            </li>
          ))}
        </ul>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
            className="p-2 bg-blue-500 hover:bg-blue-700 rounded-md mx-2" >
            Anterior
          </button>
          <span className="py-2">Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage(prevPage => Math.max(prevPage + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 bg-blue-500 hover:bg-blue-700 rounded-md mx-2" >
            Siguiente
          </button>
        </div>

        {orderMsgOpen && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
          <div className="relative top-1/4 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white"> 
            <button 
              onClick={handleOrderMsg} 
              className="absolute top-0 right-0 m-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Aceptar
            </button> 
            {foundOrder && ( 
              <div> 
                <h3 className="text-xl font-bold mb-4">
                  Detalles de la Oden:
                </h3> 
                  <p><strong>ID: </strong>{foundOrder.order_id}</p>
                  <p><strong>Paciente: </strong>{foundOrder.patient_name}</p>
                  <p>
                    <strong>Estado: </strong>
                    <select
                      value={updatedState}
                      onChange={ (e) => setUpdatedState(e.target.value)}
                      className="p-2 border-gray-300 rounded-md bg-white">
                        <option value="Preparando">Preparando</option>
                        <option value="Lista">Lista</option>
                        <option value="Entregada">Entregada</option>
                        <option value="Cancelada">Cancelada</option>
                    </select>
                  </p>
                  <p><strong>Fecha de pedido: </strong>{foundOrder.order_date}</p>
                  <p className="my-2">
                    <strong>Fecha de entrega: </strong>
                      <input
                        type="date"
                        value={updatedDelivery}
                        onChange={ (e) => setUpdatedDelivery(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md bg-white">
                      </input>
                  </p>
                  <button
                    onClick={ () => handleSaveChanges(foundOrder.order_id, foundOrder) }
                    className="mt-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition">
                    Guardar Cambios
                  </button>
              </div> 
            )} 
            </div> 
          </div>
      )}
      </div>
    );
  };
  
  export default VerOrdenes;