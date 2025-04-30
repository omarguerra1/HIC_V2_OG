import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderTracking = () => {
  const [orders, setOrders] = useState({
    inProcess: [],
    paid: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando la carga de datos del usuario actual
    const fetchUserOrders = async () => {
      try {
        // En una implementación real, aquí harías la llamada a tu API
        // con el ID del usuario actual para obtener sus pedidos
        const user = JSON.parse(localStorage.getItem("usuarioActual"));

        if (user) {
          // Ejemplo de datos simulados que coinciden con la imagen
          const mockOrders = {
            inProcess: [
              { id: 123, status: "Aprobado", amount: 120.00, currency: "MXN" },
              { id: 125, status: "Aprobado", amount: 100.00, currency: "MXN" }
            ],
            paid: [
              { id: 127, status: "Preparando" },
              { id: 128, status: "Entregado" }
            ]
          };

          setOrders(mockOrders);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const handlePayNow = (orderId) => {
    // Lógica para manejar el pago
    alert(`Procesando pago para el pedido #${orderId}`);
  };

  if (loading) {
    return <div className="p-4">Cargando pedidos...</div>;
  }

  return (
    <div className="flex flex-row justify-between p-4 max-w-6xl mx-auto h-auto gap-8">
      <div className="bg-white rounded-lg shadow-md p-6 w-1/2 mt-6">
        <div>

        </div>
        <h1 className="text-2xl font-bold mb-6 ">Pedidos en Proceso</h1>
        {orders.inProcess.length > 0 ? (
          orders.inProcess.map((order) => (
            <div key={order.id} className="mb-6 pb-6 border-b bg-gray-300 rounded-lg">
              <h2 className="text-xl font-semibold">Pedido #{order.id} - {order.status}</h2>
              <p className="my-2">Total ${order.amount.toFixed(2)} {order.currency}</p>
              <button
                onClick={() => handlePayNow(order.id)}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Pagar Ahora
              </button>
            </div>
          ))
        ) : (
          <p>No tienes pedidos en proceso.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 w-1/2 mt-6">
        <h1 className="text-2xl font-bold mb-6">Pedidos Pagados</h1>
        {orders.paid.length > 0 ? (
          <div className="space-y-6">
            {orders.paid.map((order) => (
              <div key={order.id} className="pb-4 border-b bg-gray-300 rounded-lg">
                <h3 className="font-bold text-lg">Pedido #{order.id}</h3>
                <p className="mt-1"><span className="font-semibold">Estado:</span> {order.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No tienes pedidos pagados.</p>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;