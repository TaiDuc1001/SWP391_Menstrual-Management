import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

import api from '../../api/axios';
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

const APPOINTMENTS_PER_PAGE = 5;

const AppointmentHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [slotOptions, setSlotOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'All slots' }]);
  const [slotMap, setSlotMap] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const parseDate = (str: string) => {
    const [day, month, year] = str.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Fetch slot options from backend
  useEffect(() => {
    api.get('/enumerators/slots')
      .then(res => {
        const options = [{ value: '', label: 'All slots' }];
        const map: { [key: string]: string } = {};
        res.data.forEach((slot: any) => {
          if (slot.timeRange !== 'Filler slot, not used') { // Exclude filler slot
            options.push({ value: slot.timeRange, label: slot.timeRange });
          }
          map[slot.timeRange] = slot.timeRange;
        });
        setSlotOptions(options);
        setSlotMap(map);
      })
      .catch(() => {});
  }, []);

  // Reset selectedSlot if not in options (but only if not empty)
  useEffect(() => {
    if (selectedSlot && !slotOptions.some(opt => opt.value === selectedSlot)) {
      setSelectedSlot('');
    }
  }, [slotOptions, selectedSlot]);

  // Fetch appointments only after slotMap is set (not empty)
  useEffect(() => {
    if (Object.keys(slotMap).length === 0) return;
    setLoading(true);
    api.get('/appointments')
      .then(res => {
        const mapped = res.data.map((item: any) => {
          const slotTime = item.timeRange || (item.slot ? slotMap[item.timeRange] || item.timeRange : '');
          return {
            id: item.id,
            name: item.doctorName,
            date: item.date ? new Date(item.date).toLocaleDateString('en-GB') : '',
            time: slotTime,
            status: item.appointmentStatus.charAt(0) + item.appointmentStatus.slice(1).toLowerCase(),
            code: '',
            slot: slotTime,
            slotCode: item.slot,
            slotTime: slotTime,
          };
        });
        setAppointments(mapped);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load appointments');
        setLoading(false);
      });
  }, [slotMap]);

  const filteredRecords = appointments.filter((record) => {
    if (hideRows.includes(record.id)) return false;
    const searchMatch =
      (record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.code?.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusMatch = selectedStatus ? record.status === selectedStatus : true;
    const recordDate = parseDate(record.date);
    const fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
    const toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;
    // Compare slot as timeRange string
    const slotMatch = selectedSlot ? record.slotTime === selectedSlot : true;
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

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

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
        records={filteredRecords.map(r => ({ ...r, slotTime: r.time, slot: r.slot }))}
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
