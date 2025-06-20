import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import api from '../../api/axios';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';


const mapAPIStatusToUI = (status: string): Appointment['status'] => {
  switch (status) {    case 'BOOKED':
      return 'Pending';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'WAITING_FOR_CUSTOMER':
      return 'Waiting for Customer';
    case 'WAITING_FOR_DOCTOR':
      return 'Waiting for Doctor';
    case 'WAITING':
      return 'Waiting';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'FINISHED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return 'Pending';
  }
};

interface Appointment {
  id: number;
  patientName: string;
  date: string;
  time: string;
  type?: string;
  status: 'Pending' | 'Confirmed' | 'Waiting' | 'Waiting for Customer' | 'Waiting for Doctor' | 'In Progress' | 'Completed' | 'Cancelled';
  patientPhone: string;
  notes?: string;
  meetingUrl?: string;
  bookingDate?: string;
  doctor?: {
    id: number;
    name: string;
  };
}

interface ListViewProps {
  appointments: Appointment[];
  onJoinMeeting: (url: string) => void;
  onSelectAppointment: (appointment: Appointment) => void;
}

const ListView: React.FC<ListViewProps> = ({ 
  appointments, 
  onJoinMeeting, 
  onSelectAppointment 
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thời gian
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bệnh nhân
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map(appointment => (
            <tr key={appointment.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {format(new Date(appointment.date), 'dd/MM/yyyy')}
                </div>
                <div className="text-sm text-gray-500">{appointment.time}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {appointment.patientName}
                </div>
                <div className="text-sm text-gray-500">
                  {appointment.patientPhone}
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge
                  variant={
                    appointment.status === 'Pending' ? 'warning' :
                    appointment.status === 'In Progress' ? 'info' :
                    appointment.status === 'Completed' ? 'success' : 'error'
                  }
                >
                  {appointment.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {appointment.meetingUrl && appointment.status === 'In Progress' && (
                    <Button
                      onClick={() => onJoinMeeting(appointment.meetingUrl!)}
                      variant="primary"
                      size="small"
                    >
                      Vào phòng tư vấn
                    </Button>
                  )}
                  <Button
                    onClick={() => onSelectAppointment(appointment)}
                    variant="secondary"
                    size="small"
                  >
                    Chi tiết
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface DayViewProps {
  appointments: Appointment[];
  onJoinMeeting: (url: string) => void;
  onSelectAppointment: (appointment: Appointment) => void;
}

const DayView: React.FC<DayViewProps> = ({ 
  appointments,
  onJoinMeeting,
  onSelectAppointment
}) => {
  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 9; // Từ 9h sáng
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(app => app.date === today);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-[100px_1fr] h-[600px]">
        {/* Time slots */}
        <div className="border-r">
          {timeSlots.map(time => (
            <div key={time} className="h-16 border-b p-2 text-sm text-gray-600">
              {time}
            </div>
          ))}
        </div>
        {/* Appointments */}
        <div className="relative">
          {todayAppointments.map(appointment => {
            const [startTime] = appointment.time.split(' - ');
            const [hours] = startTime.split(':');
            const top = (parseInt(hours) - 9) * 64; // 64px là chiều cao của mỗi ô 1 giờ

            return (
              <div
                key={appointment.id}
                className="absolute left-0 right-4 p-2 m-2 rounded-lg shadow"
                style={{
                  top: `${top}px`,
                  backgroundColor: appointment.status === 'Pending' ? '#FEF3C7' :
                    appointment.status === 'In Progress' ? '#DBEAFE' :
                    appointment.status === 'Completed' ? '#D1FAE5' : '#FEE2E2',
                  height: '56px'
                }}
              >
                <div className="font-medium text-sm">{appointment.patientName}</div>
                <div className="text-xs text-gray-600">{appointment.time}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface WeekViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  onJoinMeeting: (url: string) => void;
  onSelectAppointment: (appointment: Appointment) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ 
  appointments,
  selectedDate,
  onJoinMeeting,
  onSelectAppointment
}) => {
  const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i));
  
  // Tạo mảng khung giờ từ 7:00 đến 17:00
  const timeSlots = Array.from({ length: 11 }, (_, i) => ({
    hour: i + 7,
    label: `${(i + 7).toString().padStart(2, '0')}:00`
  }));

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header với các ngày trong tuần */}
      <div className="grid grid-cols-8 border-b">
        <div className="p-4 border-r"></div>
        {daysOfWeek.map(date => (
          <div
            key={date.toString()}
            className={`p-4 text-center border-r ${
              format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                ? 'bg-blue-50'
                : ''
            }`}
          >
            <div className="font-medium">{format(date, 'EEE')}</div>
            <div className="text-sm text-gray-600">{format(date, 'dd/MM')}</div>
          </div>
        ))}
      </div>

      {/* Grid chứa các khung giờ và lịch hẹn */}
      <div className="grid grid-cols-8">
        {/* Cột khung giờ */}
        <div className="border-r">
          {timeSlots.map(({ hour, label }) => (
            <div key={hour} className="h-16 border-b p-2 text-sm text-gray-600">
              {label}
            </div>
          ))}
        </div>

        {/* Các cột ngày trong tuần */}
        {daysOfWeek.map(date => {
          const dayAppointments = appointments.filter(
            app => app.date === format(date, 'yyyy-MM-dd')
          );

          return (
            <div key={date.toString()} className="relative border-r h-[704px]">
              {/* Background grid */}
              {timeSlots.map(({ hour }) => (
                <div key={hour} className="h-16 border-b"></div>
              ))}

              {/* Appointments */}
              {dayAppointments.map(appointment => {
                const [startTime] = appointment.time.split(' - ');
                const [hours, minutes] = startTime.split(':').map(Number);
                const top = (hours - 7) * 64 + (minutes / 60) * 64;                let bgColor;
                switch (appointment.status) {
                  case 'Pending':
                    bgColor = 'rgba(254, 243, 199, 0.9)';
                    break;
                  case 'Confirmed':
                    bgColor = 'rgba(255, 237, 213, 0.9)';
                    break;                  case 'Waiting':
                    bgColor = 'rgba(243, 232, 255, 0.9)';
                    break;
                  case 'Waiting for Customer':
                    bgColor = 'rgba(243, 232, 255, 0.9)';
                    break;
                  case 'Waiting for Doctor':
                    bgColor = 'rgba(243, 232, 255, 0.9)';
                    break;
                  case 'In Progress':
                    bgColor = 'rgba(219, 234, 254, 0.9)';
                    break;
                  case 'Completed':
                    bgColor = 'rgba(209, 250, 229, 0.9)';
                    break;
                  case 'Cancelled':
                    bgColor = 'rgba(254, 226, 226, 0.9)';
                    break;
                  default:
                    bgColor = 'rgba(229, 231, 235, 0.9)';
                }

                return (
                  <div
                    key={appointment.id}
                    className="absolute left-0 right-1 p-2 mx-1 rounded-lg shadow cursor-pointer hover:opacity-90 transition-opacity"
                    style={{
                      top: `${top}px`,
                      backgroundColor: bgColor,
                      height: '56px',
                      zIndex: 10
                    }}
                    onClick={() => onSelectAppointment(appointment)}
                  >
                    <div className="font-medium text-sm truncate">
                      {appointment.patientName}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                      {appointment.time}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ConsultationSchedule: React.FC = () => {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'list'>('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<Appointment['status'] | 'all'>('all');
  
  // State for notes editing
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesInput, setNotesInput] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalToday: 0,
    completed: 0,
    pending: 0,
    cancelled: 0
  });

  const filterAppointments = (appointments: Appointment[]) => {
    return appointments
      .filter(app => {
        const matchesSearch = app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.patientPhone.includes(searchTerm);
        const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(a.date + ' ' + a.time.split(' - ')[0]).getTime() - 
        new Date(b.date + ' ' + b.time.split(' - ')[0]).getTime());
  };

  const groupAppointmentsByStatus = (appointments: Appointment[]) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return {
      pending: appointments.filter(app => app.status === 'Pending' && app.date === today),
      inProgress: appointments.filter(app => app.status === 'In Progress'),
      history: appointments.filter(app => ['Completed', 'Cancelled'].includes(app.status))
    };
  };

  // Fetch appointments from API
const fetchAppointments = async () => {
  setLoading(true);
  try {
    const response = await api.get('/appointments/doctor');
    const data = response.data;

    const mappedAppointments: Appointment[] = data.map((item: any) => ({
      id: item.id,
      patientName: item.customerName,
      date: item.date,
      time: item.timeRange,
      status: mapAPIStatusToUI(item.appointmentStatus),
      patientPhone: item.phoneNumber,
      notes: item.customerNote,
      meetingUrl: item.url,
      bookingDate: item.date
    }));

    setAppointments(mappedAppointments);
    updateStats(mappedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchAppointments();
}, []);


  const updateStats = (appointments: Appointment[]) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setStats({
      totalToday: appointments.filter(app => app.date === today).length,
      completed: appointments.filter(app => app.status === 'Completed').length,
      pending: appointments.filter(app => app.status === 'Pending').length,
      cancelled: appointments.filter(app => app.status === 'Cancelled').length
    });
  };

  const handleStatusChange = async (appointmentId: number, newStatus: Appointment['status']) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status: newStatus });
      fetchAppointments(); // Refresh data
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const addNotes = async (appointmentId: number, notes: string) => {
    try {
      setLoading(true);
      // Gọi API để thêm ghi chú
      await api.put(`/appointments/${appointmentId}/notes`, {
        notes,
        lastUpdated: new Date().toISOString()
      });

      // Cập nhật state local
      const updatedAppointments = appointments.map(app => 
        app.id === appointmentId 
          ? { 
              ...app, 
              notes,
              lastUpdated: new Date().toISOString()
            } 
          : app
      );
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error adding notes:', error);
      alert('An error occurred while adding notes');
    } finally {
      setLoading(false);
    }
  };

  // Handle saving notes
  const handleSaveNotes = async () => {
    if (!selectedAppointment) return;
    setIsSavingNotes(true);
    try {
      await api.patch(`/appointments/${selectedAppointment.id}/notes`, { notes: notesInput });
      setIsEditingNotes(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setIsSavingNotes(false);
    }
  };  const getStatusColor = (status: Appointment['status']) => {    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-orange-100 text-orange-800',
      'Waiting': 'bg-purple-100 text-purple-800',
      'Waiting for Customer': 'bg-purple-100 text-purple-800',
      'Waiting for Doctor': 'bg-purple-100 text-purple-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const MEETING_INFO = {
    meetingUrl: 'https://meet.google.com/rzw-jwjr-udw',
    phoneNumber: '+1 575-567-3711',
    pin: '435 953 990#'
  };

  const handleStartMeeting = async (appointment: Appointment) => {
    if (!window.confirm('Are you sure you want to start this consultation?')) {
      return;
    }

    try {
      setLoading(true);

      // Kiểm tra nếu có cuộc tư vấn nào đang diễn ra
      const ongoingAppointment = appointments.find(a => a.status === 'In Progress');
      if (ongoingAppointment) {
        if (!window.confirm('Hiện đang có một cuộc tư vấn khác. Bạn có muốn tiếp tục?')) {
          return;
        }
      }

      // Gọi API để cập nhật trạng thái thành "Đang tư vấn"
      await api.put(`/appointments/${appointment.id}/start`, {
        status: 'Đang tư vấn',
        meetingUrl: MEETING_INFO.meetingUrl,
        lastUpdated: new Date().toISOString()
      });

      // Cập nhật state local
      const updatedAppointments = appointments.map(app => 
        app.id === appointment.id 
          ? { 
              ...app, 
              status: 'In Progress' as Appointment['status'],
              meetingUrl: MEETING_INFO.meetingUrl,
              lastUpdated: new Date().toISOString()
            } 
          : app
      );
      setAppointments(updatedAppointments);

      // Mở URL cuộc họp trong tab mới
      window.open(MEETING_INFO.meetingUrl, '_blank');

      // Đóng modal
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error starting meeting:', error);
      alert('An error occurred while starting the consultation');
    } finally {
      setLoading(false);
    }  };
  const handleConfirmReadyToStart = async (appointment: Appointment) => {
    try {
      setLoading(true);
      
      // Call the doctor confirmation endpoint
      await api.put(`/appointments/doctor/confirm/${appointment.id}`);
      
      // Update local state
      const updatedAppointments = appointments.map(app => 
        app.id === appointment.id 
          ? { 
              ...app, 
              status: 'In Progress' as Appointment['status'], // This will be updated from API response
              meetingUrl: 'https://meet.google.com/rzw-jwjr-udw',
              lastUpdated: new Date().toISOString()
            } 
          : app
      );
      setAppointments(updatedAppointments);

      // Refresh appointments to get actual status
      fetchAppointments();
      
      // Close modal
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error confirming ready to start:', error);
      alert('An error occurred while confirming appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishMeeting = async (appointment: Appointment) => {
    if (!window.confirm('Are you sure you want to finish this consultation?')) {
      return;
    }

    try {
      setLoading(true);

      // Kiểm tra nếu có ghi chú trước khi kết thúc
      if (!appointment.notes && !window.confirm('You have not added any notes. Do you still want to finish?')) {
        return;
      }

      // Gọi API để cập nhật trạng thái thành "Hoàn thành"
      await api.put(`/appointments/${appointment.id}/finish`, {
        status: 'Hoàn thành',
        lastUpdated: new Date().toISOString()
      });

      // Cập nhật state local
      const updatedAppointments = appointments.map(app => 
        app.id === appointment.id 
          ? { 
              ...app, 
              status: 'Completed' as Appointment['status'],
              lastUpdated: new Date().toISOString()
            } 
          : app
      );
      setAppointments(updatedAppointments);

      // Đóng modal
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error finishing meeting:', error);
      alert('An error occurred while finishing the consultation');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    // Xác nhận trước khi hủy
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      setLoading(true);
      // Gọi API để cập nhật trạng thái thành "Đã hủy"
      await api.put(`/appointments/${appointment.id}/cancel`, {
        status: 'Đã hủy',
        lastUpdated: new Date().toISOString()
      });

      // Cập nhật state local
      const updatedAppointments = appointments.map(app => 
        app.id === appointment.id 
          ? { 
              ...app, 
              status: 'Cancelled' as Appointment['status'],
              lastUpdated: new Date().toISOString()
            } 
          : app
      );
      setAppointments(updatedAppointments);

      // Đóng modal
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('An error occurred while cancelling the appointment');
    } finally {
      setLoading(false);
    }
  };

  const joinMeeting = (meetingUrl: string) => {
    window.open(meetingUrl, '_blank');
  };

  const renderAppointmentRow = (appointment: Appointment) => {
    return (
      <div
        key={appointment.id}
        className="p-4 hover:bg-gray-50 cursor-pointer"
        onClick={() => setSelectedAppointment(appointment)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xl text-gray-600">
                {appointment.patientName.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">{appointment.patientName}</h3>
              <div className="text-sm text-gray-500 space-x-2">
                <span>{appointment.time}</span>
                <span>•</span>
                <span>{appointment.type}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
            {appointment.status === 'Pending' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartMeeting(appointment);
                }}
                className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Bắt đầu tư vấn
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderAppointmentModal = (appointment: Appointment) => {
    const isEditable = ['Pending', 'In Progress'].includes(appointment.status);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Chi tiết cuộc hẹn</h2>
              <p className="text-sm text-gray-500">ID: #{appointment.id}</p>
            </div>
            <button
              onClick={() => setSelectedAppointment(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-500">Bệnh nhân</label>
              <p className="font-medium text-gray-800">{appointment.patientName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Số điện thoại</label>
              <p className="font-medium text-gray-800">{appointment.patientPhone}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Thời gian đặt lịch</label>
              <p className="font-medium text-gray-800">
                {format(new Date(appointment.bookingDate || ''), 'HH:mm dd/MM/yyyy')}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Trạng thái</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
          </div>

          {/* Hiển thị thông tin meeting */}
          {(appointment.status === 'In Progress' || appointment.meetingUrl) && (
            <div className="col-span-2 bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium text-blue-800">Thông tin phòng tư vấn</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const meetingInfo = `Link tham gia: ${MEETING_INFO.meetingUrl}\nSố điện thoại: ${MEETING_INFO.phoneNumber}\nMã PIN: ${MEETING_INFO.pin}`;
                      navigator.clipboard.writeText(meetingInfo);
                      alert('Đã sao chép thông tin phòng tư vấn!');
                    }}
                    className="p-1.5 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-100"
                    title="Sao chép thông tin"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                  <button
                    onClick={() => window.open(MEETING_INFO.meetingUrl, '_blank')}
                    className="p-1.5 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-100"
                    title="Mở trong tab mới"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center bg-white rounded border p-2">
                  <span className="text-sm text-gray-500 w-24">Link tham gia:</span>
                  <span className="truncate text-blue-800 flex-1">{MEETING_INFO.meetingUrl}</span>
                </div>
                <div className="flex items-center bg-white rounded border p-2">
                  <span className="text-sm text-gray-500 w-24">Điện thoại:</span>
                  <span className="text-blue-800">{MEETING_INFO.phoneNumber}</span>
                </div>
                <div className="flex items-center bg-white rounded border p-2">
                  <span className="text-sm text-gray-500 w-24">Mã PIN:</span>
                  <span className="text-blue-800">{MEETING_INFO.pin}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-500">Ghi chú</label>
              {!isEditingNotes && isEditable && (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                  disabled={loading}
                >
                  {appointment.notes ? 'Chỉnh sửa' : 'Thêm ghi chú'}
                </button>
              )}
            </div>
            {isEditingNotes && isEditable ? (
              <div>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full p-2 border rounded-lg mb-2"
                  rows={4}
                  placeholder="Nhập ghi chú..."
                  disabled={loading}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsEditingNotes(false);
                      setNotesInput(appointment.notes || '');
                    }}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    disabled={loading || isSavingNotes}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={loading || isSavingNotes || !notesInput.trim()}
                  >
                    {isSavingNotes ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="mt-1 text-gray-700">
                {appointment.notes || 'Chưa có ghi chú'}
              </p>
            )}
          </div>          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            {appointment.status === 'Pending' && (
              <>
                <button
                  onClick={() => handleCancelAppointment(appointment)}
                  className="px-4 py-2 text-red-500 hover:text-red-600"
                  disabled={loading}
                >
                  {loading ? 'Đang hủy...' : 'Hủy cuộc hẹn'}
                </button>
                <button
                  onClick={() => handleStartMeeting(appointment)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {loading ? 'Đang tạo phòng tư vấn...' : (appointment.meetingUrl ? 'Bắt đầu tư vấn' : 'Tạo phòng tư vấn & Bắt đầu')}
                </button>
              </>
            )}            {appointment.status === 'Confirmed' && (
              <button
                onClick={() => handleConfirmReadyToStart(appointment)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M5 13l4 4L19 7" />
                </svg>
                {loading ? 'Confirming...' : 'Confirm Ready'}
              </button>
            )}            {(appointment.status === 'Waiting' || appointment.status === 'Waiting for Customer') && (
              <button
                onClick={() => handleConfirmReadyToStart(appointment)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
                disabled={loading}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M5 13l4 4L19 7" />
                </svg>
                {loading ? 'Confirming...' : 'Confirm Ready (Customer Waiting)'}
              </button>
            )}
            {appointment.status === 'In Progress' && (
              <>
                <button
                  onClick={() => window.open(appointment.meetingUrl, '_blank')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Vào phòng tư vấn
                </button>
                <button
                  onClick={() => handleFinishMeeting(appointment)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? 'Đang hoàn thành...' : 'Kết thúc tư vấn'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Điều hướng ngày
  const handlePrevDate = () => {
    setSelectedDate(prev => addDays(prev, -1));
  };

  const handleNextDate = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleJoinMeeting = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Lịch hẹn hôm nay</h3>
          <p className="text-2xl font-bold">{stats.totalToday}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Đang chờ</h3>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Hoàn thành</h3>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Đã hủy</h3>
          <p className="text-2xl font-bold text-red-500">{stats.cancelled}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentView('day')}
            variant={currentView === 'day' ? 'primary' : 'secondary'}
          >
            Ngày
          </Button>
          <Button
            onClick={() => setCurrentView('week')}
            variant={currentView === 'week' ? 'primary' : 'secondary'}
          >
            Tuần
          </Button>
          <Button
            onClick={() => setCurrentView('list')}
            variant={currentView === 'list' ? 'primary' : 'secondary'}
          >
            Danh sách
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handlePrevDate}>
              ←
            </Button>
            <span className="text-lg font-medium">
              {format(selectedDate, 'dd/MM/yyyy')}
            </span>
            <Button variant="secondary" onClick={handleNextDate}>
              →
            </Button>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc số điện thoại"
              className="px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-lg"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Appointment['status'] | 'all')}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đang chờ">Đang chờ</option>
              <option value="Đang tư vấn">Đang tư vấn</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'day' && (
        <DayView 
          appointments={filterAppointments(appointments)}
          onJoinMeeting={handleJoinMeeting}
          onSelectAppointment={setSelectedAppointment}
        />
      )}
      {currentView === 'week' && (
        <WeekView
          appointments={filterAppointments(appointments)}
          selectedDate={selectedDate}
          onJoinMeeting={handleJoinMeeting}
          onSelectAppointment={setSelectedAppointment}
        />
      )}
      {currentView === 'list' && (
        <ListView 
          appointments={filterAppointments(appointments)}
          onJoinMeeting={handleJoinMeeting}
          onSelectAppointment={setSelectedAppointment}
        />
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Chi tiết cuộc hẹn</h2>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Thông tin bệnh nhân
                </h3>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Số điện thoại</h4>
                  <p className="font-medium text-gray-800">{selectedAppointment.patientPhone}</p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Thời gian đặt lịch</h4>
                  <p className="font-medium text-gray-800">
                    {format(new Date(selectedAppointment.bookingDate || ''), 'HH:mm dd/MM/yyyy')}
                  </p>
                </div>
                {selectedAppointment.notes && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500">Ghi chú</h4>
                    <p className="font-medium text-gray-800">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Thông tin cuộc hẹn
                </h3>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Thời gian</h4>
                  <p className="font-medium text-gray-800">{selectedAppointment.time}</p>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500">Trạng thái</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>
            </div>

            {selectedAppointment && (
              <div className="space-y-4">
                <p>SĐT: {selectedAppointment.patientPhone}</p>
                <p>Thời gian: {selectedAppointment.time}</p>
                {selectedAppointment.notes && (
                  <p>Ghi chú: {selectedAppointment.notes}</p>
                )}
              </div>
            )}

            <div className="flex gap-2 justify-end mt-4">
              {selectedAppointment.status === 'Pending' && (
                <Button
                  onClick={() => handleStatusChange(selectedAppointment.id, 'In Progress')}
                  variant="primary"
                >
                  Bắt đầu tư vấn
                </Button>
              )}
              {selectedAppointment.status === 'In Progress' && (
                <Button
                  onClick={() => handleStatusChange(selectedAppointment.id, 'Completed')}
                  variant="success"
                >
                  Hoàn thành
                </Button>
              )}
              {['Pending', 'In Progress'].includes(selectedAppointment.status) && (
                <Button
                  onClick={() => handleStatusChange(selectedAppointment.id, 'Cancelled')}
                  variant="error"
                >
                  Hủy cuộc hẹn
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationSchedule;
