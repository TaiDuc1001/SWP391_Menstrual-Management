import React from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'danger'
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {

        if (e.target === e.currentTarget && type !== 'danger') {
            onCancel();
        }
    };

    const getButtonColors = () => {
        switch (type) {
            case 'danger':
                return 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md';
            case 'warning':
                return 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-md';
            case 'info':
                return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md';
            default:
                return 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md';
        }
    };

    const getHeaderColors = () => {
        switch (type) {
            case 'danger':
                return 'bg-gradient-to-r from-red-50 to-pink-50';
            case 'warning':
                return 'bg-gradient-to-r from-yellow-50 to-orange-50';
            case 'info':
                return 'bg-gradient-to-r from-blue-50 to-indigo-50';
            default:
                return 'bg-gradient-to-r from-red-50 to-pink-50';
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {}
                <div className={`px-6 py-4 border-b border-gray-200 ${getHeaderColors()}`}>
                    <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                </div>
                
                {}
                <div className="p-6">
                    <p className="text-gray-600 leading-relaxed">{message}</p>
                </div>
                
                {}
                <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-6 py-2 rounded-lg transition-colors font-medium ${getButtonColors()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;

