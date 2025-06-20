import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

import plusWhiteIcon from '../../assets/icons/plus-white.svg';

import TestingTitleBar from '../../components/feature/TitleBar/TestingTitleBar';
import TestingUtilityBar from '../../components/feature/UtilityBar/TestingUtilityBar';
import TestTable from '../../components/feature/Table/TestTable';
import SearchInput from '../../components/feature/Filter/SearchInput';
import DropdownSelect from '../../components/feature/Filter/DropdownSelect';
import MultiSelectDropdown from '../../components/feature/Filter/MultiSelectDropdown';
import DatePickerInput from '../../components/feature/Filter/DatePickerInput';
import TestResultPopup from '../../components/feature/Popup/TestResultPopup';

const plusIcon = plusWhiteIcon; 

const availableTypes = [
  'HIV',
  'Gonorrhea',
  'Syphilis',
];

const TESTS_PER_PAGE = 5;

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
  const [currentExaminationId, setCurrentExaminationId] = useState<number | null>(null);
  const [slotOptions, setSlotOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'All slots' }]);
  const [slotMap, setSlotMap] = useState<{ [key: string]: string }>({});
  const [statusOptions, setStatusOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'All status' }]);
  const [panelOptions, setPanelOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'All panels' }]);
  const [selectedPanel, setSelectedPanel] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/examinations').then(res => {
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && typeof data === 'object') {
          data = [data];
        } else {
          data = [];
        }
      }
      setTestRecords(data.map((order: any) => ({
        id: order.id,
        date: order.date ? new Date(order.date).toLocaleDateString('en-GB') : '',
        slot: order.slot ?? '',
        time: order.timeRange || '', // Lấy trực tiếp từ API
        panels: order.panelName || 'No info',
        statusRaw: order.examinationStatus || '',
        status: order.examinationStatus
          ? order.examinationStatus.toLowerCase() === 'completed' ? 'Completed'
            : order.examinationStatus.toLowerCase() === 'pending' ? 'Pending'
            : order.examinationStatus.toLowerCase() === 'in_progress' ? 'In progress'
            : order.examinationStatus.charAt(0).toUpperCase() + order.examinationStatus.slice(1).toLowerCase()
          : '',
      })));
    });
  }, []);

  useEffect(() => {
    api.get('/enumerators/slots').then(res => {
      const options = [{ value: '', label: 'All slots' }];
      const map: { [key: string]: string } = {};
      (res.data as { name: string; timeRange: string }[]).forEach(slot => {
        if (slot.timeRange !== 'Filler slot, not used') {
          options.push({ value: slot.timeRange, label: slot.timeRange });
          map[slot.timeRange] = slot.timeRange;
        }
      });
      setSlotOptions(options);
      setSlotMap(map);
    });
  }, []);

  useEffect(() => {
    api.get('/enumerators/examination-status').then(res => {
      const options = [{ value: '', label: 'All status' }];
      (res.data as string[]).forEach(status => {
        options.push({ value: status, label: status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ') });
      });
      setStatusOptions(options);
    });
  }, []);

  useEffect(() => {
    api.get('/panels').then(res => {
      const options = [{ value: '', label: 'All panels' }];
      (res.data as { panelName: string }[]).forEach(panel => {
        options.push({ value: panel.panelName, label: panel.panelName });
      });
      setPanelOptions(options);
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

  const filteredRecords = testRecords.filter((record) => {
    if (hideRows.includes(record.id)) {
      return false;
    }
    const searchMatch =
      record.date.includes(searchTerm) ||
      record.slot.includes(searchTerm) ||
      record.panels.toLowerCase().includes(searchTerm.toLowerCase());
    const slotMatch = selectedSlot ? record.time === selectedSlot : true;
    const statusMatch = selectedStatus ? record.statusRaw === selectedStatus : true;
    const panelMatch = selectedPanel ? record.panels === selectedPanel : true;
    const recordPanelList = record.panels.split(',').map((p: string) => p.trim());
    const typeMatch = selectedTypes.length === 0 ? true : selectedTypes.some(type => recordPanelList.includes(type));
    const recordDate = parseDate(record.date);
    const fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
    const toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;
    return searchMatch && slotMatch && typeMatch && statusMatch && panelMatch && fromMatch && toMatch;
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
        <DropdownSelect
          value={selectedPanel}
          onChange={setSelectedPanel}
          options={panelOptions}
        />
        <DropdownSelect
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={statusOptions}
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
        slotTimeMap={slotMap}
        selected={selected}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectAll={handleSelectAll}
        hideRows={hideRows}
        onDeleteRows={(ids) => {
          setHideRows(prev => [...prev, ...ids]);
          setSelected([]);
        }}
        onViewRows={(ids) => {
          if (ids && ids.length > 0) {
            setCurrentExaminationId(ids[0]);
            setShowResultPopup(true);
          }
        }}
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
      {showResultPopup && currentExaminationId !== null && (
        <TestResultPopup onClose={() => { setShowResultPopup(false); setCurrentExaminationId(null); }} examinationId={currentExaminationId} />
      )}
    </div>
  );
};

export default STITests;