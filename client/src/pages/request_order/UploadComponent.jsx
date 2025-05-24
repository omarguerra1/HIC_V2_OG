import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ProgressBar from './ProgressBar';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ----- sabores -----
  const [medCount, setMedCount] = useState(1);
  const [flavors, setFlavors] = useState([]);
  const availableFlavors = [
    "Fresa", "Uva", "Plátano", "Mango",
    "Piña", "Chicle Rosa", "Chicle Azul", "Grosella"
  ];

  // ----- cuestionario -----
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [peso, setPeso] = useState("");
  const [fechaDeNacimiento, setFechaDeNacimiento] = useState("");
  const [padecimiento, setPadecimiento] = useState("");
  const [intoleranciaLactosa, setIntoleranciaLactosa] = useState("");
  const [tieneFoto, setTieneFoto] = useState("");
  const [cuestionarioRespondido, setCuestionarioRespondido] = useState(false);
  const [mensajeError , setMensajeError] = useState("");

  // Usuario
  const [currentUser, setCurrentUser] = useState(null);

  // Inicializa usuario y array de sabores cuando cambia medCount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuarioActual"));
    setCurrentUser(user);
    setFlavors(Array(medCount).fill(""));
  }, [medCount]);

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
      setErrorMessage("Formato no soportado. Sólo JPEG o PNG.");
      setFile(null);
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage("Archivo demasiado grande. Máx 10MB.");
      setFile(null);
      return;
    }

    setErrorMessage("");
    setFile(selectedFile);
    setImageUrl(URL.createObjectURL(selectedFile));
  };

  const validarFormulario = () => {
    if (!nombreCompleto || !peso || !fechaDeNacimiento || !padecimiento || !intoleranciaLactosa) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Complete todos los campos del cuestionario.",
        confirmButtonColor: "#ef4444"
      });
      return;
    }
    setMensajeError("");
    setCuestionarioRespondido(true);
  };

  const handleFlavorChange = (index, value) => {
    setFlavors(prev => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setProgress(0);
    setFile(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    // validación de sabores
    if (flavors.some(f => !f)) {
      alert("Seleccione un sabor para cada medicamento.");
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('user_id', currentUser.user_id);
    formData.append('nombre_completo', nombreCompleto);
    formData.append('peso', peso);
    formData.append('fecha_de_nacimiento', fechaDeNacimiento);
    formData.append('padecimiento', padecimiento);
    formData.append('i_lactosa', intoleranciaLactosa);
    formData.append('flavor', JSON.stringify(flavors));

    try {
      setIsUploading(true);
      const response = await axios.post(
        'http://localhost:3000/prescriptions',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: e => {
            setProgress(Math.round((e.loaded * 100) / e.total));
          }
        }
      );

      if (response.status === 201) {
        alert(
          `Receta creada (ID: ${response.data.prescription.prescription_id}).\n` +
          `El administrador añadirá los nombres de medicamento luego.`
        );
        setSuccess(true);
        setImageUrl(`http://localhost:3000${response.data.prescription.image_url}`);
      } else {
        alert("Error al procesar la receta.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al subir la receta.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ← Regresar como en Historial de Pagos */}
      <button
        onClick={() => window.history.back()}
        className="mb-4 px-4 py-2 bg-gray-300 text-black rounded flex items-center"
      >
        <span className="mr-2">←</span> Regresar
      </button>
      <div className="flex gap-6">
        {/* Columna Cuestionario */}
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">¿Tiene la foto de su receta?</h2>
          <select
            value={tieneFoto}
            onChange={e => {
              setTieneFoto(e.target.value);
              setCuestionarioRespondido(false);
            }}
            className="w-full p-2 border rounded-lg mb-4 bg-gray-300 text-black font-semibold"
          >
            <option value="" disabled>Seleccione una opción</option>
            <option>Sí</option>
            <option>No</option>
          </select>

          {tieneFoto === 'Sí' && !cuestionarioRespondido && (
            <>
              <h3 className="text-xl mb-3 font-bold">Cuestionario</h3>
              {/* Nombre completo */}
              <div className="mb-4 ">
                <label className="block text-sm font-semibold">Nombre completo</label>
                <input
                  type="text"
                  value={nombreCompleto}
                  onChange={e => setNombreCompleto(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-300 text-black font-semibold"
                />
              </div>
              {/* Peso */}
              <div className="mb-4">
                <label className="block text-sm font-semibold">Peso (kg)</label>
                <input
                  type="number"
                  value={peso}
                  onChange={e => setPeso(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-300 text-black font-semibold"
                />
              </div>
              {/* Fecha de nacimiento */}
              <div className="mb-4">
                <label className="block text-sm font-semibold">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={fechaDeNacimiento}
                  onChange={e => setFechaDeNacimiento(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-300 text-black font-semibold"
                />
              </div>
              {/* Padecimiento */}
              <div className="mb-4">
                <label className="block text-sm font-semibold">Diagnóstico o padecimiento</label>
                <input
                  type="text"
                  value={padecimiento}
                  onChange={e => setPadecimiento(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-300 text-black font-semibold"
                />
              </div>
              {/* Intolerancia */}
              <div className="mb-4">
                <label className="block text-sm font-semibold">¿Intolerante a lactosa?</label>
                <select
                  value={intoleranciaLactosa}
                  onChange={e => setIntoleranciaLactosa(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-gray-300 text-black font-semibold"
                >
                  <option value="">Seleccione</option>
                  <option>No</option>
                  <option>Sí</option>
                </select>
              </div>

              <button
                onClick={validarFormulario}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-lg mt-4 hover:bg-green-700"
              >
                Enviar cuestionario
              </button>
            </>
          )}
        </div>

        {/* Columna Subida y Sabores */}
        <div className={`
      flex-1 bg-white shadow-lg rounded-lg p-6
      ${!cuestionarioRespondido ? 'opacity-50 pointer-events-none blur-sm' : ''}
    `}>
          <h2 className="text-2xl font-bold mb-4">Cargar Receta Médica</h2>
          <label htmlFor="fileInput" className="block text-sm font-medium text-gray-700 mb-2">
            Selecciona una imagen:
          </label>
          {/* Archivo */}
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
          file:bg-blue-600 file:text-white
          hover:file:bg-black"/>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="mr-2" size={20} />
              {errorMessage}
            </div>
          )}
          {/* Preview */}
          {imageUrl && (
            <div className="mb-4">
              <img src={imageUrl} alt="Receta" className="w-full rounded-lg border p-2" />
              <button onClick={handleRemoveImage} className="mt-2 text-red-500">
                Eliminar Imagen
              </button>
            </div>
          )}
          {/* Cantidad de meds */}
          <div className="mb-4">
            <label className="block mb-1">Cantidad de medicamentos</label>
            <input
              type="number"
              min="1"
              max="10"
              value={medCount}
              onChange={e => setMedCount(Number(e.target.value))}
              className="w-full p-2 border rounded-lg bg-gray-300"
            />
          </div>
          {/* Select sabores */}
          {flavors.map((flavor, i) => (
            <div key={i} className="mb-4">
              <label className="block mb-1">
                Sabor para medicamento {i + 1}
              </label>
              <select
                value={flavor}
                onChange={e => handleFlavorChange(i, e.target.value)}
                className="w-full p-2 border rounded-lg bg-gray-300"
              >
                <option value="">Seleccione un sabor</option>
                {availableFlavors.map((f, idx) => (
                  <option key={idx} value={f}>{f}</option>
                ))}
              </select>
            </div>
          ))}
          {/* Botón subir */}
          <div className="mt-6">
            <button onClick={handleUpload} disabled={isUploading || !file} className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isUploading || !file ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  <Upload className="mr-2" size={20} />
                  Subir Imagen
                </>
              )}
            </button>
          </div>
          {/* Progress & éxito */}
          {progress > 0 && <ProgressBar progress={progress} />}
          {success && (
            <div className="mt-4 flex items-center p-3 bg-green-100 text-green-700 rounded-lg">
              <CheckCircle className="mr-2 animate-bounce" size={24} />
              Receta cargada con éxito.
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default UploadComponent;
