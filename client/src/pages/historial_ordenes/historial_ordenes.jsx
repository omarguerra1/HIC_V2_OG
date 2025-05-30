import { useState, useEffect } from "react";
import axios from "axios";
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const HistorialOrdenes = () => {
  //const [orders, setOrders] = useState([]);
  const [HistorialPagos, setHistorialPagos] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentUser, setCurrentUser] = useState(null);
  const [sortColumn, setSortColumn] = useState('order_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const perPage = 10;

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("usuarioActual"));
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    getHistorialPagos();
  }, [page]);

  useEffect(() => {
    if (currentUser) {
      filterOrders();
    }
  }, [currentUser, HistorialPagos]);

  useEffect(() => {
    if (userOrders.length > 0) {
      handleSort(sortColumn, sortDirection);
    }
  }, [userOrders.length]);

  const getHistorialPagos = async () => {
    try {
      const response = await axios.get("http://localhost:3000/historial_pagos/", { //orders
        params: { page }
      });
      setHistorialPagos(response.data.historial);
      setTotalPages(response.data.totalPages);
      console.log("Datos Recibidos")
      alert("Usuario actual:", currentUser);
    } catch (error) {
      alert("No se pudo obtener la información de las órdenes");
      console.log("Error al obtener órdenes");
    }
  };

  const filterOrders = () => {
    const filtered = HistorialPagos.filter(order => order.user_name === currentUser.name_);
    console.log("Usuario actual:", currentUser);
    setUserOrders(filtered);
  };

  const handleSort = (column, directionOverride = null) => {
    let direction = directionOverride || 'asc';
    if (!directionOverride) {
      if (column === sortColumn && sortDirection === 'asc') {
        direction = 'desc';
      }
    }

    setSortColumn(column);
    setSortDirection(direction);

    const sorted = [...userOrders].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      if (column === 'order_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (column === 'amount') {
        //aValue = parseFloat(aValue);
        //bValue = parseFloat(bValue);
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setUserOrders(sorted);
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return <FaSort className="inline ml-2 text-gray-400" />;
    return sortDirection === 'asc' ? (
      <FaSortUp className="inline ml-2 text-blue-500" />
    ) : (
      <FaSortDown className="inline ml-2 text-blue-500" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => window.history.back()}
        className="mb-4 px-4 py-2 bg-gray-300 text-black rounded flex items-center"
      >
        <span className="mr-2">←</span> Regresar
      </button>

      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Historial de Pagos</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto" role="table" aria-label="Tabla de historial de pagos">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort("order_id")}>
                Orden ID {getSortIcon("order_id")}
              </th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort("amount")}>
                Importe {getSortIcon("amount")}
              </th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort("order_date")}>
                Fecha {getSortIcon("order_date")}
              </th>
              <th className="py-3 px-6 text-left">Cliente</th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort("state")}>
                Estado {getSortIcon("state")}
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {userOrders.length > 0 ? (
              userOrders.map(order => (
                <tr
                  key={order.order_id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-300"
                >
                  <td className="py-3 px-6 text-left">{order.order_id}</td>
                  <td className="py-3 px-6 text-left">${order.amount || "-.--"}</td>
                  <td className="py-3 px-6 text-left">{order.order_date}</td>
                  <td className="py-3 px-6 text-left">{order.user_name || "Cliente N/D"}</td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={
                        `${order.state === 'Entregada' ? 'bg-green-200 text-green-600' :
                          order.state === 'Preparando' ? 'bg-yellow-200 text-yellow-600' :
                          order.state === 'Lista'      ? 'bg-blue-200 text-blue-600' :
                          order.state === 'Cancelada'  ? 'bg-red-200 text-red-600' :
                          'bg-gray-200 text-gray-600'
                        } py-1 px-3 rounded-full text-xs`
                      }
                    >
                      {order.state}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 px-6 text-gray-500 text-center">
                  No hay pagos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6 items-center">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition duration-300"
        >
          Anterior
        </button>
        <span className="text-gray-700 py-2">Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition duration-300"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default HistorialOrdenes;