import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

import plusWhiteIcon from '../../assets/icons/plus-white.svg';

import TestingTitleBar from '../../components/TitleBar/TestingTitleBar';
import TestingUtilityBar from '../../components/UtilityBar/TestingUtilityBar';
import TestTable from '../../components/Table/TestTable';
import SearchInput from '../../components/Filter/SearchInput';
import DropdownSelect from '../../components/Filter/DropdownSelect';
import MultiSelectDropdown from '../../components/Filter/MultiSelectDropdown';
import DatePickerInput from '../../components/Filter/DatePickerInput';

const plusIcon = plusWhiteIcon; 

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
  const navigate = useNavigate();

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
      slotTimeMap[record.slot].includes(searchTerm) ||
      record.panels.toLowerCase().includes(searchTerm.toLowerCase());

    const slotMatch = selectedSlot ? record.slot === selectedSlot : true;

    const recordPanelList = record.panels.split(',').map(p => p.trim());
    const typeMatch = selectedTypes.length === 0 ? true : selectedTypes.some(type => recordPanelList.includes(type));

    const statusMatch = selectedStatus ? record.status === selectedStatus : true;

    const recordDate = parseDate(record.date);
    const fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
    const toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;

    return searchMatch && slotMatch && typeMatch && statusMatch && fromMatch && toMatch;
  });
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
          placeholder="Search by date, time, or test panels"
        />
        <DropdownSelect
          value={selectedSlot}
          onChange={setSelectedSlot}
          options={[{ value: '', label: 'All slots' }, ...Object.entries(slotTimeMap).map(([slot, time]) => ({ value: slot, label: `Slot ${slot}` }))]}
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
        onViewRows={(ids) => {
          setHideRows(prev => [...prev, ...ids]);
          setSelected([]);
        }}
      />
    </div>
  );
};

export default STITests;