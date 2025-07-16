import React, {useEffect} from 'react';

interface NotificationPopupProps {
    message: string;
    type: 'success' | 'error';
    isOpen: boolean;
    onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({message, type, isOpen, onClose}) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div
                className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-center min-w-[300px]`}>
                <span className="text-center">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-4 text-white hover:text-gray-200"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default NotificationPopup;

