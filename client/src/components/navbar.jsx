import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PharmacyContext } from "../context/pharmacy-context";
import "./navbar.css";

export const Navbar = () => {
  const { logged, userRole, logout } = useContext(PharmacyContext);

  // Función para generar los enlaces según el rol del usuario
  const getLinks = () => {
    if (!logged) {
      return [
        { path: "/", label: "Inicio" },
        { path: "/login", label: "Iniciar Sesión" },
      ];
    }

    if (userRole === "hic_admin") {
      return [
        { path: "/managePrescriptions", label: "Gestión de Recetas" },
        { path: "/manageOrders", label: "Gestión de Pedidos" },
      ];
    }

    return [
      { path: "/UploadComponent", label: "Subir Receta" },
      { path: "/SeguimientoPedido", label: "Seguimiento de Pedidos" },
      { path: "/Notifications", label: "Notificaciones" },
    ];
  };

  return (
    <div className="navbar">
      <div className="links">
        {getLinks().map(({ path, label }) => (
          <Link key={path} to={path}>{label}</Link>
        ))}
        {logged && <button onClick={logout}>Cerrar Sesión</button>}
      </div>
    </div>
  );
};