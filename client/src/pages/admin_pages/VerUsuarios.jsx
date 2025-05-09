import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/user/";

const VerUsuarios = () => {
  const [state, setState] = useState({
    users: [],
    page: 1,
    totalPages: 1,
    search: "",
    foundUser: null,
    userMsgOpen: false,
    isRegistering: false,
    formData: { username: "", email: "", password: "", password2: "" },
  });

  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, [state.page]);

  const getUsers = async () => {
    try {
      const response = await axios.get(API_BASE_URL, { params: { page: state.page } });
      setState((prev) => ({ ...prev, users: response.data.users, totalPages: response.data.totalPages }));
    } catch (error) {
      alert("No se pudo obtener la información de los usuarios");
      console.warn("Error al obtener usuarios:", error);
    }
  };

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [e.target.name]: e.target.value },
    }));
  };

  const registerAdmin = async () => {
    const { username, email, password, password2 } = state.formData;

    if (password !== password2) {
      alert("Las contraseñas deben coincidir");
      return;
    }

    if (password.length > 15) {
      alert("Contraseña de máximo 15 caracteres");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}register`, {
        name_: username,
        email,
        password_: password,
        matricula: "default",
        role: "hic_admin",
      });

      if (response.data.success) {
        alert("Usuario creado exitosamente");
        setState((prev) => ({ ...prev, isRegistering: false }));
      }
    } catch (error) {
      alert("Creación de usuario fallida");
      console.error("Error al crear usuario:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const foundUser = state.users.find((user) => user.user_id.toString() === state.search);
    if (foundUser) {
      setState((prev) => ({ ...prev, foundUser, userMsgOpen: true }));
    } else {
      alert("No se encontró un usuario con ese ID");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold mb-8">Lista de Usuarios en el Sistema</h2>

      <form onSubmit={handleSearch} className="mb-4">
        <label htmlFor="search">Buscar por ID:</label>
        <input
          id="search"
          type="text"
          name="search"
          value={state.search}
          onChange={handleChange}
          placeholder="Ingrese una ID de usuario"
          className="p-2 border border-gray-300 rounded-md bg-white"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-md">
          Buscar
        </button>
      </form>

      <div className="py-3">
        <button onClick={() => setState((prev) => ({ ...prev, isRegistering: true }))} className="ml-2 p-2 bg-blue-500 text-white rounded-md">
          Registrar Nuevo Administrador
        </button>
      </div>

      <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
        {state.users.map((user) => (
          <li key={user.user_id} className="border-b last:border-0 p-2">
            <p><strong>ID:</strong> {user.user_id}</p>
            <p><strong>Tipo de usuario:</strong> {user.role}</p>
            <p><strong>Nombre:</strong> {user.name_}</p>
            <p><strong>Correo Electrónico:</strong> {user.email}</p>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-4">
        <button onClick={() => setState((prev) => ({ ...prev, page: Math.max(prev.page - 1, 1) }))} disabled={state.page === 1} className="p-2 bg-blue-500 rounded-md mx-2 hover:bg-blue-700">
          Anterior
        </button>
        <span className="py-2">Página {state.page} de {state.totalPages}</span>
        <button onClick={() => setState((prev) => ({ ...prev, page: Math.min(prev.page + 1, state.totalPages) }))} disabled={state.page === state.totalPages} className="p-2 bg-blue-500 rounded-md mx-2 hover:bg-blue-700">
          Siguiente
        </button>
      </div>

      {state.isRegistering && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex justify-center">
          <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto my-64">
            <button onClick={() => setState((prev) => ({ ...prev, isRegistering: false }))} className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white">
              X
            </button>
            <form onSubmit={(e) => { e.preventDefault(); registerAdmin(); }}>
              <h2 className="text-2xl font-bold mb-4">Registro de Administrador</h2>
              {["username", "email", "password", "password2"].map((field) => (
                <input
                  key={field}
                  type={field.includes("password") ? "password" : "text"}
                  name={field}
                  placeholder={`Ingrese ${field}`}
                  value={state.formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white my-1 text-black"
                />
              ))}
              <input type="submit" className="btn-register w-full bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition my-2" value="Registrar Administrador" />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerUsuarios;