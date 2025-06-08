import React, { useState } from 'react';
import Popup from '../Popup/Popup';

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
    <Popup open={open} onClose={onClose} className="max-w-2xl w-full p-8">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <form onSubmit={handleSubmit} className="flex-1 min-w-[300px]">
          <div className="text-lg font-semibold text-pink-600 mb-6 flex items-center gap-2">
            <span className="inline-block w-5 h-5 bg-pink-400 rounded-full"></span>
            Khai Báo Chu Kỳ Kinh
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Ngày bắt đầu kỳ kinh</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 focus:outline-pink-400"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Số ngày hành kinh</label>
            <input
              type="number"
              min={1}
              max={15}
              className="w-full border rounded px-3 py-2 focus:outline-pink-400"
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Độ dài chu kỳ kinh nguyệt</label>
            <input
              type="number"
              min={20}
              max={40}
              className="w-full border rounded px-3 py-2 focus:outline-pink-400"
              value={cycleLength}
              onChange={e => setCycleLength(Number(e.target.value))}
              required
            />
          </div>
          <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded font-semibold hover:bg-pink-600 transition">Lưu chu kỳ</button>
        </form>
        <div className="hidden md:block flex-1">
          <img src={require('../../assets/images/blood-testing.svg')} alt="Menstrual Illustration" className="w-full max-w-xs mx-auto" />
        </div>
      </div>
    </Popup>
  );
};

export default MenstrualCyclePopup;
