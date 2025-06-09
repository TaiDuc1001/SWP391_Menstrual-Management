import React, { useState } from 'react';
import Popup from '../Popup/Popup';
import Woman from '../../assets/images/Woman.svg';
import pen from '../../assets/icons/pen.svg';

interface MenstrualCyclePopupProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: { startDate: string; duration: number; cycleLength: number }) => void;
}

const MenstrualCyclePopup: React.FC<MenstrualCyclePopupProps> = ({ open, onClose, onSave }) => {
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState(5);
  const [cycleLength, setCycleLength] = useState(28);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave({ startDate, duration, cycleLength });
    onClose();
  };
  return (
    <Popup open={open} onClose={onClose} className="max-w-3xl w-full p-6 relative">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-2xl z-10 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-full bg-white shadow-md w-10 h-10 flex items-center justify-center"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <form onSubmit={handleSubmit} className="flex-1 min-w-[320px]">
          <div className="text-xl font-semibold text-gray-800 mb-8 flex items-center gap-2">
            <span className="inline-block w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center">
              <img src={pen} alt="Pen" className="w-4 h-4" />
            </span>
            Khai Báo Chu Kỳ Kinh
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-medium">Ngày bắt đầu kỳ kinh</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-pink-400 text-base placeholder-gray-400"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              placeholder="mm/dd/yyyy"
              pattern="\\d{4}-\\d{2}-\\d{2}"
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2 font-medium">Số ngày hành kinh</label>
            <input
              type="number"
              min={1}
              max={15}
              className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-pink-400 text-base"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 mb-2 font-medium">Độ dài chu kỳ kinh nguyệt</label>
            <input
              type="number"
              min={20}
              max={40}
              className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-pink-400 text-base"
              value={cycleLength}
              onChange={e => setCycleLength(Number(e.target.value))}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded px-8 py-2 transition-all text-base shadow" style={{minWidth: 140}}>Lưu chu kỳ</button>
          </div>
        </form>
        <div className="hidden md:flex flex-1 items-center justify-center">
          <img src={Woman} alt="Menstrual Illustration" className="w-full max-w-xs mx-auto" />
        </div>
      </div>
    </Popup>
  );
};

export default MenstrualCyclePopup;
