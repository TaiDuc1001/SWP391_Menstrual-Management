import React from 'react';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Popup: React.FC<PopupProps> = ({ open, onClose, children, className = '' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`bg-white rounded-xl shadow-lg relative animate-fade-in ${className}`}>
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          x
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
