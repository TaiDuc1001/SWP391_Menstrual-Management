import React, { createContext, useContext, useState } from 'react';

interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const id = Date.now().toString();
        const newNotification = { ...notification, id };
        
        setNotifications(prev => [...prev, newNotification]);

        const duration = notification.duration || 5000;
        setTimeout(() => {
            removeNotification(id);
        }, duration);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
};

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map(notification => (
                <div
                    key={notification.id}
                    className={`max-w-sm p-4 rounded-lg shadow-lg border-l-4 ${
                        notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
                        notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
                        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                        'bg-blue-50 border-blue-500 text-blue-800'
                    }`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold">{notification.title}</h4>
                            <p className="text-sm mt-1">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

