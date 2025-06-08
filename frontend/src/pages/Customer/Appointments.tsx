import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

import plusWhiteIcon from '../../assets/icons/plus-white.svg';
import AppointmentTitleBar from '../../components/TitleBar/AppointmentTitleBar';
import AppointmentUtilityBar from '../../components/UtilityBar/AppointmentUtilityBar';
import AppointmentTable from '../../components/Table/AppointmentTable';
import SearchInput from '../../components/Filter/SearchInput';
import DropdownSelect from '../../components/Filter/DropdownSelect';
import DatePickerInput from '../../components/Filter/DatePickerInput';
import AppointmentDetailPopup from '../../components/Popup/AppointmentDetailPopup';
import TestResultPopup from '../../components/Popup/TestResultPopup';

const plusIcon = plusWhiteIcon;

const statusOptions = [
  { value: '', label: 'All status' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Pending', label: 'Pending' },
];

const slotOptions = [
  { value: '', label: 'All slots' },
  { value: 'morning', label: 'Morning (08:00 - 12:00)' },
  { value: 'afternoon', label: 'Afternoon (13:00 - 17:00)' },
  { value: 'evening', label: 'Evening (18:00 - 21:00)' },
];
const slotTimeMap: Record<string, string> = {
  morning: '08:00 - 12:00',
  afternoon: '13:00 - 17:00',
  evening: '18:00 - 21:00',
};

const mockAppointments = [
  { id: 1, name: 'BS. Lê Văn Anh', date: '27/05/2024', time: '15:00', status: 'Completed', code: 'TV20201', slot: 'afternoon' },
  { id: 2, name: 'BS. Nguyễn Hoàng Đức', date: '22/05/2024', time: '10:30', status: 'Cancelled', code: 'TV20032', slot: 'morning' },
  { id: 3, name: 'BS. Hà Quỳnh Trang', date: '20/05/2024', time: '18:00', status: 'Confirmed', code: 'TV20027', slot: 'evening' },
  { id: 4, name: 'BS. Trần Minh Phương', date: '18/05/2024', time: '09:00', status: 'Pending', code: 'TV20010', slot: 'morning' },
];

const AppointmentHistory: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(null);
  const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(null);
  const [hideRows, setHideRows] = useState<number[]>([]);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const navigate = useNavigate();

  const parseDate = (str: string) => {
    const [day, month, year] = str.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredRecords = mockAppointments.filter((record) => {
    if (hideRows.includes(record.id)) return false;
    const searchMatch =
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.code.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = selectedStatus ? record.status === selectedStatus : true;
    const recordDate = parseDate(record.date);
    const fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
    const toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;
    const slotMatch = selectedSlot ? record.slot === selectedSlot : true;
    return searchMatch && statusMatch && fromMatch && toMatch && slotMatch;
  });

  const handleCheckboxChange = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
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
      <AppointmentTitleBar
        title="Appointment history"
        onNewAppointment={() => { /* navigate to new appointment page if needed */ }}
        icon={<img src={plusIcon} alt="Plus" className="w-5 h-5" />}
        buttonText="New appointment"
      />
      <AppointmentUtilityBar>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by doctor name or code"
        />
        <DropdownSelect
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={statusOptions}
        />
        <DropdownSelect
          value={selectedSlot}
          onChange={setSelectedSlot}
          options={slotOptions}
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
      </AppointmentUtilityBar>
      <AppointmentTable
        records={filteredRecords.map(r => ({ ...r, slotTime: slotTimeMap[r.slot] || r.time }))}
        selected={selected}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectAll={handleSelectAll}
        hideRows={hideRows}
        onCancelRows={(ids) => {
          setHideRows(prev => [...prev, ...ids]);
          setSelected([]);
        }}
        onViewRows={(ids) => {
          const appointment = filteredRecords.find(r => r.id === ids[0]);
          if (appointment) {
            setSelectedAppointment({
              name: appointment.name,
              code: appointment.code,
              date: appointment.date,
              time: appointment.time,
              status: appointment.status,
              problem: 'Mô tả vấn đề mẫu',
              doctorNote: 'Ghi chú từ bác sĩ mẫu',
              rating: 4,
              ratingComment: 'Bác sĩ rất tận tình.'
            });
            setShowDetailPopup(true);
          }
        }}
      />
      {showDetailPopup && selectedAppointment && (
        <AppointmentDetailPopup
          open={showDetailPopup}
          onClose={() => setShowDetailPopup(false)}
          appointment={selectedAppointment}
        />
      )}
      {showResultPopup && (
        <TestResultPopup onClose={() => setShowResultPopup(false)} />
      )}
    </div>
  );
};

export default AppointmentHistory;
