import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    nombreUsuario: "",
    correo: "",
    userMatricula: "",
    userMatricula2: "",
  });

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const registerGeneralUser = async () => {
    if (state.userMatricula !== state.userMatricula2) {
      alert("Las matrículas deben coincidir, intente de nuevo.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/user/register", {
        name_: state.nombreUsuario,
        email: state.correo,
        password_: "default",
        matricula: state.userMatricula,
        role: "general",
      });

      if (response.data.success) {
        alert("Usuario creado exitosamente.");
        navigate("/login_g");
      } else {
        alert("Error al crear usuario. Por favor, intente de nuevo.");
      }
    } catch (error) {
      alert("Creación de usuario fallida.");
      console.error("Error durante creación de usuario:", error);
    }
  };

  return (
    <div className="login-form max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 justify-center w-96"> Registro de Usuario </h2>
      <form onSubmit={(e) => { e.preventDefault(); registerGeneralUser(); }}>
        <div className="mb-2">
          <label htmlFor="nombreUsuario" className="block text-sm font-medium text-gray-700">Nombre completo*</label>
          <input
            type="text"
            id="nombreUsuario"
            name="nombreUsuario"
            value={state.nombreUsuario}
            onChange={handleChange}
            placeholder="Ingrese su nombre"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white text-black"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo electrónico (opcional)</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={state.correo}
            onChange={handleChange}
            placeholder="Ingrese su correo"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white text-black"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">Matrícula*</label>
          <input
            type="text"
            id="matricula"
            name="userMatricula"
            value={state.userMatricula}
            onChange={handleChange}
            placeholder="Ingrese una matrícula"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white text-black"
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="matricula2" className="block text-sm font-medium text-gray-700">Confirmar Matrícula*</label>
          <input
            type="text"
            id="matricula2"
            name="userMatricula2"
            value={state.userMatricula2}
            onChange={handleChange}
            placeholder="Ingrese la matrícula de nuevo, debe coincidir"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white text-black"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition my-2">
          Registrar Usuario
        </button>
      </form>
    </div>
  );
};

export default Register;