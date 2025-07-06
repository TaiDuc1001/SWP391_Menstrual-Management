import React, { useEffect, useState } from 'react';

interface SuccessNotificationProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    duration?: number; // Auto close after duration (ms)
}

const SuccessNotification: React.FC<SuccessNotificationProps> = ({
    isOpen,
    onClose,
    title,
    message,
    duration = 5000
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            
            if (duration > 0) {
                const timer = setTimeout(() => {
                    handleClose();
                }, duration);
                
                return () => clearTimeout(timer);
            }
        }
    }, [isOpen, duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for animation to complete
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-20" 
                onClick={handleClose}
            />
            
            {/* Notification */}
            <div className={`relative bg-white rounded-lg shadow-lg border-l-4 border-green-500 max-w-md w-full transform transition-all duration-300 ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'
            }`}>
                {/* Header */}
                <div className="flex items-start p-4">
                    <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    
                    <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                            {title}
                        </h3>
                        <div className="mt-1 text-sm text-gray-600">
                            {message}
                        </div>
                    </div>
                    
                    <button
                        onClick={handleClose}
                        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                {/* Progress bar */}
                {duration > 0 && (
                    <div className="h-1 bg-gray-200">
                        <div 
                            className="h-full bg-green-500 transition-all ease-linear animate-shrink"
                            style={{ 
                                animationDuration: `${duration}ms`,
                                animationFillMode: 'forwards'
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuccessNotification;
