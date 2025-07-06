import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { rescheduleService } from '../../../api/services/rescheduleService';

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: number;
    doctorId: number;
    onSuccess: () => void;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
    isOpen,
    onClose,
    appointmentId,
    doctorId,
    onSuccess
}) => {
    const [customerNote, setCustomerNote] = useState('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get next 30 days excluding today
    const getNextDays = (count: number) => {
        const days = [];
        const today = new Date();
        for (let i = 1; i <= count; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            // Skip weekends (optional)
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                days.push(date.toISOString().split('T')[0]);
            }
        }
        return days;
    };

    const availableDates = getNextDays(30);

    useEffect(() => {
        if (selectedDate && doctorId) {
            fetchAvailableSlots();
        }
    }, [selectedDate, doctorId]);

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal is closed
            setSelectedDate('');
            setSelectedSlot('');
            setCustomerNote('');
            setError('');
            setAvailableSlots([]);
        }
    }, [isOpen]);

    const fetchAvailableSlots = async () => {
        try {
            const response = await api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${selectedDate}`);
            setAvailableSlots(response.data);
        } catch (err) {
            console.error('Error fetching available slots:', err);
            setAvailableSlots([]);
        }
    };

    const handleSlotSelection = (timeRange: string) => {
        setSelectedSlot(timeRange);
        setError('');
    };

    const handleSubmit = async () => {
        if (!selectedDate || !selectedSlot) {
            setError('Please select both a date and time slot');
            return;
        }

        setLoading(true);
        try {
            const requestData = {
                appointmentId,
                customerNote,
                options: [{
                    date: selectedDate,
                    slot: selectedSlot
                }]
            };

            await rescheduleService.createRescheduleRequest(requestData);
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error creating reschedule request:', err);
            setError('Failed to submit reschedule request');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Reschedule Appointment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-2">
                            <span className="text-blue-500 mt-0.5">ℹ️</span>
                            <div className="text-sm text-blue-700">
                                <p className="font-medium mb-1">How it works:</p>
                                <p>1. Select your preferred date and time slot</p>
                                <p>2. Add a note explaining why you need to reschedule</p>
                                <p>3. Your doctor will approve or reject your request</p>
                            </div>
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date
                        </label>
                        <select
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="">Choose a date...</option>
                            {availableDates.map(date => (
                                <option key={date} value={date}>
                                    {formatDate(date)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Time Slot Selection */}
                    {selectedDate && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Available Time Slots
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {availableSlots.map(timeRange => (
                                    <button
                                        key={timeRange}
                                        onClick={() => handleSlotSelection(timeRange)}
                                        className={`border rounded-lg px-3 py-2 text-sm transition-colors ${
                                            selectedSlot === timeRange
                                                ? 'border-pink-500 bg-pink-50 text-pink-700'
                                                : 'border-gray-300 hover:border-pink-500 hover:bg-pink-50'
                                        }`}
                                    >
                                        {timeRange}
                                    </button>
                                ))}
                            </div>
                            {availableSlots.length === 0 && (
                                <p className="text-gray-500 text-sm">No available slots for this date</p>
                            )}
                        </div>
                    )}

                    {/* Selected Option Display */}
                    {selectedDate && selectedSlot && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selected Appointment
                            </label>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-center space-x-3">
                                    <span className="text-green-500">📅</span>
                                    <span className="text-sm font-medium">
                                        {formatDate(selectedDate)}
                                    </span>
                                    <span className="text-green-500">🕒</span>
                                    <span className="text-sm font-medium">{selectedSlot}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Customer Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Rescheduling
                        </label>
                        <textarea
                            value={customerNote}
                            onChange={(e) => setCustomerNote(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            rows={3}
                            placeholder="Please explain why you need to reschedule this appointment..."
                            maxLength={500}
                        />
                        <div className="text-xs text-gray-500 text-right mt-1">
                            {500 - customerNote.length} characters remaining
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedDate || !selectedSlot}
                        className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RescheduleModal;
