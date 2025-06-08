import React from 'react';
import Popup from './Popup';
import greenCheckIcon from '../../assets/icons/green-check.svg';

interface SuccessPopupProps {
  open: boolean;
  onClose: () => void;
  message?: string;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ open, onClose, message = 'Successfully!' }) => {
  if (!open) return null;
  return (
    <Popup open={open} onClose={onClose} className="w-full max-w-xs p-8">
      <div className="flex flex-col items-center gap-2">
        <img src={greenCheckIcon} alt="success" className="w-12 h-12 mb-2" />
        <div className="text-xl font-bold text-green-600 mb-2">{message}</div>
      </div>
    </Popup>
  );
};

export default SuccessPopup;
