import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/order/";

const HistorialOrdenes = () => {
  const [state, setState] = useState({
    orders: [],
    userOrders: [],
    page: 1,
    totalPages: 1,
    search: "",
    foundOrder: null,
    orderMsgOpen: false,
    currentUser: JSON.parse(localStorage.getItem("usuarioActual")) || null,
  });

  useEffect(() => {
    getOrders();
  }, [state.page]);

  const getOrders = async () => {
    try {
      const response = await axios.get(API_BASE_URL, { params: { page: state.page } });
      const filteredOrders = response.data.orders.filter(order => order.user_id === state.currentUser?.user_id);
      setState(prev => ({
        ...prev,
        orders: response.data.orders,
        userOrders: filteredOrders,
        totalPages: response.data.totalPages,
      }));
    } catch (error) {
      alert("No se pudo obtener la información de las órdenes");
      console.warn("Error al obtener órdenes:", error);
    }
  };

  const handleChange = (e) => {
    setState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const foundOrder = state.userOrders.find(order => order.order_id.toString() === state.search);
    if (foundOrder) {
      setState(prev => ({ ...prev, foundOrder, orderMsgOpen: true }));
    } else {
      alert("No se encontró una orden con ese ID");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold mb-8">Historial de Órdenes</h2>

      <form onSubmit={handleSearch} className="mb-4">
        <label htmlFor="search">Buscar por ID:</label>
        <input
          id="search"
          type="text"
          name="search"
          value={state.search}
          onChange={handleChange}
          placeholder="Ingrese una ID de orden"
          className="p-2 border border-gray-300 rounded-md bg-white"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-md">
          Buscar
        </button>
      </form>

      <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        {state.userOrders.map((order) => (
          <li key={order.order_id} className="border-b last:border-0 p-2">
            <p><strong>ID:</strong> {order.order_id}</p>
            <p><strong>Estado:</strong> {order.state}</p>
            <p><strong>Fecha de pedido:</strong> {order.order_date}</p>
            <p><strong>Fecha de entrega:</strong> {order.delivery_schedule}</p>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button onClick={() => setState(prev => ({ ...prev, page: Math.max(prev.page - 1, 1) }))} disabled={state.page === 1} className="p-2 bg-blue-500 rounded-md mx-2 hover:bg-blue-700">
          Anterior
        </button>
        <span className="py-2">Página {state.page} de {state.totalPages}</span>
        <button onClick={() => setState(prev => ({ ...prev, page: Math.min(prev.page + 1, state.totalPages) }))} disabled={state.page === state.totalPages} className="p-2 bg-blue-500 rounded-md mx-2 hover:bg-blue-700">
          Siguiente
        </button>
      </div>

      {state.orderMsgOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-1/4 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
            <button onClick={() => setState(prev => ({ ...prev, orderMsgOpen: false }))} className="absolute top-0 right-0 m-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Aceptar
            </button>
            {state.foundOrder && (
              <div>
                <h3 className="text-xl font-bold mb-4">Detalles de la Orden:</h3>
                <p><strong>ID:</strong> {state.foundOrder.order_id}</p>
                <p><strong>Estado:</strong> {state.foundOrder.state}</p>
                <p><strong>Fecha de pedido:</strong> {state.foundOrder.order_date}</p>
                <p><strong>Fecha de entrega:</strong> {state.foundOrder.delivery_schedule}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialOrdenes;