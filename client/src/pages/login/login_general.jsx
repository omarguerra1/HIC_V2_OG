import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../images/logo1.png";

const API_URL = "http://localhost:3000/user"; 

const LoginGeneral = () => {
  const navigate = useNavigate();
  const [matricula, setMatricula] = useState("");
  const [activeButton, setActiveButton] = useState("general");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log(res.data);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  const handleChange = (e) => {
    setMatricula(e.target.value);
  };

  const loginGeneral = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        password: matricula,
        rol: "general",
      });

      if (response.status === 200) {
        localStorage.setItem("usuarioActual", JSON.stringify(response.data.user));
        alert("Login exitoso");
        navigate("/", { replace: true });
      }
    } catch (error) {
      alert("Matrícula incorrecta");
      console.error(error);
    }
  };

  const handleTypeOfUser = () => {
    setActiveButton((prev) => (prev === "general" ? "admin" : "general"));
    navigate(activeButton === "general" ? "/login" : "/login_g");
  };

  return (
    <div className="login-form max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 mb-4">
      <h2 className="text-2xl font-bold mb-4 mt-4">Iniciar Sesión</h2>
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Usuario" className="w-24 h-24" />
      </div>
      <div className="double-button-container flex justify-center mb-4">
        <label htmlFor="tipoUsuario" className="text-black py-2 mr-2">Tipo de usuario:</label>
        <button
          id="tipoUsuario"
          onClick={handleTypeOfUser}
          className={`px-4 py-2 rounded-lg ${activeButton === "general" ? "bg-blue-500 text-white rounded-full px-3" : "bg-gray-300 text-black rounded-full px-3"}`}
        >
          {activeButton === "general" ? "General" : "Administrador"}
        </button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); loginGeneral(); }} className="space-y-4">
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Matrícula</label>
          <input
            id="password"
            type="password"
            value={matricula}
            onChange={handleChange}
            placeholder="Ingrese su matrícula"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-blue-500 bg-gray-200 text-black"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
          Ingresar
        </button>
      </form>
      <button onClick={() => navigate("/register")} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition">
        Regístrate
      </button>
    </div>
  );
};

export default LoginGeneral;