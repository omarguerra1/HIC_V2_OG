

import PropTypes from 'prop-types'; 

const ResetMatricula = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative w-max">
                <button onClick={onClose} className="bg-red-600 absolute top-1 right-1 text-xl font-bold text-white hover:text-white">&times;</button>
                <h2 className="text-2xl font-bold mb-2">¿Has olvidado tu matrícula?</h2>
                <p className="text-blue-600 font-semibold mb-4 cursor-pointer">Restablece tu matrícula</p>
                <p className="mb-4">Ingresa tu dirección de correo electrónico a continuación si olvidaste tu matrícula</p>
                <form onSubmit={(e) => { e.preventDefault(); /* Aquí lógica de envío */ onClose(); }}>
                    <label className="block mb-2 text-sm font-semibold">Correo electrónico</label>
                    <input
                        type="email"
                        className="bg-slate-400 w-full p-2 mb-4 border border-gray-300 rounded text-black placeholder-black"
                        placeholder="ejemplo@gmail.com"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
                        Restablecer matrícula
                    </button>
                </form>
            </div>
        </div>
    );
};


ResetMatricula.propTypes = {
    onClose: PropTypes.func.isRequired
};

export default ResetMatricula;
