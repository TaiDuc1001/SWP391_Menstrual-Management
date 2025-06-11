import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

import plusWhiteIcon from '../../assets/icons/plus-white.svg';

import TestingTitleBar from '../../components/TitleBar/TestingTitleBar';
import TestingUtilityBar from '../../components/UtilityBar/TestingUtilityBar';
import TestTable from '../../components/Table/TestTable';
import SearchInput from '../../components/Filter/SearchInput';
import DropdownSelect from '../../components/Filter/DropdownSelect';
import MultiSelectDropdown from '../../components/Filter/MultiSelectDropdown';
import DatePickerInput from '../../components/Filter/DatePickerInput';
import TestResultPopup from '../../components/Popup/TestResultPopup';

const plusIcon = plusWhiteIcon; 

const availableTypes = [
  'HIV',
  'Gonorrhea',
  'Syphilis',
];

const TESTS_PER_PAGE = 5;

// Slot number to time mapping
const slotTimeMap: Record<number, string> = {
  1: '08:00-09:00',
  2: '09:00-10:00',
  3: '10:00-11:00',
  4: '11:00-12:00',
  5: '13:00-14:00',
  6: '14:00-15:00',
  7: '15:00-16:00',
  8: '16:00-17:00',
};

const STITests: React.FC = () => {
  const [testRecords, setTestRecords] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [hideRows, setHideRows] = useState<number[]>([]);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/orders').then(res => {
      console.log('Fetched /orders response:', res.data); // Debug log
      let data = res.data;
      if (!Array.isArray(data)) {
        // If backend returns a single object, wrap it in an array
        if (data && typeof data === 'object') {
          data = [data];
        } else {
          data = [];
        }
      }
      console.log('Processed data:', data);
      setTestRecords(data.map((order: any) => ({
        id: order.id,
        date: order.date ? new Date(order.date).toLocaleDateString('en-GB') : '',
        slot: order.slot ?? '',
        panels: (
          order.apackage?.packageName ||
          'No info'
        ),
        status: order.status
          ? order.status.toLowerCase() === 'completed' ? 'Completed'
            : order.status.toLowerCase() === 'pending' ? 'Pending'
            : order.status.charAt(0).toUpperCase() + order.status.slice(1)
          : '',
      })));
    });
  }, []);

  const handleCheckboxChange = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const visibleRecords = filteredRecords.filter((record) => !hideRows.includes(record.id));
      setSelected(visibleRecords.map((record) => record.id));
    } else {
      setSelected([]);
    }
  };

  const parseDate = (str: string) => {
    const [day, month, year] = str.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Get all unique slot ids from data for filter dropdown
  const slotOptions = React.useMemo(() => {
    const slots = Array.from(new Set(testRecords.map(r => r.slot).filter(Boolean)));
    return [{ value: '', label: 'All slots' }, ...slots.map(slot => ({ value: slot, label: `Slot ${slot}` }))];
  }, [testRecords]);

  const filteredRecords = testRecords.filter((record) => {
    if (hideRows.includes(record.id)) {
      return false;
    }
    const searchMatch =
      record.date.includes(searchTerm) ||
      record.slot.includes(searchTerm) ||
      record.panels.toLowerCase().includes(searchTerm.toLowerCase());
    const slotMatch = selectedSlot ? record.slot === selectedSlot : true;
    const recordPanelList = record.panels.split(',').map((p: string) => p.trim());
    const typeMatch = selectedTypes.length === 0 ? true : selectedTypes.some(type => recordPanelList.includes(type));
    const statusMatch = selectedStatus ? record.status === selectedStatus : true;
    const recordDate = parseDate(record.date);
    const fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
    const toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;
    return searchMatch && slotMatch && typeMatch && statusMatch && fromMatch && toMatch;
  });

  // Paging should use filteredRecords
  const totalPages = Math.ceil(filteredRecords.length / TESTS_PER_PAGE);
  const startIdx = (currentPage - 1) * TESTS_PER_PAGE;
  const endIdx = startIdx + TESTS_PER_PAGE;
  const pagedRecords = filteredRecords.slice(startIdx, endIdx);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSlot, selectedTypes, selectedStatus, selectedDateFrom, selectedDateTo]);

  React.useEffect(() => {
    const newSelected = selected.filter(id => !hideRows.includes(id));
    if (newSelected.length !== selected.length) {
      setSelected(newSelected);
    }
  }, [hideRows]);

  React.useEffect(() => {
    const visibleIds = filteredRecords.map(r => r.id);
    const newSelected = selected.filter(id => visibleIds.includes(id));
    if (newSelected.length !== selected.length) {
      setSelected(newSelected);
    }
  }, [filteredRecords]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <TestingTitleBar
        title="Testing history"
        onNewOrder={() => { navigate('/sti-tests/packages'); }}
        newOrderIcon={<img src={plusIcon} alt="Plus" className="w-5 h-5" />} />
      <TestingUtilityBar>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by date, slot, or test panels"
        />
        <DropdownSelect
          value={selectedSlot}
          onChange={setSelectedSlot}
          options={slotOptions}
        />
        <MultiSelectDropdown
          selected={selectedTypes}
          setSelected={setSelectedTypes}
          options={availableTypes}
          showDropdown={showTypeDropdown}
          setShowDropdown={setShowTypeDropdown}
        />
        <DropdownSelect
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={[
            { value: '', label: 'All status' },
            { value: 'Completed', label: 'Completed' },
            { value: 'Pending', label: 'Pending' },
            { value: 'In progress', label: 'In progress' },
          ]}
        />
        <DatePickerInput
          selected={selectedDateFrom}
          onChange={setSelectedDateFrom}
          placeholder="From date"
          maxDate={selectedDateTo || undefined}
        />
        <DatePickerInput
          selected={selectedDateTo}
          onChange={setSelectedDateTo}
          placeholder="To date"
          minDate={selectedDateFrom || undefined}
        />
      </TestingUtilityBar>      
      <TestTable
        filteredRecords={filteredRecords}
        slotTimeMap={slotTimeMap} 
        selected={selected}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectAll={handleSelectAll}
        hideRows={hideRows}
        onDeleteRows={(ids) => {
          setHideRows(prev => [...prev, ...ids]);
          setSelected([]);
        }}
        onViewRows={() => setShowResultPopup(true)}
        currentPage={currentPage}
        testsPerPage={TESTS_PER_PAGE}
      />
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded font-semibold ${currentPage === i + 1 ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-pink-100'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`}
          >
            Next
          </button>
        </div>
      )}
      {showResultPopup && (
        <TestResultPopup onClose={() => setShowResultPopup(false)} />
      )}
    </div>
  );
};

export default STITests;