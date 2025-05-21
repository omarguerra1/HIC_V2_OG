//import { useState } from 'react';
import { useState, useEffect } from "react";
import axios from "axios";

const handlePayment = async (tipoPago, orderData) => {
    if (!orderData) {
        alert("Error: No se han recibido los datos del pedido.");
        return;
    }

    const userName = orderData.nombre_usuario;
    const userMatricula = orderData.matricula;
    const userOrderID = orderData.order_id;
    const pago = tipoPago === "ventanilla" ? "$245" : "$245";
    //const medicamentos = orderData.medicamentos;
    const medicamentos = Array.isArray(orderData.medicamento) ? orderData.medicamento : [orderData.medicamento];  // ✅ Asegura que sea un array



    try {
        const response = await axios.post("http://localhost:3000/pdf/generate-pdf", {
            userName,
            userMatricula,
            pago,
            userOrderID,
            medicamentos,
            tipoPago  // ✅ Envía el tipo de pago
        }, { responseType: 'arraybuffer' });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = tipoPago === "ventanilla" ? `recibo_ventanilla_${userMatricula}.pdf` : `recibo_transferencia_${userMatricula}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();

    } catch (error) {
        console.error("Error al generar el PDF:", error);
        alert("Hubo un problema al generar el recibo");
    }
};

const CardPaymentForm = () => {
    const [orderData, setOrderData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card'); // Default payment method is 'card'

    // **Obtener datos de la orden al cargar el componente**
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/order_medicamentos/"); // Cambia el ID dinámicamente si es necesario
                //setOrderData(response.data);
                setOrderData(response.data.ordermed[0]);  // ✅ Ajusta para acceder al primer elemento del array
                console.log("Datos recibidos:", response.data);
            } catch (error) {
                console.error("Error al obtener los datos de la orden:", error);
            }
        };

        fetchOrderData();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="mt-4 text-left">
                <button className="bg-black text-white px-4 py-2 rounded">Regresar</button>
            </div>

            <div className="flex flex-row justify-between gap-8 mt-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6 w-1/2">
                    <div className="p-6 space-y-6 max-w-3xl mx-auto">
                        {/* Encabezado */}
                        <div className="flex justify-center">
                            <h1 className="text-2xl font-bold text-black text-center">Resumen del Pedido</h1>
                        </div>

                        {/* Resumen del pedido */}
                        {orderData ? (
                            <div className="space-y-2">
                                <h2 className="text-lg font-semibold">Resumen del Pedido</h2>
                                <p><strong>Pedido:</strong> #{orderData.order_id}</p>
                                <p><strong>Fecha:</strong> {orderData.date}</p>
                                <p><strong>Producto:</strong> {orderData.product_name} / Medicamentos: {orderData.medicamento}</p>
                                <p className="text-lg font-semibold text-blue-600">Total: $245 MXN</p>
                            </div>
                        ) : (
                            <p>Cargando datos del pedido...</p>
                        )}
                    </div>
                </div>

                {/* Opciones de pago */}
                <div className="bg-white rounded-lg shadow-md p-6 w-1/2">
                    <h2 className="text-xl font-semibold mb-4">Seleccionar Método de Pago</h2>
                    <div className="flex space-x-4">
                        <button onClick={() => setPaymentMethod('card')} className={`flex-1 p-2 text-sm font-medium text-center rounded-lg ${paymentMethod === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            Tarjeta de Crédito/Débito
                        </button>

                        <button onClick={() => setPaymentMethod('cash')} className={`flex-1 p-2 text-sm font-medium text-center rounded-lg ${paymentMethod === 'cash' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                            Pago en Efectivo
                        </button>

                    </div>

                    {/* Formulario de pago */}
                    <form className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:max-w-xl lg:p-8">
                        {paymentMethod === 'card' ? (
                            <div className="mb-6 grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-gray-900">
                                        Nombre completo (como aparece en la tarjeta)*
                                    </label>
                                    <input type="text" id="full_name" value={orderData?.customer_name || ""} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500" required />
                                </div>
                                {/* Otros campos del formulario... */}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p>Por el momento solo se aceptan pagos en ventanilla y por medio de transferencia bancaria.</p>
                                <div className="flex space-x-4">
                                    <button type="button" onClick={() => handlePayment('ventanilla', orderData)} className="bg-blue-500 text-white px-4 py-2 rounded">
                                        Generar PDF - Pago en Ventanilla
                                    </button>

                                    <button type="button" onClick={() => handlePayment('transferencia', orderData)} className="bg-green-500 text-white px-4 py-2 rounded">
                                        Generar PDF - Pago por Transferencia
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CardPaymentForm;
