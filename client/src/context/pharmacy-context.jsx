import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const PharmacyContext = createContext(null);

const API_BASE_URL = "http://localhost:3001"; // Base de la API

export const PharmacyContextProvider = (props) => {
  const [logged, setLogged] = useState(false); // Estado para saber si hay un usuario logueado
  const [userRole, setUserRole] = useState(null); // Rol del usuario (e.g., "general", "hic_admin")
  const [prescriptions, setPrescriptions] = useState([]); // Lista de recetas médicas subidas
  const [orderStatus, setOrderStatus] = useState([]); // Estado de pedidos de medicamentos

  useEffect(() => {
    if (logged) {
      fetchPrescriptions(); // Si hay un usuario logueado, obtener recetas
      fetchOrderStatus(); // Obtener estado de pedidos
    }
  }, [logged]);

  // Cambiar estado de sesión
  const login = (role) => {
    setLogged(true);
    setUserRole(role);
  };

  const logout = () => {
    setLogged(false);
    setUserRole(null);
  };

  // Obtener recetas médicas del backend
  const fetchPrescriptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/prescriptions`);
      setPrescriptions(response.data);
    } catch (error) {
      console.error("Error al obtener las recetas:", error);
    }
  };

  // Obtener el estado de los pedidos
  const fetchOrderStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`);
      setOrderStatus(response.data);
    } catch (error) {
      console.error("Error al obtener el estado de los pedidos:", error);
    }
  };

  const contextValue = {
    logged,
    userRole,
    prescriptions,
    orderStatus,
    login,
    logout,
    fetchPrescriptions,
    fetchOrderStatus,
  };

  return (
    <PharmacyContext.Provider value={contextValue}>
      {props.children}
    </PharmacyContext.Provider>
  );
};
