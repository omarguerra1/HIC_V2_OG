import OrderTracking from './OrderTracking'; // Importamos el componente de OrderTracking

const SeguimientoPedido = () => {
  return (
    <div className="w-full p-4">
      <OrderTracking /> {/* Reutilizamos el componente OrderTracking */}
    </div>
  );
};

export default SeguimientoPedido;
