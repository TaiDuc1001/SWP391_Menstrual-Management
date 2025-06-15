import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import NotificationPopup from '../../components/Popup/NotificationPopup';
import refreshIcon from '../../assets/icons/refresh.svg';

interface Appointment {
  id: number;
  date: string;
  timeRange: string;
  doctorName: string;
  appointmentStatus: string;
  url?: string;
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

const OnlineConsultation: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewType, setViewType] = useState<ViewType>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    message: '',
    type: 'success'
  });
  const [cancelModal, setCancelModal] = useState<CancelModalState>({
    isOpen: false,
    appointmentId: null
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      isOpen: true,
      message,
      type
    });
    // Auto close after 3 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isOpen: false }));
    }, 3000);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      const filteredAppointments = response.data.filter(
        (apt: Appointment) =>
          apt.doctorName === 'Doctor Test Account' &&
          (apt.appointmentStatus === 'BOOKED' || apt.appointmentStatus === 'IN_PROGRESS')
      );
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
          await fetchAppointments();
          showNotification('Bắt đầu cuộc họp thành công!', 'success');
        } else {
          showNotification('Không thể xác nhận cuộc họp. Vui lòng thử lại!', 'error');
        }
      } catch (error) {
        console.error('Error confirming appointment:', error);
        showNotification('Có lỗi khi xác nhận cuộc họp!', 'error');
      }
    } else {
      showNotification('Không tìm thấy link họp!', 'error');
    }
  };

  const handleEndMeeting = async (appointmentId: number) => {
    try {
      const response = await api.put(`/appointments/finish/${appointmentId}`);
      if (response.status === 200) {
        showNotification('Kết thúc cuộc họp thành công!', 'success');
        await fetchAppointments();
      }
    } catch (error) {
      console.error('Error ending meeting:', error);
      showNotification('Có lỗi xảy ra khi kết thúc cuộc họp!', 'error');
    }
  };
  const handleCancelAppointment = async (appointmentId: number) => {
    try {
      const response = await api.put(`http://localhost:8080/api/appointments/cancel/${appointmentId}`);
      if (response.status === 200) {
        showNotification('Hủy cuộc hẹn thành công!', 'success');
        await fetchAppointments();
        closeCancelModal();
      } else {
        showNotification('Không thể hủy cuộc hẹn. Vui lòng thử lại sau!', 'error');
      }
    } catch (error) {
      console.error('Error canceling appointment:', error);
      showNotification('Có lỗi xảy ra khi hủy cuộc hẹn!', 'error');
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
      }
      case 'month':
        return `Tháng ${selectedDate.getMonth() + 1}`;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAppointments();
    setIsRefreshing(false);
    showNotification('Đã làm mới dữ liệu', 'success');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">          <NotificationPopup
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />
        {/* Modal hủy cuộc hẹn */}
        {cancelModal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-[400px] shadow-xl">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-center">Xác nhận hủy cuộc hẹn</h3>
                <p className="text-gray-600 text-center mt-4 mb-2">
                  Bạn có chắc chắn muốn hủy cuộc hẹn này không?
                </p>
                <p className="text-red-600 text-center text-base font-semibold mb-6">
                  Hành động này không thể hoàn tác.
                </p>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={closeCancelModal}
                    className="px-8 py-2 font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded transition-colors border border-gray-300"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={() => cancelModal.appointmentId && handleCancelAppointment(cancelModal.appointmentId)}
                    className="px-8 py-2 font-medium text-white bg-red-500 hover:bg-red-600 rounded transition-colors"
                  >
                    Xác nhận hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Tư vấn trực tuyến</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
            <div className="flex items-center gap-3">
              <label className="text-gray-700 font-medium whitespace-nowrap min-w-[100px]">Chế độ xem:</label>
              <select
                className="form-select flex-1 rounded-lg border-2 border-gray-400 shadow-md hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 py-2 px-3 font-medium text-gray-700"
                value={viewType}
                onChange={(e) => setViewType(e.target.value as ViewType)}
              >
                <option value="day">Theo ngày</option>
                <option value="week">Theo tuần</option>
                <option value="month">Theo tháng</option>
              </select>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => handleDateChange(-1)}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-gray-700 font-medium"
              >
                <img
                  src={refreshIcon}
                  alt="refresh"
                  className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`}
                />
                Làm mới
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
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
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.appointmentStatus === 'BOOKED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                          }`}>
                          {appointment.appointmentStatus === 'BOOKED' ? 'Booked' : 'In Progress'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {appointment.appointmentStatus === 'BOOKED' && (
                            <>
                              <button
                                onClick={() => handleStartMeeting(appointment)}
                                className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Bắt đầu cuộc họp
                              </button>
                              <button
                                onClick={() => openCancelModal(appointment.id)}
                                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Hủy cuộc hẹn
                              </button>
                            </>
                          )}
                          {appointment.appointmentStatus === 'IN_PROGRESS' && (
                            <button
                              onClick={() => handleEndMeeting(appointment.id)}
                              className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Kết thúc cuộc họp
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filterAppointmentsByDate(selectedDate).length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-lg font-medium">Không có cuộc hẹn nào</p>
                          <p className="text-sm text-gray-400">trong khoảng thời gian này</p>
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

export default OnlineConsultation;
