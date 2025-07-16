import React, { useState, useEffect, useRef } from 'react';
import { scheduleService, CreateScheduleRequest, Slot } from '../../../api/services/scheduleService';
import { Doctor } from '../../../api/services/doctorService';

interface CreateScheduleModalProps {
    doctors: Doctor[];
    onClose: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
    doctors,
    onClose,
    onSuccess,
    onError
}) => {
    const [formData, setFormData] = useState<CreateScheduleRequest>({
        doctorId: 0,
        date: '',
        slots: []
    });
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchSlots();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.doctorId || !formData.date || formData.slots.length === 0) {
            onError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            await scheduleService.createSchedules(formData);
            onSuccess();
        } catch (error: any) {
            console.error('Error creating schedule:', error);

            let errorMessage = 'Failed to create schedule';
            const status = error.response?.status;
            const data = error.response?.data;

            if (status === 409) {
                errorMessage = 'Server error: An unexpected error occurred. Please try again later.';
            } else if (status === 400) {
                errorMessage = 'Invalid schedule data: Please check the selected date and time slots.';
            } else if (status === 500) {
                errorMessage = 'Schedule conflict: Some slots have already been created for this doctor on the selected date. Please choose different slots or update the existing ones.';
            } else if (typeof data === 'object' && (data?.message || data?.title)) {
                errorMessage = data.message || data.title;
            } else if (error.message) {
                errorMessage = error.message;
            }

            onError(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    const handleSlotToggle = (slot: string) => {
        setFormData(prev => ({
            ...prev,
            slots: prev.slots.includes(slot)
                ? prev.slots.filter(s => s !== slot)
                : [...prev.slots, slot]
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Create New Schedule</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Doctor <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.doctorId}
                                onChange={(e) => setFormData(prev => ({ ...prev, doctorId: Number(e.target.value) }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select a doctor...</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name} - {doctor.specialization}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                min={getCurrentDate()}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time Slots <span className="text-red-500">*</span>
                            </label>
                            {loadingSlots ? (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {availableSlots.map(slot => (
                                        <label
                                            key={slot.ordinal}
                                            className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.slots.includes(slot.slot)}
                                                onChange={() => handleSlotToggle(slot.slot)}
                                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-gray-900">
                                                    Slot {slot.ordinal}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {slot.timeRange}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {formData.slots.length > 0 && (
                                <div className="mt-2 text-sm text-gray-600">
                                    Selected: {formData.slots.length} slot(s)
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || formData.slots.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Creating...' : 'Create Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateScheduleModal;

