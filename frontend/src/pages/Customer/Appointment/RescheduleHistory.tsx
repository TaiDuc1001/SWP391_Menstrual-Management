import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rescheduleService, RescheduleRequest } from '../../../api/services/rescheduleService';
import RescheduleStatusCard from '../../../components/feature/Card/RescheduleStatusCard';

const RescheduleHistory: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (appointmentId) {
            fetchRescheduleHistory();
        }
    }, [appointmentId]);

    const fetchRescheduleHistory = async () => {
        if (!appointmentId) return;

        try {
            setLoading(true);
            const requests = await rescheduleService.getRescheduleRequestsByAppointmentId(Number(appointmentId));
            // Sort by created date, newest first
            const sortedRequests = requests.sort((a, b) => 
                new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
            );
            setRescheduleRequests(sortedRequests);
        } catch (err) {
            console.error('Error fetching reschedule history:', err);
            setError('Failed to load reschedule history');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRescheduleRequest = async (requestId: number) => {
        if (!window.confirm('Are you sure you want to cancel this reschedule request?')) {
            return;
        }

        try {
            await rescheduleService.cancelRescheduleRequest(requestId);
            await fetchRescheduleHistory();
            alert('Reschedule request cancelled successfully');
        } catch (err) {
            console.error('Error cancelling reschedule request:', err);
            alert('Failed to cancel reschedule request');
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(`/customer/appointments/${appointmentId}`)}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
                    >
                        <span className="mr-2">←</span>
                        Back to Appointment Details
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Reschedule History</h1>
                </div>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reschedule history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="mb-6">
                    <button
                        onClick={() => navigate(`/customer/appointments/${appointmentId}`)}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
                    >
                        <span className="mr-2">←</span>
                        Back to Appointment Details
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Reschedule History</h1>
                </div>
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchRescheduleHistory}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(`/customer/appointments/${appointmentId}`)}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
                >
                    <span className="mr-2">←</span>
                    Back to Appointment Details
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Reschedule History</h1>
                <p className="text-gray-600 mt-2">Complete history of reschedule requests for Appointment #{appointmentId}</p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-gray-800">{rescheduleRequests.length}</div>
                    <div className="text-sm text-gray-600">Total Requests</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                        {rescheduleRequests.filter(r => r.status === 'PENDING').length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {rescheduleRequests.filter(r => r.status === 'APPROVED').length}
                    </div>
                    <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                        {rescheduleRequests.filter(r => r.status === 'REJECTED').length}
                    </div>
                    <div className="text-sm text-gray-600">Rejected</div>
                </div>
            </div>

            {/* Content */}
            {rescheduleRequests.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reschedule History</h3>
                    <p className="text-gray-500">This appointment has no reschedule requests yet.</p>
                    <button
                        onClick={() => navigate(`/customer/appointments/${appointmentId}`)}
                        className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        Back to Appointment
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            All Reschedule Requests ({rescheduleRequests.length})
                        </h2>
                        <button
                            onClick={fetchRescheduleHistory}
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                            🔄 Refresh
                        </button>
                    </div>

                    {/* Reschedule Request Cards */}
                    {rescheduleRequests.map((request, index) => (
                        <div key={request.id} className="relative">
                            {/* Request Number */}
                            <div className="absolute -left-4 top-4 bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium z-10">
                                {index + 1}
                            </div>
                            
                            <RescheduleStatusCard
                                rescheduleRequest={request}
                                onCancel={request.status === 'PENDING' ? handleCancelRescheduleRequest : undefined}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RescheduleHistory;
