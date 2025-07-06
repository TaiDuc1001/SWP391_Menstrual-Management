import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { rescheduleService } from '../../../api/services/rescheduleService';

interface RescheduleOption {
    date: string;
    slot: string;
    timeRange: string;
}

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
    const [selectedOptions, setSelectedOptions] = useState<RescheduleOption[]>([]);
    const [customerNote, setCustomerNote] = useState('');
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
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

    const fetchAvailableSlots = async () => {
        try {
            const response = await api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${selectedDate}`);
            setAvailableSlots(response.data);
        } catch (err) {
            console.error('Error fetching available slots:', err);
            setAvailableSlots([]);
        }
    };

    const handleAddOption = (timeRange: string) => {
        if (selectedOptions.length >= 5) {
            setError('You can select maximum 5 options');
            return;
        }

        const slot = timeRange; // Assuming timeRange is the slot value
        const newOption: RescheduleOption = {
            date: selectedDate,
            slot,
            timeRange
        };

        // Check if this option already exists
        const exists = selectedOptions.some(
            opt => opt.date === selectedDate && opt.slot === slot
        );

        if (exists) {
            setError('This option is already selected');
            return;
        }

        setSelectedOptions([...selectedOptions, newOption]);
        setError('');
    };

    const handleRemoveOption = (index: number) => {
        setSelectedOptions(selectedOptions.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (selectedOptions.length === 0) {
            setError('Please select at least one option');
            return;
        }

        setLoading(true);
        try {
            const requestData = {
                appointmentId,
                customerNote,
                options: selectedOptions.map(opt => ({
                    date: opt.date,
                    slot: opt.slot
                }))
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
                                <p>1. Select 1-5 preferred date and time options</p>
                                <p>2. Add a note explaining why you need to reschedule</p>
                                <p>3. Your doctor will approve one of your options</p>
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
                                        onClick={() => handleAddOption(timeRange)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-pink-500 hover:bg-pink-50 transition-colors"
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

                    {/* Selected Options */}
                    {selectedOptions.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selected Options ({selectedOptions.length}/5)
                            </label>
                            <div className="space-y-2">
                                {selectedOptions.map((option, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-gray-500">📅</span>
                                            <span className="text-sm">
                                                {formatDate(option.date)}
                                            </span>
                                            <span className="text-gray-500">🕒</span>
                                            <span className="text-sm">{option.timeRange}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveOption(index)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
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
                        disabled={loading || selectedOptions.length === 0}
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
