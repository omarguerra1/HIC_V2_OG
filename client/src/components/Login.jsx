import React, {useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const URI = "http://100.26.48.45:3001/users";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    return (
        <div className="login-container flex items-center justify-center">
            <format className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre de usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full mt-1 p-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className="block w-full mt-1 p-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                >
                    Iniciar Sesión
                </button>
                <div>
                    <Link to="/sign-up" className="text-blue-500 hover:underline py-3">Crear nueva cuenta</Link>
                </div>
            </format>
        </div>
    );

};

export default Login;