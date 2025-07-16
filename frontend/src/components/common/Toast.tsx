import React, { useEffect } from 'react';
import '../../styles/components/toast.css';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 2000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    if (!isVisible) return null;

    return (
        <div className="toast-container">
            <div className="toast-message">
                {message}
            </div>
        </div>
    );
};

export default Toast;

