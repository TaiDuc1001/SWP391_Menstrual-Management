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
  { id: 5, name: 'BS. Nguyễn Văn A', date: '15/05/2024', time: '11:00', status: 'Upcoming', code: 'TV20011', slot: 'morning' },
  { id: 6, name: 'BS. Trần Thị B', date: '14/05/2024', time: '14:00', status: 'Completed', code: 'TV20012', slot: 'afternoon' },
  { id: 7, name: 'BS. Lê Văn C', date: '13/05/2024', time: '19:00', status: 'Cancelled', code: 'TV20013', slot: 'evening' },
  { id: 8, name: 'BS. Nguyễn Thị D', date: '12/05/2024', time: '08:30', status: 'Confirmed', code: 'TV20014', slot: 'morning' },
  { id: 9, name: 'BS. Phạm Văn E', date: '11/05/2024', time: '16:00', status: 'Pending', code: 'TV20015', slot: 'afternoon' },
  { id: 10, name: 'BS. Đỗ Thị F', date: '10/05/2024', time: '20:00', status: 'Upcoming', code: 'TV20016', slot: 'evening' },
  { id: 11, name: 'BS. Nguyễn Văn G', date: '09/05/2024', time: '09:30', status: 'Completed', code: 'TV20017', slot: 'morning' },
  { id: 12, name: 'BS. Trần Thị H', date: '08/05/2024', time: '13:00', status: 'Cancelled', code: 'TV20018', slot: 'afternoon' },
  { id: 13, name: 'BS. Lê Văn I', date: '07/05/2024', time: '18:30', status: 'Confirmed', code: 'TV20019', slot: 'evening' },
  { id: 14, name: 'BS. Nguyễn Thị K', date: '06/05/2024', time: '10:00', status: 'Pending', code: 'TV20020', slot: 'morning' },
  { id: 15, name: 'BS. Phạm Văn L', date: '05/05/2024', time: '15:30', status: 'Upcoming', code: 'TV20021', slot: 'afternoon' },
  { id: 16, name: 'BS. Đỗ Thị M', date: '04/05/2024', time: '19:30', status: 'Completed', code: 'TV20022', slot: 'evening' },
  { id: 17, name: 'BS. Nguyễn Văn N', date: '03/05/2024', time: '08:00', status: 'Cancelled', code: 'TV20023', slot: 'morning' },
  { id: 18, name: 'BS. Trần Thị O', date: '02/05/2024', time: '12:30', status: 'Confirmed', code: 'TV20024', slot: 'afternoon' },
  { id: 19, name: 'BS. Lê Văn P', date: '01/05/2024', time: '17:00', status: 'Pending', code: 'TV20025', slot: 'evening' },
  { id: 20, name: 'BS. Nguyễn Thị Q', date: '30/04/2024', time: '09:00', status: 'Upcoming', code: 'TV20026', slot: 'morning' },
];

const APPOINTMENTS_PER_PAGE = 5;

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
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.ceil(filteredRecords.length / APPOINTMENTS_PER_PAGE);
  const startIdx = (currentPage - 1) * APPOINTMENTS_PER_PAGE;
  const endIdx = startIdx + APPOINTMENTS_PER_PAGE;
  const pagedRecords = filteredRecords.slice(startIdx, endIdx);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedSlot, selectedDateFrom, selectedDateTo]);

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
        onNewAppointment={() => { navigate('/appointments/book'); }}
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
        currentPage={currentPage}
        appointmentsPerPage={APPOINTMENTS_PER_PAGE}
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
              problem: 'Sample problem description',
              doctorNote: "Sample doctor's note",
              rating: 4,
              ratingComment: 'The doctor was very dedicated.'
            });
            setShowDetailPopup(true);
          }
        }}
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
