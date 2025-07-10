import React, {useEffect, useState} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {useNavigate} from 'react-router-dom';
import api from '../../../api/axios';
import {useTableState} from '../../../api/hooks';
import {useSlotOptions, useStatusOptions} from '../../../utils';
import {formatAppointmentStatus, createMultiFieldSearch, createDateFilter} from '../../../utils/statusMappings';
import plusWhiteIcon from '../../../assets/icons/plus-white.svg';
import AppointmentTitleBar from '../../../components/feature/TitleBar/AppointmentTitleBar';
import AppointmentUtilityBar from '../../../components/feature/UtilityBar/AppointmentUtilityBar';
import Appointments from '../../../components/feature/Table/Customer/Appointments';
import {SearchInput} from '../../../components';
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
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(null);
    const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(null);
    const [hideRows, setHideRows] = useState<number[]>([]);
    const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [showResultPopup, setShowResultPopup] = useState(false);
    const navigate = useNavigate();

    const {slotOptions, slotMap} = useSlotOptions();
    const statusOptions = useStatusOptions('/enumerators/appointment-status');

    const parseDate = (str: string) => {
        const [day, month, year] = str.split('/').map(Number);
        return new Date(year, month - 1, day);
    };

    const filteredRecords = appointments.filter((record: any) => {
        if (hideRows.includes(record.id)) return false;

        // Enhanced search using multi-field search
        const searchFields = ['name', 'doctor', 'date', 'status', 'appointmentStatus', 'id'];
        const searchMatch = createMultiFieldSearch(searchTerm, searchFields)(record);

        // Status filter - match both display status and raw appointment status
        const statusMatch = selectedStatus ? (
            record.appointmentStatus === selectedStatus ||
            record.status === selectedStatus ||
            record.status.toLowerCase() === selectedStatus.toLowerCase()
        ) : true;
        
        // Slot filter - match time slot with multiple field support
        const slotMatch = selectedSlot ? (
            record.time === selectedSlot || 
            record.slotTime === selectedSlot ||
            record.timeRange === selectedSlot ||
            record.slot === selectedSlot
        ) : true;

        // Enhanced date filtering
        const dateFilter = createDateFilter(selectedDateFrom, selectedDateTo, 'date');
        let dateMatch = true;
        
        // Custom date parsing for DD/MM/YYYY format
        if (selectedDateFrom || selectedDateTo) {
            try {
                const recordDate = parseDate(record.date);
                const fromMatch = selectedDateFrom ? recordDate >= selectedDateFrom : true;
                const toMatch = selectedDateTo ? recordDate <= selectedDateTo : true;
                dateMatch = fromMatch && toMatch;
            } catch {
                dateMatch = true; // Include item if date parsing fails
            }
        }

        return searchMatch && statusMatch && slotMatch && dateMatch;
    });
    const {
        data: paginatedData,
        currentPage,
        totalPages,
        selected,
        handlePageChange,
        handleSelectChange, handleSelectAll,
        handleSort,
        sortConfig
    } = useTableState(filteredRecords, {
        initialPageSize: 5,
        initialSortConfig: { key: 'rawDate', direction: 'desc' }
    });

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
                        rawDate: item.date ? new Date(item.date) : null, // Keep raw date for sorting
                    };
                });
                
                // Sort by date descending (newest first)
                const sortedMapped = mapped.sort((a: any, b: any) => {
                    if (!a.rawDate && !b.rawDate) return 0;
                    if (!a.rawDate) return 1;
                    if (!b.rawDate) return -1;
                    return b.rawDate.getTime() - a.rawDate.getTime();
                });
                
                setAppointments(sortedMapped);
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
                    rawDate: item.date ? new Date(item.date) : null, // Keep raw date for sorting
                };
            });
            
            // Sort by date descending (newest first)
            const sortedMapped = mapped.sort((a: any, b: any) => {
                if (!a.rawDate && !b.rawDate) return 0;
                if (!a.rawDate) return 1;
                if (!b.rawDate) return -1;
                return b.rawDate.getTime() - a.rawDate.getTime();
            });
            
            setAppointments(sortedMapped);
            // alert('Meeting is starting! You can now join the meeting.');
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

    const handleCheckout = (id: number) => {
        navigate(`/customer/vnpay-checkout/${id}`);
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <AppointmentTitleBar
                title="Appointment history"
                onNewAppointment={() => {
                    navigate('/customer/appointments/book');
                }}
                icon={<img src={plusIcon} alt="Plus" className="w-5 h-5"/>}
                buttonText="New appointment"
            />
            <AppointmentUtilityBar>
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search by doctor name or code"
                />
                <div className="dropdown-full-width">
                    <DropdownSelect
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        options={statusOptions}
                        placeholder="Status"
                    />
                </div>
                <div className="dropdown-full-width">
                    <DropdownSelect
                        value={selectedSlot}
                        onChange={setSelectedSlot}
                        options={slotOptions}
                        placeholder="Time Slot"
                    />
                </div>
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
            </AppointmentUtilityBar> <Appointments
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
            onConfirmRows={handleConfirmRows}            onJoinMeeting={handleJoinMeeting}
            onViewRows={handleViewRows}
            onViewAppointmentDetail={handleViewAppointmentDetail}
            onCheckout={handleCheckout}
        />{showDetailPopup && selectedAppointment && (
            <AppointmentDetailPopup
                open={showDetailPopup}
                onClose={() => setShowDetailPopup(false)}
                appointment={selectedAppointment}
            />
        )}
            {showResultPopup && (
                <TestResultPopup onClose={() => setShowResultPopup(false)}/>
            )}
        </div>
    );
};

export default AppointmentHistory;
