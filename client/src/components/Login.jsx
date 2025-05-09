import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://100.26.48.45:3001/users";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      console.log("Login exitoso:", response.data);
      // Manejar redireccionamiento o almacenamiento de tokens aquí
    } catch (error) {
      console.error("Error al iniciar sesión:", error.response?.data || error);
    }
  };

  return (
    <div className="login-container flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="password">Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Iniciar Sesión
        </button>

        <div className="text-center mt-4">
          <Link to="/sign-up" className="text-blue-500 hover:underline">Crear nueva cuenta</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;