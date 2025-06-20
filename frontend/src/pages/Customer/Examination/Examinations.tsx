import React, {useEffect, useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {useNavigate} from 'react-router-dom';
import api from '../../../api/axios';
import {useTableState} from '../../../api/hooks';

import plusWhiteIcon from '../../../assets/icons/plus-white.svg';

import TestingTitleBar from '../../../components/feature/TitleBar/TestingTitleBar';
import TestingUtilityBar from '../../../components/feature/UtilityBar/TestingUtilityBar';
import ExaminationsTable from '../../../components/feature/Table/Customer/Examinations';
import SearchInput from '../../../components/feature/Filter/SearchInput';
import DropdownSelect from '../../../components/feature/Filter/DropdownSelect';
import DatePickerInput from '../../../components/feature/Filter/DatePickerInput';
import TestResultPopup from '../../../components/feature/Popup/TestResultPopup';

const plusIcon = plusWhiteIcon; 

const availableTypes = [
  'HIV',
  'Gonorrhea',
  'Syphilis',
];

const TESTS_PER_PAGE = 5;

const Examinations: React.FC = () => {
  const [testRecords, setTestRecords] = useState<any[]>([]);
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [hideRows, setHideRows] = useState<number[]>([]);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [currentExaminationId, setCurrentExaminationId] = useState<number | null>(null);
  const [slotOptions, setSlotOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'All slots' }]);
  const [slotMap, setSlotMap] = useState<{ [key: string]: string }>({});
  const [statusOptions, setStatusOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'All status' }]);
  const [panelOptions, setPanelOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'All panels' }]);
  const [selectedPanel, setSelectedPanel] = useState('');
  const navigate = useNavigate();

  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Filter data first
  const filteredRecords = testRecords.filter((record: any) => {
    const searchMatch = searchTerm ? record.panels.toLowerCase().includes(searchTerm.toLowerCase()) || record.date.includes(searchTerm) : true;
    const slotMatch = selectedSlot ? record.slot === selectedSlot : true;
    const statusMatch = selectedStatus ? record.status === selectedStatus : true;
    const panelMatch = selectedPanel ? record.panels === selectedPanel : true;
    const recordPanelList = record.panels.split(',').map((p: string) => p.trim());
    const typeMatch = selectedTypes.length === 0 ? true : selectedTypes.some(type => recordPanelList.includes(type));
    const recordDate = parseDate(record.date);
    const fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
    const toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;
    return searchMatch && slotMatch && typeMatch && statusMatch && panelMatch && fromMatch && toMatch;
  }).filter(record => !hideRows.includes(record.id));

  // Use table state hook for pagination, sorting, and selection
  const {
    data: paginatedData,
    currentPage,
    totalPages,
    selected,
    handlePageChange,
    handleSelectChange,
    handleSelectAll: handleSelectAllBase,
    handleSort,
    sortConfig
  } = useTableState(filteredRecords, {
    initialPageSize: TESTS_PER_PAGE
  });

  const handleSelectAllWrapper = (checked: boolean) => {
    handleSelectAllBase(checked);
  };

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
    });  }, []);

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
      <ExaminationsTable
        filteredRecords={paginatedData}
        slotTimeMap={slotMap}
        selected={selected as number[]}
        onSelectChange={handleSelectChange}
        onSelectAll={handleSelectAllWrapper}
        hideRows={hideRows}
        onDeleteRows={(ids: number[]) => {
          setHideRows(prev => [...prev, ...ids]);
          handleSelectChange([]);
        }}
        onViewRows={(ids: number[]) => {
          if (ids && ids.length > 0) {
            setCurrentExaminationId(ids[0]);
            setShowResultPopup(true);
          }
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={TESTS_PER_PAGE}
        totalItems={filteredRecords.length}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      {/* Pagination is now handled by the Examinations component */}
      {showResultPopup && currentExaminationId !== null && (
        <TestResultPopup onClose={() => { setShowResultPopup(false); setCurrentExaminationId(null); }} examinationId={currentExaminationId} />
      )}
    </div>
  );
};

export default Examinations;