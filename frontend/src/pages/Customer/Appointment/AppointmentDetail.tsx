import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import api from '../../../api/axios';
import {Button, LoadingSpinner, StatusBadge} from '../../../components';
import RescheduleModal from '../../../components/feature/Modal/RescheduleModal';
import RatingModal from '../../../components/feature/Modal/RatingModal';
import Rating from '../../../components/feature/Rating/Rating';
import RescheduleStatusCard from '../../../components/feature/Card/RescheduleStatusCard';
import SuccessNotification from '../../../components/feature/Notification/SuccessNotification';
import ErrorNotification from '../../../components/feature/Notification/ErrorNotification';
import { rescheduleService, RescheduleRequest } from '../../../api/services/rescheduleService';
import calendarIcon from '../../../assets/icons/calendar.svg';
import clockIcon from '../../../assets/icons/clock.svg';
import userIcon from '../../../assets/icons/profile.svg';

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
    score?: number;
    feedback?: string;
}

const AppointmentDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState<AppointmentDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
    const [loadingReschedule, setLoadingReschedule] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successTitle, setSuccessTitle] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchAppointmentDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await api.get(`/appointments/${id}`);
                setAppointment(response.data);
                
                // Fetch reschedule requests for this appointment
                await fetchRescheduleRequests();
            } catch (err) {
                console.error('Error fetching appointment details:', err);
                setError('Failed to load appointment details');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetail();
    }, [id]);

    const fetchRescheduleRequests = async () => {
        if (!id) return;
        
        try {
            setLoadingReschedule(true);
            const requests = await rescheduleService.getRescheduleRequestsByAppointmentId(Number(id));
            setRescheduleRequests(requests);
        } catch (err) {
            console.error('Error fetching reschedule requests:', err);
        } finally {
            setLoadingReschedule(false);
        }
    };

    const handleJoinMeeting = () => {
        if (appointment?.url) {
            window.open(appointment.url, '_blank');
        }
    };

    const handleRescheduleSuccess = () => {
        // Refresh appointment data
        const fetchAppointmentDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await api.get(`/appointments/${id}`);
                setAppointment(response.data);
                
                // Refresh reschedule requests
                await fetchRescheduleRequests();
            } catch (err) {
                console.error('Error fetching appointment details:', err);
                setError('Failed to load appointment details');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentDetail();
        setSuccessTitle('Reschedule Request Submitted!');
        setSuccessMessage('Your doctor will review and approve your reschedule request. You will be notified when there is a response.');
        setShowSuccessNotification(true);
    };

    const handleCancelRescheduleRequest = async (requestId: number) => {
        if (!window.confirm('Are you sure you want to cancel this reschedule request?')) {
            return;
        }

        try {
            await rescheduleService.cancelRescheduleRequest(requestId);
            await fetchRescheduleRequests();
            setSuccessTitle('Request Cancelled Successfully!');
            setSuccessMessage('The reschedule request has been cancelled successfully.');
            setShowSuccessNotification(true);
        } catch (err) {
            console.error('Error cancelling reschedule request:', err);
            setErrorMessage('Unable to cancel reschedule request. Please try again.');
            setShowErrorNotification(true);
        }
    };

    const handleCancelAppointment = async () => {
        if (!window.confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
            return;
        }

        try {
            await api.put(`/appointments/cancel/${id}`);
            // Refresh appointment data
            const response = await api.get(`/appointments/${id}`);
            setAppointment(response.data);
            setSuccessTitle('Appointment Cancelled Successfully!');
            setSuccessMessage('The appointment has been cancelled successfully.');
            setShowSuccessNotification(true);
        } catch (err) {
            console.error('Error cancelling appointment:', err);
            setErrorMessage('Unable to cancel appointment. Please try again.');
            setShowErrorNotification(true);
        }
    };

    const handleRatingSuccess = (score: number, feedback: string) => {
        // Update appointment data with new rating
        if (appointment) {
            setAppointment({
                ...appointment,
                score,
                feedback
            });
        }
        setSuccessTitle('Rating Submitted Successfully!');
        setSuccessMessage('Thank you for your feedback. Your rating has been recorded.');
        setShowSuccessNotification(true);
    };

    // Check if there's an active reschedule request (PENDING)
    const hasPendingRescheduleRequest = rescheduleRequests.some(req => req.status === 'PENDING');

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleReschedule = async (newDateTime: string) => {
        if (!id) return;

        try {
            setLoading(true);
            await api.put(`/appointments/${id}`, {
                date: newDateTime,
                appointmentStatus: 'PENDING'
            });
            setShowRescheduleModal(false);
            // Refetch appointment details
            const response = await api.get(`/appointments/${id}`);
            setAppointment(response.data);
        } catch (err) {
            console.error('Error rescheduling appointment:', err);
            setError('Failed to reschedule appointment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="page-content">
                    <div className="text-center">
                        <LoadingSpinner size="large"/>
                        <p className="mt-4 text-gray-600">Loading appointment details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !appointment) {
        return (
            <div className="page-container">
                <div className="page-content">
                    <div className="text-center">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                        <p className="text-gray-600 mb-4">{error || 'Appointment not found'}</p>
                        <Button variant="primary" onClick={() => navigate('/customer/appointments')}>
                            Back to Appointments
                        </Button>
                    </div>
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
                            <StatusBadge status={appointment.appointmentStatus}/>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Latest Reschedule Status Card */}
                        {!loadingReschedule && rescheduleRequests.length > 0 && (() => {
                            const latestRequest = rescheduleRequests
                                .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())[0];
                            
                            return (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-800">Latest Reschedule Request</h3>
                                        {rescheduleRequests.length > 1 && (
                                            <button
                                                onClick={() => navigate(`/customer/appointments/${id}/reschedule-history`)}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                                            >
                                                View Full History ({rescheduleRequests.length})
                                                <span className="ml-1">→</span>
                                            </button>
                                        )}
                                    </div>
                                    <RescheduleStatusCard
                                        rescheduleRequest={latestRequest}
                                        onCancel={latestRequest.status === 'PENDING' ? handleCancelRescheduleRequest : undefined}
                                    />
                                </div>
                            );
                        })()}

                        <div className="appointment-detail-info-card">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Appointment Information</h2>

                            <div className="appointment-detail-info-grid">
                                <div className="appointment-detail-info-item">
                                    <div className="appointment-detail-icon-wrapper appointment-detail-icon-pink">
                                        <img src={calendarIcon} alt="Date" className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-semibold text-gray-800">{formatDate(appointment.date)}</p>
                                    </div>
                                </div>

                                <div className="appointment-detail-info-item">
                                    <div className="appointment-detail-icon-wrapper appointment-detail-icon-blue">
                                        <img src={clockIcon} alt="Time" className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Time</p>
                                        <p className="font-semibold text-gray-800">{appointment.timeRange}</p>
                                    </div>
                                </div>
                                <div className="appointment-detail-info-item">
                                    <div className="appointment-detail-icon-wrapper appointment-detail-icon-green">
                                        <img src={userIcon} alt="Doctor" className="w-6 h-6"/>
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
                        </div>
                        {appointment.customerNote && (
                            <div className="appointment-detail-notes-card">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    📝 Notes
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700">{appointment.customerNote}</p>
                                </div>
                            </div>
                        )}

                        {/* Rating Display */}
                        {appointment.appointmentStatus === 'FINISHED' && appointment.score && (
                            <div className="appointment-detail-rating-card">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                    ⭐ Your Rating
                                </h2>
                                <div className="appointment-detail-rating-display">
                                    <div className="rating-section">
                                        <Rating score={appointment.score} size="large" />
                                    </div>
                                    {appointment.feedback && (
                                        <div className="feedback-section">
                                            <h4 className="feedback-title">Your Feedback:</h4>
                                            <p className="feedback-text">{appointment.feedback}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )} {appointment.url && ['CONFIRMED', 'IN_PROGRESS', 'FINISHED'].includes(appointment.appointmentStatus) && (
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
                    </div>
                    <div className="space-y-6">
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
                                
                                {/* Reschedule Button */}
                                {['BOOKED', 'CONFIRMED', 'WAITING_FOR_CUSTOMER', 'WAITING_FOR_DOCTOR'].includes(appointment.appointmentStatus) && (
                                    <button
                                        onClick={() => setShowRescheduleModal(true)}
                                        disabled={hasPendingRescheduleRequest}
                                        className={`appointment-detail-action-btn ${
                                            hasPendingRescheduleRequest 
                                                ? 'appointment-detail-btn-gray opacity-50 cursor-not-allowed' 
                                                : 'appointment-detail-btn-orange'
                                        }`}
                                        title={hasPendingRescheduleRequest ? 'You already have a pending reschedule request' : ''}
                                    >
                                        {hasPendingRescheduleRequest ? 'Reschedule Pending' : 'Reschedule'}
                                    </button>
                                )}
                                
                                {appointment.appointmentStatus === 'BOOKED' && (
                                    <button
                                        onClick={handleCancelAppointment}
                                        className="appointment-detail-action-btn appointment-detail-btn-red"
                                    >
                                        Cancel Appointment
                                    </button>
                                )}

                                {/* Rate Doctor Button */}
                                {appointment.appointmentStatus === 'FINISHED' && (
                                    <button
                                        onClick={() => setShowRatingModal(true)}
                                        className="appointment-detail-action-btn appointment-detail-btn-yellow"
                                    >
                                        {appointment.score ? 'Update Rating' : 'Rate Doctor'}
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
                        </div>
                        <div className="appointment-detail-timeline-card">
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
                                        <div
                                            className="appointment-detail-timeline-dot appointment-detail-timeline-dot-progress"></div>
                                        <div>
                                            <p className="appointment-detail-timeline-text">Consultation Active</p>
                                            <p className="appointment-detail-timeline-subtext">Session is currently
                                                ongoing</p>
                                        </div>
                                    </div>
                                )}

                                {appointment.appointmentStatus === 'FINISHED' && (
                                    <div className="appointment-detail-timeline-item">
                                        <div
                                            className="appointment-detail-timeline-dot appointment-detail-timeline-dot-active"></div>
                                        <div>
                                            <p className="appointment-detail-timeline-text">Consultation Complete</p>
                                            <p className="appointment-detail-timeline-subtext">Session finished - Check
                                                for follow-up notes</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showRescheduleModal && appointment && (
                <RescheduleModal
                    isOpen={showRescheduleModal}
                    onClose={() => setShowRescheduleModal(false)}
                    appointmentId={appointment.id}
                    doctorId={appointment.doctorId}
                    onSuccess={handleRescheduleSuccess}
                />
            )}

            {/* Rating Modal */}
            {showRatingModal && appointment && (
                <RatingModal
                    appointmentId={appointment.id}
                    currentScore={appointment.score}
                    currentFeedback={appointment.feedback}
                    onClose={() => setShowRatingModal(false)}
                    onSuccess={handleRatingSuccess}
                />
            )}

            {/* Success Notification */}
            <SuccessNotification
                isOpen={showSuccessNotification}
                onClose={() => setShowSuccessNotification(false)}
                title={successTitle}
                message={successMessage}
                duration={6000}
            />

            {/* Error Notification */}
            <ErrorNotification
                isOpen={showErrorNotification}
                onClose={() => setShowErrorNotification(false)}
                title="An Error Occurred"
                message={errorMessage}
                duration={5000}
            />
        </div>
    );
};

export default AppointmentDetail;
