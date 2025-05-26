import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  //const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("usuarioActual"));
    if (user) setCurrentUser(user);
  }, []);

  const handleChange = (e) => {
    setCurrentUser((prevUser) => ({ ...prevUser, [e.target.name]: e.target.value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/user/update/${currentUser.user_id}`, currentUser);
      sessionStorage.setItem("usuarioActual", JSON.stringify(response.data.user));
      alert("Datos de usuario actualizados.");
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      alert("Error al actualizar datos de usuario.");
    }
  };

  if (!currentUser) {
    return <p className="text-center mt-6">Cargando perfil de usuario...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
      <form className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="role" className="font-semibold">Tipo de usuario:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={currentUser.role}
            readOnly
            className="border border-gray-300 p-2 rounded bg-white text-black"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="name_" className="font-semibold">Nombre:</label>
          <input
            type="text"
            id="name_"
            name="name_"
            value={currentUser.name_}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded bg-white text-black"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="font-semibold">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={currentUser.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded bg-white text-black"
          />
        </div>

        {currentUser.role === "hic_admin" ? (
          <div className="flex flex-col">
            <label htmlFor="password_" className="font-semibold">Contraseña:</label>
            <input
              type="password"
              id="password_"
              name="password_"
              value={currentUser.password_}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded bg-white text-black"
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <label htmlFor="matricula" className="font-semibold">Matrícula:</label>
            <input
              type="text"
              id="matricula"
              name="matricula"
              value={currentUser.matricula}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded bg-white text-black"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleSaveChanges}
          className="w-full bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default UserProfile;