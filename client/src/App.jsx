import "./App.css";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import logo from './images/LogoOficial.png';
import logofooter from './images/LogoOficial.png'
import insta from './images/instagram.png'
import fa from './images/facebook.png'
import twitter from './images/gorjeo.png'
import youtube from './images/youtube.png'
import io from "socket.io-client";
//Shared pages
import UserProfile from "./pages/user_profile/user_profile.jsx"
import HomePage from './pages/home/HomePage.jsx';
import Messages from "./pages/messages/messages.jsx";
import Notificaciones from "./pages/notifications/Notification.jsx"

//General user pages
import HistorialOrdenes from "./pages/historial_ordenes/historial_ordenes.jsx";
import Register from "./pages/register/registrar_usuario_general.jsx" //Importacion de pagina de registro
import LoginGeneral from "./pages/login/login_general.jsx" //Login para usuarios generales
import SeguimientoPedido from './pages/order_tracking/SeguimientoPedido.jsx';
import UploadComponent from "./pages/request_order/UploadComponent.jsx";

//Admin pages
import Login from "./pages/login/login"; // Login para administradores
import VerUsuarios from "./pages/admin_pages/VerUsuarios.jsx"
import VerOrdenes from "./pages/admin_pages/VerOrdenes.jsx"
import { PharmacyContextProvider } from "./context/pharmacy-context";
import Recetas from "./pages/recetas/recetas.jsx"
const socket = io("http://localhost:3000");

const App = () => {

  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioActual"));
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.emit("userLoggedIn", currentUser.user_id, currentUser.role);
      socket.on("unseenMessages", (message) => {
        alert(message);
      });
      return () => {
        socket.off("unseenMessages");
      };
    }
  }, [currentUser]);

  const handleUserButton = () => {
    if (currentUser === null) {
      window.location.href = "/login_g";
    } else {
      setIsMenuOpen((prev) => !prev);
    }
  };

  const handleMenuOption = (option) => {
    setIsMenuOpen(false);
    if (option === "profile") {
      window.location.href = "/user-profile";
    } else if (option === "orders") {
      window.location.href = "/user-orders";
    } else if (option === "logout") {
      localStorage.removeItem("usuarioActual");
      setCurrentUser(null);
      window.location.href = "/";
    }
  };

  return (
    <PharmacyContextProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex flex-col w-screen items-center mt-0">
          {/* Ajuste del header */}
          <header className="bg-fuchsia-900 text-white p-8 flex justify-between items-center w-full absolute top-0 left-0 z-50">
            <div className="flex items-center">
              <Link to="/">
                {/* Cambiar tamaño del logo */}
                <img src={logo} alt="Logo de la Empresa" className="w-32 mb-4 md:mb-0 ml-[65px]" />
              </Link>
            </div>
            <div className="relative">
              <button
                onClick={handleUserButton}
                className="text-black bg-green-500 rounded-2xl px-4 py-1 hover:bg-yellow-400 motion-safe:hover:scale-110 transform transition-transform duration-300"
              >
                {currentUser ? `Hola ${currentUser.name_}` : 'Iniciar Sesión'}
              </button>
              {isMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-48 bg-blue-500 border border-gray-300 rounded-lg shadow-lg z-50">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-blue-700 cursor-pointer rounded-lg"
                      onClick={() => handleMenuOption("profile")}
                    >
                      Ver Perfil
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-blue-700 cursor-pointer rounded-lg"
                      onClick={() => handleMenuOption("orders")}
                    >
                      Historial de Ordenes
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-blue-700 cursor-pointer rounded-lg"
                      onClick={() => handleMenuOption("logout")}
                    >
                      Cerrar Sesión
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </header>

          {/* Ajustar el espacio para el contenido para que el header no se sobreponga */}
          <main className="flex-grow container w-screen p-4 pt-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ver_usuarios" element={<VerUsuarios />} />
              <Route path="/ver_ordenes" element={<VerOrdenes />} />
              <Route path="/cargar-receta" element={<UploadComponent />} />
              <Route path="/seguimiento-pedido" element={<SeguimientoPedido />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login_g" element={<LoginGeneral />} />
              <Route path="/register" element={<Register />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/user-orders" element={<HistorialOrdenes />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/notifications" element={<Notificaciones />} />
              <Route path="/prescriptions" element={<Recetas />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-200 text-center p-4 w-screen mt-0">
            <div className="flex flex-col md:flex-row justify-around items-center mt-2">
              <div>
                <img src={logofooter} alt="Hospital Infantil" className="w-32 mx-auto mb-4 md:mb-0 ml-1" />
                <p>Avenida Alejandro von Humboldt 11431 y<br></br> Garita de Otay,22430 Tijuana, Baja <br></br>California</p>
              </div>

              <div>
                <h3 className="font-semibold mt-[3px]">Sobre Nosotros</h3>
                <p>Misión, Visión y Valores</p>
                <p>Historia Hospital</p>
                <p>Noticias</p>
                <p>Más información</p>
              </div>

              <div>
                <h3 className="font-semibold mt-[3px]">Contacto</h3>
                <p>664-973-7735</p>
                <p>664-979-7797</p>
                <p>ext. 603-417</p>
              </div>

              <div>
                <h3 className="font-semibold mt-[3px]">Redes Sociales</h3>
                <div className="flex justify-center space-x-3 mt-3">
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <img src={insta} alt="Instagram" className="h-6 w-6" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <img src={fa} alt="Facebook" className="h-6 w-6" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <img src={twitter} alt="Twitter" className="h-6 w-6" />
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <img src={youtube} alt="Website" className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 text-center p-4 w-full mt-4 mb-0">
                <p>&copy; 2024 Farmacia Online. Todos los derechos reservados.</p>
              </div>
          </footer>
        </div>
      </Router>
    </PharmacyContextProvider>
  );
};
export default App;