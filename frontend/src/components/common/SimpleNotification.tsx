import React from 'react';

export interface SimpleNotificationProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    onClose: () => void;
}

export const SimpleNotification: React.FC<SimpleNotificationProps> = ({ message, type, onClose }) => {
    const bgColor = {
        success: 'bg-green-50 border-green-500 text-green-800',
        error: 'bg-red-50 border-red-500 text-red-800',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
        info: 'bg-blue-50 border-blue-500 text-blue-800'
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-4 right-4 z-50">
            <div className={`max-w-sm p-4 rounded-lg shadow-lg border-l-4 ${bgColor[type]}`}>
                <div className="flex justify-between items-start">
                    <p className="text-sm">{message}</p>
                    <button
                        onClick={onClose}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
};

export const useSimpleNotification = () => {
    const [notification, setNotification] = React.useState<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
    } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        setNotification({ message, type });
    };

    const hideNotification = () => {
        setNotification(null);
    };

    return {
        notification,
        showNotification,
        hideNotification
    };
};
