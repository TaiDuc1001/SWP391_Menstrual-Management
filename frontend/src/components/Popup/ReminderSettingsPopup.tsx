import React, { useState } from 'react';
import Popup from './Popup';

interface ReminderSettingsPopupProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const ReminderSettingsPopup: React.FC<ReminderSettingsPopupProps> = ({ open, onClose, onSave }) => {
  const [periodEnabled, setPeriodEnabled] = useState(true);
  const [periodDays, setPeriodDays] = useState(3);
  const [ovulationEnabled, setOvulationEnabled] = useState(true);
  const [ovulationDays, setOvulationDays] = useState(3);
  const [pillEnabled, setPillEnabled] = useState(false);
  const [reminderType, setReminderType] = useState('Qua app');
  const [reminderTime, setReminderTime] = useState('07:00');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave();
    onClose();
  };

  return (
    <Popup open={open} onClose={onClose} className="max-w-xs w-full p-6 relative">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-2xl z-10 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-full bg-white shadow-md w-10 h-10 flex items-center justify-center"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="text-pink-600 font-bold text-lg mb-2 flex items-center gap-2">
          <span className="inline-block w-5 h-5 bg-pink-400 rounded-full"></span>
          Nhắc nhở thông minh
        </div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="font-semibold text-sm flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-pink-400 rounded-full"></span>
              Gần đến kỳ kinh
            </div>
            <div className="text-xs text-gray-500">Nhắc nhở trước: <span className="font-semibold">{periodDays} ngày</span></div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={periodEnabled} onChange={e => setPeriodEnabled(e.target.checked)} />
            <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-pink-500 transition relative">
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${periodEnabled ? 'translate-x-4' : ''}`}></div>
            </div>
          </label>
          <div className="flex items-center ml-2">
            <button type="button" className="w-6 h-6 rounded bg-gray-100 text-pink-500 text-lg flex items-center justify-center" onClick={() => setPeriodDays(d => Math.max(1, d-1))}>-</button>
            <span className="mx-1 text-sm font-semibold">{periodDays}</span>
            <button type="button" className="w-6 h-6 rounded bg-gray-100 text-pink-500 text-lg flex items-center justify-center" onClick={() => setPeriodDays(d => Math.min(10, d+1))}>+</button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="font-semibold text-sm flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full"></span>
              Sắp rụng trứng
            </div>
            <div className="text-xs text-gray-500">Nhắc nhở trước: <span className="font-semibold">{ovulationDays} ngày</span></div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={ovulationEnabled} onChange={e => setOvulationEnabled(e.target.checked)} />
            <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-yellow-400 transition relative">
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${ovulationEnabled ? 'translate-x-4' : ''}`}></div>
            </div>
          </label>
          <div className="flex items-center ml-2">
            <button type="button" className="w-6 h-6 rounded bg-gray-100 text-yellow-500 text-lg flex items-center justify-center" onClick={() => setOvulationDays(d => Math.max(1, d-1))}>-</button>
            <span className="mx-1 text-sm font-semibold">{ovulationDays}</span>
            <button type="button" className="w-6 h-6 rounded bg-gray-100 text-yellow-500 text-lg flex items-center justify-center" onClick={() => setOvulationDays(d => Math.min(10, d+1))}>+</button>
          </div>
        </div>
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="font-semibold text-sm flex items-center gap-1">
              <span className="inline-block w-3 h-3 border-2 border-blue-400 rounded-full"></span>
              Nhắc nhở uống thuốc ngừa thai
            </div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={pillEnabled} onChange={e => setPillEnabled(e.target.checked)} />
            <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-400 transition relative">
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${pillEnabled ? 'translate-x-4' : ''}`}></div>
            </div>
          </label>
        </div>
        <div className="mb-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cách nhận nhắc nhở</label>
          <select className="w-full border rounded px-3 py-2 focus:outline-pink-400" value={reminderType} onChange={e => setReminderType(e.target.value)}>
            <option>Qua app</option>
            <option>Qua SMS</option>
            <option>Qua Email</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Giờ nhắc cố định</label>
          <input type="time" className="w-full border rounded px-3 py-2 focus:outline-pink-400" value={reminderTime} onChange={e => setReminderTime(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded font-semibold hover:bg-pink-600 transition mt-2">Lưu cài đặt</button>
      </form>
    </Popup>
  );
};

export default ReminderSettingsPopup;
