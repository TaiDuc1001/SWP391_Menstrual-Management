import React, { useState } from 'react';
import { DoctorSchedule, Schedule } from '../../../api/services/scheduleService';
import deleteIcon from '../../../assets/icons/trash-bin.svg';

interface ViewScheduleModalProps {
    doctor: DoctorSchedule;
    onClose: () => void;
    onDeleteSchedule: (scheduleId: number) => void;
    onDeleteDaySchedule: (doctorId: number, date: string) => void;
}

const ViewScheduleModal: React.FC<ViewScheduleModalProps> = ({
    doctor,
    onClose,
    onDeleteSchedule,
    onDeleteDaySchedule
}) => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

    const formatSchedulesByDate = (schedules: Schedule[]) => {
        const filtered = schedules.filter(schedule => 
            schedule.date.startsWith(selectedMonth)
        );

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
                schedules: dateSchedules.sort((a: Schedule, b: Schedule) => 
                    a.slot.name.localeCompare(b.slot.name)
                )
            }))            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const schedulesByDate = formatSchedulesByDate(doctor.schedules);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {doctor.doctorName}'s Schedule
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
                    {/* Month Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filter by Month
                        </label>
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {schedulesByDate.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No schedules found for the selected month.</p>
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
                                            onClick={() => onDeleteDaySchedule(doctor.doctorId, date)}
                                            className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete all schedules for this day"
                                        >
                                            <img src={deleteIcon} alt="Delete" className="w-4 h-4 mr-1" />
                                            Delete Day
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
                                                            onClick={() => onDeleteSchedule(schedule.id)}
                                                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
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
