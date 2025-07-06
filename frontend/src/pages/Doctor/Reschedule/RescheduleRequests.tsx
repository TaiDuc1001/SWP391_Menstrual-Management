import React, { useState, useEffect } from 'react';
import { rescheduleService, RescheduleRequest as RescheduleRequestType } from '../../../api/services/rescheduleService';

interface RescheduleOption {
    id: number;
    date: string;
    slot: string;
    timeRange: string;
    isSelected: boolean;
}

// Remove the local RescheduleRequest interface since we're importing it
// interface RescheduleRequest { ... }

const DoctorRescheduleRequests: React.FC = () => {
    const [requests, setRequests] = useState<RescheduleRequestType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Assuming doctor ID is 1 for now (in real app, get from auth context)
    const doctorId = 1;

    useEffect(() => {
        fetchRescheduleRequests();
    }, []);

    const fetchRescheduleRequests = async () => {
        try {
            setLoading(true);
            const data = await rescheduleService.getPendingRescheduleRequestsForDoctor(doctorId);
            setRequests(data);
        } catch (err) {
            console.error('Error fetching reschedule requests:', err);
            setError('Failed to load reschedule requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveOption = async (rescheduleRequestId: number, optionId: number) => {
        try {
            await rescheduleService.approveRescheduleOption(rescheduleRequestId, optionId);
            
            // Refresh the list
            await fetchRescheduleRequests();
            alert('Reschedule request approved successfully!');
        } catch (err) {
            console.error('Error approving reschedule option:', err);
            alert('Failed to approve reschedule request');
        }
    };

    const handleRejectRequest = async (rescheduleRequestId: number) => {
        if (!window.confirm('Are you sure you want to reject this reschedule request?')) {
            return;
        }

        try {
            await rescheduleService.rejectRescheduleRequest(rescheduleRequestId);
            
            // Refresh the list
            await fetchRescheduleRequests();
            alert('Reschedule request rejected');
        } catch (err) {
            console.error('Error rejecting reschedule request:', err);
            alert('Failed to reject reschedule request');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reschedule requests...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchRescheduleRequests}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Reschedule Requests</h1>
                <p className="text-gray-600 mt-2">Manage patient reschedule requests</p>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📅</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Requests</h3>
                    <p className="text-gray-500">There are no reschedule requests waiting for your approval.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {requests.map((request) => (
                        <div key={request.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Appointment #{request.appointmentId}
                                    </h3>
                                    <p className="text-gray-600">Reschedule Request #{request.id}</p>
                                    {request.createdAt && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Requested: {new Date(request.createdAt).toLocaleString('en-GB')}
                                        </p>
                                    )}
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                                    Pending Review
                                </span>
                            </div>

                            {/* Customer Note */}
                            {request.customerNote && (
                                <div className="mb-4 bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Reason for Rescheduling:</h4>
                                    <p className="text-gray-600">{request.customerNote}</p>
                                </div>
                            )}

                            {/* Options */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-3">Patient's Preferred Time:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {request.options.map((option, index) => (
                                        <div
                                            key={option.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-500">📅</span>
                                                    <span className="text-sm text-gray-700">
                                                        {formatDate(option.date)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-500">🕒</span>
                                                    <span className="text-sm text-gray-700">
                                                        {option.timeRange}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => option.id && handleApproveOption(request.id, option.id)}
                                                disabled={!option.id}
                                                className="w-full mt-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium disabled:opacity-50"
                                            >
                                                Approve This Time
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => handleRejectRequest(request.id)}
                                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Reject Request
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Refresh Button */}
            <div className="mt-8 text-center">
                <button
                    onClick={fetchRescheduleRequests}
                    className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    🔄 Refresh
                </button>
            </div>
        </div>
    );
};

export default DoctorRescheduleRequests;
