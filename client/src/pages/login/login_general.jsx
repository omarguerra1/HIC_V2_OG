import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../images/logo1.png'
import ResetMatricula from "./ResetMatricula";
const URI = 'http://localhost:3000/user';  // Ruta del backend

const LoginGeneral = () => {

    const navigate = useNavigate();
    const [matricula, setMatricula] = useState('');
    const [setUsers] = useState([]);
    const [activeButton, setActiveButton] = useState("general");
    const [showModal, setShowModal] = useState(false);

    const navigateRegister = () => {
        navigate(`/register`);
    }

    useEffect(() => {
        getUsers();
    })

    const getUsers = async () => {
        try {
            const res = await axios.get(URI);  // Solicitar usuarios
            console.log(res.data);
            setUsers(res.data);  // Actualizar usuarios en el estado
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };
    const loginGeneral = async () => {
        try {
            const response = await axios.post('http://localhost:3000/user/login', {
                password: matricula,
                rol: "general"
            });
            if (response.status === 200) {
                const currentUser = response.data.user;
                localStorage.setItem("usuarioActual", JSON.stringify(currentUser));
                alert("Login exitoso");
            }
        } catch (error) {
            alert("Matricula incorrecta");
            console.error(error);
        }
        navigate("/", { replace: true });
        window.location.reload("/");
    };

    const handleTypeOfUser = () => {
        if (activeButton === "general") {
            setActiveButton("admin");
            navigate("/login");
        } else if (activeButton === "admin") {
            setActiveButton("general");
            navigate("/login_g");
        }
    };

    return (
        
        <div className="login-form mx-auto w-full px-4 sm:px-6 md:w-3/4 md:max-w-lg lg:w-2/5 xl:w-1/3 2xl:w-1/2 bg-white shadow-lg rounded-lg p-6 mt-10 mb-4">
            <h2 className="text-2xl font-bold mb-4 mt-4">Iniciar Sesión</h2>
            <div className="flex justify-center mb-6">
                <img src={logo} alt="Usuario" className="w-24 h-24" />
            </div>
            <div className="double-button-container flex justify-center mb-4">
                <label className="text-black py-2 mr-2">Tipo de usuario:</label>
                <button
                    onClick={handleTypeOfUser}
                    className={`px-4 py-2 rounded-lg ${activeButton === 'general' ? 'bg-blue-500 text-white rounded-full px-3' : 'bg-gray-300 text-black rounded-full px-3'}`}
                >
                    {activeButton === "general" ? "General" : "Administrador"}
                </button>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                loginGeneral();  // Llamar a la función loginGeneral
            }} className="space-y-4">
                <div className="">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Matricula</label>
                    <input
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}

                        type="password"
                        name="password"
                        id="password"
                        placeholder="Ingrese su matricula"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-blue-500 bg-gray-200 text-black"
                    />
                </div>
                {/* Nueva línea de ¿Olvidaste tu matrícula? */}
                <div className="text-right mt-1">
                    <button type="button" onClick={() => setShowModal(true)} className="bg-white text-sm text-blue-600 hover:underline">
                        ¿Olvidaste tu matrícula?
                    </button>
                </div>
                <div className="mt-4"></div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
                    Ingresar
                </button>
            </form>
            <button
                onClick={navigateRegister}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition">
                Regístrate
            </button>
            {showModal && <ResetMatricula onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default LoginGeneral;