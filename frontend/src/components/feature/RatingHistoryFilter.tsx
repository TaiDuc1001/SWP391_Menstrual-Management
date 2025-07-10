import React from 'react';
import { FaStar } from 'react-icons/fa';

interface RatingHistoryFilterProps {
  filterType: 'week' | 'month' | 'year';
  setFilterType: (type: 'week' | 'month' | 'year') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  star: number | '';
  setStar: (star: number | '') => void;
}

const stars = [5, 4, 3, 2, 1];
const RatingHistoryFilter: React.FC<RatingHistoryFilterProps> = ({ filterType, setFilterType, selectedDate, setSelectedDate, star, setStar }) => {
  // Helper for label
  const getLabel = () => {
    if (filterType === 'week') return 'Chọn ngày trong tuần';
    if (filterType === 'month') return 'Chọn tháng';
    if (filterType === 'year') return 'Chọn năm';
    return '';
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6 items-end bg-pink-50 rounded-xl px-4 py-3 shadow-sm">
      <div className="flex gap-2 items-center">
        <span className="font-semibold text-pink-600">Lọc theo:</span>
        <button
          className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all duration-150 ${filterType === 'week' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-100'}`}
          onClick={() => setFilterType('week')}
        >Tuần</button>
        <button
          className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all duration-150 ${filterType === 'month' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-100'}`}
          onClick={() => setFilterType('month')}
        >Tháng</button>
        <button
          className={`px-3 py-1 rounded-lg text-sm font-medium border transition-all duration-150 ${filterType === 'year' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-100'}`}
          onClick={() => setFilterType('year')}
        >Năm</button>
      </div>
      <div className="flex gap-2 items-center">
        <span className="font-semibold text-pink-600">{getLabel()}:</span>
        {filterType === 'year' ? (
          <input
            type="number"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 w-28"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            min="2000"
            max="2100"
            placeholder="2025"
          />
        ) : filterType === 'month' ? (
          <input
            type="month"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 w-36"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        ) : (
          <input
            type="date"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300 w-36"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        )}
      </div>
      <div className="flex gap-2 items-center">
        <span className="font-semibold text-pink-600">Số sao:</span>
        <button
          className={`px-2 py-1 rounded-lg text-sm font-medium border transition-all duration-150 ${star === '' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-100'}`}
          onClick={() => setStar('')}
        >Tất cả</button>
        {stars.map(s => (
          <button
            key={s}
            className={`px-2 py-1 rounded-lg text-sm font-medium border flex items-center gap-1 transition-all duration-150 ${star === s ? 'bg-yellow-400 text-white border-yellow-400' : 'bg-white border-pink-200 text-yellow-600 hover:bg-yellow-100'}`}
            onClick={() => setStar(s)}
          >
            {s} <span className="inline-block text-yellow-400 align-middle" style={{fontSize: '1.1em', marginLeft: 2}}>★</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingHistoryFilter;
