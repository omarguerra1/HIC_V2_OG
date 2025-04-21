import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios"; 

const UserProfile = () => {
    //Datos de usuario
    const [currentUser, setCurrentUser] = useState({
        user_id: "",
        role: "",
        name_: "",
        email: "",
        password_: "",
        matricula: ""
    });
    const navigate = useNavigate();
  
    useEffect( () => {
      const user = JSON.parse(localStorage.getItem("usuarioActual"));
      setCurrentUser(user);
    }, [] );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSaveChanges = async() => {
        try{
            const response = await axios.put(`http://localhost:3000/user/update/${currentUser.user_id}`, currentUser);
            localStorage.setItem("usuarioActual", JSON.stringify(response.data.user));
            alert("Datos de usuario actualizados");
        } catch(error){
            console.error("Error al actualizar datos");
            alert("Error al actualizar datos de usuario");
        }
    };

    return(
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 space-y-4">Perfil de Usuario</h2>
            <form className="space-y-4">
                <div className="flex flex-col">
                    <label className="font-semibold">Tipo de usuario:</label>
                    <input
                        type="text"
                        name="role"
                        value={currentUser.role}
                        readOnly
                        className="border border-gray-300 p-2 rounded bg-white text-black">
                    </input>
                </div>
                <div className="flex flex-col">
                <label className="font-semibold">Nombre:</label>
                    <input
                        type="text"
                        name="name_"
                        value={currentUser.name_}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded  bg-white text-black">
                    </input>
                </div>
                <div className="flex flex-col">
                <label className="font-semibold">Correo Electronico:</label>
                    <input
                        type="email"
                        name="email"
                        value={currentUser.email}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded  bg-white text-black">
                    </input>
                </div>
                {currentUser.role === "hic_admin" ? (
                    <div className="flex flex-col">
                    <label className="font-semibold">Contraseña:</label>
                        <input
                        type="text"
                        name="password_"
                        value={currentUser.password_}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded  bg-white text-black">
                        </input>
                    </div>
                    ) : (
                    <div className="flex flex-col">
                    <label className="font-semibold">Matricula:</label>
                        <input
                        type="text"
                        name="matricula"
                        value={currentUser.matricula}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded  bg-white text-black">
                        </input>
                    </div>
                    )}
                    <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="btn-update w-full bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition">
                            Guardar cambios
                    </button>
            </form>
        </div>
        
    );
};

export default UserProfile;