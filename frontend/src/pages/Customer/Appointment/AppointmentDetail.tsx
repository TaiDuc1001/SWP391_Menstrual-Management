import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import StatusBadge from '../../../components/common/Badge/StatusBadge';
import calendarIcon from '../../../assets/icons/calendar.svg';
import clockIcon from '../../../assets/icons/clock.svg';
import userIcon from '../../../assets/icons/profile.svg';
import '../../../styles/pages/appointment-detail.css';

interface AppointmentDetailData {
  id: number;
  customerName: string;
  doctorId: number;
  doctorName: string;
  date: string;
  timeRange: string;
  appointmentStatus: string;
  customerNote: string;
  url?: string;
}

const AppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<AppointmentDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointmentDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/appointments/${id}`);
        setAppointment(response.data);
      } catch (err) {
        console.error('Error fetching appointment details:', err);
        setError('Failed to load appointment details');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentDetail();
  }, [id]);

  const handleJoinMeeting = () => {
    if (appointment?.url) {
      window.open(appointment.url, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="appointment-detail-container">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="appointment-detail-container">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error || 'Appointment not found'}</p>
          <button
            onClick={() => navigate('/customer/appointments')}
            className="appointment-detail-btn-pink"
          >
            Back to Appointments
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="appointment-detail-container">
      <div className="appointment-detail-content">
        <div className="mb-6">
          <button
            onClick={() => navigate('/customer/appointments')}
            className="appointment-detail-back-btn"
          >
            <span className="mr-2">←</span>
            Back to Appointments
          </button>
          
          <div className="appointment-detail-header-card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Appointment Details</h1>
                <p className="text-gray-600 mt-1">APT-{appointment.id.toString().padStart(4, '0')}</p>
              </div>
              <StatusBadge status={appointment.appointmentStatus} />
            </div>
          </div>
        </div>        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="appointment-detail-info-card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Information</h2>
              
              <div className="appointment-detail-info-grid">
                <div className="appointment-detail-info-item">
                  <div className="appointment-detail-icon-wrapper appointment-detail-icon-pink">
                    <img src={calendarIcon} alt="Date" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800">{formatDate(appointment.date)}</p>
                  </div>
                </div>

                <div className="appointment-detail-info-item">
                  <div className="appointment-detail-icon-wrapper appointment-detail-icon-blue">
                    <img src={clockIcon} alt="Time" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold text-gray-800">{appointment.timeRange}</p>
                  </div>
                </div>
                <div className="appointment-detail-info-item">
                  <div className="appointment-detail-icon-wrapper appointment-detail-icon-green">
                    <img src={userIcon} alt="Doctor" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <button 
                      onClick={() => navigate(`/customer/doctors/${appointment.doctorId}`)}
                      className="appointment-detail-doctor-btn"
                    >
                      {appointment.doctorName}
                    </button>
                  </div>
                </div>
              </div>
            </div>            {appointment.customerNote && (
              <div className="appointment-detail-notes-card">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  📝 Notes
                </h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{appointment.customerNote}</p>
                </div>
              </div>
            )}            {appointment.url && ['CONFIRMED', 'IN_PROGRESS', 'FINISHED'].includes(appointment.appointmentStatus) && (
              <div className="appointment-detail-meeting-card">
                <div className="appointment-detail-meeting-content">
                  <p className="text-blue-800 mb-3">Meeting URL: {appointment.url}</p>
                  <button
                    onClick={handleJoinMeeting}
                    className="appointment-detail-action-btn appointment-detail-btn-blue"
                  >
                    Join Meeting
                  </button>
                </div>
              </div>
            )}
          </div>          <div className="space-y-6">
            <div className="appointment-detail-actions-card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                {(appointment.appointmentStatus === 'CONFIRMED' || appointment.appointmentStatus === 'IN_PROGRESS') && appointment.url && (
                  <button
                    onClick={handleJoinMeeting}
                    className="appointment-detail-action-btn appointment-detail-btn-green"
                  >
                    Join Consultation
                  </button>
                )}
                {appointment.appointmentStatus === 'BOOKED' && (
                  <button
                    onClick={() => {}}
                    className="appointment-detail-action-btn appointment-detail-btn-red"
                  >
                    Cancel Appointment
                  </button>
                )}
                <button
                  onClick={() => navigate(`/customer/doctors/${appointment.doctorId}`)}
                  className="appointment-detail-action-btn appointment-detail-btn-pink"
                >
                  View Doctor Profile
                </button>
                
                <button
                  onClick={() => navigate('/customer/appointments')}
                  className="appointment-detail-action-btn appointment-detail-btn-gray"
                >
                  Back to Appointments
                </button>
              </div>
            </div>            <div className="appointment-detail-timeline-card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Timeline</h2>
              
              <div className="space-y-4">
                <div className="appointment-detail-timeline-item">
                  <div className={`appointment-detail-timeline-dot ${
                    appointment.appointmentStatus === 'CANCELLED' 
                      ? 'appointment-detail-timeline-dot-cancelled'
                      : 'appointment-detail-timeline-dot-active'
                  }`}></div>
                  <div>
                    <p className="appointment-detail-timeline-text">Appointment Booked</p>
                    <p className="appointment-detail-timeline-subtext">
                      {new Date(appointment.date).toLocaleDateString()} - Waiting for confirmation
                    </p>
                  </div>
                </div>
                
                <div className="appointment-detail-timeline-item">
                  <div className={`appointment-detail-timeline-dot ${
                    ['CONFIRMED', 'IN_PROGRESS', 'FINISHED'].includes(appointment.appointmentStatus)
                      ? 'appointment-detail-timeline-dot-active'
                      : appointment.appointmentStatus === 'CANCELLED'
                        ? 'appointment-detail-timeline-dot-cancelled'
                        : 'appointment-detail-timeline-dot-inactive'
                  }`}></div>
                  <div>
                    <p className="appointment-detail-timeline-text">Doctor Confirmed</p>
                    <p className="appointment-detail-timeline-subtext">
                      {appointment.appointmentStatus === 'BOOKED' 
                        ? 'Waiting for doctor confirmation'
                        : appointment.appointmentStatus === 'CANCELLED'
                          ? 'Appointment was cancelled'
                          : 'Meeting URL will be provided'
                      }
                    </p>
                  </div>
                </div>
                
                {appointment.appointmentStatus === 'IN_PROGRESS' && (
                  <div className="appointment-detail-timeline-item">
                    <div className="appointment-detail-timeline-dot appointment-detail-timeline-dot-progress"></div>
                    <div>
                      <p className="appointment-detail-timeline-text">Consultation Active</p>
                      <p className="appointment-detail-timeline-subtext">Session is currently ongoing</p>
                    </div>
                  </div>
                )}
                
                {appointment.appointmentStatus === 'FINISHED' && (
                  <div className="appointment-detail-timeline-item">
                    <div className="appointment-detail-timeline-dot appointment-detail-timeline-dot-active"></div>
                    <div>
                      <p className="appointment-detail-timeline-text">Consultation Complete</p>
                      <p className="appointment-detail-timeline-subtext">Session finished - Check for follow-up notes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
