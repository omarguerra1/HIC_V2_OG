import React, { useState, useEffect } from "react";
import axios from "axios";

const Recetas = () => {

    const [prescriptions, setPrescriptions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [preMsgOpen, setPreMsg] = useState(false);
    const [foundPrescription, setFoundPrescription] = useState(null);
    const [imgPath, setImgPath] = useState("");
    const basePath = "http://localhost:3000/server";

    //Detalles de nuevo medicamento
    const [medicines, setMedicines] = useState([])
    const [medName, setMedName] = useState("");
    const [medDosis, setMedDosis] = useState("");
    const [medFreq, setMedFreq] = useState("");
    const [medCount, setMedCount] = useState(0);

    useEffect( () => {
        getPrescriptions();
    }, [page]);

    const getPrescriptions = async() => {
        try{
            const response = await axios.get("http://localhost:3000/prescriptions/get_prescriptions", {
              params: {page} 
            });
            const presWithNames = await Promise.all(response.data.prescriptions.map(async (p) => {
              const patientDetails = await getPatientName(p.user_id);
              return {...p, patient_name: patientDetails ? patientDetails.user.name_ : "Desconocido"};
            }));
            setPrescriptions(presWithNames);
            setTotalPages(response.data.totalPages);
          } catch(error){
            alert("No se pudo obtener la informacion de las recetas");
            console.log("Error al obtener ordenes");
          }
    };

    const handleSearch = () => {

    }

    const handleCreateOrder = async() => {
        try{
            const response = await axios.post("http://localhost:3000/order/order", {
                user_id: foundPrescription.user_id,
                prescription_id: foundPrescription.prescription_id,
            });
            if(response.data.success){
                alert("Orden Creada");
            }
        } catch(error){
            alert("No se pudo crear la orden");
        }
    }

    const handleSaveMed = async() => {
        try{
            if(medCount > 5){
                alert("No se pueden añadir mas medicamentos a esta receta, máximo 5");
                return;
            }
            const response = await axios.post("http://localhost:3000/medicines/new_med", {
                nombre: medName,
                dosis: medDosis,
                frecuencia: medFreq,
                flavor: foundPrescription.flavor,
                prescription_id: foundPrescription.prescription_id,
            });
            if(response.data.success){
                alert("Medicamento añadido a la receta");
                setMedCount(medCount + 1);
                setMedicines([...medicines, response.data.medicamento]);
                //medicines.append(response.data.medicamento)
            }
        } catch(error){
            alert("Error al añadir el medicamento");
        }
    }

    const handleAddMed = () => {
        if( medName != "" && medDosis != "" && medFreq != ""){
            handleSaveMed();
        }
        setMedName("");
        setMedDosis("");
        setMedFreq("");
    }

    const handlePreMsg = () => {
        setPreMsg(false);
      };

    const handleUpdatePre = (preID) => {
        const foundPrescription = prescriptions.find(p => p.prescription_id === preID);
        if(foundPrescription){
          setFoundPrescription(foundPrescription);
          setImgPath(`${basePath}${foundPrescription.image_url}`);
          setPreMsg(true);
        }
      };

    const getPatientName = async (userId) => {
        try{
          const response = await axios.get(`http://localhost:3000/user/get_user/${userId}`);
          return response.data;
        } catch(error){
          console.error("Error al obtener nombre de usuario");
          return null;
        }
      };

      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-3xl font-bold mb-8">Lista de Recetas en el Sistema</h2>
  
          <form onSubmit={handleSearch}
            className="mb-4">
              <input
                type="text"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                placeholder="Ingrese una ID de receta"
                className="p-2 border border-gray-300 rounded-md bg-white">
              </input>
              <button
                type="submit"
                className="ml-2 p-2 bg-blue-500 text-white rounded-md">
                Buscar
              </button>
          </form>
  
          <ul className="w-full max-w-md bg-white shadow-md rounded-lg p-4">
            {prescriptions.map((p) => (
              <li key={p.prescription_id} className="border-b last:border-0 p-2">
                  <p><strong>ID: </strong>{p.prescription_id}</p>
                  <p><strong>Paciente: </strong>{p.patient_name}</p>
                  <p><strong>Sabor: </strong>{p.flavor}</p>
                  <p><strong>Fecha de receta: </strong>{p.upload_date}</p>
                  <button
                    onClick={ () => handleUpdatePre(p.prescription_id) }
                    className="ml-4 p-2 my-1 bg-green-600 text-white rounded-md hover:bg-green-800 transition">
                    Ver Receta
                  </button>
              </li>
            ))}
          </ul>
  
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))}
              disabled={page === 1}
              className="p-2 bg-blue-500 hover:bg-blue-700 rounded-md mx-2" >
              Anterior
            </button>
            <span className="py-2">Página {page} de {totalPages}</span>
            <button
              onClick={() => setPage(prevPage => Math.max(prevPage + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 bg-blue-500 hover:bg-blue-700 rounded-md mx-2" >
              Siguiente
            </button>
          </div>

          {preMsgOpen && (
            <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'>
                <div className="relative top-1/4 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white"> 
                    <button 
                        onClick={handlePreMsg} 
                        className="absolute top-0 right-0 m-3 bg-red-500 text-white rounded-md hover:bg-red-700 transition">
                        X
                    </button> 
                    {foundPrescription && ( 
                    <div> 
                        <h2 className="text-xl font-bold mb-4">
                            Detalles de la Receta:
                        </h2>
                        <img 
                            src={`http://localhost:3000${foundPrescription.image_url}`} 
                            alt="Receta médica" 
                            className="w-75 h-75 mx-auto mb-4 object-contain"
                        />
                        <h3>Agrega los detalles de los medicamentos (Máximo 5 medicamentos):</h3>
                        <p className="my-2">
                            <strong>Nombre de Medicamento: </strong>
                            <input
                                type="text"
                                value={medName}
                                onChange={ (e) => setMedName(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md bg-white">
                            </input>
                        </p>
                        <p><strong>Sabor: </strong>{foundPrescription.flavor}</p>
                        <p className="my-2">
                            <strong>Dosis de Medicamento: </strong>
                            <input
                                type="text"
                                value={medDosis}
                                onChange={ (e) => setMedDosis(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md bg-white">
                            </input>
                        </p>
                        <p className="my-2">
                            <strong>Frecuencia de Medicamento: </strong>
                            <input
                                type="text"
                                value={medFreq}
                                onChange={ (e) => setMedFreq(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md bg-white">
                            </input>
                        </p>
                        <div>
                            <button
                                onClick={ () => handleSaveMed() }
                                className="mt-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition mx-2">
                                Guardar Medicamento
                            </button>
                            <button
                                onClick={ () => handleAddMed() }
                                className="mt-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition">
                                Añadir Otro Medicamento
                            </button>
                        </div>
                        <button
                            onClick={ () => handleCreateOrder() }
                            className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition">
                            Terminar y Crear Orden
                        </button>
                </div> 
                )} 
                </div> 
          </div>
      )}
        </div>
      );
    };

  export default Recetas;