import React, {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const URI = "http://100.26.48.45:3001/users/";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [users, setUsers] = useState([]);
    const [rol, setRol] = useState("general");
    const navigate = useNavigate();
    const navLogin = () => {
        navigate("/login");
    }
    const navRegister = () => {
        navigate("/sign-up");
    }

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async() => {
        const res = await axios.get(URI)
        setUsers(res.data)
    }

    const regUser = async (e) => {
        e.preventDefault();
        await axios.post(URI, {name_:username, email:email, password_:password, matricula:"123456", role:rol});
        navLogin();
    }

    return (
        <div className="login-container flex items-center justify-center">
            <form onSubmit={regUser} action="/auth" method="post" className="bg-white p-6 rounded shadow-md w-80">
                <h2 className="text-2xl font-bold mb-4">Crear nueva cuenta</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre de usuario:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => users.find(event => event.username === e.target.value) ? navRegister():setUsername(e.target.value)}
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
                <div className="mb-4">
                    <label className="block text-gray-700">Correo electronico:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                        className="block w-full mt-1 p-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
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