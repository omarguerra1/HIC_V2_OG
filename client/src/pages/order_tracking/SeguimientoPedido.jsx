import React, { memo } from "react";
import OrderTracking from "./OrderTracking"; // Importamos el componente reutilizable

const SeguimientoPedido = memo(() => {
  return (
    <div className="w-full p-4">
      <OrderTracking />
    </div>
  );
});

export default SeguimientoPedido;