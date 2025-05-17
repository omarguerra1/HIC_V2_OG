import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const PharmacyContext = createContext(null);

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const PharmacyContextProvider = ({ children }) => {
  const [user, setUser] = useState({ logged: false, role: null });
  const [data, setData] = useState({ prescriptions: [], orders: [] });

  useEffect(() => {
    if (user.logged) {
      fetchData();
    }
  }, [user.logged]);

  const fetchData = async () => {
    try {
      const [prescriptionsRes, ordersRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/prescriptions`),
        axios.get(`${API_BASE_URL}/orders`),
      ]);
      setData({ prescriptions: prescriptionsRes.data, orders: ordersRes.data });
    } catch (error) {
      console.warn("Error al obtener datos:", error);
    }
  };

  const login = (role) => setUser({ logged: true, role });
  const logout = () => setUser({ logged: false, role: null });

  return (
    <PharmacyContext.Provider value={{ ...user, ...data, login, logout, fetchData }}>
      {children}
    </PharmacyContext.Provider>
  );
};