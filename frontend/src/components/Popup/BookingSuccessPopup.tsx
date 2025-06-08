import React from 'react';
import Popup from './Popup';
import greenCheckIcon from '../../assets/icons/green-check.svg';
import calendarIcon from '../../assets/icons/calendar.svg';
import userIcon from '../../assets/icons/home.svg'; 
import clockIcon from '../../assets/icons/yellow-clock.svg';
import noteIcon from '../../assets/icons/notification.svg'; 

interface BookingSuccessPopupProps {
  open: boolean;
  onClose: () => void;
  doctor: string;
  date: string;
  time: string;
  note: string;
  onGoHome?: () => void;
  onViewHistory?: () => void;
  onBookNew?: () => void;
}

const BookingSuccessPopup: React.FC<BookingSuccessPopupProps> = ({
  open,
  onClose,
  doctor,
  date,
  time,
  note,
  onGoHome,
  onViewHistory,
  onBookNew,
}) => {
  if (!open) return null;
  return (
    <Popup open={open} onClose={onClose} className="w-full max-w-md p-8">
      <div className="flex flex-col items-center gap-2">
        <img src={greenCheckIcon} alt="success" className="w-10 h-10 mb-1" />
        <div className="text-2xl font-bold text-green-600 mb-2">BOOKING SUCCESSFUL</div>
        <div className="w-full flex flex-col gap-2 text-gray-700 text-[15px] mt-2 mb-2">
          <div className="flex items-center gap-2">
            <img src={userIcon} alt="doctor" className="w-5 h-5 text-blue-500" />
            <span>Doctor: <span className="font-semibold text-gray-900">{doctor}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <img src={calendarIcon} alt="date" className="w-5 h-5 text-blue-500" />
            <span>Date: <span className="font-semibold text-gray-900">{date}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <img src={clockIcon} alt="time" className="w-5 h-5 text-purple-500" />
            <span>Time: <span className="font-semibold text-gray-900">{time}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <img src={noteIcon} alt="note" className="w-5 h-5 text-green-500" />
            <span>Note: <span className="font-semibold text-gray-900">{note}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-pink-600 text-sm mt-2">
          <span className="text-lg">•</span>
          <span>Please arrive on time and prepare the necessary information.</span>
        </div>
        <div className="flex items-center gap-2 text-blue-600 text-sm mt-1">
          <span className="text-lg">•</span>
          <span>A confirmation email has been sent to you.</span>
        </div>
        <div className="flex gap-2 mt-6 w-full">
          <button
            className="flex-1 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
            onClick={onGoHome}
          >Go to Home</button>
          <button
            className="flex-1 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            onClick={onViewHistory}
          >
            <span className="inline-flex items-center gap-1">
              <img src={calendarIcon} alt="history" className="w-4 h-4" /> View History
            </span>
          </button>
          <button
            className="flex-1 px-4 py-2 rounded bg-pink-400 hover:bg-pink-500 text-white font-semibold"
            onClick={onBookNew}
          >+ Book New</button>
        </div>
      </div>
    </Popup>
  );
};

export default BookingSuccessPopup;
