import { useState } from 'react';
const CardPaymentForm = () => {
    const [paymentMethod, setPaymentMethod] = useState('card'); // Default payment method is 'card'
    /**/

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="mt-4 text-left" >
                <button className="bg-black text-white px-4 py-2 rounded">
                    Regresar
                </button>
            </div>
            <div className="flex flex-row justify-between gap-8 mt-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6 w-1/2">
                    <div className="p-6 space-y-6 max-w-3xl mx-auto">
                        {/* Encabezado */}
                        <div className="flex justify-center">
                            <h1 className="text-2xl font-bold text-black text-center">Resumen del Pedido</h1>
                        </div>

                        {/* Resumen del pedido */}
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold">Resumen del Pedido</h2>
                            <p><strong>Pedido:</strong> #12345</p>
                            <p><strong>Fecha:</strong> 22/04/2025</p>
                            <p><strong>Producto:</strong> Amoxicilina 250mg / Sabor: Fresa</p>
                            <p className="text-lg font-semibold text-blue-600">Total: $245.00 MXN</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 w-1/2">
                    {/* Opciones de pago */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Seleccionar Método de Pago</h2>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`flex-1 p-2 text-sm font-medium text-center rounded-lg ${paymentMethod === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                Tarjeta de Crédito/Débito
                            </button>
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`flex-1 p-2 text-sm font-medium text-center rounded-lg ${paymentMethod === 'cash' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                Pago en Efectivo
                            </button>
                        </div>
                    </div>

                    {/* Formulario de pago */}
                    <form
                        action="#"
                        className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:max-w-xl lg:p-8"
                    >
                        {paymentMethod === 'card' ? (
                            // Formulario para tarjeta
                            <div className="mb-6 grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label
                                        htmlFor="full_name"
                                        className="mb-2 block text-sm font-medium text-gray-900"
                                    >
                                        Nombre completo (como aparece en la tarjeta)*
                                    </label>
                                    <input
                                        type="text"
                                        id="full_name"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                        placeholder="Bonnie Green"
                                        required
                                    />
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <label
                                        htmlFor="card-number-input"
                                        className="mb-2 block text-sm font-medium text-gray-900 mt-5"
                                    >
                                        Número de tarjeta*
                                    </label>
                                    <input
                                        type="text"
                                        id="card-number-input"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                        placeholder="xxxx-xxxx-xxxx-xxxx"
                                        pattern="^4[0-9]{12}(?:[0-9]{3})?$"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="card-expiration-input"
                                        className="mb-2 block text-sm font-medium text-gray-900"
                                    >
                                        Fecha de expiración*
                                    </label>
                                    <input
                                        type="text"
                                        id="card-expiration-input"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                        placeholder="MM/AA"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="cvv-input"
                                        className="mb-2 block text-sm font-medium text-gray-900"
                                    >
                                        CVV*
                                    </label>
                                    <input
                                        type="number"
                                        id="cvv-input"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                        placeholder="•••"
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            // Formulario para pago en efectivo
                            <div className="space-y-4">
                                <p>Recibirás un folio y código QR para pagar en efectivo en el hospital o farmacia.</p>
                                <div className="mb-4">
                                    <label
                                        htmlFor="patient-name"
                                        className="mb-2 block text-sm font-medium text-gray-900"
                                    >
                                        Nombre del paciente*
                                    </label>
                                    <input
                                        type="text"
                                        id="patient-name"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                        placeholder="Juan Pérez"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="contact-info"
                                        className="mb-2 block text-sm font-medium text-gray-900"
                                    >
                                        Teléfono o correo para recibir instrucciones*
                                    </label>
                                    <input
                                        type="text"
                                        id="contact-info"
                                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                                        placeholder="juan.perez@mail.com"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Botón de pago */}
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
                        >
                            Confirmar Pago
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default CardPaymentForm;
