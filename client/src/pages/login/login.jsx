import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../images/logo1.png';
import closeEye from '../../images/eye_close.png';
import openEye from '../../images/eye_no_close.jpg';

const API_URL = "http://localhost:3000/user";

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    correo: "",
    contraseña: "",
    activeButton: "admin",
    showPassword: false,
    users: [],
  });

  useEffect(() => {
    getUsers();
    const currentUser = JSON.parse(localStorage.getItem("usuarioActual"));
    if (currentUser) navigate("/", { replace: true });
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      setState((prev) => ({ ...prev, users: res.data }));
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loginAdmin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: state.correo,
        password: state.contraseña,
        rol: "admin",
      });

      if (response.status === 200) {
        localStorage.setItem("usuarioActual", JSON.stringify(response.data.user));
        alert("Login exitoso");
        navigate("/", { replace: true });
      }
    } catch (error) {
      alert("Correo o contraseña incorrectos");
      console.error(error);
    }
  };

  const handleTypeOfUser = () => {
    const newRole = state.activeButton === "general" ? "admin" : "general";
    setState((prev) => ({ ...prev, activeButton: newRole }));
    navigate(newRole === "admin" ? "/login" : "/login_g");
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4">
      <div className="bg-white rounded-lg shadow-md p-10 w-full max-w-md mt-6">
        <h2 className="text-2xl font-bold mb-4 mt-4">Iniciar Sesión</h2>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Usuario" className="w-24 h-24" />
        </div>
        <div className="double-button-container flex justify-center mb-4">
          <label htmlFor="userType" className="text-black py-2 mr-2">Tipo de usuario:</label>
          <button
            id="userType"
            onClick={handleTypeOfUser}
            className={`px-4 py-2 rounded-lg ${state.activeButton === 'general' ? 'bg-blue-500 text-white rounded-full px-3' : 'bg-gray-300 text-black rounded-full px-3'}`}
          >
            {state.activeButton === "general" ? "General" : "Administrador"}
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); loginAdmin(); }} className="space-y-4">
          <div>
            <label htmlFor="correo" className="block mb-1 text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              id="correo"
              type="email"
              name="correo"
              value={state.correo}
              onChange={handleChange}
              placeholder="correo@gmail.com"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-300 text-black"
            />
          </div>
          <div>
            <label htmlFor="contraseña" className="block mb-1 text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                id="contraseña"
                name="contraseña"
                value={state.contraseña}
                onChange={handleChange}
                type={state.showPassword ? "text" : "password"}
                placeholder="*********"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-blue-500 bg-gray-200 text-black"
              />
              <button
                type="button"
                onClick={() => setState((prev) => ({ ...prev, showPassword: !prev.showPassword }))}
                className="absolute right-2 top-2 cursor-pointer"
              >
                <img src={state.showPassword ? openEye : closeEye} alt="Mostrar/ocultar contraseña" className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Recordarme
            </label>
            <a href="#" className="text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;