import React from 'react';

interface PopupProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

//exit
const Popup: React.FC<PopupProps> = ({open, onClose, children, className = ''}) => {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-xl shadow-lg relative animate-fade-in ${className}`}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Popup;
