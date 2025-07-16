import React, { useEffect, useState } from 'react';
import { DoctorSchedule, scheduleService, Slot } from '../../../api/services/scheduleService';
import { doctorService } from '../../../api/services/doctorService';
import NewUserButton from "../../../components/common/Button/AdminCreateButton";
import { applyPagination } from '../../../utils';
import plusWhiteIcon from "../../../assets/icons/plus-white.svg";
import searchIcon from "../../../assets/icons/search.svg";
import refreshIcon from "../../../assets/icons/refresh.svg";
import editIcon from '../../../assets/icons/edit.svg';
import eyeIcon from '../../../assets/icons/eye.svg';
import deleteIcon from '../../../assets/icons/trash-bin.svg';
import SuccessNotification from '../../../components/feature/Notification/SuccessNotification';
import ErrorNotification from '../../../components/feature/Notification/ErrorNotification';
import CreateScheduleModal from '../../../components/feature/Modal/CreateScheduleModal';
import UpdateScheduleModal from '../../../components/feature/Modal/UpdateScheduleModal';
import ViewScheduleModal from '../../../components/feature/Modal/ViewScheduleModal';
import ConfirmDialog from '../../../components/common/Dialog/ConfirmDialog';

const WorkScheduleManagement: React.FC = () => {
    const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorSchedule | null>(null);

    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');

    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    } | null>(null);

    const showSuccess = (title: string, message: string) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setShowSuccessNotification(true);
    };

    const showError = (title: string, message: string) => {
        setNotificationTitle(title);
        setNotificationMessage(message);
        setShowErrorNotification(true);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [schedulesResponse, doctorsResponse] = await Promise.all([
                scheduleService.getAllDoctorSchedules(),
                doctorService.getAllDoctors()
            ]);
            setDoctorSchedules(schedulesResponse.data);
            setDoctors(doctorsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            showError('Load Error', 'Failed to load schedule data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedDoctor && doctorSchedules.length > 0) {
            const updatedDoctor = doctorSchedules.find(d => d.doctorId === selectedDoctor.doctorId);
            if (updatedDoctor) {
                setSelectedDoctor(updatedDoctor);
            }
        }
    }, [doctorSchedules, selectedDoctor]);

    const handleRefresh = () => {
        setSearchTerm('');
        setCurrentPage(1);
        fetchData();
    };

    const filteredDoctors = doctorSchedules.filter(doctor =>
        doctor.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginationResult = applyPagination(filteredDoctors, {
        currentPage,
        itemsPerPage: pageSize
    });
    const { items: paginatedDoctors, totalPages, totalItems, startIdx, endIdx } = paginationResult;

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleCreateSchedule = () => {
        setShowCreateModal(true);
    };

    const handleViewSchedule = (doctor: DoctorSchedule) => {
        setSelectedDoctor(doctor);
        setShowViewModal(true);
    };

    const handleUpdateSchedule = (doctor: DoctorSchedule) => {
        setSelectedDoctor(doctor);
        setShowUpdateModal(true);
    };

    const handleDeleteSchedule = async (scheduleId: number) => {
        try {
            await scheduleService.deleteSchedule(scheduleId);
            showSuccess('Schedule Deleted', 'Schedule has been deleted successfully');

            await fetchData();
        } catch (error: any) {
            console.error('Error deleting schedule:', error);
            showError('Delete Error', error.response?.data?.message || 'Failed to delete schedule');
            throw error;
        }
    };

    const handleDeleteDaySchedule = async (doctorId: number, date: string) => {
        try {
            await scheduleService.deleteDoctorSchedulesByDate(doctorId, date);
            showSuccess('Schedules Deleted', 'All schedules for the selected date have been deleted');
            await fetchData();
        } catch (error: any) {
            console.error('Error deleting day schedules:', error);
            showError('Delete Error', error.response?.data?.message || 'Failed to delete schedules');
            throw error;
        }
    };

    const handleRequestDeleteSchedule = async (scheduleId: number): Promise<void> => {
        return new Promise((resolve) => {
            setConfirmDialog({
                isOpen: true,
                title: 'Delete Schedule Confirmation',
                message: 'Are you sure you want to delete this schedule? This action cannot be undone.',
                onConfirm: async () => {
                    await handleDeleteSchedule(scheduleId);
                    resolve();
                }
            });
        });
    };
    const handleRequestDeleteDaySchedule = async (doctorId: number, date: string): Promise<void> => {
        return new Promise((resolve) => {
            setConfirmDialog({
                isOpen: true,
                title: 'Delete All Schedules for This Day',
                message: `Are you sure you want to delete all schedules for this doctor on ${new Date(date).toLocaleDateString()}? This action cannot be undone.`,
                onConfirm: async () => {
                    await handleDeleteDaySchedule(doctorId, date);
                    resolve();
                }
            });
        });
    };

    const formatSchedulesByDate = (schedules: any[]) => {
        const groupedByDate = schedules.reduce((acc: any, schedule) => {
            if (!acc[schedule.date]) {
                acc[schedule.date] = [];
            }
            acc[schedule.date].push(schedule);
            return acc;
        }, {});

        return Object.entries(groupedByDate).map(([date, dateSchedules]: [string, any]) => ({
            date,
            schedules: dateSchedules
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Work Schedule Management</h1>
                <NewUserButton
                    onClick={handleCreateSchedule}
                    icon={<img src={plusWhiteIcon} alt="Plus" className="w-4 h-4" />}
                >
                    Create Schedule
                </NewUserButton>
            </div>

            {}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex justify-between items-center gap-4">
                    <div className="flex-1 relative">
                        <img
                            src={searchIcon}
                            alt="Search"
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search by doctor name or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <img src={refreshIcon} alt="Refresh" className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>
            </div>

            {}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Doctor Schedules</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doctor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Specialization
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Active Schedules
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Latest Schedule
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedDoctors.map((doctor) => {
                                const activeSchedules = doctor.schedules.filter(s => !s.hasAppointment);
                                const latestSchedule = doctor.schedules.sort((a, b) => 
                                    new Date(b.date).getTime() - new Date(a.date).getTime()
                                )[0];

                                return (
                                    <tr key={doctor.doctorId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium">
                                                        {doctor.doctorName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {doctor.doctorName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {doctor.doctorId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {doctor.specialization}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">
                                                {activeSchedules.length} slots
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {latestSchedule ? 
                                                new Date(latestSchedule.date).toLocaleDateString() : 
                                                'No schedules'
                                            }
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewSchedule(doctor)}
                                                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Schedule"
                                                >
                                                    <img src={eyeIcon} alt="View" className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateSchedule(doctor)}
                                                    className="p-2 text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 rounded-lg transition-colors"
                                                    title="Update Schedule"
                                                >
                                                    <img src={editIcon} alt="Edit" className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{Math.min(startIdx + 1, totalItems)}</span> to <span className="font-medium">{Math.min(endIdx, totalItems)}</span> of <span className="font-medium">{totalItems}</span> doctors
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 min-h-[60px] flex items-center justify-center">
                {totalItems > 0 && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                        >
                            Prev
                        </button>
                        {Array.from({length: totalPages}, (_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded font-semibold ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {}
            {showCreateModal && (<CreateScheduleModal
                    doctors={doctors}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchData();
                        showSuccess('Schedule Created', 'New schedule has been created successfully');
                    }}
                    onError={(message: string) => {
                        let title = 'Create Error';
                        let displayMessage = message;
                        
                        if (message.toLowerCase().includes('conflict') || message.toLowerCase().includes('already booked')) {
                            title = 'Schedule Conflict';
                            displayMessage = 'Some time slots are already booked. Please choose others or update existing ones.';
                        } else if (message.toLowerCase().includes('invalid')) {
                            title = 'Invalid Data';
                        } else if (message.toLowerCase().includes('server error')) {
                            title = 'Server Error';
                        }
                        
                        showError(title, displayMessage);
                    }}
                />
            )}

            {showViewModal && selectedDoctor && (
                <ViewScheduleModal
                    doctor={selectedDoctor}
                    onClose={() => setShowViewModal(false)}
                    onDeleteSchedule={handleRequestDeleteSchedule}
                    onDeleteDaySchedule={handleRequestDeleteDaySchedule}
                    onRefreshData={fetchData}
                />
            )}

            {showUpdateModal && selectedDoctor && (
                <UpdateScheduleModal
                    doctor={selectedDoctor}
                    onClose={() => setShowUpdateModal(false)}
                    onSuccess={() => {
                        setShowUpdateModal(false);
                        fetchData();
                        showSuccess('Schedule Updated', 'Schedule has been updated successfully');
                    }}
                    onError={(message: string) => showError('Update Error', message)}
                />
            )}

            {}
            {showSuccessNotification && (
                <SuccessNotification
                    isOpen={showSuccessNotification}
                    title={notificationTitle}
                    message={notificationMessage}
                    onClose={() => setShowSuccessNotification(false)}
                />
            )}

            {showErrorNotification && (
                <ErrorNotification
                    isOpen={showErrorNotification}
                    title={notificationTitle}
                    message={notificationMessage}
                    onClose={() => setShowErrorNotification(false)}
                />
            )}

            {}
            {confirmDialog && (
                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    onConfirm={async () => {
                        await confirmDialog.onConfirm();
                        setConfirmDialog(null);
                    }}
                    onCancel={() => setConfirmDialog(null)}
                    type="danger"
                />
            )}
        </div>
    );
};

export default WorkScheduleManagement;

