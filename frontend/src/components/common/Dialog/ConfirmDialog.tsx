import React from 'react';

type ConfirmDialogProps = {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
    type: string;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = () => null;
export default ConfirmDialog;
