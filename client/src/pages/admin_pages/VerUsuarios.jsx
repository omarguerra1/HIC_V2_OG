import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios"; 

const VerUsuarios = () => {

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [userMsgOpen, setUserMsg] = useState(false);
  const [isRegistering, setRegister] = useState(false);

  //Nuevos datos de registro
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();

  useEffect( () => {
    getUsers();
  }, [page]);

  const getUsers = async () => {
    try{
      const response = await axios.get("http://localhost:3000/user/", {
        params: {page} 
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch(error){
      alert("No se pudo obtener la informacion de los usuarios");
      console.log("Error al obtener usuarios");
    }
  };

  const handleRegisterButton = () => {
    setRegister(true);
  };

  const registerAdmin = async() => {
    if(password != password2){
      alert("La contraseña debe coincidir");
      return;
    }
    if(password.length > 15){
      alert("Contraseña de maximo 15 caracteres");
      return;
    }
    try{
      const response = await axios.post('http://localhost:3000/user/register', {
          name_: username,
          email: email,
          password_: password,
          matricula: "default",
          role: "hic_admin"
      });
      if (response.data.success){
          alert("Usuario creado exitosamente");
      }
    } catch(error){
      alert("Creacion de usuario fallida");
      console.error("Error durante creación de usuario: ", error);
    }
    setRegister(false);
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if(search){
      const foundUser = users.find(user => user.user_id.toString() === search);
      if(foundUser){
        setFoundUser(foundUser);
        setUserMsg(true);
      } else{
        alert("No se encontro un usuario con ese ID");
        setFoundUser(null);
      }
    } else{
      alert("Ingrese un ID para buscar");
      setFoundUser(null);
    }
  };

  const handleUserMsg = () => {
    setUserMsg(false);
  };

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-3xl font-bold mb-8">Lista de Usuarios en el Sistema</h2>

        <form onSubmit={handleSearch}
          className="mb-4">
            <input
              type="text"
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Ingrese una ID de usuario"
              className="p-2 border border-gray-300 rounded-md bg-white">
            </input>
            <button
              type="submit"
              className="ml-2 p-2 bg-blue-500 text-white, rounded-md">
              Buscar
            </button>
        </form>

        <div className="py-3">
          <button
            onClick={handleRegisterButton}
            className="ml-2 p-2 bg-blue-500 text-white, rounded-md">
            Registrar Nuevo Administrador
          </button>
        </div>

        <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
          {users.map((user) => (
            <li key={user.user_id} className="border-b last:border-0 p-2">
                <p><strong>ID: </strong>{user.user_id}</p>
                <p><strong>Tipo de usuario: </strong>{user.role}</p>
                <p><strong>Nombre: </strong>{user.name_}</p>
                <p><strong>Correo Electronico: </strong>{user.email}</p>
            </li>
          ))}
        </ul>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
            disabled={page === 1}
            className="p-2 bg-blue-500 rounded-md mx-2 hover:bg-blue-700" >
            Anterior
          </button>
          <span className="py-2">Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage(prevPage => Math.max(prevPage + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 bg-blue-500 rounded-md mx-2 hover:bg-blue-700" >
            Siguiente
          </button>
        </div>

        {userMsgOpen && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
          <div className="relative top-1/4 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white"> 
            <button 
              onClick={handleUserMsg} 
              className="absolute top-0 right-0 m-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Aceptar
            </button> 
            {foundUser && ( 
              <div> 
                <h3 className="text-xl font-bold mb-4">
                  Detalles del Usuario:
                </h3> 
                <p><strong>ID: </strong> {foundUser.user_id}</p> 
                <p><strong>Tipo de usuario: </strong> {foundUser.role}</p> 
                <p><strong>Nombre: </strong> {foundUser.name_}</p> 
                <p><strong>Correo Electronico: </strong> {foundUser.email}</p> 
              </div> )} 
            </div> 
          </div>
      )}

        {isRegistering && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto flex justify-center">
          <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto h-auto max-h-screen my-64">
            <button
              onClick={ () => setRegister(false) }
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white">
              X
            </button>
            <form onSubmit={(e) => {
                e.preventDefault();
                registerAdmin();
            }}>
                <h2 className="text-2xl font-bold mb-4">Registro de Administrador</h2>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text" name="nombreUsuario" id="nombreUsuario" placeholder="Ingrese su nombre" 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white my-1 text-black"/>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email" name="correo" id="correo" placeholder="Ingrese su correo electronico"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500  my-1 bg-white text-black"/>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="text" name="matricula" id="matricula" placeholder="Ingrese una contraseña"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 my-1 bg-white text-black"/>
                <input
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    type="text" name="matricula2" id="matricula2" placeholder="Ingrese la contraseña de nuevo, debe coincidir"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500 bg-white text-black my-1"/>
                <input type="submit" className="btn-register w-full bg-blue-500 text-white py-2 px-2 rounded-md hover:bg-blue-600 transition my-2" value="Registrar Administrador" />
            </form>
          </div>
          </div>
        )}

      </div>
    );
  };
  
  export default VerUsuarios;