import React, { useState, useEffect, useRef } from 'react';
import { DoctorSchedule, scheduleService, Slot, CreateScheduleRequest } from '../../../api/services/scheduleService';

interface UpdateScheduleModalProps {
    doctor: DoctorSchedule;
    onClose: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const UpdateScheduleModal: React.FC<UpdateScheduleModalProps> = ({
    doctor,
    onClose,
    onSuccess,
    onError
}) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [existingSlots, setExistingSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSlots();
    }, []);

    useEffect(() => {
        if (selectedDate) {
            updateExistingSlots();
        }
    }, [selectedDate, doctor.schedules]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchSlots = async () => {
        try {
            setLoadingSlots(true);
            const response = await scheduleService.getSlotOptions();
            setAvailableSlots(response.data);
        } catch (error) {
            console.error('Error fetching slots:', error);
            onError('Failed to load slot options');
        } finally {
            setLoadingSlots(false);
        }
    };

    const updateExistingSlots = () => {
        const dateSchedules = doctor.schedules.filter(s => s.date === selectedDate);
        setExistingSlots(dateSchedules.map(s => s.slot.name));
        setSelectedSlots([]);
    };

    const handleAddSlots = async () => {
        if (!selectedDate || selectedSlots.length === 0) {
            onError('Please select a date and at least one slot');
            return;
        }

        try {
            setLoading(true);
            const request: CreateScheduleRequest = {
                doctorId: doctor.doctorId,
                date: selectedDate,
                slots: selectedSlots
            };
            
            await scheduleService.createSchedules(request);
            onSuccess();
        } catch (error: any) {
            console.error('Error adding slots:', error);
            onError(error.response?.data?.message || 'Failed to add slots');
        } finally {
            setLoading(false);
        }
    };

    const handleSlotToggle = (slot: string) => {
        setSelectedSlots(prev => 
            prev.includes(slot)
                ? prev.filter(s => s !== slot)
                : [...prev, slot]
        );
    };

    const getSlotStatus = (slotName: string) => {
        if (existingSlots.includes(slotName)) {
            const schedule = doctor.schedules.find(s => s.date === selectedDate && s.slot.name === slotName);
            return schedule?.hasAppointment ? 'booked' : 'available';
        }
        return 'none';
    };

    const isSlotDisabled = (slotCode: string) => {
        const slot = availableSlots.find(s => s.slot === slotCode);
        return slot ? existingSlots.includes(slot.name) : false;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" ref={modalRef}>
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Update Schedule - {doctor.doctorName}
                        </h2>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                min={getCurrentDate()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {selectedDate && existingSlots.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    Existing Schedules for {new Date(selectedDate).toLocaleDateString()}
                                </h3>
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {existingSlots.map(slotName => {
                                        const slot = availableSlots.find(s => s.name === slotName);
                                        const status = getSlotStatus(slotName);
                                        return (
                                            <div
                                                key={slotName}
                                                className={`p-2 border rounded-lg ${
                                                    status === 'booked' 
                                                        ? 'border-red-300 bg-red-50' 
                                                        : 'border-green-300 bg-green-50'
                                                }`}
                                            >
                                                <div className="text-sm font-medium">
                                                    {slot?.name || slotName}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {slot?.timeRange || 'Time not available'}
                                                </div>
                                                <div className={`text-xs ${
                                                    status === 'booked' ? 'text-red-600' : 'text-green-600'
                                                }`}>
                                                    {status === 'booked' ? 'Booked' : 'Available'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}


                        {selectedDate && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    Add New Slots
                                </h3>
                                {loadingSlots ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        {availableSlots.map(slot => {
                                            const disabled = isSlotDisabled(slot.slot);
                                            return (
                                                <label
                                                    key={slot.ordinal}
                                                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                                                        disabled 
                                                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                                                            : 'border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSlots.includes(slot.slot)}
                                                        onChange={() => handleSlotToggle(slot.slot)}
                                                        disabled={disabled}
                                                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                                                    />
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {slot.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {slot.timeRange}
                                                        </div>
                                                        {disabled && (
                                                            <div className="text-xs text-red-500">
                                                                Already scheduled
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                                {selectedSlots.length > 0 && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Selected: {selectedSlots.length} new slot(s)
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddSlots}
                            disabled={loading || !selectedDate || selectedSlots.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Adding...' : 'Add Slots'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateScheduleModal;

