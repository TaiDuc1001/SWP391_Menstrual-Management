import React, { useState, useEffect, useRef } from 'react';
import { DoctorSchedule, Schedule, scheduleService } from '../../../api/services/scheduleService';
import deleteIcon from '../../../assets/icons/trash-bin.svg';
import ConfirmDialog from '../../common/Dialog/ConfirmDialog';

interface ViewScheduleModalProps {
    doctor: DoctorSchedule;
    onClose: () => void;
    onDeleteSchedule: (scheduleId: number) => Promise<void>;
    onDeleteDaySchedule: (doctorId: number, date: string) => Promise<void>;
    onRefreshData: () => Promise<void>;
}

const ViewScheduleModal: React.FC<ViewScheduleModalProps> = ({
    doctor: initialDoctor,
    onClose,
    onDeleteSchedule,
    onDeleteDaySchedule,
    onRefreshData
}) => {
    // Get current date
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Get date 30 days from now
    const getDateAfter30Days = () => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [startDate, setStartDate] = useState(getCurrentDate());
    const [endDate, setEndDate] = useState(getDateAfter30Days());
    const [isLoading, setIsLoading] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState<DoctorSchedule>(initialDoctor);
    const modalRef = useRef<HTMLDivElement>(null);

    // Update currentDoctor when initialDoctor changes
    useEffect(() => {
        setCurrentDoctor(initialDoctor);
    }, [initialDoctor]);

    // Handle click outside to close
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

    const refreshDoctorData = async () => {
        try {
            const response = await scheduleService.getAllDoctorSchedules();
            const updatedDoctor = response.data.find((d: DoctorSchedule) => d.doctorId === currentDoctor.doctorId);
            if (updatedDoctor) {
                setCurrentDoctor(updatedDoctor);
            }
        } catch (error) {
            console.error('Error refreshing doctor data:', error);
        }
    };

    const handleDeleteSchedule = async (scheduleId: number) => {
        setIsLoading(true);
        try {
            await onDeleteSchedule(scheduleId);
            await refreshDoctorData();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteDaySchedule = async (doctorId: number, date: string) => {
        setIsLoading(true);
        try {
            await onDeleteDaySchedule(doctorId, date);
            await refreshDoctorData();
        } finally {
            setIsLoading(false);
        }
    };

    const formatSchedulesByDate = (schedules: Schedule[]) => {
        const filtered = schedules.filter(schedule => {
            const scheduleDate = new Date(schedule.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return scheduleDate >= start && scheduleDate <= end;
        });

        const groupedByDate = filtered.reduce((acc: any, schedule) => {
            if (!acc[schedule.date]) {
                acc[schedule.date] = [];
            }
            acc[schedule.date].push(schedule);
            return acc;
        }, {});

        return Object.entries(groupedByDate)
            .map(([date, dateSchedules]: [string, any]) => ({
                date,
                schedules: dateSchedules.sort((a: Schedule, b: Schedule) => {
                    // Sort by slot ordinal
                    const aOrdinal = a.slot.name === 'ZERO' ? 0 : 
                                   a.slot.name === 'ONE' ? 1 :
                                   a.slot.name === 'TWO' ? 2 :
                                   a.slot.name === 'THREE' ? 3 :
                                   a.slot.name === 'FOUR' ? 4 :
                                   a.slot.name === 'FIVE' ? 5 :
                                   a.slot.name === 'SIX' ? 6 :
                                   a.slot.name === 'SEVEN' ? 7 :
                                   a.slot.name === 'EIGHT' ? 8 : 999;
                    
                    const bOrdinal = b.slot.name === 'ZERO' ? 0 : 
                                   b.slot.name === 'ONE' ? 1 :
                                   b.slot.name === 'TWO' ? 2 :
                                   b.slot.name === 'THREE' ? 3 :
                                   b.slot.name === 'FOUR' ? 4 :
                                   b.slot.name === 'FIVE' ? 5 :
                                   b.slot.name === 'SIX' ? 6 :
                                   b.slot.name === 'SEVEN' ? 7 :
                                   b.slot.name === 'EIGHT' ? 8 : 999;
                    
                    return aOrdinal - bOrdinal;
                })
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const schedulesByDate = formatSchedulesByDate(currentDoctor.schedules);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" ref={modalRef}>
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {currentDoctor.doctorName}'s Schedule
                        </h2>
                        <p className="text-sm text-gray-500">{currentDoctor.specialization}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-6">
                    {/* Date Range Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Date Range
                        </label>
                        <div className="flex gap-4 items-center">
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">From Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-gray-500 mb-1">To Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {schedulesByDate.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No schedules found for the selected date range.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {schedulesByDate.map(({ date, schedules }) => (
                                <div key={date} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {new Date(date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </h3>
                                        <button
                                            onClick={() => handleDeleteDaySchedule(currentDoctor.doctorId, date)}
                                            disabled={isLoading}
                                            className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                                            title="Delete all schedules for this day"
                                        >
                                            <img src={deleteIcon} alt="Delete" className="w-4 h-4 mr-1" />
                                            {isLoading ? 'Deleting...' : 'Delete Day'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {schedules.map((schedule: Schedule) => (
                                            <div
                                                key={schedule.id}
                                                className={`p-3 rounded-lg border-2 ${
                                                    schedule.hasAppointment
                                                        ? 'border-red-200 bg-red-50'
                                                        : 'border-green-200 bg-green-50'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {schedule.slot.name}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {schedule.slot.timeRange}
                                                        </div>
                                                        <div className={`text-xs mt-1 ${
                                                            schedule.hasAppointment
                                                                ? 'text-red-600'
                                                                : 'text-green-600'
                                                        }`}>
                                                            {schedule.hasAppointment ? 'Booked' : 'Available'}
                                                        </div>
                                                    </div>
                                                    {!schedule.hasAppointment && (
                                                        <button
                                                            onClick={() => handleDeleteSchedule(schedule.id)}
                                                            disabled={isLoading}
                                                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                                                            title="Delete this schedule"
                                                        >
                                                            <img src={deleteIcon} alt="Delete" className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end p-6 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewScheduleModal;
