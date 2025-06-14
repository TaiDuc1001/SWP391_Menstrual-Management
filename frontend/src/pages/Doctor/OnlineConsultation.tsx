import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

interface Appointment {
  id: number;
  date: string;
  timeRange: string;
  doctorName: string;
  appointmentStatus: string;
}

type ViewType = 'day' | 'week' | 'month';

const OnlineConsultation: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<ViewType>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const filterAppointmentsByDate = (date: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      switch (viewType) {
        case 'day':
          return aptDate.toDateString() === date.toDateString();
        case 'week':
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return aptDate >= startOfWeek && aptDate <= endOfWeek;
        case 'month':
          return (
            aptDate.getMonth() === date.getMonth() &&
            aptDate.getFullYear() === date.getFullYear()
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
        newDate.setDate(selectedDate.getDate() + (days * 7));
        break;
      case 'month':
        newDate.setMonth(selectedDate.getMonth() + days);
        break;
    }
    setSelectedDate(newDate);
  };

  const handleStartMeeting = async (appointmentId: number) => {
    try {
      // Gọi API để cập nhật trạng thái thành IN_PROGRESS
      await api.put(`/appointments/${appointmentId}/start`);
      // Refresh lại danh sách cuộc hẹn
      await fetchAppointments();
    } catch (error) {
      console.error('Error starting meeting:', error);
    }
  };  const handleEndMeeting = async (appointmentId: number) => {
    try {
      const response = await api.put(`/appointments/finish/${appointmentId}`);
      if (response.status === 200) {
        alert('Kết thúc cuộc họp thành công!');
        // Refresh lại danh sách cuộc hẹn
        await fetchAppointments();
      }
    } catch (error) {
      console.error('Error ending meeting:', error);
      alert('Có lỗi xảy ra khi kết thúc cuộc họp!');
    }
  };
  const handleCancelAppointment = async (appointmentId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy cuộc hẹn này không?')) {
      try {
        // Gọi API để hủy cuộc hẹn
        const response = await api.put(`http://localhost:8080/api/appointments/cancel/${appointmentId}`);
        
        if (response.status === 200) {
          alert('Hủy cuộc hẹn thành công!');
          // Refresh lại danh sách cuộc hẹn để cập nhật UI
          await fetchAppointments();
        } else {
          alert('Không thể hủy cuộc hẹn. Vui lòng thử lại sau!');
        }
      } catch (error) {
        console.error('Error canceling appointment:', error);
        alert('Có lỗi xảy ra khi hủy cuộc hẹn!');
      }
    }
  };

  const formatDateRange = () => {
    switch (viewType) {
      case 'day':
        return selectedDate.toLocaleDateString();
      case 'week': {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
      }
      case 'month':
        return selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Online Consultation</h1>
        <div className="flex items-center space-x-4 mt-4">
          <select
            className="border rounded p-2"
            value={viewType}
            onChange={(e) => setViewType(e.target.value as ViewType)}
          >
            <option value="day">Day View</option>
            <option value="week">Week View</option>
            <option value="month">Month View</option>
          </select>
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => handleDateChange(-1)}
          >
            Previous
          </button>
          <span className="font-semibold">{formatDateRange()}</span>
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={() => handleDateChange(1)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày
              </th>
              <th className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thời gian
              </th>
              <th className="w-2/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="w-5/12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filterAppointmentsByDate(selectedDate).map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">#{appointment.id}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{new Date(appointment.date).toLocaleDateString()}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{appointment.timeRange}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    appointment.appointmentStatus === 'BOOKED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {appointment.appointmentStatus}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {appointment.appointmentStatus === 'BOOKED' && (
                      <>
                        <button
                          onClick={() => handleStartMeeting(appointment.id)}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
                        >
                          Bắt đầu cuộc họp
                        </button>
                        <button
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                        >
                          Hủy cuộc hẹn
                        </button>
                      </>
                    )}
                    {appointment.appointmentStatus === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleEndMeeting(appointment.id)}
                        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors"
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
                <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                  Không có cuộc hẹn nào trong khoảng thời gian này
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnlineConsultation;
