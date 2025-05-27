import "./App.css";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './images/LogoOficial.png';
import logofooter from './images/LogoOficial.png'
import insta from './images/instagram.png'
import fa from './images/facebook.png'
import twitter from './images/gorjeo.png'
import youtube from './images/youtube.png'
import socket from './socketClient.js' //modulo singleton
import axios from 'axios';
//Shared pages
import UserProfile from "./pages/user_profile/user_profile.jsx"
import HomePage from './pages/home/HomePage.jsx';
import Messages from "./pages/messages/messages.jsx";

//General user pages
import HistorialPagos from "./pages/historial_ordenes/historial_ordenes.jsx";
import Register from "./pages/register/registrar_usuario_general.jsx" //Importacion de pagina de registro
import LoginGeneral from "./pages/login/login_general.jsx" //Login para usuarios generales
import SeguimientoPedido from './pages/order_tracking/SeguimientoPedido.jsx';
import UploadComponent from "./pages/request_order/UploadComponent.jsx";
import NotificationsPanel from "./pages/notifications/NotificationsPanel.jsx";
//Admin pages
import Login from "./pages/login/login"; // Login para administradores
import VerUsuarios from "./pages/admin_pages/VerUsuarios.jsx"
import VerOrdenes from "./pages/admin_pages/VerOrdenes.jsx"
import Recetas from "./pages/recetas/recetas.jsx"
import CardPaymentForm from "./pages/payment/pagos.jsx";


const App = () => {

  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0); //counter de notificaciones
  useEffect(() => {
    const raw = sessionStorage.getItem("usuarioActual");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        if (u.user_id) {
          setCurrentUser(u);
        }
      } catch {
        // JSON inválido: borramos para evitar bucles
        sessionStorage.removeItem("usuarioActual");
      }
    }
  }, []);
  // en cada cambio de user o refreshKey recargamos count
  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/notifications/${currentUser.user_id}`);
        setUnreadCount(data.filter(n => !n.is_read).length);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [currentUser, refreshKey]);
  useEffect(() => {
    if (!currentUser) return;
    socket.connect();
    // Mensajes
    socket.emit("userLoggedIn", currentUser.user_id, currentUser.role);
    socket.on("unseenMessages", (message) => {
      alert(message);
    });
    if (currentUser.role === "hic_admin") {
      socket.on("new-prescription", () => {
        setRefreshKey(k => k + 1);
      });
      socket.on("new-order", () => {
        setRefreshKey(k => k + 1);
      });
      socket.on("order-paid", () => {
        setRefreshKey(k => k + 1);
      });
    }

    // —— GENERAL —— escuchan estos eventos
    if (currentUser.role === "general") {
      socket.on("prescription-updated", ({userId }) => {
        if (userId === currentUser.user_id) {
          setRefreshKey(k => k + 1);
        }
      });
      socket.on("order-ready-to-pay", () => {
        setRefreshKey(k => k + 1);
      });
      socket.on("order-state-changed", () => {
        setRefreshKey(k => k + 1);
      });
    }
    return () => {
      //limpiar los handlers
      // Limpiar todos los handlers
      socket.off("unseenMessages");
      socket.off("new-prescription");
      socket.off("new-order");
      socket.off("order-paid");
      socket.off("prescription-updated");
      socket.off("order-ready-to-pay");
      socket.off("order-state-changed");
      socket.disconnect();
    };
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
    } else if (option === "logout") {
      sessionStorage.removeItem("usuarioActual");
      setCurrentUser(null);
      window.location.href = "/";
    }
  };
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        {/* Ajuste del header */}
        <header className="bg-fuchsia-900 text-white py-4 px-4 sm:py-8 sm:px-8 flex justify-between items-center w-full relative z-50">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-24 sm:w-32" />
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(v => !v)}
              className="relative bg-black p-2 rounded-full hover:bg-gray-800 transition"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 
             14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 
             10-4 0v1.341C8.67 6.165 8 7.388 8 
             8.75v5.408c0 .538-.214 1.055-.595 
             1.437L6 17h5m4 0v1a3 3 0 
             01-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={handleUserButton}
              className="bg-fuchsia-500 text-white rounded-2xl px-4 py-1 hover:bg-fuchsia-600 transition"
            >
              {currentUser
                ? `Hola ${currentUser.name_ ?? "usuario"}`
                : "Iniciar Sesión"
              }
            </button>
          </div>

          {showNotifications && currentUser?.user_id && (
            <div className="absolute top-28 right-0 z-50">
              <NotificationsPanel
                userId={currentUser.user_id}
                onClose={() => setShowNotifications(false)}
                refreshKey={refreshKey}
              />
            </div>
          )}
          {isMenuOpen && currentUser && (
            <div className="absolute top-16 right-0 mt-1 w-48 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-lg shadow-lg overflow-hidden border border-gray-200 z-50">
              <div className="flex items-center px-4 py-3 border-b border-black">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-3 font-semibold text-white">
                  {currentUser.name_}
                </span>
              </div>
              <ul>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                  onClick={() => handleMenuOption('profile')}
                >
                  <svg
                    className="w-5 h-5 mr-2 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.121 17.804A13.937 13.937 0 0112 
                 15c2.967 0 5.69 1 7.879 2.804M12 
                 3a4 4 0 110 8 4 4 0 010-8z"
                    />
                  </svg>
                  Ver Perfil
                </li>
                <li
                  className="flex items-center px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                  onClick={() => handleMenuOption('logout')}
                >
                  <svg
                    className="w-5 h-5 mr-2 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 
                 4v1a3 3 0 01-6 0v-1m6 0H9"
                    />
                  </svg>
                  Cerrar Sesión
                </li>
              </ul>
            </div>
          )}
        </header>
        {/* Ajustar el espacio para el contenido para que el header no se sobreponga */}
        <main className="flex-grow container w-screen p-4 flex items-center justify-center">
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
            <Route path="/user-pagos" element={<HistorialPagos />} />
            <Route path="/messages" element={<Messages />} />
            {/*<Route path="/notifications" element={<Notificaciones />} /> */}
            <Route path="/prescriptions" element={<Recetas />} />
            <Route path="/pagar/:orderId" element={<CardPaymentForm />} />
          </Routes>
        </main>
        {/* Footer */}
        <footer className="bg-gray-200 text-center px-4 w-screen">
          <div className="flex flex-col items-center md:flex-row md:justify-around md:items-start mt-8 space-y-6 md:space-y-0">

            <div className="flex flex-col items-center text-center">
              <img src={logofooter} alt="Hospital Infantil" className="w-32 mb-4" />
              <p className="font-semibold text-fuchsia-900">Avenida Alejandro von Humboldt 11431 y<br />
                Garita de Otay, 22430 Tijuana, Baja<br />
                California
              </p>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-bold mb-2 text-black">Sobre Nosotros</h3>
              <p className="font-semibold text-fuchsia-900">Misión, Visión y Valores</p>
              <p className="font-semibold text-fuchsia-900">Historia Hospital</p>
              <p className="font-semibold text-fuchsia-900">Noticias</p>
              <p className="font-semibold text-fuchsia-900">Más información</p>
            </div>

            <div className="text-center md:text-left">
              <h3 className="font-bold text-black mb-2">Contacto</h3>
              <p className="font-semibold text-fuchsia-900">973 7756</p>
              <p className="font-semibold text-fuchsia-900">973 7757</p>
              <p className="font-semibold text-fuchsia-900">ext. 404 y 417</p>
            </div>

            <div className="text-left">
              <h3 className="font-bold text-black mb-2">Redes Sociales</h3>
              <div className="flex justify-start space-x-3 mt-3">
                <a href="https://www.instagram.com/hicoficial/" target="_blank" rel="noopener noreferrer">
                  <img src={insta} alt="Instagram" className="h-6 w-6" />
                </a>
                <a href="https://www.facebook.com/hicoficial/" target="_blank" rel="noopener noreferrer">
                  <img src={fa} alt="Facebook" className="h-6 w-6" />
                </a>
                <a href="https://x.com/hicoficial" target="_blank" rel="noopener noreferrer">
                  <img src={twitter} alt="Twitter" className="h-6 w-6" />
                </a>
                <a href="https://www.youtube.com/user/HICoficial/" target="_blank" rel="noopener noreferrer">
                  <img src={youtube} alt="Website" className="h-6 w-6" />
                </a>
              </div>
            </div>

          </div>

          <div className="text-center mt-8">
            <p>&copy; 2025 Hospital Infantil de las Californias. Todos los derechos reservados.</p>
          </div>
        </footer>

      </div>
    </Router>
  );
};
export default App;
