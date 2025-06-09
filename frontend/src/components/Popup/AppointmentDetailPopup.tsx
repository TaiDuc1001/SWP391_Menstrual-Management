import React from 'react';
import Popup from './Popup';
import calendarIcon from '../../assets/icons/calendar.svg';
import cameraIcon from '../../assets/icons/camera.svg';
import meetingIcon from '../../assets/icons/meeting.svg';
import { Rating } from 'react-simple-star-rating';

interface AppointmentDetailPopupProps {
  open: boolean;
  onClose: () => void;
  appointment: {
    name: string;
    code: string;
    date: string;
    time: string;
    status: string;
    problem: string;
    doctorNote: string;
    rating?: number;
    ratingComment?: string;
  };
}

const AppointmentDetailPopup: React.FC<AppointmentDetailPopupProps> = ({ open, onClose, appointment }) => {
  if (!open) return null;
  return (
    <Popup open={open} onClose={onClose}>
      <div className="p-6 max-w-2xl w-full relative flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
              <span className="w-10 h-10 rounded-full bg-gray-300 block"></span>
            </div>
            <div>
              <div className="text-lg font-semibold">{appointment.name}</div>
              <div className="text-xs text-blue-600 font-medium">ID: {appointment.code}</div>
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-gray-700 transition-colors text-2xl z-30 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full bg-white shadow-md w-10 h-10 flex items-center justify-center"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2">
          <span className="flex items-center gap-1">
            <img src={calendarIcon} alt="calendar" className="w-4 h-4" />
            {appointment.date} - {appointment.time}
          </span>
          <span className="flex items-center gap-1">
            <img src={meetingIcon} alt="type" className="w-4 h-4" />
            <span className="font-medium text-gray-800">Online</span>
          </span>
          <span className="flex items-center gap-1">
            <img src={cameraIcon} alt="meeting" className="w-4 h-4" />
            Location: <a href="https://meet.google.com/iid-ypfx-gdt" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Meet</a>
          </span>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="bg-blue-50 rounded-lg p-4 flex-1 border border-blue-100">
            <div className="font-semibold mb-1 text-blue-700 flex items-center gap-1">
              <i className="fa-regular fa-comment-dots" /> Problem Description
            </div>
            <div className="text-gray-700 text-sm">
              {appointment.problem || 'Recently, I had unprotected sex and experienced itching and burning during urination. I am worried about a possible sexually transmitted infection (STI). I would like advice on symptoms and necessary tests.'}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 flex-1 border border-green-100">
            <div className="font-semibold mb-1 text-green-700 flex items-center gap-1">
              <i className="fa-regular fa-notes-medical" /> Doctor's Note
            </div>
            <div className="text-gray-700 text-sm">
              {appointment.doctorNote || 'Suspected STI – further testing needed. Avoid sexual activity until results are available. Schedule a follow-up in 7 days.'}
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-100">
          <div className="font-semibold mb-1 text-yellow-700 flex items-center gap-1">
            <i className="fa-regular fa-star" /> Consultation Rating
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Rating
              initialValue={appointment.rating || 4}
              size={24}
              allowFraction={true}
              readonly={true}
              SVGstyle={{ display: 'inline' }}
              fillColor="#facc15"
              emptyColor="#d1d5db"
            />
            <span className="text-gray-600 text-sm font-medium">{appointment.rating || '4'} / 5</span>
          </div>
          <div className="text-gray-600 text-sm mb-2">{appointment.ratingComment || 'The doctor gave clear and enthusiastic advice. Scheduling was very convenient.'}</div>
          <a href="#" className="text-blue-600 text-sm underline flex items-center gap-1"><i className="fa-regular fa-paper-plane" />Send new feedback</a>
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <button className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold">Book Again</button>
        </div>
      </div>
    </Popup>
  );
};

export default AppointmentDetailPopup;
