import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
// traemos el ícono de usuario de lucide-react
import { User } from 'lucide-react';

const NotificationsPanel = ({ userId, onClose, refreshKey }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/notifications/${userId}`
        );
        setNotifications(data);
      } catch (err) {
        console.error('Error al cargar notificaciones:', err);
      }
    };
    fetchNotifications();
  }, [userId, refreshKey]);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:3000/notifications/read/${id}`
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  return (
    <div className="w-[400px] absolute z-50 right-0 h-auto max-h-[80vh] overflow-x-hidden overflow-y-auto transform transition ease-in-out duration-700 bg-gray-50 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold text-gray-800">Notificaciones</p>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg width={24} height={24} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        {notifications.length === 0
          ? <p className="text-gray-500">No tienes notificaciones.</p>
          : notifications.map(note => (
            <div
              key={note.notification_id}
              onClick={() => markAsRead(note.notification_id)}
              className={`w-full p-3 bg-white rounded flex shadow cursor-pointer ${note.is_read ? 'opacity-50' : ''}`}
            >
              <div className="w-8 h-8 border rounded-full border-gray-200 flex items-center justify-center">
                {/* Aquí va el ícono de usuario */}
                <User size={16} className="text-gray-500" />
              </div>
              <div className="pl-3">
                <p className="text-sm text-black">{note.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

NotificationsPanel.propTypes = {
  userId:     PropTypes.number.isRequired,
  onClose:    PropTypes.func.isRequired,
  refreshKey: PropTypes.number.isRequired,
};

export default NotificationsPanel;
