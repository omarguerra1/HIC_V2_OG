import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("¿Estás seguro de que quieres cancelar este pedido?");
    if (!confirmCancel) return; 

    try {
        await axios.delete(`http://localhost:3000/order/${orderId}`);
        alert("Pedido cancelado exitosamente");
        window.location.reload();
        setOrders(prevOrders => ({
            ...prevOrders,
            inProcess: prevOrders.inProcess.filter(o => o.order_id !== orderId)
        }));
    } catch (error) {
        console.error("Error al cancelar pedido:", error);
        //alert("Hubo un problema al cancelar el pedido");
    }
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState({ inProcess: [], paid: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        // 1) Obtener user_id (ajusta según tu login)
        const usuario = JSON.parse(localStorage.getItem('usuarioActual'));
        if (!usuario) throw new Error('Usuario no autenticado');
        const user_id = usuario.user_id;

        // 2) Llamar al endpoint CORRECTO (/order) y enviar user_id
        const { data } = await axios.get(
          'http://localhost:3000/order',      // ← singular
          {
            params: {
              page: 1,
              limit: 100,
              user_id                    // ← para que el backend filtre
            }
          }
        );

        // 3) Separar según estado de pago
        const inProcess = data.orders.filter(o => o.estado_pago === 'Sin Pagar');
        const paid = data.orders.filter(o => o.estado_pago === 'Pagada');
        setOrders({ inProcess, paid });
      } catch (error) {
        console.error('Error al cargar los pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);
  if (loading) return <div className="p-4">Cargando pedidos...</div>;
  const handlePayNow = (orderId) => {
    navigate(`/pagar/${orderId}`);
  };

  if (loading) {
    return <div className="p-4">Cargando pedidos...</div>;
  }

  return (
    <div className="flex flex-wrap justify-center p-4 max-w-6xl mx-auto gap-8">
      {/* Botón Regresar */}
      <div className="w-full text-left">
        <button
          onClick={() => window.history.back()}
          className="mb-4 px-4 py-2 bg-gray-300 text-black rounded flex items-center"
        >
          <span className="mr-2">←</span> Regresar
        </button>
      </div>

      {/* Pedidos sin pagar (en proceso) */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-5/12">
        <h1 className="text-2xl font-bold mb-6">Pedidos en Proceso</h1>
        {orders.inProcess.length > 0 ? (
          orders.inProcess.map(order => (
            <div key={order.order_id} className="mb-6 pb-6 border-b bg-gray-100 rounded-lg p-4 flex flex-col items-center">
              <h2 className="text-xl font-semibold text-center">
                Pedido #{order.order_id} – {order.state}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                Fecha de pedido: {new Date(order.order_date).toLocaleString()}
              </p>
              <div className="flex gap-4 mt-3 justify-center">
                <button
                  onClick={() => handlePayNow(order.order_id)}
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition">
                  Pagar Ahora
                </button>
                <button
                  onClick={() => handleCancelOrder(order.order_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                  Cancelar Pedido
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tienes pedidos en proceso.</p>
        )}
      </div>

      {/* Pedidos pagados */}
      <div className="bg-white rounded-lg shadow-md p-6 w-full md:w-5/12">
        <h1 className="text-2xl font-bold mb-6">Pedidos Pagados</h1>
        {orders.paid.length > 0 ? (
          orders.paid.map(order => (
            <div key={order.order_id} className="mb-6 pb-4 border-b bg-gray-100 rounded-lg p-4">
              <h3 className="font-bold text-lg">
                Pedido #{order.order_id}
              </h3>
              <p className="mt-1">
                <span className="font-semibold">Estado:</span> {order.state}
              </p>
              <p className="text-sm text-gray-600">
                Fecha de pedido: {new Date(order.order_date).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p>No tienes pedidos pagados.</p>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
