import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const handlePayment = async (tipoPago, orderData) => {
  if (!orderData) {
    alert("Error: No se han recibido los datos del pedido.");
    return;
  }

  const { user_id, username, order_id, medicamentos } = orderData;
  const total = medicamentos
    .reduce((sum, m) => sum + parseFloat(m.precio ?? 0), 0)
    .toFixed(2);

  try {
    const response = await axios.post(
      "http://localhost:3000/pdf/generate-pdf",
      {
        userName:      username,
        userMatricula: user_id,
        pago:          `$${total}`,
        userOrderID:   order_id,
        medicamentos,
        tipoPago
      },
      { responseType: "arraybuffer" }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = tipoPago === "ventanilla"
      ? `recibo_ventanilla_${user_id}.pdf`
      : `recibo_transferencia_${user_id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error("Error al generar el PDF:", error);
    alert("Hubo un problema al generar el recibo");
  }
};

const CardPaymentForm = () => {
  const { orderId } = useParams();
  const navigate    = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("ventanilla");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/order/${orderId}`
        );
        if (data.success) {
          setOrderData(data.order);
        } else {
          console.error("Orden no encontrada");
        }
      } catch (err) {
        console.error("Error al obtener la orden:", err);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (!orderData) {
    return (
      <p className="p-4 text-center">Cargando datos del pedido…</p>
    );
  }

  const total = orderData.medicamentos
    .reduce((sum, m) => sum + parseFloat(m.precio ?? 0), 0)
    .toFixed(2);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Regresar */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-300 text-black rounded flex items-center"
      >
        ← Regresar
      </button>

      {/* Layout en dos columnas */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Resumen del Pedido */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:w-1/2">
          <h1 className="text-2xl font-bold mb-4 text-center">
            Resumen del Pedido
          </h1>
          <div className="flex justify-center space-x-8 mb-6">
            <p className="text-blue-600 font-semibold">
              Pedido: #{orderData.order_id}
            </p>
            <p className="text-blue-600 font-semibold">
              Fecha: {new Date(orderData.order_date).toLocaleString()}
            </p>
          </div>
          <ul className="space-y-3">
            {orderData.medicamentos.map(m => (
              <li
                key={m.medicamento_id}
                className="flex justify-between items-center bg-gray-50 rounded p-3"
              >
                <span className="font-medium">
                  {m.nombre} ({m.flavor})
                </span>
                <span className="font-semibold">
                  ${parseFloat(m.precio).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right">
            <span className="text-lg font-bold text-blue-600">
              Total: ${total} MXN
            </span>
          </div>
        </div>

        {/* Opciones de Pago */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">
            Seleccionar Método de Pago
          </h2>
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setPaymentMethod("ventanilla")}
              className={`flex-1 p-2 text-sm font-medium rounded-lg ${
                paymentMethod === "ventanilla"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Pago en Ventanilla
            </button>
            <button
              onClick={() => setPaymentMethod("transferencia")}
              className={`flex-1 p-2 text-sm font-medium rounded-lg ${
                paymentMethod === "transferencia"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Transferencia Bancaria
            </button>
          </div>
          <button
            onClick={() => handlePayment(paymentMethod, orderData)}
            className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Generar Recibo (
            {paymentMethod === "ventanilla"
              ? "Ventanilla"
              : "Transferencia"}
            )
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
