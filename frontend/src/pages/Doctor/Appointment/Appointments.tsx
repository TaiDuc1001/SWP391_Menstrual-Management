import React, {useEffect, useState} from 'react';
import api from '../../../api/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NotificationPopup from '../../../components/feature/Popup/NotificationPopup';
import refreshIcon from '../../../assets/icons/refresh.svg';

interface Appointment {
    id: number;
    customerId: number;
    customerName: string;
    doctorId: number;
    date: string;
    timeRange: string;
    doctorName: string;
    appointmentStatus: string;
    customerNote?: string;
    doctorNote?: string;
    url?: string;
    phoneNumber?: string;
}

type ViewType = 'day' | 'week' | 'month';

interface NotificationState {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
}

interface CancelModalState {
    isOpen: boolean;
    appointmentId: number | null;
}

interface DetailModalState {
    isOpen: boolean;
    appointment: Appointment | null;
}

const Appointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [viewType, setViewType] = useState<ViewType>('day');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [notification, setNotification] = useState<NotificationState>({
        isOpen: false,
        message: '',
        type: 'success',
    });
    const [cancelModal, setCancelModal] = useState<CancelModalState>({
        isOpen: false,
        appointmentId: null,
    });
    const [detailModal, setDetailModal] = useState<DetailModalState>({
        isOpen: false,
        appointment: null,
    });
    const [joinedMeetings, setJoinedMeetings] = useState<Set<number>>(new Set());

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({
            isOpen: true,
            message,
            type,
        });
        setTimeout(() => {
            setNotification(prev => ({...prev, isOpen: false}));
        }, 3000);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments/doctor');
            console.log('All appointments:', response.data); 
            const filteredAppointments = response.data.filter(
                (apt: Appointment) =>
                    (apt.appointmentStatus === 'BOOKED' ||
                        apt.appointmentStatus === 'CONFIRMED' ||
                        apt.appointmentStatus === 'WAITING_FOR_CUSTOMER' ||
                        apt.appointmentStatus === 'WAITING_FOR_DOCTOR' ||
                        apt.appointmentStatus === 'WAITING' ||
                        apt.appointmentStatus === 'IN_PROGRESS')
            );
            console.log('Filtered appointments:', filteredAppointments); 
            setAppointments(filteredAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const normalizeDate = (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const filterAppointmentsByDate = (date: Date) => {
        const normalizedDate = normalizeDate(date);
        return appointments.filter(apt => {
            const aptDate = normalizeDate(new Date(apt.date));
            switch (viewType) {
                case 'day':
                    return aptDate.getTime() === normalizedDate.getTime();

                case 'week': {
                    const startOfWeek = new Date(normalizedDate);
                    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                    startOfWeek.setHours(0, 0, 0, 0);
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    endOfWeek.setHours(23, 59, 59, 999);
                    return aptDate >= startOfWeek && aptDate <= endOfWeek;
                }

                case 'month':
                    return (
                        aptDate.getMonth() === normalizedDate.getMonth() &&
                        aptDate.getFullYear() === normalizedDate.getFullYear()
                    );

                default:
                    return false;
            }
        });
    };

    const handleDateChange = (days: number) => {
        const newDate = new Date(selectedDate);
        switch (viewType) {
            case 'day':
                newDate.setDate(selectedDate.getDate() + days);
                break;
            case 'week':
                newDate.setDate(selectedDate.getDate() + days * 7);
                break;
            case 'month':
                newDate.setMonth(selectedDate.getMonth() + days);
                break;
        }
        setSelectedDate(newDate);
    };

    const handleStartMeeting = async (appointment: Appointment) => {
        if (appointment.url) {
            try {
                const response = await api.put(`/appointments/confirm/${appointment.id}`);
                if (response.status === 200) {
                    window.open(appointment.url, '_blank');
                    await fetchAppointments();                    showNotification('Meeting started successfully!', 'success');
                } else {
                    showNotification('Unable to confirm meeting. Please try again!', 'error');
                }
            } catch (error) {
                console.error('Error confirming appointment:', error);
                showNotification('Error confirming meeting!', 'error');
            }        } else {
            showNotification('Meeting link not found!', 'error');
        }
    };
    const handleJoinMeeting = (appointment: Appointment) => {
        const meetingUrl = appointment.url || 'https://meet.google.com/rzw-jwjr-udw';
        window.open(meetingUrl, '_blank');

        setJoinedMeetings(prev => new Set(prev).add(appointment.id));
        showNotification('Joined meeting successfully!', 'success');
    };
    const handleEndMeeting = async (appointmentId: number) => {
        try {
            const response = await api.put(`/appointments/finish/${appointmentId}`);
            if (response.status === 200) {
                showNotification('Meeting ended successfully!', 'success');
                setJoinedMeetings(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(appointmentId);
                    return newSet;
                });
                await fetchAppointments();
            }
        } catch (error) {
            console.error('Error ending meeting:', error);
            showNotification('Error ending meeting!', 'error');
        }
    };
    const handleDoctorConfirm = async (appointment: Appointment) => {
        try {
            const response = await api.put(`/appointments/doctor/confirm/${appointment.id}`);
            if (response.status === 200) {
                const updatedAppointment = response.data;

                
                if (updatedAppointment.appointmentStatus === 'IN_PROGRESS') {
                    showNotification('Both parties confirmed! Starting meeting...', 'success');

                } else if (updatedAppointment.appointmentStatus === 'WAITING_FOR_CUSTOMER') {
                    showNotification('You confirmed! Waiting for customer to confirm...', 'success');
                } else if (updatedAppointment.appointmentStatus === 'WAITING') {
                    showNotification('You confirmed! Waiting for customer to confirm...', 'success');
                } else {
                    showNotification('Confirmed successfully!', 'success');
                }

                
                await fetchAppointments();
            }
        } catch (error) {            console.error('Error confirming appointment:', error);
            showNotification('Error occurred while confirming!', 'error');
        }
    };

    const handleCancelAppointment = async (appointmentId: number) => {
        try {
            const response = await api.put(`http://localhost:8080/api/appointments/cancel/${appointmentId}`);            if (response.status === 200) {
                showNotification('Appointment cancelled successfully!', 'success');
                await fetchAppointments();
                closeCancelModal();
            } else {
                showNotification('Unable to cancel appointment. Please try again later!', 'error');
            }
        } catch (error) {
            console.error('Error canceling appointment:', error);
            showNotification('Error occurred while cancelling appointment!', 'error');
        }
    };

    const formatDateRange = () => {
        switch (viewType) {
            case 'day':
                return selectedDate.toLocaleDateString('vi-VN', {
                    weekday: 'long',
                });
            case 'week': {
                const startOfWeek = new Date(selectedDate);
                startOfWeek.setDate(selectedDate.getDate() - startOfWeek.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6);
                return `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1}-${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}`;
            }            case 'month':
                return `Month ${selectedDate.getMonth() + 1}`;
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchAppointments();        setIsRefreshing(false);
        showNotification('Data refreshed', 'success');
    };

    const openCancelModal = (appointmentId: number) => {
        setCancelModal({
            isOpen: true,
            appointmentId
        });
    };

    const closeCancelModal = () => {
        setCancelModal({
            isOpen: false,
            appointmentId: null
        });
    };

    const openDetailModal = (appointment: Appointment) => {
        setDetailModal({
            isOpen: true,
            appointment
        });
    };

    const closeDetailModal = () => {
        setDetailModal({
            isOpen: false,
            appointment: null
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <NotificationPopup
                    isOpen={notification.isOpen}
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(prev => ({...prev, isOpen: false}))}
                />
                
                {cancelModal.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg w-[400px] shadow-xl">
                            <div className="p-6">                                <h3 className="text-xl font-semibold text-center">Confirm Cancel Appointment</h3>
                                <p className="text-gray-600 text-center mt-4 mb-2">
                                    Are you sure you want to cancel this appointment?
                                </p>
                                <p className="text-red-600 text-center text-base font-semibold mb-6">
                                    This action cannot be undone.
                                </p>

                                <div className="flex justify-center space-x-3">
                                    <button
                                        onClick={closeCancelModal}                                        className="px-8 py-2 font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded transition-colors border border-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => cancelModal.appointmentId && handleCancelAppointment(cancelModal.appointmentId)}
                                        className="px-8 py-2 font-medium text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
                                    >
                                        Confirm Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}                
                {detailModal.isOpen && detailModal.appointment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-[800px] max-h-[90vh] overflow-y-auto shadow-xl">
                            <div className="p-8">                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800">Appointment Details</h3>
                                        <p className="text-gray-500 mt-1">APT-{String(detailModal.appointment.id).padStart(4, '0')}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">                                        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-lg ${
                                            detailModal.appointment.appointmentStatus === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                                            detailModal.appointment.appointmentStatus === 'CONFIRMED' ? 'bg-orange-100 text-orange-800' :
                                            (detailModal.appointment.appointmentStatus === 'WAITING' || 
                                             detailModal.appointment.appointmentStatus === 'WAITING_FOR_CUSTOMER' || 
                                             detailModal.appointment.appointmentStatus === 'WAITING_FOR_DOCTOR') ? 'bg-purple-100 text-purple-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {detailModal.appointment.appointmentStatus === 'BOOKED' ? 'BOOKED' :
                                             detailModal.appointment.appointmentStatus === 'CONFIRMED' ? 'CONFIRMED' :
                                             detailModal.appointment.appointmentStatus === 'WAITING_FOR_CUSTOMER' ? 'WAITING FOR CUSTOMER' :
                                             detailModal.appointment.appointmentStatus === 'WAITING_FOR_DOCTOR' ? 'WAITING FOR DOCTOR' :
                                             detailModal.appointment.appointmentStatus === 'WAITING' ? 'WAITING' :
                                             'IN PROGRESS'}
                                        </span>
                                        <button
                                            onClick={closeDetailModal}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="flex items-center space-x-4 p-4 bg-pink-50 rounded-lg">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Date</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {new Date(detailModal.appointment.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">Time</p>
                                                <p className="text-lg font-semibold text-gray-900">{detailModal.appointment.timeRange}</p>
                                            </div>
                                        </div>
                                    </div>                                    
                                    
                                    
                                    {detailModal.appointment.customerName && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Customer</p>
                                                    <p className="text-lg font-semibold text-gray-900">{detailModal.appointment.customerName}</p>
                                                </div>
                                            </div>
                                            

                                            
                                            {detailModal.appointment.phoneNumber && (
                                                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Phone Number</p>
                                                        <p className="text-lg font-semibold text-gray-900">{detailModal.appointment.phoneNumber}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    
                                    {detailModal.appointment.customerNote && (
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h4 className="text-lg font-bold text-gray-800 mb-4">Notes</h4>
                                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                                <p className="text-gray-700 leading-relaxed">{detailModal.appointment.customerNote}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={closeDetailModal}
                                        className="px-6 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-8 bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Online Consultation</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
                        <div className="flex items-center gap-3">                            <label className="text-gray-700 font-medium whitespace-nowrap min-w-[100px]">View mode:</label>
                            <select
                                className="form-select flex-1 rounded-lg border-2 border-gray-400 shadow-md hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 py-2 px-3 font-medium text-gray-700"
                                value={viewType}
                                onChange={(e) => setViewType(e.target.value as ViewType)}
                            >                                <option value="day">By day</option>
                                <option value="week">By week</option>
                                <option value="month">By month</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-center space-x-4">
                            <button
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                onClick={() => handleDateChange(-1)}
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M15 19l-7-7 7-7"/>
                                </svg>
                            </button>

                            <div className="flex-1 text-center">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date: Date | null) => date && setSelectedDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    className="form-input w-full text-center border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                <div className="text-sm text-gray-600 mt-1">{formatDateRange()}</div>
                            </div>
                            <button
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                onClick={() => handleDateChange(1)}
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5l7 7-7 7"/>
                                </svg>
                            </button>
                            <button
                                onClick={handleRefresh}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                            >
                                <img
                                    src={refreshIcon}
                                    alt="refresh"
                                    className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}                                />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {filterAppointmentsByDate(selectedDate).map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">#{appointment.id}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {new Date(appointment.date).toLocaleDateString('vi-VN')}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{appointment.timeRange}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.appointmentStatus === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                                appointment.appointmentStatus === 'CONFIRMED' ? 'bg-orange-100 text-orange-800' :
                                    (appointment.appointmentStatus === 'WAITING' || appointment.appointmentStatus === 'WAITING_FOR_CUSTOMER' || appointment.appointmentStatus === 'WAITING_FOR_DOCTOR') ? 'bg-purple-100 text-purple-800' :
                                        'bg-green-100 text-green-800'
                        }`}>
                          {appointment.appointmentStatus === 'BOOKED' ? 'Booked' :
                              appointment.appointmentStatus === 'CONFIRMED' ? 'Confirmed' :
                                  appointment.appointmentStatus === 'WAITING_FOR_CUSTOMER' ? 'Waiting for Customer' :
                                      appointment.appointmentStatus === 'WAITING_FOR_DOCTOR' ? 'Waiting for Doctor' :
                                          appointment.appointmentStatus === 'WAITING' ? 'Waiting' :
                                              'In Progress'}
                        </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                {appointment.appointmentStatus === 'BOOKED' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStartMeeting(appointment)}                                                            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                        >
                                                            Start Meeting
                                                        </button>
                                                        <button
                                                            onClick={() => openCancelModal(appointment.id)}
                                                            className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            Cancel Appointment
                                                        </button>
                                                    </>
                                                )}
                                                {appointment.appointmentStatus === 'CONFIRMED' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleDoctorConfirm(appointment)}
                                                            className="text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                                        >
                                                            Confirm Ready                                                        </button>
                                                        <button
                                                            onClick={() => openCancelModal(appointment.id)}
                                                            className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            Cancel Appointment
                                                        </button>
                                                    </>
                                                )}
                                                {(appointment.appointmentStatus === 'WAITING' || appointment.appointmentStatus === 'WAITING_FOR_CUSTOMER') && (
                                                    <>
                                                        <button
                                                            onClick={() => handleDoctorConfirm(appointment)}
                                                            className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                                        >
                                                            Confirm Ready (Customer Waiting)
                                                        </button>                                                        <button
                                                            onClick={() => openCancelModal(appointment.id)}
                                                            className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            Cancel Appointment
                                                        </button>
                                                    </>
                                                )}
                                                {appointment.appointmentStatus === 'WAITING_FOR_DOCTOR' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleDoctorConfirm(appointment)}
                                                            className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        >
                                                            Confirm Appointment
                                                        </button>                                                        <button
                                                            onClick={() => openCancelModal(appointment.id)}
                                                            className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            Cancel Appointment
                                                        </button>
                                                    </>
                                                )}
                                                {appointment.appointmentStatus === 'IN_PROGRESS' && !joinedMeetings.has(appointment.id) && (
                                                    <button
                                                        onClick={() => handleJoinMeeting(appointment)}
                                                        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        Join Meeting
                                                    </button>
                                                )}
                                                {appointment.appointmentStatus === 'IN_PROGRESS' && joinedMeetings.has(appointment.id) && (
                                                    <button
                                                        onClick={() => handleEndMeeting(appointment.id)}
                                                        className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                    >
                                                        Finish Meeting
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => openDetailModal(appointment)}
                                                    className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                                >
                                                    View Detail
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filterAppointmentsByDate(selectedDate).length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none"
                                                     stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                                </svg>                                                <p className="text-lg font-medium">No appointments</p>
                                                <p className="text-sm text-gray-400">in this time period</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
