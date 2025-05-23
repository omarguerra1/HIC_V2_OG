// Aquí va solo lógica “pura”, sin JSX ni exportaciones de componentes
export function computeStep(order) {
  // 0 y 1 los damos por hechos si existe la orden
  if (order.medicamentos && order.medicamentos.length > 0) {
    if (order.estado_pago === 'Sin Pagar') return 2;
    if (order.estado_pago === 'Pagada')    return 3;
    switch (order.state) {
      case 'Preparando': return 4;
      case 'Lista':      return 5;
      case 'Entregada':  return 6;
    }
  }
  return 1; // sólo recibida
}
