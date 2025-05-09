import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Package, Bell, Mail, Clipboard } from "lucide-react"; 

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("usuarioActual")) || null);
  const navigate = useNavigate();

  const handleNavigation = (e, path) => {
    if (!currentUser) {
      e.preventDefault();
      alert("Debes iniciar sesión para acceder a esta sección");
    } else {
      navigate(path);
    }
  };

  const getLinks = () => {
    if (!currentUser || currentUser.role === "general") {
      return [
        { path: "/cargar-receta", icon: <FileText size={48} className="text-blue-600 mb-4" />, label: "Subir Receta", restricted: true },
        { path: "/seguimiento-pedido", icon: <Package size={48} className="text-green-600 mb-4" />, label: "Seguimiento de Pedido" },
        { path: "/notifications", icon: <Bell size={48} className="text-red-600 mb-4" />, label: "Notificaciones" },
        { path: "/messages", icon: <Mail size={48} className="text-yellow-600 mb-4" />, label: "Mensajes", restricted: true },
      ];
    }

    return [
      { path: "/prescriptions", icon: <Clipboard size={48} className="text-purple-600 mb-4" />, label: "Recetas" },
      { path: "/ver_usuarios", icon: <FileText size={48} className="text-blue-600 mb-4" />, label: "Ver Usuarios" },
      { path: "/ver_ordenes", icon: <Package size={48} className="text-green-600 mb-4" />, label: "Ver Ordenes" },
      { path: "/notifications", icon: <Bell size={48} className="text-red-600 mb-4" />, label: "Notificaciones" },
      { path: "/messages", icon: <Mail size={48} className="text-yellow-600 mb-4" />, label: "Mensajes" },
    ];
  };

  return (
    <div className="flex flex-col items-center justify-center h-full mt-6 mb-6">
      <h2 className="text-3xl font-bold mb-8">Hospital Infantil de las Californias</h2>
      <div className={`grid grid-cols-1 md:grid-cols-${currentUser?.role === "hic_admin" ? "5" : "4"} gap-6`}>
        {getLinks().map(({ path, icon, label, restricted }) => (
          <Link
            key={path}
            to={path}
            aria-label={label}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition duration-300 ease-in-out transform hover:scale-105"
            onClick={(e) => restricted && handleNavigation(e, path)}
          >
            {icon}
            <span className="text-xl font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;