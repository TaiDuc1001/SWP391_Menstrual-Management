import React, {useEffect, useState} from 'react';
import StatusBadge from '../../../components/common/Badge/StatusBadge';
import refreshIcon from '../../../assets/icons/refresh.svg';
import searchIcon from '../../../assets/icons/search.svg';
import userIcon from '../../../assets/icons/avatar.svg';
import NotificationPopup from '../../../components/feature/Popup/NotificationPopup';
import axios from 'axios';

interface Examination {
    id: number;
    date: string;
    timeRange: string;
    examinationStatus: string;
    panelName: string;
    customerName: string;
}

interface TestResult {
    testTypeId: number;
    name: string;
    diagnosis: boolean;
    testIndex: string;
    normalRange: string;
    note: string;
}

interface ExaminationDetail {
    id: number;
    testResults: TestResult[];
    date: string;
    timeRange: string;
    customerName: string;
    staffName: string | null;
    examinationStatus: string;
    panelId: number;
}

const getStatusLabel = (status: string): string => {
    switch (status) {
        case 'SAMPLED':
            return 'Sampled';
        case 'IN_PROGRESS':
            return 'In Progress';
        case 'EXAMINED':
            return 'Examined';
        case 'CANCELLED':
            return 'Cancelled';
        case 'COMPLETED':
            return 'Completed';
        default:
            return status;
    }
};

const Examinations: React.FC = () => {
    const [data, setData] = useState<Examination[]>([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [notification, setNotification] = useState({
        message: '',
        type: 'success' as 'success' | 'error',
        isOpen: false
    });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedExamination, setSelectedExamination] = useState<ExaminationDetail | null>(null);
    const [selectedPanelName, setSelectedPanelName] = useState<string>('');
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const itemsPerPage = 10;

    const fetchData = async () => {
        try {
            const res = await axios.get<Examination[]>('http://localhost:8080/api/examinations');
            setData(res.data);
        } catch (error) {
            console.error('Error loading data:', error);
            setNotification({
                message: 'An error occurred while loading data',
                type: 'error',
                isOpen: true
            });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await axios.put(`http://localhost:8080/api/examinations/completed/${id}`);
            setNotification({
                message: 'Status updated successfully',
                type: 'success',
                isOpen: true
            });
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
            setNotification({
                message: 'An error occurred while updating status',
                type: 'error',
                isOpen: true
            });
        }
    };

    const handleViewDetails = async (row: Examination) => {
        setIsLoadingDetail(true);
        setSelectedPanelName(row.panelName); // Lưu panelName từ row
        try {
            const response = await axios.get<ExaminationDetail>(`http://localhost:8080/api/examinations/examined/${row.id}`);
            setSelectedExamination(response.data);
            setIsDetailModalOpen(true);
        } catch (error) {
            console.error('Error loading details:', error);
        } finally {
            setIsLoadingDetail(false);
        }
    };    

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedExamination(null);
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({...prev, isOpen: false}));
    };

    const filteredData = data.filter(item =>
        item.examinationStatus === 'EXAMINED' &&
        (!status || item.examinationStatus.toLowerCase() === status.toLowerCase()) &&
        (item.customerName.toLowerCase().includes(search.toLowerCase()) ||
            item.panelName.toLowerCase().includes(search.toLowerCase()) ||
            String(item.id).toLowerCase().includes(search.toLowerCase()))
    );


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NotificationPopup
                message={notification.message}
                type={notification.type}
                isOpen={notification.isOpen}
                onClose={handleCloseNotification}
            />
            <div className="flex-1 flex flex-col items-center px-6 py-8">
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-2xl shadow p-8">
                        <h2 className="text-lg font-bold mb-6">List of requests to update results</h2>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative w-[400px]">
                                <input
                                    type="text"
                                    placeholder="Search by code, customer name..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <img src={searchIcon} alt="Search" className="w-5 h-5 text-gray-400"/>
                </span>
                            </div>
                            <button
                                onClick={fetchData}
                                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-5 h-10 rounded-lg transition shadow min-w-[120px]"
                            >
                                <img src={refreshIcon} alt="refresh" className="w-5 h-5"/>
                                <span className="text-base">Refresh</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                            <table className="min-w-full text-sm table-fixed">
                                <thead>
                                <tr className="bg-gray-50 text-gray-700">
                                    <th className="p-3 text-left font-semibold w-24">Request ID</th>
                                    <th className="p-3 text-left font-semibold w-32">Customer</th>
                                    <th className="p-3 text-left font-semibold w-40">Test Package</th>
                                    <th className="p-3 text-left font-semibold w-32">Appointment Date</th>
                                    <th className="p-3 text-left font-semibold w-44 whitespace-nowrap">Time</th>
                                    <th className="p-3 text-left font-semibold w-24">Status</th>
                                    <th className="p-3 text-left font-semibold w-40">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentItems.map(row => (
                                    <tr key={row.id}
                                        className="border-b last:border-b-0 hover:bg-blue-50/30 transition">
                                        <td className="p-3 font-medium">EXM-{row.id.toString().padStart(4, '0')}</td>
                                        <td className="p-3">{row.customerName}</td>
                                        <td className="p-3">{row.panelName}</td>
                                        <td className="p-3">{row.date}</td>
                                        <td className="p-3 whitespace-nowrap">{row.timeRange}</td>
                                        <td className="p-3">
                                            <StatusBadge status={getStatusLabel(row.examinationStatus)}/>
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            {row.examinationStatus === 'EXAMINED' ? (
                                                <button
                                                    className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow bg-green-500 text-white hover:bg-green-600 transition"
                                                    onClick={() => handleApprove(row.id)}
                                                >
                                                    Update
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Unavailable</span>
                                            )}
                                            <button
                                                className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow bg-blue-500 text-white hover:bg-blue-600 transition"
                                                onClick={() => handleViewDetails(row)}
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (<tr>
                                        <td colSpan={7} className="text-center p-6 text-gray-400">
                                            No matching data found.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 p-4 border-t">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-3 py-1 rounded ${
                                                currentPage === index + 1
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-3 py-1 rounded ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal chi tiết kết quả xét nghiệm */}
            {isDetailModalOpen && selectedExamination && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={handleCloseDetailModal}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    <img src={userIcon} alt="userIcon" className="w-10 h-10" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">DETAILED TEST RESULT</h2>
                                    <p className="text-sm text-gray-600">
                                        Code: <span
                                        className="text-blue-600 font-semibold">{selectedExamination.id}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseDetailModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                X
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {/* Thông tin cơ bản */}
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <span className="text-sm text-gray-600">Test date: </span>
                                    <span className="font-semibold">{selectedExamination.date}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Test time: </span>
                                    <span className="font-semibold">{selectedExamination.timeRange}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Staff: </span>
                                    <span className="font-semibold">{selectedExamination.staffName || '-'}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Test panel: </span>
                                    <span className="font-semibold">{selectedPanelName || '-'}</span>
                                </div>
                            </div>

                            {/* Bảng kết quả chi tiết */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Detailed result table</h3>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full text-sm">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="p-3 text-left font-semibold text-gray-700">Item</th>
                                            <th className="p-3 text-left font-semibold text-gray-700">Result</th>
                                            <th className="p-3 text-left font-semibold text-gray-700">Normal range</th>
                                            <th className="p-3 text-left font-semibold text-gray-700">Test index</th>
                                            <th className="p-3 text-left font-semibold text-gray-700">Note</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedExamination.testResults.map((result, index) => (
                                            <tr key={index} className="border-b hover:bg-gray-50">
                                                <td className="p-3 font-medium">{result.name}</td>
                                                <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                result.diagnosis
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-green-100 text-green-800'
                            }`}>
                              {result.diagnosis ? 'Positive' : 'Negative'}
                            </span>
                                                </td>
                                                <td className="p-3">{result.normalRange}</td>
                                                <td className="p-3">{result.testIndex}</td>
                                                <td className="p-3">{result.note || '-'}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Thông báo cảnh báo */}
                            <div className="mt-6 bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <span className="text-orange-400">⚠️</span>
                                    </div>
                                    <div className="ml-3"><p className="text-sm text-orange-700">
                                        You have a positive result. Please schedule a consultation appointment soon to
                                        receive timely treatment support.
                                    </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading overlay cho modal */}
            {isLoadingDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span>Loading details...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Examinations;
