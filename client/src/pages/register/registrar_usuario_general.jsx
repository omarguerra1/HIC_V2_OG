import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

const Register = () =>{

    const navigate = useNavigate();
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [userMatricula, setMatricula] = useState("");
    const [userMatricula2, setMatricula2] = useState("");

    const registerGeneralUser = async() => {
        if(userMatricula != userMatricula2){
            alert("Las matriculas deben coincidir, intente de nuevo");
            return;
        }
        try{
            const response = await axios.post('http://localhost:3000/user/register', {
                name_: nombreUsuario,
                email: correo,
                password_: "default",
                matricula: userMatricula,
                role: "general"
            });
            if (response.data.success){
                alert("Usuario creado exitosamente");
            }
        } catch(error){
            alert("Creacion de usuario fallida");
            console.error("Error durante creación de usuario: ", error);
        }
        navigate("/login_g");
    };

    return (
        <div className="login-form max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                registerGeneralUser();
            }}>
                <input
                    value={nombreUsuario}
                    onChange={(e) => setNombreUsuario(e.target.value)}
                    type="text" name="nombreUsuario" id="nombreUsuario" placeholder="Ingrese su nombre" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white my-2 text-black"/>
                <input
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    type="email" name="correo" id="correo" placeholder="Ingrese su correo electronico (opcional)"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500  my-1 bg-white text-black"/>
                <input
                    value={userMatricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    type="text" name="matricula" id="matricula" placeholder="Ingrese una matricula"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 my-1 bg-white text-black"/>
                <input
                    value={userMatricula2}
                    onChange={(e) => setMatricula2(e.target.value)}
                    type="text" name="matricula2" id="matricula2" placeholder="Ingrese la matricula de nuevo, debe coincidir"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white text-black"/>
                <input type="submit" className="btn-login w-full bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition my-2" value="Registrar Usuario" />
            </form>
        </div>
    );
};

export default Register;