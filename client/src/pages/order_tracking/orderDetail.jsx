import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function OrderDetail({ orderId }) {
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        axios
            .get(`http://localhost:3000/order/${orderId}`)
            .then(({ data }) => setDetail(data.order))
            .catch(console.error);
    }, [orderId]);

    if (!detail) return <p>Cargando detalle…</p>;
    // Calcular total
    const total = detail.medicamentos.reduce(
        (sum, m) => sum + parseFloat(m.precio || 0),
        0
    );

    return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Detalle de medicamentos</h4>
            <table className="w-full text-sm">
                <thead>
                    <tr>
                        <th className="text-left">Medicamento</th>
                        <th>Dosis</th>
                        <th>Frecuencia</th>
                        <th className="text-right">Precio</th>
                    </tr>
                </thead>
                <tbody>
                    {detail.medicamentos.map(m => (
                        <tr key={m.medicamento_id}>
                            <td>{m.nombre}</td>
                            <td>{m.dosis}</td>
                            <td>{m.frecuencia}</td>
                            <td className="text-right">${parseFloat(m.precio).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3} className="text-right font-bold">Total:</td>
                        <td className="text-right font-bold">${total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

// Aquí validamos orderId
OrderDetail.propTypes = {
    orderId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
};
