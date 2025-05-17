
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../images/logo1.png'
const URI = 'http://localhost:3000/user';

const Login = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [user, setUsers] = useState([]);
    const [activeButton, setActiveButton] = useState("admin");

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const res = await axios.get(URI);
            setUsers(res.data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    const loginAdmin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/user/login', {
                email: correo,
                password: contraseña,
                rol: "admin"
            });

            if (response.status === 200) {
                const currentUser = response.data.user;
                localStorage.setItem("usuarioActual", JSON.stringify(currentUser));
                alert("Login exitoso");
                navigate("/", { replace: true });
                window.location.reload();
            }
        } catch (error) {
            alert("Correo o contraseña incorrectos");
            console.error(error);
        }
    };

    //const navigateRegister = () => navigate("/register");
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
        <div className="flex flex-col items-center justify-center flex-grow p-4">
            <div className="bg-white rounded-lg shadow-md p-10 w-full max-w-md mt-6">
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
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        loginAdmin();
                    }}
                    className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Correo Electrónico</label>
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="correo@gmail.com"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-300 text-black" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Contraseña</label>
                        <div className="relative">
                            <input
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                type="password"
                                name="password"
                                id="password"
                                placeholder="*********"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-black focus:border-blue-500 bg-gray-200 text-black" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            Recordarme
                        </label>
                        <a href="#" className="text-blue-500 hover:underline">¿Olvidaste tu contraseña?</a>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition">
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
