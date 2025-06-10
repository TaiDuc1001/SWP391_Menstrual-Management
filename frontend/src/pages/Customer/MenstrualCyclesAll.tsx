import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../../components/Filter/SearchInput';
import DatePickerInput from '../../components/Filter/DatePickerInput';
import Table from '../../components/Table/Table';
import ActionButton from '../../components/Button/ActionButton';
import MenstrualCyclePopup from '../../components/Popup/MenstrualCyclePopup';

const mockData = [
  { id: 1, startDate: '13/05/2024', endDate: '17/05/2024', duration: 5, cycle: 28 },
  { id: 2, startDate: '16/04/2024', endDate: '19/04/2024', duration: 4, cycle: 29 },
  { id: 3, startDate: '16/03/2024', endDate: '20/03/2024', duration: 5, cycle: 28 },
  { id: 4, startDate: '15/02/2024', endDate: '19/02/2024', duration: 5, cycle: 28 },
  { id: 5, startDate: '18/01/2024', endDate: '22/01/2024', duration: 5, cycle: 30 },
];

const MenstrualCyclesAll: React.FC = () => {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [data, setData] = useState(mockData);
  const [showCyclePopup, setShowCyclePopup] = useState(false);
  const [editRow, setEditRow] = useState<any>(null);
  const navigate = useNavigate();

  const parseDate = (str: string) => {
    // Ensure dd/mm/yyyy format is parsed correctly
    if (!str) return new Date('');
    const [day, month, year] = str.split('/').map(Number);
    if (!day || !month || !year) return new Date('');
    return new Date(year, month - 1, day);
  };

  const filteredData = data.filter(row => {
    const searchMatch =
      search === '' ||
      row.startDate.includes(search) ||
      row.endDate.includes(search) ||
      row.duration.toString().includes(search) ||
      row.cycle.toString().includes(search);
    const start = fromDate ? parseDate(row.startDate) >= fromDate : true;
    const end = toDate ? parseDate(row.endDate) <= toDate : true;
    return searchMatch && start && end;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(filteredData.map(row => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDelete = (ids?: number[]) => {
    if (ids && ids.length > 0) {
      setData(prev => prev.filter(row => !ids.includes(row.id)));
      setSelected([]);
    } else {
      setData(prev => prev.filter(row => !selected.includes(row.id)));
      setSelected([]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2 mb-2">
          <span className="inline-block w-6 h-6 bg-pink-400 rounded-full mr-2"></span>
          Lịch sử chu kỳ
        </h2>
        <div className="flex-1 flex gap-2 justify-end">
          <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm theo Số ngày, Chu kỳ ( ngày )...." />
          <DatePickerInput selected={fromDate} onChange={setFromDate} placeholder="From date" />
          <DatePickerInput selected={toDate} onChange={setToDate} placeholder="End date" />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-pink-400 rounded-full"></span>
            Lịch sử chu kỳ
          </h3>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-pink-500 font-semibold text-sm">
              <input type="checkbox" checked={selected.length === filteredData.length && filteredData.length > 0} onChange={handleSelectAll} className="accent-pink-500" />
              {selected.length} selected
            </span>
            <button className="text-xl text-pink-400 hover:text-pink-600" title="View"><i className="fa fa-eye"></i></button>
            <button
              className="text-xl text-pink-400 hover:text-pink-600"
              title="Delete"
              onClick={() => handleDelete(selected)}
              disabled={selected.length === 0}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-2">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2 w-8"></th>
                <th className="py-2 font-medium"><span className="inline-flex items-center gap-1"><i className="fa fa-calendar text-pink-400"></i> Bắt đầu</span></th>
                <th className="py-2 font-medium"><span className="inline-flex items-center gap-1"><i className="fa fa-calendar text-pink-400"></i> Kết thúc</span></th>
                <th className="py-2 font-medium">Số ngày</th>
                <th className="py-2 font-medium">Chu kỳ ( ngày )</th>
                <th className="py-2 w-24"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={row.id} className="text-center border-b last:border-b-0 hover:bg-pink-50 transition">
                  <td className="py-2">
                    <input type="checkbox" checked={selected.includes(row.id)} onChange={() => handleCheckboxChange(row.id)} className="accent-pink-500" />
                  </td>
                  <td className="py-2 font-semibold text-gray-700">{row.startDate}</td>
                  <td className="py-2 font-semibold text-gray-700">{row.endDate}</td>
                  <td className="py-2">{row.duration}</td>
                  <td className="py-2">{row.cycle}</td>
                  <td className="py-2">
                    <button
                      className="bg-pink-400 text-white px-4 py-1 rounded font-semibold shadow hover:bg-pink-500 transition"
                      onClick={() => {
                        setEditRow(row);
                        setShowCyclePopup(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <MenstrualCyclePopup
        open={showCyclePopup}
        onClose={() => {
          setShowCyclePopup(false);
          setEditRow(null);
        }}
        onSave={() => {
          setShowCyclePopup(false);
          setEditRow(null);
          // Optionally update data here
        }}
        // Optionally pass editRow for editing
      />
    </div>
  );
};

export default MenstrualCyclesAll;
