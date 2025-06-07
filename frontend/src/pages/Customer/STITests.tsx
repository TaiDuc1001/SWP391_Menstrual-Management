import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import eyeIcon from '../../assets/icons/eye.svg';
import trashBinIcon from '../../assets/icons/trash-bin.svg';
import searchIcon from '../../assets/icons/search.svg';
import dropDownIcon from '../../assets/icons/drop-down.svg';
import calendarIcon from '../../assets/icons/calendar.svg';
import plusWhiteIcon from '../../assets/icons/plus-white.svg';

import StatusBadge from '../../components/StatusBadge/StatusBadge';
import ViewResultButton from '../../components/ViewResultButton/ViewResultButton';
import NewOrderButton from '../../components/NewOrderButton/NewOrderButton';

const plusIcon = plusWhiteIcon; 

// Slot to time mapping
const slotTimeMap: { [key: string]: string } = {
  '1': '7:00 - 9:00',
  '2': '9:00 - 11:00',
  '3': '11:00 - 13:00',
  '4': '13:00 - 15:00',
  '5': '15:00 - 17:00',
  '6': '17:00 - 19:00',
  '7': '19:00 - 21:00',
  '8': '21:00 - 23:00',
};

const availableTypes = [
  'HIV',
  'Gonorrhea',
  'Syphilis',
];

const STITests: React.FC = () => {
  const testRecords = [
    { id: 1, date: '22/05/2025', slot: '2', panels: 'HIV, Gonorrhea, Syphilis', status: 'Pending'},
    { id: 2, date: '22/05/2025', slot: '2', panels: 'HIV, Gonorrhea, Syphilis', status: 'In progress'},
    { id: 3, date: '22/05/2025', slot: '2', panels: 'HIV, Gonorrhea, Syphilis', status: 'Completed'},
    { id: 4, date: '22/05/2025', slot: '3', panels: 'HIV, Gonorrhea, Syphilis', status: 'Completed'},
  ];

  const [selected, setSelected] = useState<number[]>([]);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [hideRows, setHideRows] = useState<number[]>([]);

  const handleCheckboxChange = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(filteredRecords.map((record) => record.id));
    } else {
      setSelected([]);
    }
  };

  // Helper to parse dd/mm/yyyy to Date
  const parseDate = (str: string) => {
    const [day, month, year] = str.split('/').map(Number);
    return new Date(year, month - 1, day);
  };



  const filteredRecords = testRecords.filter((record) => {
    // Search filter
    const searchMatch =
      record.date.includes(searchTerm) ||
      slotTimeMap[record.slot].includes(searchTerm) ||
      record.panels.toLowerCase().includes(searchTerm.toLowerCase());

    // Slot filter
    const slotMatch = selectedSlot ? record.slot === selectedSlot : true;

    // Type filter (multi-select, by panels)
    const recordPanelList = record.panels.split(',').map(p => p.trim());
    const typeMatch = selectedTypes.length === 0 ? true : selectedTypes.some(type => recordPanelList.includes(type));

    // Status filter
    const statusMatch = selectedStatus ? record.status === selectedStatus : true;

    // Date range filter
    const recordDate = parseDate(record.date);
    const fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
    const toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;

    return searchMatch && slotMatch && typeMatch && statusMatch && fromMatch && toMatch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded shadow w-full mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-pink-600">Testing history</h1>
        <NewOrderButton icon={<img src={plusIcon} alt="Plus" className="w-5 h-5" />}>
          New order
        </NewOrderButton>
      </div>
      <div className="mb-4 flex space-x-4 w-full" style={{maxWidth: '100%'}}>
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            placeholder="Search by date, time, or test panels"
            className="border rounded p-2 w-full pr-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <img src={searchIcon} alt="Search" className="w-5 h-5 text-gray-400" />
          </span>
        </div>
        <div className="relative min-w-[8rem]">
          <select className="border rounded p-2 pr-8 appearance-none w-full" value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}>
            <option value="">All slots</option>
            {Object.entries(slotTimeMap).map(([slot, time]) => (
              <option key={slot} value={slot}>{`Slot ${slot}`}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <img src={dropDownIcon} alt="Dropdown" className="w-4 h-4 text-gray-400" />
          </span>
        </div>
        <div className="relative min-w-[12rem]">
          <button
            type="button"
            className="border rounded p-2 pr-8 appearance-none w-full flex items-center justify-between"
            onClick={() => setShowTypeDropdown(v => !v)}
          >
            {selectedTypes.length === 0 ? 'All test types' : selectedTypes.join(', ')}
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
              <img src={dropDownIcon} alt="Dropdown" className="w-4 h-4 text-gray-400 ml-2" />
            </span>
          </button>
          {showTypeDropdown && (
            <div className="absolute z-50 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-auto">
              <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.length === 0}
                  onChange={() => setSelectedTypes([])}
                  className="mr-2"
                />
                All test types
              </label>
              {availableTypes.map(type => (
                <label key={type} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => {
                      setSelectedTypes(prev =>
                        prev.includes(type)
                          ? prev.filter(t => t !== type)
                          : [...prev, type]
                      );
                    }}
                    className="mr-2"
                  />
                  {type}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="relative min-w-[10rem]">
          <select className="border rounded p-2 pr-8 appearance-none w-full" value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
            <option value="">All status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="In progress">In progress</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <img src={dropDownIcon} alt="Dropdown" className="w-4 h-4 text-gray-400" />
          </span>
        </div>

        <div className="relative w-40 min-w-[10rem]">
          <DatePicker
            selected={selectedDateFrom}
            onChange={date => setSelectedDateFrom(date)}
            placeholderText="From date"
            className="border rounded p-2 w-full pr-10 focus:outline-none"
            calendarClassName="z-50"
            maxDate={selectedDateTo || undefined}
          />
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <img src={calendarIcon} alt="Calendar" className="w-5 h-5 text-gray-400" />
          </span>
        </div>
        <div className="relative w-40 min-w-[10rem]">
          <DatePicker
            selected={selectedDateTo}
            onChange={date => setSelectedDateTo(date)}
            placeholderText="To date"
            className="border rounded p-2 w-full pr-10 focus:outline-none"
            calendarClassName="z-50"
            minDate={selectedDateFrom || undefined}
          />
          <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
            <img src={calendarIcon} alt="Calendar" className="w-5 h-5 text-gray-400" />
          </span>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Testing history</h2>
          <div className="flex items-center gap-6 pr-2">
            {selected.length > 0 && (
              <span className="text-pink-500 mr-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-1 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><rect width="18" height="18" x="1" y="1" rx="3" fill="#fff" stroke="#ec4899" strokeWidth="2"/><polyline points="5 10 9 14 15 6" fill="none" stroke="#ec4899" strokeWidth="2"/></svg>
                {selected.length} selected
              </span>
            )}
            <button className="text-gray-500 hover:text-gray-700" onClick={() => {
              setHideRows(selected.length > 0 ? [...hideRows, ...selected] : hideRows);
              setSelected([]);
            }}>
              <img src={eyeIcon} alt="View" className="w-5 h-5" />
            </button>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => {
              setHideRows(selected.length > 0 ? [...hideRows, ...selected] : hideRows);
              setSelected([]);
            }}>
              <img src={trashBinIcon} alt="Delete" className="w-5 h-5" />
            </button>
          </div>
        </div>
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-8" />
            <col className="w-32" />
            <col className="w-32" />
            <col className="w-56" />
            <col className="w-32" />
            <col className="w-16" />
          </colgroup>
          <thead>
            <tr className="text-left text-pink-500">
              <th className="p-2"><input type="checkbox" checked={filteredRecords.length > 0 && selected.length === filteredRecords.length} onChange={handleSelectAll} /></th>
              <th className="p-2">Date</th>
              <th className="p-2">Time</th>
              <th className="p-2">Test panels</th>
              <th className="p-2 text-center">Status</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">No records found</td>
              </tr>
            ) : (
              filteredRecords.filter(record => !hideRows.includes(record.id)).map((record) => (
                <tr key={record.id} className="border-t">
                  <td className="p-2"><input type="checkbox" checked={selected.includes(record.id)} onChange={() => handleCheckboxChange(record.id)} /></td>
                  <td className="p-2">{record.date}</td>
                  <td className="p-2">{slotTimeMap[record.slot]}</td>
                  <td className="p-2">{record.panels}</td>
                  <td className="p-2 text-center">
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="p-2">
                    {record.status === 'Completed' ? <ViewResultButton /> : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default STITests;