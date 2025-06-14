import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import api from '../../api/axios';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';

interface Appointment {
  id: number;
  patientName: string;
  date: string;
  time: string;
  type: string;
  status: 'Đang chờ' | 'Đang tư vấn' | 'Hoàn thành' | 'Đã hủy';
  patientPhone: string;
  patientEmail?: string;
  symptoms?: string[];
  notes?: string;
  meetingUrl?: string;
  bookingDate?: string; // Ngày đặt lịch
  lastUpdated?: string; // Thời gian cập nhật cuối
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
              Loại tư vấn
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
                <div className="text-sm text-gray-900">{appointment.type}</div>
              </td>
              <td className="px-6 py-4">
                <Badge
                  variant={
                    appointment.status === 'Đang chờ' ? 'warning' :
                    appointment.status === 'Đang tư vấn' ? 'info' :
                    appointment.status === 'Hoàn thành' ? 'success' : 'error'
                  }
                >
                  {appointment.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {appointment.meetingUrl && appointment.status === 'Đang tư vấn' && (
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
                  backgroundColor: appointment.status === 'Đang chờ' ? '#FEF3C7' :
                    appointment.status === 'Đang tư vấn' ? '#DBEAFE' :
                    appointment.status === 'Hoàn thành' ? '#D1FAE5' : '#FEE2E2',
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

  return (
    <div className="bg-white rounded-lg shadow">
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
      <div className="grid grid-cols-8">
        <div className="border-r">
          {Array.from({ length: 9 }, (_, i) => {
            const hour = i + 9;
            return (
              <div key={hour} className="h-16 border-b p-2 text-sm text-gray-600">
                {`${hour}:00`}
              </div>
            );
          })}
        </div>
        {daysOfWeek.map(date => {
          const dayAppointments = appointments.filter(
            app => app.date === format(date, 'yyyy-MM-dd')
          );

          return (
            <div key={date.toString()} className="relative border-r">
              {/* Phần lưới giờ */}
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="h-16 border-b"></div>
              ))}

              {/* Các cuộc hẹn */}
              {dayAppointments.map(appointment => {
                const [startTime] = appointment.time.split(' - ');
                const [hours] = startTime.split(':');
                const top = (parseInt(hours) - 9) * 64;

                return (
                  <div
                    key={appointment.id}
                    className="absolute left-0 right-1 p-2 mx-1 rounded-lg shadow"
                    style={{
                      top: `${top}px`,
                      backgroundColor: appointment.status === 'Đang chờ' ? '#FEF3C7' :
                        appointment.status === 'Đang tư vấn' ? '#DBEAFE' :
                        appointment.status === 'Hoàn thành' ? '#D1FAE5' : '#FEE2E2',
                      height: '56px'
                    }}
                  >
                    <div className="font-medium text-sm truncate">
                      {appointment.patientName}
                    </div>
                    <div className="text-xs text-gray-600">{appointment.time}</div>
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
      pending: appointments.filter(app => app.status === 'Đang chờ' && app.date === today),
      inProgress: appointments.filter(app => app.status === 'Đang tư vấn'),
      history: appointments.filter(app => ['Hoàn thành', 'Đã hủy'].includes(app.status))
    };
  };

  // Fetch appointments from API
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await api.get('/appointments/doctor');
      setAppointments(response.data);
      updateStats(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const mockAppointments: Appointment[] = [
        {
          id: 1,
          patientName: "Nguyễn Thị Hoa",
          date: format(new Date(), 'yyyy-MM-dd'),
          time: "09:00 - 09:30",
          type: "Tư vấn định kỳ",
          status: "Đang chờ" as const,
          patientPhone: "0912345678",
          patientEmail: "hoa@example.com",
          symptoms: ["Đau bụng kinh", "Chu kỳ không đều"],
          notes: "Lần khám đầu tiên",
          bookingDate: "2025-06-10",
          lastUpdated: "2025-06-10 15:30:00"
        },
        {
          id: 2,
          patientName: "Trần Thị Mai",
          date: format(new Date(), 'yyyy-MM-dd'),
          time: "10:00 - 10:30",
          type: "Theo dõi",
          status: "Đang tư vấn" as const,
          patientPhone: "0923456789",
          patientEmail: "mai@example.com",
          symptoms: ["Ra máu bất thường", "Đau vùng chậu"],
          meetingUrl: "https://meet.google.com/abc-defg-hij",
          bookingDate: "2025-06-11",
          lastUpdated: "2025-06-15 10:00:00"
        },
        {
          id: 3,
          patientName: "Lê Thị Lan",
          date: format(new Date(), 'yyyy-MM-dd'),
          time: "11:00 - 11:30",
          type: "Tái khám",
          status: "Hoàn thành" as const,
          patientPhone: "0934567890",
          patientEmail: "lan@example.com",
          symptoms: ["Kinh nguyệt không đều"],
          notes: "Đã điều trị 2 tháng, tình trạng cải thiện",
          bookingDate: "2025-06-01",
          lastUpdated: "2025-06-15 11:30:00"
        },
        {
          id: 4,
          patientName: "Phạm Thị Hương",
          date: format(new Date(), 'yyyy-MM-dd'),
          time: "13:30 - 14:00",
          type: "Tư vấn lần đầu",
          status: "Đang chờ" as const,
          patientPhone: "0945678901",
          patientEmail: "huong@example.com",
          symptoms: ["Đau bụng dữ dội", "Nôn mửa"],
          bookingDate: "2025-06-13",
          lastUpdated: "2025-06-13 09:00:00"
        },
        {
          id: 5,
          patientName: "Vũ Thị Ánh",
          date: format(new Date(), 'yyyy-MM-dd'),
          time: "14:30 - 15:00",
          type: "Tư vấn định kỳ",
          status: "Đang chờ" as const,
          patientPhone: "0956789012",
          patientEmail: "anh@example.com",
          symptoms: ["Rối loạn nội tiết tố"],
          notes: "Đang theo dõi hormone",
          bookingDate: "2025-06-12",
          lastUpdated: "2025-06-12 14:00:00"
        },
        {
          id: 6,
          patientName: "Đặng Thị Thanh",
          date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
          time: "09:00 - 09:30",
          type: "Tái khám",
          status: "Đang chờ" as const,
          patientPhone: "0967890123",
          patientEmail: "thanh@example.com",
          symptoms: ["U xơ tử cung"],
          notes: "Theo dõi sau điều trị 3 tháng",
          bookingDate: "2025-06-10",
          lastUpdated: "2025-06-10 10:00:00"
        },
        {
          id: 7,
          patientName: "Hoàng Thị Ngọc",
          date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
          time: "10:00 - 10:30",
          type: "Tư vấn định kỳ",
          status: "Đang chờ" as const,
          patientPhone: "0978901234",
          patientEmail: "ngoc@example.com",
          symptoms: ["Tiền mãn kinh", "Bốc hỏa"],
          bookingDate: "2025-06-11",
          lastUpdated: "2025-06-11 15:00:00"
        },
        {
          id: 8,
          patientName: "Trương Thị Tuyết",
          date: format(addDays(new Date(), -1), 'yyyy-MM-dd'),
          time: "15:00 - 15:30",
          type: "Tư vấn khẩn cấp",
          status: "Hoàn thành" as const,
          patientPhone: "0989012345",
          patientEmail: "tuyet@example.com",
          symptoms: ["Xuất huyết bất thường", "Đau bụng dữ dội"],
          notes: "Đã chuyển bệnh viện để theo dõi",
          bookingDate: "2025-06-14",
          lastUpdated: "2025-06-14 15:30:00"
        },
        {
          id: 9,
          patientName: "Phan Thị Mỹ Linh",
          date: format(addDays(new Date(), -1), 'yyyy-MM-dd'),
          time: "16:00 - 16:30",
          type: "Tư vấn định kỳ",
          status: "Đã hủy" as const,
          patientPhone: "0990123456",
          patientEmail: "linh@example.com",
          symptoms: ["Rối loạn kinh nguyệt"],
          notes: "Bệnh nhân hủy hẹn vì lý do cá nhân",
          bookingDate: "2025-06-13",
          lastUpdated: "2025-06-14 09:00:00"
        },
        {
          id: 10,
          patientName: "Bùi Thị Kim Anh",
          date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
          time: "09:30 - 10:00",
          type: "Tư vấn online",
          status: "Đang chờ" as const,
          patientPhone: "0901234567",
          patientEmail: "kimanh@example.com",
          symptoms: ["Tư vấn về kế hoạch hóa gia đình"],
          bookingDate: "2025-06-15",
          lastUpdated: "2025-06-15 08:00:00",
          meetingUrl: "https://meet.google.com/xyz-abcd-efg"
        }
      ];
      
      setAppointments(mockAppointments);
      updateStats(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  const updateStats = (appointments: Appointment[]) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setStats({
      totalToday: appointments.filter(app => app.date === today).length,
      completed: appointments.filter(app => app.status === 'Hoàn thành').length,
      pending: appointments.filter(app => app.status === 'Đang chờ').length,
      cancelled: appointments.filter(app => app.status === 'Đã hủy').length
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
      alert('Có lỗi xảy ra khi thêm ghi chú');
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
  };

  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      'Đang chờ': 'bg-yellow-100 text-yellow-800',
      'Đang tư vấn': 'bg-blue-100 text-blue-800',
      'Hoàn thành': 'bg-green-100 text-green-800',
      'Đã hủy': 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const MEETING_INFO = {
    meetingUrl: 'https://meet.google.com/rzw-jwjr-udw',
    phoneNumber: '+1 575-567-3711',
    pin: '435 953 990#'
  };

  const handleStartMeeting = async (appointment: Appointment) => {
    if (!window.confirm('Bạn có chắc chắn muốn bắt đầu cuộc tư vấn này?')) {
      return;
    }

    try {
      setLoading(true);

      // Kiểm tra nếu có cuộc tư vấn nào đang diễn ra
      const ongoingAppointment = appointments.find(a => a.status === 'Đang tư vấn');
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
              status: 'Đang tư vấn' as const,
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
      alert('Có lỗi xảy ra khi bắt đầu cuộc tư vấn');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishMeeting = async (appointment: Appointment) => {
    if (!window.confirm('Bạn có chắc chắn muốn kết thúc cuộc tư vấn này?')) {
      return;
    }

    try {
      setLoading(true);

      // Kiểm tra nếu có ghi chú trước khi kết thúc
      if (!appointment.notes && !window.confirm('Bạn chưa thêm ghi chú. Vẫn muốn kết thúc?')) {
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
              status: 'Hoàn thành' as const,
              lastUpdated: new Date().toISOString()
            } 
          : app
      );
      setAppointments(updatedAppointments);

      // Đóng modal
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error finishing meeting:', error);
      alert('Có lỗi xảy ra khi kết thúc cuộc tư vấn');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointment: Appointment) => {
    // Xác nhận trước khi hủy
    if (!window.confirm('Bạn có chắc chắn muốn hủy cuộc hẹn này không?')) {
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
              status: 'Đã hủy' as const,
              lastUpdated: new Date().toISOString()
            } 
          : app
      );
      setAppointments(updatedAppointments);

      // Đóng modal
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('Có lỗi xảy ra khi hủy cuộc hẹn');
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
                {appointment.lastUpdated && (
                  <>
                    <span>•</span>
                    <span title={`Cập nhật: ${format(new Date(appointment.lastUpdated), 'HH:mm dd/MM/yyyy')}`}>
                      {format(new Date(appointment.lastUpdated), 'HH:mm')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
            {appointment.status === 'Đang chờ' && (
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
    const isEditable = ['Đang chờ', 'Đang tư vấn'].includes(appointment.status);
    
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
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium text-gray-800">{appointment.patientEmail || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Thời gian</label>
              <p className="font-medium text-gray-800">{appointment.time}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Loại tư vấn</label>
              <p className="font-medium text-gray-800">{appointment.type}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Trạng thái</label>
              <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            {appointment.bookingDate && (
              <div>
                <label className="text-sm text-gray-500">Ngày đặt lịch</label>
                <p className="font-medium text-gray-800">
                  {format(new Date(appointment.bookingDate), 'dd/MM/yyyy')}
                </p>
              </div>
            )}
            {appointment.lastUpdated && (
              <div>
                <label className="text-sm text-gray-500">Cập nhật lần cuối</label>
                <p className="font-medium text-gray-800">
                  {format(new Date(appointment.lastUpdated), 'HH:mm dd/MM/yyyy')}
                </p>
              </div>
            )}
          </div>

          {appointment.symptoms && (
            <div className="mb-4">
              <label className="text-sm text-gray-500">Triệu chứng</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {appointment.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hiển thị thông tin meeting */}
          {(appointment.status === 'Đang tư vấn' || appointment.meetingUrl) && (
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
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            {appointment.status === 'Đang chờ' && (
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
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {loading ? 'Đang tạo phòng tư vấn...' : (appointment.meetingUrl ? 'Bắt đầu tư vấn' : 'Tạo phòng tư vấn & Bắt đầu')}
                </button>
              </>
            )}
            {appointment.status === 'Đang tư vấn' && (
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
                <h3 className="font-medium">Thông tin bệnh nhân</h3>
                <p>Tên: {selectedAppointment.patientName}</p>
                <p>SĐT: {selectedAppointment.patientPhone}</p>
                {selectedAppointment.patientEmail && (
                  <p>Email: {selectedAppointment.patientEmail}</p>
                )}
              </div>
              <div>
                <h3 className="font-medium">Thông tin cuộc hẹn</h3>
                <p>Ngày: {format(new Date(selectedAppointment.date), 'dd/MM/yyyy')}</p>
                <p>Giờ: {selectedAppointment.time}</p>
                <p>Loại: {selectedAppointment.type}</p>
              </div>
            </div>

            {selectedAppointment.symptoms && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Triệu chứng</h3>
                <div className="flex gap-2 flex-wrap">
                  {selectedAppointment.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h3 className="font-medium mb-2">Ghi chú</h3>
              {isEditingNotes ? (
                <div>
                  <textarea
                    className="w-full p-2 border rounded-lg mb-2"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveNotes}
                      variant="primary"
                      disabled={isSavingNotes}
                    >
                      {isSavingNotes ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                    <Button
                      onClick={() => setIsEditingNotes(false)}
                      variant="secondary"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-2">{selectedAppointment.notes || 'Chưa có ghi chú'}</p>
                  <Button
                    onClick={() => {
                      setNotesInput(selectedAppointment.notes || '');
                      setIsEditingNotes(true);
                    }}
                    variant="secondary"
                  >
                    Chỉnh sửa
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              {selectedAppointment.status === 'Đang chờ' && (
                <Button
                  onClick={() => handleStatusChange(selectedAppointment.id, 'Đang tư vấn')}
                  variant="primary"
                >
                  Bắt đầu tư vấn
                </Button>
              )}
              {selectedAppointment.status === 'Đang tư vấn' && (
                <Button
                  onClick={() => handleStatusChange(selectedAppointment.id, 'Hoàn thành')}
                  variant="success"
                >
                  Hoàn thành
                </Button>
              )}
              {['Đang chờ', 'Đang tư vấn'].includes(selectedAppointment.status) && (
                <Button
                  onClick={() => handleStatusChange(selectedAppointment.id, 'Đã hủy')}
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
