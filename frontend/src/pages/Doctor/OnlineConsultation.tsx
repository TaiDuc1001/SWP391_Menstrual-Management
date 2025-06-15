import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import api from '../../api/axios';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import videoCallIcon from '../../assets/icons/video_call.svg';
import clockIcon from '../../assets/icons/clock.svg';
import calendarIcon from '../../assets/icons/calendar.svg';

interface Patient {
  id: number;
  name: string;
  age: number;
  avatar?: string;
  symptoms: string[];
  appointmentTime: string;
  status: 'waiting' | 'in-consultation' | 'completed' | 'cancelled';
  notes?: string;
  medicalHistory?: {
    date: string;
    diagnosis: string;
    treatment: string;
  }[];
}

const OnlineConsultation: React.FC = () => {
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const MEETING_INFO = {
    meetingUrl: 'https://meet.google.com/rzw-jwjr-udw',
    phoneNumber: '+1 575-567-3711',
    pin: '435 953 990#'
  };

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockPatients: Patient[] = [
      {
        id: 1,
        name: "Nguyễn Thị Hoa",
        age: 28,
        symptoms: ["Đau bụng kinh", "Chu kỳ không đều"],
        appointmentTime: "09:00 - 09:30",
        status: "waiting",
        notes: "Lần khám đầu tiên",
        medicalHistory: [
          {
            date: "2025-05-15",
            diagnosis: "Rối loạn kinh nguyệt",
            treatment: "Kê đơn thuốc điều hòa nội tiết"
          }
        ]
      },
      {
        id: 2,
        name: "Trần Thị Mai",
        age: 32,
        symptoms: ["Ra máu bất thường", "Đau vùng chậu"],
        appointmentTime: "09:30 - 10:00",
        status: "waiting"
      }
    ];
    setWaitingPatients(mockPatients);
  }, []);

  const handleStartConsultation = async (patient: Patient) => {
    if (!window.confirm('Bạn có chắc chắn muốn bắt đầu cuộc tư vấn này?')) {
      return;
    }

    try {
      setLoading(true);
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentPatient(patient);
      setWaitingPatients(prev => prev.filter(p => p.id !== patient.id));
      window.open(MEETING_INFO.meetingUrl, '_blank');
    } catch (error) {
      console.error('Error starting consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndConsultation = async () => {
    if (!currentPatient || !window.confirm('Bạn có chắc chắn muốn kết thúc cuộc tư vấn này?')) {
      return;
    }

    try {
      setLoading(true);
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentPatient(null);
      setNotes('');
    } catch (error) {
      console.error('Error ending consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!currentPatient) return;

    try {
      setLoading(true);
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update current patient notes
      setCurrentPatient(prev => prev ? { ...prev, notes } : null);
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setLoading(false);
    }
  };
  const getStatusBadgeColor = (status: Patient['status']): 'warning' | 'info' | 'success' | 'error' | 'primary' => {
    switch (status) {
      case 'waiting':
        return 'warning';
      case 'in-consultation':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tư vấn trực tuyến</h1>
          <p className="text-gray-600">Quản lý và thực hiện các cuộc tư vấn trực tuyến</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Current consultation */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                {currentPatient ? 'Cuộc tư vấn hiện tại' : 'Chưa có cuộc tư vấn nào đang diễn ra'}
              </h2>

              {currentPatient && (
                <div>
                  {/* Patient info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="text-sm text-gray-500">Bệnh nhân</label>
                      <p className="font-medium">{currentPatient.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Thời gian</label>
                      <p className="font-medium">{currentPatient.appointmentTime}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Tuổi</label>
                      <p className="font-medium">{currentPatient.age} tuổi</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Trạng thái</label>
                      <Badge variant={getStatusBadgeColor(currentPatient.status)}>
                        {currentPatient.status === 'in-consultation' ? 'Đang tư vấn' : 'Đang chờ'}
                      </Badge>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div className="mb-6">
                    <label className="text-sm text-gray-500 block mb-2">Triệu chứng</label>
                    <div className="flex flex-wrap gap-2">
                      {currentPatient.symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Medical history */}
                  {currentPatient.medicalHistory && (
                    <div className="mb-6">
                      <label className="text-sm text-gray-500 block mb-2">Lịch sử khám</label>
                      <div className="space-y-3">
                        {currentPatient.medicalHistory.map((record, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-sm text-gray-600">{format(new Date(record.date), 'dd/MM/yyyy')}</div>
                            <div className="font-medium">Chẩn đoán: {record.diagnosis}</div>
                            <div className="text-sm">Điều trị: {record.treatment}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="text-sm text-gray-500 block mb-2">Ghi chú</label>
                    <textarea
                      className="w-full p-3 border rounded-lg min-h-[100px] mb-2"
                      placeholder="Nhập ghi chú về cuộc tư vấn..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      onClick={handleSaveNotes}
                      disabled={loading}
                    >
                      {loading ? 'Đang lưu...' : 'Lưu ghi chú'}
                    </Button>
                  </div>

                  {/* Meeting controls */}
                  <div className="flex justify-between items-center">
                    <Button
                      variant="secondary"
                      onClick={() => window.open(MEETING_INFO.meetingUrl, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <img src={videoCallIcon} alt="video" className="w-5 h-5" />
                      Vào lại phòng tư vấn
                    </Button>
                    <Button
                      variant="error"
                      onClick={handleEndConsultation}
                      disabled={loading}
                    >
                      {loading ? 'Đang kết thúc...' : 'Kết thúc tư vấn'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right column - Waiting list */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Danh sách chờ ({waitingPatients.length})
              </h2>

              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm bệnh nhân..."
                  className="w-full px-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Waiting list */}
              <div className="space-y-3">
                {waitingPatients
                  .filter(patient => 
                    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(patient => (
                    <div
                      key={patient.id}
                      className="p-4 border rounded-lg hover:border-pink-400 transition cursor-pointer"
                      onClick={() => !loading && !currentPatient && handleStartConsultation(patient)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-gray-500">{patient.age} tuổi</p>
                        </div>
                        <Badge variant={getStatusBadgeColor(patient.status)}>
                          {patient.status === 'waiting' ? 'Đang chờ' : 'Đang tư vấn'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <img src={clockIcon} alt="time" className="w-4 h-4" />
                        <span>{patient.appointmentTime}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {patient.symptoms.slice(0, 2).map((symptom, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {symptom}
                          </span>
                        ))}
                        {patient.symptoms.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            +{patient.symptoms.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineConsultation;
