import React from 'react';
import OrderTracking from './OrderTracking'; // Importamos el componente de OrderTracking

const SeguimientoPedido = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <OrderTracking /> {/* Reutilizamos el componente OrderTracking */}
    </div>
  );
};

export default SeguimientoPedido;
