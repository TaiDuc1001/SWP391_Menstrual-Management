import React from 'react';
import { FaStar } from 'react-icons/fa';

interface RatingHistoryFilterProps {
  star: number | '';
  setStar: (star: number | '') => void;
}


const stars = [5, 4, 3, 2, 1];
const RatingHistoryFilter: React.FC<RatingHistoryFilterProps> = ({ star, setStar }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6 items-end bg-pink-50 rounded-xl px-4 py-3 shadow-sm">
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
