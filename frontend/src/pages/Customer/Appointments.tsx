import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import plusWhiteIcon from '../../assets/icons/plus-white.svg';
import AppointmentTitleBar from '../../components/feature/TitleBar/AppointmentTitleBar';
import AppointmentUtilityBar from '../../components/feature/UtilityBar/AppointmentUtilityBar';
import AppointmentTable from '../../components/feature/Table/AppointmentTable';
import SearchInput from '../../components/feature/Filter/SearchInput';
import DropdownSelect from '../../components/feature/Filter/DropdownSelect';
import DatePickerInput from '../../components/feature/Filter/DatePickerInput';
import AppointmentDetailPopup from '../../components/feature/Popup/AppointmentDetailPopup';
import TestResultPopup from '../../components/feature/Popup/TestResultPopup';
import StatusBadge from '../../components/common/Badge/StatusBadge';

const plusIcon = plusWhiteIcon;

const APPOINTMENTS_PER_PAGE = 5;

const AppointmentHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusOptions, setStatusOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'All status' }]);
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
  };  useEffect(() => {
    api.get('/enumerators/slots')
      .then(res => {
        const options = [{ value: '', label: 'All slots' }];
        const map: { [key: string]: string } = {};
        res.data.forEach((slot: any) => {
          if (slot.timeRange !== 'Filler slot, not used') {
            options.push({ value: slot.timeRange, label: slot.timeRange });
          }
          map[slot.timeRange] = slot.timeRange;
        });
        setSlotOptions(options);
        setSlotMap(map);
      })
      .catch((error) => {
        console.error('Error loading slots:', error);
      });

    api.get('/enumerators/appointment-status')
      .then(res => {
        const options = [{ value: '', label: 'All status' }];
        res.data.forEach((status: string) => {
          options.push({ value: status, label: status.charAt(0) + status.slice(1).toLowerCase() });
        });
        setStatusOptions(options);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedSlot && !slotOptions.some(opt => opt.value === selectedSlot)) {
      setSelectedSlot('');
    }
  }, [slotOptions, selectedSlot]);  useEffect(() => {
    // Load appointments even if slotMap is empty - we can display basic info
    setLoading(true);    api.get('/appointments')
      .then(res => {
        const mapped = res.data.map((item: any) => {
          const slotTime = item.timeRange || (item.slot ? slotMap[item.timeRange] || item.timeRange : '');
          let status;
          switch (item.appointmentStatus) {
            case 'WAITING_FOR_DOCTOR':
              status = 'Waiting for Doctor';
              break;
            case 'WAITING_FOR_CUSTOMER':
              status = 'Waiting for Customer';
              break;
            default:
              status = item.appointmentStatus.charAt(0) + item.appointmentStatus.slice(1).toLowerCase().replace('_', ' ');
          }
          return {
            id: item.id,
            name: item.doctorName,
            date: item.date ? new Date(item.date).toLocaleDateString('en-GB') : '',
            time: slotTime,
            status,
            appointmentStatus: item.appointmentStatus,
            code: '',
            slot: slotTime,
            slotCode: item.slot,
            slotTime: slotTime,
          };
        });
        setAppointments(mapped);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading appointments:', error);
        setError('Failed to load appointments');
        setLoading(false);
      });
  }, [slotMap]);

  const filteredRecords = appointments.filter((record) => {
    if (hideRows.includes(record.id)) return false;
    const searchMatch =
      (record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.code?.toLowerCase().includes(searchTerm.toLowerCase()));
    const statusMatch = selectedStatus ? record.appointmentStatus === selectedStatus : true;
    const recordDate = parseDate(record.date);
    const fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
    const toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;
    const slotMatch = selectedSlot ? record.slotTime === selectedSlot : true;
    return searchMatch && statusMatch && fromMatch && toMatch && slotMatch;
  });

  const totalPages = Math.ceil(filteredRecords.length / APPOINTMENTS_PER_PAGE);
  const startIdx = (currentPage - 1) * APPOINTMENTS_PER_PAGE;
  const endIdx = startIdx + APPOINTMENTS_PER_PAGE;

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
        records={filteredRecords.map(r => ({
          ...r,
          slotTime: r.time,
          slot: r.slot,
          status: r.status
        }))}
        selected={selected}
        handleCheckboxChange={handleCheckboxChange}
        handleSelectAll={handleSelectAll}
        hideRows={hideRows}
        currentPage={currentPage}
        appointmentsPerPage={APPOINTMENTS_PER_PAGE}
        onCancelRows={(ids) => {
          setHideRows(prev => [...prev, ...ids]);
          setSelected([]);
        }}        onConfirmRows={async (ids) => {
          try {
            await api.put(`/appointments/customer/confirm/${ids[0]}`);
            // Refresh appointments after confirmation
            const res = await api.get('/appointments');
            const mapped = res.data.map((item: any) => {
              const slotTime = item.timeRange || (item.slot ? slotMap[item.timeRange] || item.timeRange : '');
              let status;
              switch (item.appointmentStatus) {
                case 'WAITING_FOR_DOCTOR':
                  status = 'Waiting for Doctor';
                  break;
                case 'WAITING_FOR_CUSTOMER':
                  status = 'Waiting for Customer';
                  break;
                default:
                  status = item.appointmentStatus.charAt(0) + item.appointmentStatus.slice(1).toLowerCase().replace('_', ' ');
              }
              return {
                id: item.id,
                name: item.doctorName,
                date: item.date ? new Date(item.date).toLocaleDateString('en-GB') : '',
                time: slotTime,
                status,
                appointmentStatus: item.appointmentStatus,
                code: '',
                slot: slotTime,
                slotCode: item.slot,
                slotTime: slotTime,
              };
            });
            setAppointments(mapped);
            alert('Meeting is starting! You can now join the meeting.');
          } catch (error) {
            console.error('Error confirming appointment:', error);
            alert('Failed to confirm appointment');
          }
        }}
        onJoinMeeting={(id) => {
          const appointment = filteredRecords.find(r => r.id === id);
          if (appointment) {
            // In a real app, this would come from the appointment data
            window.open('https://meet.google.com/rzw-jwjr-udw', '_blank');
          }
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
