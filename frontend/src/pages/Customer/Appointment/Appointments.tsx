import React, {useEffect, useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {useNavigate} from 'react-router-dom';
import api from '../../../api/axios';
import {useTableState} from '../../../api/hooks';
import plusWhiteIcon from '../../../assets/icons/plus-white.svg';
import AppointmentTitleBar from '../../../components/feature/TitleBar/AppointmentTitleBar';
import AppointmentUtilityBar from '../../../components/feature/UtilityBar/AppointmentUtilityBar';
import Appointments from '../../../components/feature/Table/Customer/Appointments';
import SearchInput from '../../../components/feature/Filter/SearchInput';
import DropdownSelect from '../../../components/feature/Filter/DropdownSelect';
import DatePickerInput from '../../../components/feature/Filter/DatePickerInput';
import AppointmentDetailPopup from '../../../components/feature/Popup/AppointmentDetailPopup';
import TestResultPopup from '../../../components/feature/Popup/TestResultPopup';

const plusIcon = plusWhiteIcon;

const AppointmentHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [slotOptions, setSlotOptions] = useState<{ value: string; label: string }[]>([{ value: '', label: 'All slots' }]);
  const [slotMap, setSlotMap] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const parseDate = (str: string) => {
    const [day, month, year] = str.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredRecords = appointments.filter((record: any) => {
    if (hideRows.includes(record.id)) return false;
    
    const searchMatch = searchTerm ? 
      record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm) ||
      record.status?.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    
    const statusMatch = selectedStatus ? record.appointmentStatus === selectedStatus : true;
    const slotMatch = selectedSlot ? record.time === selectedSlot : true;
    
    let fromMatch = true;
    let toMatch = true;
    
    if (selectedDateFrom || selectedDateTo) {
      try {
        const recordDate = parseDate(record.date);
        fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
        toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;
      } catch {
        fromMatch = toMatch = true;
      }
    }
    
    return searchMatch && statusMatch && slotMatch && fromMatch && toMatch;
  });
  const {
    data: paginatedData,
    currentPage,
    totalPages,
    selected,
    handlePageChange,
    handleSelectChange,
    handleSelectAll,
    handleSort,
    sortConfig
  } = useTableState(filteredRecords, {
    initialPageSize: 5
  });useEffect(() => {
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
  }, [slotOptions, selectedSlot]);

  useEffect(() => {
    setLoading(true);
    api.get('/appointments')
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

  const handleConfirmRows = async (ids: number[]) => {
    try {
      await api.put(`/appointments/customer/confirm/${ids[0]}`);
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
  };

  const handleCancelRows = (ids: number[]) => {
    setHideRows(prev => [...prev, ...ids]);
    handleSelectChange([]);
  };
  const handleViewRows = (ids: number[]) => {
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
  };

  const handleJoinMeeting = (id: number) => {
    const appointment = filteredRecords.find(r => r.id === id);
    if (appointment) {
      window.open('https://meet.google.com/rzw-jwjr-udw', '_blank');
    }
  };

  const handleViewAppointmentDetail = (id: number) => {
    navigate(`/customer/appointments/${id}`);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <AppointmentTitleBar
        title="Appointment history"
        onNewAppointment={() => { navigate('/customer/appointments/book'); }}
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
      </AppointmentUtilityBar>      <Appointments
        records={paginatedData.map(r => ({
          ...r,
          doctor: r.name,
          slotTime: r.time,
          slot: r.slot,
          status: r.status
        }))}
        selected={selected as number[]}
        onSelectChange={handleSelectChange}
        onSelectAll={handleSelectAll}
        hideRows={hideRows}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={5}
        totalItems={filteredRecords.length}
        sortConfig={sortConfig}
        onSort={handleSort}
        loading={loading}
        onCancelRows={handleCancelRows}
        onConfirmRows={handleConfirmRows}
        onJoinMeeting={handleJoinMeeting}
        onViewRows={handleViewRows}
        onViewAppointmentDetail={handleViewAppointmentDetail}
      />{showDetailPopup && selectedAppointment && (
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
