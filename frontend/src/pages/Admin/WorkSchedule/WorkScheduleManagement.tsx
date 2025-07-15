import React, { useEffect, useState } from 'react';
import { DoctorSchedule, scheduleService, Slot } from '../../../api/services/scheduleService';
import { doctorService } from '../../../api/services/doctorService';
import NewUserButton from "../../../components/common/Button/AdminCreateButton";
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
import DeleteConfirmModal from '../../../components/feature/Modal/DeleteConfirmModal';

const WorkScheduleManagement: React.FC = () => {
    const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorSchedule | null>(null);
    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
    const [deleteType, setDeleteType] = useState<'schedule' | 'date'>('schedule');
    const [deleteDate, setDeleteDate] = useState<string>('');

    // Notification states
    const [showSuccessNotification, setShowSuccessNotification] = useState(false);
    const [showErrorNotification, setShowErrorNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState('');
    const [notificationMessage, setNotificationMessage] = useState('');

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

    const handleRefresh = () => {
        setSearchTerm('');
        setCurrentPage(1);
        fetchData();
    };

    const filteredDoctors = doctorSchedules.filter(doctor =>
        doctor.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedDoctors = filteredDoctors.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalPages = Math.ceil(filteredDoctors.length / pageSize);

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

    const handleDeleteSchedule = (scheduleId: number) => {
        setSelectedScheduleId(scheduleId);
        setDeleteType('schedule');
        setShowDeleteModal(true);
    };

    const handleDeleteDaySchedule = (doctorId: number, date: string) => {
        setSelectedDoctor(doctorSchedules.find(d => d.doctorId === doctorId) || null);
        setDeleteDate(date);
        setDeleteType('date');
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            if (deleteType === 'schedule' && selectedScheduleId) {
                await scheduleService.deleteSchedule(selectedScheduleId);
                showSuccess('Schedule Deleted', 'Schedule has been deleted successfully');
            } else if (deleteType === 'date' && selectedDoctor) {
                await scheduleService.deleteDoctorSchedulesByDate(selectedDoctor.doctorId, deleteDate);
                showSuccess('Schedules Deleted', 'All schedules for the selected date have been deleted');
            }
            
            setShowDeleteModal(false);
            fetchData();
        } catch (error: any) {
            console.error('Error deleting schedule:', error);
            showError('Delete Error', error.response?.data?.message || 'Failed to delete schedule');
        }
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

            {/* Search and filters */}
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

            {/* Doctors schedule table */}
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

                {/* Pagination */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * pageSize, filteredDoctors.length)}
                                </span>{' '}
                                of <span className="font-medium">{filteredDoctors.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                            page === currentPage
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (<CreateScheduleModal
                    doctors={doctors}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchData();
                        showSuccess('Schedule Created', 'New schedule has been created successfully');
                    }}
                    onError={(message: string) => showError('Create Error', message)}
                />
            )}

            {showViewModal && selectedDoctor && (
                <ViewScheduleModal
                    doctor={selectedDoctor}
                    onClose={() => setShowViewModal(false)}
                    onDeleteSchedule={handleDeleteSchedule}
                    onDeleteDaySchedule={handleDeleteDaySchedule}
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

            {showDeleteModal && (
                <DeleteConfirmModal
                    title={deleteType === 'schedule' ? 'Delete Schedule' : 'Delete Day Schedules'}
                    message={
                        deleteType === 'schedule' 
                            ? 'Are you sure you want to delete this schedule? This action cannot be undone.'
                            : `Are you sure you want to delete all schedules for ${selectedDoctor?.doctorName} on ${deleteDate}? This action cannot be undone.`
                    }
                    onConfirm={confirmDelete}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}

            {/* Notifications */}
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
        </div>
    );
};

export default WorkScheduleManagement;
