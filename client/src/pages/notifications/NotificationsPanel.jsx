import PropTypes from 'prop-types';

const NotificationsPanel = ({ onClose }) => (
  <div className="w-[400px] absolute z-50 right-0 h-auto max-h-[80vh] overflow-x-hidden overflow-y-auto transform transition ease-in-out duration-700 bg-gray-50 rounded-lg shadow-lg p-6">
    <div className="flex items-center justify-between">
      <p className="text-2xl font-semibold text-gray-800">Notificaciones</p>
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
        <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>

    {/* Notificaciones individuales */}
    <div className="w-full p-3 mt-6 bg-white rounded flex shadow">
      <div className="w-8 h-8 border rounded-full border-gray-200 flex items-center justify-center">
        {/* Icono dentro */}
        <svg width={16} height={16} fill="#EF4444" viewBox="0 0 16 16">
          <path d="M8.00059 3.01934C9.56659 1.61334 11.9866 1.66 13.4953 3.17134C15.0033 4.68334 15.0553 7.09133 13.6526 8.662L7.99926 14.3233L2.34726 8.662C0.944589 7.09133 0.997256 4.67934 2.50459 3.17134C4.01459 1.662 6.42992 1.61134 8.00059 3.01934Z" />
        </svg>
      </div>
      <div className="pl-3">
        <p className="text-sm text-black">
          <span className="text-indigo-700">James Doe</span> marcó como favorito un <span className="text-indigo-700">elemento</span>
        </p>
        <p className="text-xs text-gray-500">hace 2 horas</p>
      </div>
    </div>

    {/* Repite más bloques similares para otras notificaciones */}
  </div>
);

NotificationsPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default NotificationsPanel
