import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://100.26.48.45:3001/users/";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password: "", email: "", rol: "general" });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get(API_URL);
        setUsers(res.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    getUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const regUser = async (e) => {
    e.preventDefault();

    if (users.some(user => user.username === formData.username)) {
      alert("El nombre de usuario ya está registrado. Por favor, elige otro.");
      navigate("/sign-up");
      return;
    }

    try {
      await axios.post(API_URL, { ...formData, matricula: "123456" });
      alert("Cuenta creada exitosamente");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <div className="login-container flex items-center justify-center">
      <form onSubmit={regUser} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Crear nueva cuenta</h2>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="username">Nombre de usuario:</label>
          <input
            id="username"
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
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="email">Correo electrónico:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          Crear cuenta
        </button>
      </form>
    </div>
  );
};

export default Register;