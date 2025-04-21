import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

const URI = 'http://localhost:3000/user';  // Ruta del backend

const LoginGeneral = () => {

    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [matricula, setMatricula] = useState('');
    const [user, setUsers] = useState([]);
    const [activeButton, setActiveButton] = useState("general");

    const navigateRegister = () => {
        navigate(`/register`);
    }

    useEffect(() => {
        getUsers();
    }, [])

    const getUsers = async () => {
        try {
            const res = await axios.get(URI);  // Solicitar usuarios
            console.log(res.data);
            setUsers(res.data);  // Actualizar usuarios en el estado
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    const compare = () => {
        if (user.find(e => e.email === correo && e.password_ === contraseña))
            return true;
        else
            return false;
    };

    const loginUser = async () => {
        try {
            const response = await axios.post('http://localhost:3000/user/login', {
                email: correo,
                password: matricula,
                rol: "general"
            });
            

            if (response.status === 200) {
                const currentUser = response.data.user;
                localStorage.setItem("usuarioActual", JSON.stringify(currentUser));
                alert("Login exitoso");
            }
        } catch (error) {
            alert("Correo o contraseña incorrectos");
            console.error(error);
        }
        navigate("/", {replace: true});
        window.location.reload("/");
    };

    const handleTypeOfUser = () => {
        if(activeButton==="general"){
            setActiveButton("admin");
            navigate("/login");
        } else if(activeButton==="admin"){
            setActiveButton("general");
            navigate("/login_g");
        }
    };

    return (
        <div className="login-form max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
            <div className="double-button-container flex justify-center mb-4">
                <label className="text-black py-2">Tipo de usuario:</label>
                <button
                    onClick={handleTypeOfUser}
                    className={`px-4 py-2 mx-2 ${activeButton === 'general' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                    {activeButton==="general" ? "General" : "Administrador"}
                </button>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                loginUser();  // Llamar a la función loginUser
            }}>
                <input
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    type="email" name="email" id="email" placeholder="Ingrese su correo electrónico" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white my-2 text-black"/>
                <input
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    type="password" name="password" id="password" placeholder="Ingrese su matricula"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white text-black"/>
                <input type="submit" className="btn-login w-full bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition my-2" value="Iniciar Sesión" />
            </form>
            <div className="btn-register w-full bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition" onClick={navigateRegister}>
                Regístrate
            </div>
        </div>
    );
};

export default LoginGeneral;
