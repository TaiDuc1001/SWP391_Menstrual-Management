import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchInput from '../../components/Filter/SearchInput';
import DatePickerInput from '../../components/Filter/DatePickerInput';
import Table from '../../components/Table/Table';
import ActionButton from '../../components/Button/ActionButton';
import MenstrualCyclePopup from '../../components/Popup/MenstrualCyclePopup';
import SuccessPopup from '../../components/Popup/SuccessPopup';
import { MenstrualCycleProvider, useMenstrualCycles } from '../../context/MenstrualCycleContext';

const MenstrualCyclesAll: React.FC = () => {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [showCyclePopup, setShowCyclePopup] = useState(false);
  const [editRow, setEditRow] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const { cycles, setCycles } = useMenstrualCycles();

  const parseDate = (str: string) => {
    // Ensure dd/mm/yyyy format is parsed correctly
    if (!str) return new Date('');
    const [day, month, year] = str.split('/').map(Number);
    if (!day || !month || !year) return new Date('');
    return new Date(year, month - 1, day);
  };

  const formatDate = (str: string) => {
    if (!str) return '';
    const [day, month, year] = str.split('/');
    if (!day || !month || !year) return str;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  };

  const filteredData = cycles.filter(row => {
    const searchMatch =
      search === '' ||
      row.startDate.includes(search) ||
      row.endDate.includes(search) ||
      row.duration.toString().includes(search) ||
      row.cycle.toString().includes(search);
    // Format dates for search like STITests.tsx
    const formattedStart = row.startDate;
    const formattedEnd = row.endDate;
    const searchLower = search.toLowerCase();
    const dateMatch =
      formattedStart.toLowerCase().includes(searchLower) ||
      formattedEnd.toLowerCase().includes(searchLower);
    // Fix: filter by fromDate (startDate) and toDate (endDate)
    const start = fromDate ? parseDate(row.startDate) >= fromDate : true;
    const end = toDate ? parseDate(row.endDate) <= toDate : true;
    return (searchMatch || dateMatch) && start && end;
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
    const idsToDelete = ids && ids.length > 0 ? ids : selected;
    setCycles(prev => prev.filter(row => !idsToDelete.includes(row.id)));
    setSelected([]);
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
            <button
              className="text-sm px-3 py-1 rounded bg-red-100 text-red-600 font-semibold shadow hover:bg-red-200 transition disabled:opacity-50"
              title="Delete"
              onClick={() => handleDelete(selected)}
              disabled={selected.length === 0}
            >
              Delete
            </button>
            <button className="text-xl text-pink-400 hover:text-pink-600" title="View"><i className="fa fa-eye"></i></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-2">
            <thead>
              <tr className="text-gray-500">
                <th className="py-2 w-8"></th>
                <th className="py-2 font-medium"><span className="inline-flex items-center gap-1"><i className="fa fa-calendar text-pink-400"></i> Bắt đầu</span></th>
                <th className="py-2 font-medium"><span className="inline-flex items-center gap-1"><i className="fa fa-calendar text-pink-400"></i> Kết thúc</span></th>
                <th className="py-2 font-medium">Số ngày hành kinh</th>
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
                  <td className="py-2 font-semibold text-gray-700">{formatDate(row.startDate)}</td>
                  <td className="py-2 font-semibold text-gray-700">{formatDate(row.endDate)}</td>
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
        onSave={(data) => {
          setShowCyclePopup(false);
          setEditRow(null);
          // Calculate endDate from startDate and duration
          const parseDMY = (str: string) => {
            const [day, month, year] = str.split('/').map(Number);
            return new Date(year, month - 1, day);
          };
          const formatDMY = (date: Date) => {
            const d = date.getDate().toString().padStart(2, '0');
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const y = date.getFullYear();
            return `${d}/${m}/${y}`;
          };
          const start = parseDMY(data.startDate);
          const end = new Date(start);
          end.setDate(start.getDate() + data.duration - 1);
          const endDate = formatDMY(end);
          // If editing, update; else, add new
          if (editRow && editRow.id) {
            setCycles(prev => prev.map(row => row.id === editRow.id ? {
              ...row,
              startDate: data.startDate,
              endDate: endDate,
              duration: data.duration,
              cycle: data.cycleLength
            } : row));
          } else {
            setCycles(prev => [
              ...prev,
              {
                id: prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1,
                startDate: data.startDate,
                endDate: endDate,
                duration: data.duration,
                cycle: data.cycleLength
              }
            ]);
          }
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 1500);
        }}
        editRow={editRow}
      />
      {showSuccess && (
        <SuccessPopup
          open={showSuccess}
          onClose={() => setShowSuccess(false)}
          message="Successfully"
        />
      )}
    </div>
  );
};

// Wrap the page with MenstrualCycleProvider
export default function MenstrualCyclesAllWithProvider() {
  return (
    <MenstrualCycleProvider>
      <MenstrualCyclesAll />
    </MenstrualCycleProvider>
  );
}
