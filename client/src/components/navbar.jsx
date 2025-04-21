import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { PharmacyContext } from "../context/pharmacy-context";
import "./navbar.css";

export const Navbar = () => {
  const { logged , userRole , logout } = useContext(PharmacyContext);

  return (
    <div className="navbar">
      {!logged ? (
        // Opciones si no esta logueado
        <div className="links">
          <Link to="/">Inicio</Link>
          <Link to="/login">Iniciar Sesión</Link>
        </div>
      ) : userRole === "hic_admin" ? (
        // Opciones para administrador
        <div className="links">
          <Link to="/managePrescriptions">Gestión de Recetas</Link>
          <Link to="/manageOrders">Gestión de Pedidos</Link>
          <button onClick={logout}>Cerrar Sesión</button>
        </div>
      ) : (
        // Opciones para usuario general
        <div className="links">
          <Link to="/UploadComponent">Subir Receta</Link>
          <Link to="/SeguimientoPedido">Seguimiento de Pedidos</Link>
          <Link to="/Notifications">Notificaciones</Link>
          <button onClick={logout}>Cerrar Sesión</button>
        </div>
      )}
    </div>
  );
};