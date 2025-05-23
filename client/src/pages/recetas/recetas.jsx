import React, { useState, useEffect } from "react";
import axios from "axios";

const Recetas = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [preMsgOpen, setPreMsg] = useState(false);
  const [foundPrescription, setFoundPrescription] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState([]);
  const [bubbleOpen, setBubbleOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // <p><strong>Peso:</strong> {selectedPatient.flavors.join(", ")}</p>

  // Arrays paralelos para captura
  const [medNames, setMedNames] = useState([]);
  const [medDosages, setMedDosages] = useState([]);
  const [medFreqs, setMedFreqs] = useState([]);

  // Helper que recibe un objeto con `flavor` (string o array) y devuelve array
  const normalizeFlavors = p => {
    let arr = [];
    if (Array.isArray(p.flavor)) arr = p.flavor;
    else if (typeof p.flavor === "string") {
      try { arr = JSON.parse(p.flavor); }
      catch { arr = [p.flavor]; }
    }
    return arr;
  };

  useEffect(() => {
    getPrescriptions();
  }, [page]);

  const getPrescriptions = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/prescriptions/get_prescriptions",
        { params: { page } }
      );
      const presWithNames = await Promise.all(
        data.prescriptions.map(async p => {
          // parseamos sabores
          const flavors = normalizeFlavors(p);
          // traemos nombre de paciente
          const user = await axios.get(
            `http://localhost:3000/user/get_user/${p.user_id}`
          );
          return {
            ...p,
            flavors,
            patient_name: user.data.user.name_ || "Desconocido"
          };
        })
      );
      setPrescriptions(presWithNames);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
      alert("No se pudo obtener la información de las recetas");
    }
  };

  const openModalWithPrescription = pres => {
    const flavors = normalizeFlavors(pres);
    setFoundPrescription({ ...pres, flavors });
    // inicializamos paralelos
    setMedNames(Array(flavors.length).fill(""));
    setMedDosages(Array(flavors.length).fill(""));
    setMedFreqs(Array(flavors.length).fill(""));
    setPreMsg(true);
  };

  const handleSearch = async e => {
    e.preventDefault();
    try {
      const { data: pres } = await axios.get(
        `http://localhost:3000/prescriptions/${search}`
      );
      openModalWithPrescription(pres);
    } catch {
      alert("Receta no encontrada");
    }
  };

  const handleUpdatePre = id => {
    const pres = prescriptions.find(p => p.prescription_id === id);
    if (pres) openModalWithPrescription(pres);
  };

  // Handlers de inputs
  const handleNameChange = (i, v) => {
    setMedNames(c => { c[i] = v; return [...c]; });
  };
  const handleDosageChange = (i, v) => {
    setMedDosages(c => { c[i] = v; return [...c]; });
  };
  const handleFreqChange = (i, v) => {
    setMedFreqs(c => { c[i] = v; return [...c]; });
  };

  // Guarda y crea orden
  const handleSaveAndOrder = async () => {
    if (!foundPrescription) return;
    const n = foundPrescription.flavors.length;
    // validación
    for (let i = 0; i < n; i++) {
      if (!medNames[i] || !medDosages[i] || !medFreqs[i]) {
        alert("Complete todos los campos de cada medicamento");
        return;
      }
    }
    try {
      // 1) meds
      for (let i = 0; i < n; i++) {
        await axios.post("http://localhost:3000/medicines/new_med", {
          prescription_id: foundPrescription.prescription_id,
          flavor: foundPrescription.flavors[i],
          nombre: medNames[i],
          dosis: medDosages[i],
          frecuencia: medFreqs[i],
        });
      }
      // 2) orden
      const { data } = await axios.post("http://localhost:3000/order/order", {
        user_id: foundPrescription.user_id,
        prescription_id: foundPrescription.prescription_id,
      });
      if (data.success) {
        alert("¡Orden creada exitosamente!");
        setPreMsg(false);
      }
    } catch {
      alert("Error al guardar medicamentos o crear la orden");
    }
  };

  const handleShowForm = async () => {
    setShowForm(prevState => !prevState);  // ✅ Alterna correctamente el estado

    if (!showForm) {  // ✅ Solo carga los datos cuando el formulario se abre
      try {
        const response = await axios.get("http://localhost:3000/prescriptions/get_prescriptions");
        console.log("Datos recibidos:", response.data);
        setFormData(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error al obtener respuestas:", error);
      }
    }
  };

  // bloquea scroll de body cuando el modal está abierto
  useEffect(() => {
    console.log("Ejecutando useEffect...");
    document.body.style.overflow = preMsgOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [preMsgOpen])
  return (
    <div className={`flex flex-col items-center p-6 ${preMsgOpen ? 'overflow-hidden h-screen' : ''}`}>
      <h2 className="text-3xl font-bold mb-6">Recetas en el Sistema</h2>

      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ID de receta"
          className="p-2 border rounded-md mr-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
          Buscar
        </button>
      </form>

      <ul className="w-full max-w-2xl bg-white shadow rounded-md p-4 mb-4">
        {prescriptions.map(p => (
          <li
            key={p.prescription_id}
            className="border-b last:border-0 p-2 flex justify-between items-center"
          >
            <div>
              <p><strong>ID:</strong> {p.prescription_id}</p>
              <p><strong>Paciente:</strong> {p.patient_name}</p>
              <p><strong>Sabores:</strong> {(p.flavors || []).join(", ")}</p>
              <p><strong>Fecha:</strong> {p.upload_date}</p>
            </div>
            <button
              onClick={() => handleUpdatePre(p.prescription_id)}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-800"
            >
              Ver / Editar
            </button>
          </li>
        ))}
      </ul>

      {preMsgOpen && foundPrescription && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-40 overflow-auto">
          <div className="bg-white rounded-md shadow-lg w-1/2 mx-auto mt-48 max-h-[90vh] p-6 relative overflow-y-auto">
            <button
              onClick={() => setPreMsg(false)}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full px-3 py-1 hover:bg-red-700"
            >
              X
            </button>

            <h2 className="text-xl font-bold mb-4">Actualice los medicamentos</h2>
            <img
              src={`http://localhost:3000${foundPrescription.image_url}`}
              alt="Receta"
              className="w-full h-64 object-contain mb-4"
            />

            {foundPrescription.flavors.map((sabor, i) => (
              <div key={i} className="mb-4 border-b pb-4">
                <p className="mb-2">
                  <strong>Sabor {i + 1}:</strong> {sabor}
                </p>
                <input
                  type="text"
                  placeholder={`Nombre medicamento ${i + 1}`}
                  value={medNames[i]}
                  onChange={e => handleNameChange(i, e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  type="text"
                  placeholder="Dosis"
                  value={medDosages[i]}
                  onChange={e => handleDosageChange(i, e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  type="text"
                  placeholder="Frecuencia"
                  value={medFreqs[i]}
                  onChange={e => handleFreqChange(i, e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            ))}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleSaveAndOrder}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
              >
                Terminar y Crear Orden
              </button>
              <button
                onClick={() => setPreMsg(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setBubbleOpen(true);
                  setSelectedPatient(foundPrescription);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:bg-purple-700 transition">
                <span>Ver Datos del Paciente</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M2 4v16h20V4H2zm10 2h8v2h-8V6zm0 4h8v2h-8v-2zM4 6h6v6H4V6zm0 8h6v2H4v-2zm10 2h8v2h-8v-2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {bubbleOpen && selectedPatient && (
        <div className="fixed bottom-10 right-10 bg-white shadow-lg rounded-lg p-4 w-64 flex flex-col items-start">
          <button
            onClick={() => setBubbleOpen(false)}
            className="self-end bg-red-500 text-white rounded-full px-3 py-1 hover:bg-red-700">
            X
          </button>
          <h2 className="text-lg font-bold mb-2">Datos del Paciente</h2>
          <p><strong>Prescripcion:</strong> {selectedPatient.prescription_id}</p>
          <p><strong>Nombre:</strong> {selectedPatient.nombre_completo}</p>
          <p><strong>Fecha:</strong> {selectedPatient.fecha_de_nacimiento}</p>
          <p><strong>Peso:</strong> {selectedPatient.padecimiento}</p>
          <p><strong>Intolerante:</strong> {selectedPatient.i_lactosa}</p>
        </div>
      )}

      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Recetas;
