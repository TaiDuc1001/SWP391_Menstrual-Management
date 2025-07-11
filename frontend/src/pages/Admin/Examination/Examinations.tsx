import React, {useState, useEffect} from 'react';
import StatusBadge from '../../../components/common/Badge/StatusBadge';
import refreshIcon from '../../../assets/icons/refresh.svg';
import searchIcon from '../../../assets/icons/search.svg';
import SuccessNotification from '../../../components/feature/Notification/SuccessNotification';
import ErrorNotification from '../../../components/feature/Notification/ErrorNotification';
import { useAdminExaminations } from '../../../api/hooks/useAdminExaminations';
import { ExaminationDetail as ExaminationDetailType } from '../../../api/services/examinationService';
import { generateAvatarUrl } from '../../../utils/avatar';
import { applyPagination } from '../../../utils';

const EXAMINATION_STATUS = {
    SAMPLED: 'SAMPLED',
    IN_PROGRESS: 'IN_PROGRESS',
    EXAMINED: 'EXAMINED',
    CANCELLED: 'CANCELLED',
    COMPLETED: 'COMPLETED'
} as const;

const STATUS_LABELS = {
    [EXAMINATION_STATUS.SAMPLED]: 'Sampled',
    [EXAMINATION_STATUS.IN_PROGRESS]: 'In Progress',
    [EXAMINATION_STATUS.EXAMINED]: 'Examined',
    [EXAMINATION_STATUS.CANCELLED]: 'Cancelled',
    [EXAMINATION_STATUS.COMPLETED]: 'Completed'
} as const;

const UI_CONFIG = {
    ITEMS_PER_PAGE: 5,
    SEARCH_INPUT_WIDTH: 400,
    AVATAR_SIZE: 48,
    TABLE_COLUMNS: 7,
    MODAL_ANIMATION_DELAY: 300,
    NOTIFICATION_TITLES: {
        SUCCESS: 'Success',
        ERROR: 'Error'
    }
} as const;

const PLACEHOLDERS = {
    SEARCH: 'Search by code, customer name...',
    NO_DATA: 'No matching data found.',
    LOADING: 'Loading details...',
    UNAVAILABLE: 'Unavailable',
    DASH: '-'
} as const;

const BUTTON_TEXTS = {
    APPROVE: 'Approve',
    CANCEL: 'Cancel',
    VIEW_DETAILS: 'View Details',
    REFRESH: 'Refresh',
    CLOSE: 'X'
} as const;

const MEDICAL_KEYWORDS = {
    HIV: 'hiv',
    CHLAMYDIA: 'chlamydia'
} as const;

const MEDICAL_ASSESSMENTS = {
    HIV_POSITIVE: '⚠️ HIV screening reactive requires confirmatory testing with HIV-1/2 differentiation assay. Immediate referral to infectious disease specialist for evaluation and potential treatment initiation.',
    CHLAMYDIA_POSITIVE: '⚠️ Chlamydia positive indicates active infection. Immediate antibiotic treatment required. Partner notification and testing essential.',
    GENERIC_POSITIVE: (testName: string) => `⚠️ ${testName} positive requires clinical correlation and appropriate medical management.`,
    URGENT_CONSULTATION: '\n\nURGENT: Schedule consultation within 24-48 hours for proper diagnosis confirmation, treatment initiation, and partner notification if applicable.',
    ALL_NORMAL: '✅ All test results are within normal range. No sexually transmitted infections detected. Continue safe sexual practices and regular screening as recommended by healthcare provider.'
} as const;

interface TestResult {
    testTypeId: number;
    name: string;
    diagnosis: boolean;
    testIndex: string;
    normalRange: string;
    note: string;
}

const getStatusLabel = (status: string): string => {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status;
};

const formatDate = (dateString: string): string => {
    if (!dateString) return dateString;
    
    if (dateString.includes('-') && dateString.length === 10) {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    }
    
    return dateString;
};

const Examinations: React.FC = () => {
    const {
        examinations,
        refetch,
        approveExamination,
        cancelExamination,
        getExaminationDetail
    } = useAdminExaminations();
    
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [successNotification, setSuccessNotification] = useState({
        message: '',
        title: '',
        isOpen: false
    });
    const [errorNotification, setErrorNotification] = useState({
        message: '',
        title: '',
        isOpen: false
    });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedExamination, setSelectedExamination] = useState<ExaminationDetailType | null>(null);
    const [selectedPanelName, setSelectedPanelName] = useState<string>('');
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const pageSize = UI_CONFIG.ITEMS_PER_PAGE;

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handleRefresh = async () => {
        await refetch();
        setSearch('');
        setCurrentPage(1);
    };

    const handleApprove = async (id: number) => {
        const result = await approveExamination(id);
        if (result.success) {
            setSuccessNotification({
                title: UI_CONFIG.NOTIFICATION_TITLES.SUCCESS,
                message: result.message,
                isOpen: true
            });
        } else {
            setErrorNotification({
                title: UI_CONFIG.NOTIFICATION_TITLES.ERROR,
                message: result.message,
                isOpen: true
            });
        }
    };

    const handleCancel = async (id: number) => {
        const result = await cancelExamination(id);
        if (result.success) {
            setSuccessNotification({
                title: UI_CONFIG.NOTIFICATION_TITLES.SUCCESS,
                message: result.message,
                isOpen: true
            });
        } else {
            setErrorNotification({
                title: UI_CONFIG.NOTIFICATION_TITLES.ERROR,
                message: result.message,
                isOpen: true
            });
        }
    };

    const handleViewDetails = async (row: any) => {
        setIsLoadingDetail(true);
        setSelectedPanelName(row.panelName);
        try {
            const detail = await getExaminationDetail(row.id);
            if (detail) {
                setSelectedExamination(detail);
                setIsDetailModalOpen(true);
            }
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

    const handleCloseSuccessNotification = () => {
        setSuccessNotification(prev => ({...prev, isOpen: false}));
    };

    const handleCloseErrorNotification = () => {
        setErrorNotification(prev => ({...prev, isOpen: false}));
    };
    const filteredData = examinations.filter(item =>
        (item.examinationStatus === EXAMINATION_STATUS.EXAMINED || item.examinationStatus === EXAMINATION_STATUS.COMPLETED) &&
        (item.customerName.toLowerCase().includes(search.toLowerCase()) ||
            item.panelName.toLowerCase().includes(search.toLowerCase()) ||
            String(item.id).toLowerCase().includes(search.toLowerCase()))
    ).reverse();

    const paginationResult = applyPagination(filteredData, {
        currentPage,
        itemsPerPage: pageSize
    });
    const { items: currentItems, totalPages, totalItems, startIdx, endIdx } = paginationResult;

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <SuccessNotification
                title={successNotification.title}
                message={successNotification.message}
                isOpen={successNotification.isOpen}
                onClose={handleCloseSuccessNotification}
            />
            <ErrorNotification
                title={errorNotification.title}
                message={errorNotification.message}
                isOpen={errorNotification.isOpen}
                onClose={handleCloseErrorNotification}
            />
            <div className="flex-1 flex flex-col items-center px-6 py-8">
                <div className="w-full max-w-6xl">
                    <div className="bg-white rounded-2xl shadow p-8">
                        <div className="flex items-center mb-6">
                            <h2 className="text-lg font-semibold mr-2">List of requests to update results</h2>
                            <span className="text-blue-600 font-bold">{totalItems.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative" style={{width: `${UI_CONFIG.SEARCH_INPUT_WIDTH}px`}}>
                                <input
                                    type="text"
                                    placeholder={PLACEHOLDERS.SEARCH}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full px-4 py-2 border rounded"
                                />
                                <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <img src={searchIcon} alt="Search" className="w-5 h-5 text-gray-400"/>
                </span>
                            </div>
                            <button
                                onClick={handleRefresh}
                                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-5 h-10 rounded-lg transition shadow min-w-[120px]"
                            >
                                <img src={refreshIcon} alt="refresh" className="w-5 h-5"/>
                                <span className="text-base">{BUTTON_TEXTS.REFRESH}</span>
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                            <table className="min-w-full text-sm table-fixed">
                                <thead>
                                <tr className="bg-gray-50 text-gray-700">
                                    <th className="p-3 text-left font-semibold w-24">No</th>
                                    <th className="p-3 text-left font-semibold w-40">Customer</th>
                                    <th className="p-3 text-left font-semibold w-40">Test Package</th>
                                    <th className="p-3 text-left font-semibold w-32">Appointment Date</th>
                                    <th className="p-3 text-left font-semibold w-44 whitespace-nowrap">Time</th>
                                    <th className="p-3 text-left font-semibold w-24">Status</th>
                                    <th className="p-3 text-left font-semibold w-40">Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentItems.map((row, idx) => (
                                    <tr key={row.id}
                                        className="border-b last:border-b-0 hover:bg-blue-50/30 transition">
                                        <td className="p-3 font-medium">{startIdx + idx + 1}</td>
                                        <td className="p-3">{row.customerName}</td>
                                        <td className="p-3">{row.panelName}</td>
                                        <td className="p-3">{formatDate(row.date)}</td>
                                        <td className="p-3 whitespace-nowrap">{row.timeRange}</td>
                                        <td className="p-3">
                                            <StatusBadge status={getStatusLabel(row.examinationStatus)}/>
                                        </td>                                        <td className="p-3 flex gap-2">
                                            {row.examinationStatus === EXAMINATION_STATUS.EXAMINED ? (
                                                <>
                                                    <button
                                                        className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow bg-green-500 text-white hover:bg-green-600 transition"
                                                        onClick={() => handleApprove(row.id)}
                                                    >
                                                        {BUTTON_TEXTS.APPROVE}
                                                    </button>
                                                    <button
                                                        className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow bg-red-500 text-white hover:bg-red-600 transition"
                                                        onClick={() => handleCancel(row.id)}
                                                    >
                                                        {BUTTON_TEXTS.CANCEL}
                                                    </button>
                                                </>
                                            ) : row.examinationStatus === EXAMINATION_STATUS.COMPLETED ? null : (
                                                <span className="text-gray-400 text-xs">{PLACEHOLDERS.UNAVAILABLE}</span>
                                            )}
                                            <button
                                                className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow bg-blue-500 text-white hover:bg-blue-600 transition"
                                                onClick={() => handleViewDetails(row)}
                                            >
                                                {BUTTON_TEXTS.VIEW_DETAILS}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {currentItems.length === 0 && (<tr>
                                        <td colSpan={UI_CONFIG.TABLE_COLUMNS} className="text-center p-6 text-gray-400">
                                            {PLACEHOLDERS.NO_DATA}
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <div className="flex items-center justify-between mt-2 px-4 py-2 text-xs text-gray-500 border-t">
                                <span>
                                    Displaying {Math.min(startIdx + 1, totalItems)}-{Math.min(endIdx, totalItems)} of {totalItems.toLocaleString()} examinations
                                </span>
                            </div>
                        </div>
                        
                        {totalItems > 0 && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === 1 
                                            ? 'bg-gray-200 text-gray-400' 
                                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                    }`}
                                >
                                    Prev
                                </button>
                                {Array.from({length: totalPages}, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-3 py-1 rounded font-semibold ${
                                            currentPage === i + 1 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === totalPages 
                                            ? 'bg-gray-200 text-gray-400' 
                                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                    }`}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={generateAvatarUrl(selectedExamination.customerName || 'Customer', UI_CONFIG.AVATAR_SIZE)} 
                                        alt="Customer Avatar" 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">DETAILED TEST RESULT</h2>
                                    <p className="text-sm text-gray-600">
                                        Request ID: <span
                                        className="text-blue-600 font-semibold">{`EXM-${selectedExamination.id.toString().padStart(4, '0')}`}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseDetailModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                {BUTTON_TEXTS.CLOSE}
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <span className="text-sm text-gray-600">Test date: </span>
                                    <span className="font-semibold">{formatDate(selectedExamination.date)}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Test time: </span>
                                    <span className="font-semibold">{selectedExamination.timeRange}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Staff: </span>
                                    <span className="font-semibold">{selectedExamination.staffName || PLACEHOLDERS.DASH}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Test panel: </span>
                                    <span className="font-semibold">{selectedPanelName || PLACEHOLDERS.DASH}</span>
                                </div>
                            </div>

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
                                        {selectedExamination.testResults?.map((result: TestResult, index: number) => (
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
                                                <td className="p-3">{result.note || PLACEHOLDERS.DASH}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>                            
                            </div>
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <span className="text-blue-500">🩺</span>
                                    Medical Assessment & Recommendations
                                </h3>
                                {selectedExamination.overallNote ? (
                                    <div className={`rounded-lg p-4 border-l-4 ${
                                        selectedExamination.testResults?.some(tr => tr.diagnosis === true)
                                            ? 'bg-orange-50 border-orange-400'
                                            : 'bg-green-50 border-green-400'
                                    }`}>
                                        <div className="whitespace-pre-line text-gray-800 leading-relaxed text-sm">
                                            {selectedExamination.overallNote}
                                        </div>
                                    </div>
                                ) : (
                                    (() => {
                                        const positiveResults = selectedExamination.testResults?.filter(tr => tr.diagnosis === true) || [];
                                        const hasPositive = positiveResults.length > 0;
                                        
                                        let generatedAssessment = '';
                                        if (hasPositive) {
                                            const recommendations = positiveResults.map(result => {
                                                const testName = result.name.toLowerCase();
                                                if (testName.includes(MEDICAL_KEYWORDS.HIV)) {
                                                    return MEDICAL_ASSESSMENTS.HIV_POSITIVE;
                                                } else if (testName.includes(MEDICAL_KEYWORDS.CHLAMYDIA)) {
                                                    return MEDICAL_ASSESSMENTS.CHLAMYDIA_POSITIVE;
                                                } else {
                                                    return MEDICAL_ASSESSMENTS.GENERIC_POSITIVE(result.name);
                                                }
                                            });
                                            generatedAssessment = recommendations.join('\n\n') + MEDICAL_ASSESSMENTS.URGENT_CONSULTATION;
                                        } else {
                                            generatedAssessment = MEDICAL_ASSESSMENTS.ALL_NORMAL;
                                        }
                                        
                                        return (
                                            <div>
                                                
                                                <div className={`rounded-lg p-4 border-l-4 ${
                                                    hasPositive ? 'bg-orange-50 border-orange-400' : 'bg-green-50 border-green-400'
                                                }`}>
                                                    <div className="whitespace-pre-line text-gray-800 leading-relaxed text-sm">
                                                        {generatedAssessment}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isLoadingDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6">
                        <div className="flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span>{PLACEHOLDERS.LOADING}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Examinations;
