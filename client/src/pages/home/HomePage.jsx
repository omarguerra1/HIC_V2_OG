import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Package, Bell, Mail, Clipboard } from 'lucide-react'; //

const HomePage = () => {

  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("usuarioActual"));
    setCurrentUser(user);
  }, []);
  const handleOrderClick = (e) => {
    if (currentUser === null) {
      e.preventDefault();
      alert("Para crear una nueva orden se necesita iniciar sesión");
    } else {
      navigate("/cargar-receta");
    }
  }
  const handleMsgClick = (e) => {
    if (currentUser === null) {
      e.preventDefault();
      alert("Para revisar mensajes se necesita iniciar sesión");
    } else {
      navigate("/messages");
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-full mt-6 mb-6">
      {/* Título */}
      <h2 className="text-3xl sm:text-4xl lg:text-3x1 font-bold mb-8">
        Hospital Infantil de las Californias
      </h2>

      {/* Wrapper que limita ancho en mediano (1366×768) y amplía en ultra-wide */}
      <div className="w-full max-w-screen-lg 2xl:max-w-screen-2xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {(!currentUser || currentUser.role === "general") ? (
            <>
              <Link
                to="/cargar-receta"
                onClick={handleOrderClick}
                className="
                  bg-white shadow-lg rounded-xl
                  p-4 sm:p-6 md:p-8 lg:p-10 2xl:p-12
                  w-full
                  flex flex-col items-center justify-center
                  space-y-3 sm:space-y-4
                  transition-transform transform hover:scale-105
                "
              >
                <FileText className="
                  text-blue-600
                  w-10 h-10 sm:w-12 sm:h-12
                  md:w-16 md:h-16
                  lg:w-20 lg:h-20
                  2xl:w-24 2xl:h-24
                " />
                <span className="
                  text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl
                  font-semibold
                ">
                  Subir Receta
                </span>
              </Link>

              <Link
                to="/seguimiento-pedido"
                className="
                  bg-white shadow-lg rounded-xl
                  p-4 sm:p-6 md:p-8 lg:p-10 2xl:p-12
                  w-full
                  flex flex-col items-center justify-center
                  space-y-3 sm:space-y-4
                  transition-transform transform hover:scale-105
                "
              >
                <Package className="
                  text-green-600
                  w-10 h-10 sm:w-12 sm:h-12
                  md:w-16 md:h-16
                  lg:w-20 lg:h-20
                  2xl:w-24 2xl:h-24
                " />
                <span className="
                  text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl
                  font-semibold
                ">
                  Seguimiento de Pedido
                </span>
              </Link>

              <Link
                to="/user-pagos"
                className="
                  bg-white shadow-lg rounded-xl
                  p-4 sm:p-6 md:p-8 lg:p-10 2xl:p-12
                  w-full
                  flex flex-col items-center justify-center
                  space-y-3 sm:space-y-4
                  transition-transform transform hover:scale-105
                "
              >
                <Bell className="
                  text-red-600
                  w-10 h-10 sm:w-12 sm:h-12
                  md:w-16 md:h-16
                  lg:w-20 lg:h-20
                  2xl:w-24 2xl:h-24
                " />
                <span className="
                  text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl
                  font-semibold
                ">
                  Historial de Pagos
                </span>
              </Link>

              <Link
                to="/messages"
                onClick={handleMsgClick}
                className="
                  bg-white shadow-lg rounded-xl
                  p-4 sm:p-6 md:p-8 lg:p-10 2xl:p-12
                  w-full
                  flex flex-col items-center justify-center
                  space-y-3 sm:space-y-4
                  transition-transform transform hover:scale-105
                "
              >
                <Mail className="
                  text-yellow-600
                  w-10 h-10 sm:w-12 sm:h-12
                  md:w-16 md:h-16
                  lg:w-20 lg:h-20
                  2xl:w-24 2xl:h-24
                " />
                <span className="
                  text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl
                  font-semibold
                ">
                  Mensajes
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/prescriptions"
                className="
                  bg-white shadow-lg rounded-xl
                  p-4 sm:p-6 md:p-8 lg:p-10 2xl:p-12
                  w-full
                  flex flex-col items-center justify-center
                  space-y-3 sm:space-y-4
                  transition-transform transform hover:scale-105
                "
              >
                <Clipboard className="
                  text-purple-600
                  w-10 h-10 sm:w-12 sm:h-12
                  md:w-16 md:h-16
                  lg:w-20 lg:h-20
                  2xl:w-24 2xl:h-24
                " />
                <span className="
                  text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl
                  font-semibold
                ">
                  Recetas
                </span>
              </Link>

              <Link
                to="/ver_ordenes"
                className="
                  bg-white shadow-lg rounded-xl
                  p-4 sm:p-6 md:p-8 lg:p-10 2xl:p-12
                  w-full
                  flex flex-col	items-center justify-center
                  space-y-3 sm:space-y-4
                  transition-transform transform hover:scale-105
                "
              >
                <Package className="
                  text-green-600
                  w-10 h-10 sm:w-12 sm:h-12
                  md:w-16 md:h-16
                  lg:w-20 lg:h-20
                  2xl:w-24 2xl:h-24
                " />
                <span className="
                  text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl
                  font-semibold
                ">
                  Ver Ordenes
                </span>
              </Link>

              <Link
                to="/messages"
                className="
                  bg-white shadow-lg rounded-xl
                  p-4 sm:p-6 md:p-8 lg:p-10 2xl:p-12
                  w-full
                  flex flex-col	items-center justify-center
                  space-y-3 sm:space-y-4
                  transition-transform transform hover:scale-105
                "
              >
                <Mail className="
                  text-yellow-600
                  w-10 h-10 sm:w-12 sm:h-12
                  md:w-16 md:h-16
                  lg:w-20 lg:h-20
                  2xl:w-24 2xl:h-24
                " />
                <span className="
                  text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl
                  font-semibold
                ">
                  Mensajes
                </span>
              </Link>

              <Link
                to="/ver_usuarios"
                onClick={handleOrderClick}
                className="
                  bg-white shadow-lg rounded-xl
                  p-4 sm:p-6 md:p-8 lg:p-10 2xl:p-12
                  w-full
                  flex flex-col	items-center justify-center
                  space-y-3 sm:space-y-4
                  transition-transform transform hover:scale-105
                "
              >
                <FileText className="
                  text-blue-600
                  w-10 h-10 sm:w-12 sm:h-12
                  md:w-16 md:h-16
                  lg:w-20 lg:h-20
                  2xl:w-24 2xl:h-24
                " />
                <span className="
                  text-base sm:text-lg md:text-xl lg:text-2xl 2xl:text-3xl
                  font-semibold
                ">
                  Ver Usuarios
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );

};
export default HomePage;
