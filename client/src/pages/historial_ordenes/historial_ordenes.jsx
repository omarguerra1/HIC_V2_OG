import React, { useState, useEffect } from "react";
import axios from "axios";

const HistorialOrdenes = () => {

    const [orders, setOrders] = useState([]);
    const [userOrders, setUserOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [foundOrder, setFoundOrder] = useState(null);
    const [orderMsgOpen, setOrderMsg] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect( () => {
        const user = JSON.parse(localStorage.getItem("usuarioActual"));
        setCurrentUser(user);
    }, []);
  
    useEffect( () => {
      getOrders();
    }, [page]);

    useEffect( () => {
        if(currentUser){
            filterOrders();
        }
    }, [currentUser, orders]);
  
    const getOrders = async () => {
      try{
        const response = await axios.get("http://localhost:3000/order/", {
          params: {page} 
        });
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch(error){
        alert("No se pudo obtener la informacion de las ordenes");
        console.log("Error al obtener ordenes");
      }
    }; 

    const filterOrders = () => {
        const filteredOrders = orders.filter(order => order.user_id === currentUser.user_id);
        setUserOrders(filteredOrders);
    };
  
    const handleSearch = (e) => {
      e.preventDefault();
      if(search){
        const foundOrder = userOrders.find(order => order.order_id.toString() === search);
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
  
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl font-bold mb-8">Historial de Ordenes</h2>
  
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
                className="ml-2 p-2 bg-blue-500 text-white, rounded-md">
                Buscar
              </button>
          </form>
  
          <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
            {userOrders.map((order) => (
              <li key={order.order_id} className="border-b last:border-0 p-2">
                  <p><strong>ID: </strong>{order.order_id}</p>
                  <p><strong>Estado: </strong>{order.state}</p>
                  <p><strong>Fecha de pedido: </strong>{order.order_date}</p>
                  <p><strong>Fecha de entrega: </strong>{order.delivery_schedule}</p>
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
                    <p><strong>Estado: </strong>{foundOrder.state}</p>
                    <p><strong>Fecha de pedido: </strong>{foundOrder.order_date}</p>
                    <p><strong>Fecha de entrega: </strong>{foundOrder.delivery_schedule}</p>
                </div> )} 
              </div> 
            </div>
        )}
        </div>
      );
    };

export default HistorialOrdenes;