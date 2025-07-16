import React, {useState, useEffect} from 'react';
import plusWhiteIcon from '../../../assets/icons/plus-white.svg';
import searchIcon from '../../../assets/icons/search.svg';
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/trash-bin.svg';
import eyeIcon from '../../../assets/icons/eye.svg';
import NewServiceButton from '../../../components/common/Button/AdminCreateButton';
import { usePanels } from '../../../api/hooks/usePanels';
import { useTestTypes } from '../../../api/hooks/useTestTypes';
import { Panel, CreatePanelRequest, UpdatePanelRequest, CreateTestTypeRequest } from '../../../api/services/panelService';
import PanelModal from '../../../components/feature/Modal/PanelModal';
import TestTypeModal from '../../../components/feature/Modal/TestTypeModal';
import ConfirmDialog from '../../../components/common/Dialog/ConfirmDialog';
import SuccessNotification from '../../../components/feature/Notification/SuccessNotification';
import ErrorNotification from '../../../components/feature/Notification/ErrorNotification';

const tabs = [
    {label: 'Service Management'},
];

const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE' || status === 'Active') {
        return <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">Active</span>;
    }
    return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs">Inactive</span>;
};


const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

const formatPanelType = (type: string) => {
    switch (type) {
        case 'COMPREHENSIVE':
            return 'Comprehensive';
        case 'SPECIALIZED':
            return 'Specialized';
        case 'PREVENTIVE':
            return 'Preventive';
        default:
            return type;
    }
};

const formatPanelTag = (tag: string) => {
    switch (tag) {
        case 'RECOMMENDED':
            return 'Recommended';
        case 'BEST_VALUE':
            return 'Best Value';
        case 'BUDGET_FRIENDLY':
            return 'Budget Friendly';
        case 'POPULAR':
            return 'Popular';
        case 'EXPRESS':
            return 'Express';
        case 'NEW':
            return 'New';
        default:
            return tag;
    }
};

const getPanelTypeColor = (type: string) => {
    switch (type) {
        case 'COMPREHENSIVE':
            return 'bg-purple-100 text-purple-800';
        case 'SPECIALIZED':
            return 'bg-blue-100 text-blue-800';
        case 'PREVENTIVE':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getPanelTagColor = (tag: string) => {
    switch (tag) {
        case 'RECOMMENDED':
            return 'bg-yellow-100 text-yellow-800';
        case 'BEST_VALUE':
            return 'bg-green-100 text-green-800';
        case 'BUDGET_FRIENDLY':
            return 'bg-blue-100 text-blue-800';
        case 'POPULAR':
            return 'bg-red-100 text-red-800';
        case 'EXPRESS':
            return 'bg-orange-100 text-orange-800';
        case 'NEW':
            return 'bg-purple-100 text-purple-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const TestPanels: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7;
    
    const [isPanelModalOpen, setIsPanelModalOpen] = useState(false);
    const [isTestTypeModalOpen, setIsTestTypeModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
    const [panelToDelete, setPanelToDelete] = useState<Panel | null>(null);
    const [panelForDetails, setPanelForDetails] = useState<Panel | null>(null);

    const [successNotification, setSuccessNotification] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: ''
    });
    
    const [errorNotification, setErrorNotification] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({
        isOpen: false,
        title: '',
        message: ''
    });
    
    const { 
        panels, 
        loading: panelsLoading, 
        error: panelsError,
        totalItems,
        totalPages,
        fetchPanels,
        createPanel,
        updatePanel,
        deletePanel
    } = usePanels();
    
    const { 
        createTestType,
        fetchTestTypes
    } = useTestTypes();

    const showSuccessNotification = (title: string, message: string) => {
        setSuccessNotification({
            isOpen: true,
            title,
            message
        });
    };

    const showErrorNotification = (title: string, message: string) => {
        setErrorNotification({
            isOpen: true,
            title,
            message
        });
    };

    const closeSuccessNotification = () => {
        setSuccessNotification(prev => ({ ...prev, isOpen: false }));
    };

    const closeErrorNotification = () => {
        setErrorNotification(prev => ({ ...prev, isOpen: false }));
    };

    useEffect(() => {
        const filters = {
            page: currentPage - 1, 
            size: pageSize,
            keyword: search.trim() || undefined
        };
        fetchPanels(filters);
    }, [currentPage, search]);

    const handleCreatePanel = () => {
        setModalMode('create');
        setSelectedPanel(null);
        fetchTestTypes();
        setIsPanelModalOpen(true);
    };

    const handleEditPanel = (panel: Panel) => {
        setModalMode('edit');
        setSelectedPanel(panel);
        fetchTestTypes();
        setIsPanelModalOpen(true);
    };

    const handleDeletePanel = (panel: Panel) => {
        setPanelToDelete(panel);
        setIsDeleteConfirmOpen(true);
    };

    const handleViewDetails = (panel: Panel) => {
        setPanelForDetails(panel);
        setIsDetailsModalOpen(true);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            setIsDetailsModalOpen(false);
        }
    };

    const confirmDeletePanel = async () => {
        if (panelToDelete) {
            const success = await deletePanel(panelToDelete.id);
            if (success) {
                showSuccessNotification('Success', 'Panel deleted successfully');

                const remainingItems = totalItems - 1;
                const maxPage = Math.ceil(remainingItems / pageSize);

                if (currentPage > maxPage && maxPage > 0) {
                    setCurrentPage(maxPage);
                } else {
                    const filters = {
                        page: currentPage - 1,
                        size: pageSize,
                        keyword: search.trim() || undefined
                    };
                    fetchPanels(filters);
                }
            } else {
                showErrorNotification('Error', 'Failed to delete panel');
            }
        }
        setIsDeleteConfirmOpen(false);
        setPanelToDelete(null);
    };

    const cancelDeletePanel = () => {
        setIsDeleteConfirmOpen(false);
        setPanelToDelete(null);
    };

    const handlePanelSubmit = async (data: CreatePanelRequest | UpdatePanelRequest) => {
        try {
            if (modalMode === 'create') {
                await createPanel(data as CreatePanelRequest);
                showSuccessNotification('Success', 'Panel created successfully');
                if (currentPage !== 1) {
                    setCurrentPage(1);
                }
            } else if (selectedPanel) {
                await updatePanel(selectedPanel.id, data as UpdatePanelRequest);
                showSuccessNotification('Success', 'Panel updated successfully');
            }
            setIsPanelModalOpen(false);
        } catch (error) {
            console.error('Error submitting panel:', error);
            showErrorNotification('Error', 'Failed to save panel. Please try again.');
        }
    };

    const handleTestTypeSubmit = async (data: CreateTestTypeRequest) => {
        try {
            await createTestType(data);
            showSuccessNotification('Success', 'Test type created successfully');

            await fetchTestTypes();
            setIsTestTypeModalOpen(false);
        } catch (error) {
            console.error('Error creating test type:', error);
            showErrorNotification('Error', 'Failed to create test type. Please try again.');
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-4 rounded shadow w-full mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">
                    Service Management
                </h1>
            </div>
            <div className="bg-white rounded shadow w-full p-4">
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-[400px]">
                        <input
                            type="text"
                            placeholder="Search by panel name, type, or tag..."
                            value={search}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-2 border rounded"
                        />
                        <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                            <img src={searchIcon} alt="Search" className="w-5 h-5 text-gray-400"/>
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsTestTypeModalOpen(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                        >
                            <img src={plusWhiteIcon} alt="Plus" className="w-4 h-4"/>
                            Add Test Type
                        </button>
                        <NewServiceButton 
                            icon={<img src={plusWhiteIcon} alt="Plus" className="w-5 h-5"/>}
                            onClick={handleCreatePanel}
                        >
                            Create new panel
                        </NewServiceButton>
                    </div>
                </div>
                
                {panelsError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {panelsError}
                    </div>
                )}
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                        <tr className="bg-gray-50 text-gray-700">
                            <th className="p-2 text-left">Panel Name</th>
                            <th className="p-2 text-left">Description</th>
                            <th className="p-2 text-center">Response Time (h)</th>
                            <th className="p-2 text-center">Price</th>
                            <th className="p-2 text-center">Type</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {panelsLoading ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center">
                                    Loading panels...
                                </td>
                            </tr>
                        ) : panels.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500">
                                    No panels found
                                </td>
                            </tr>
                        ) : (
                            panels.map((panel) => (
                                <tr key={panel.id} className="border-b last:border-b-0">
                                    <td className="p-2 whitespace-nowrap font-medium">{panel.panelName}</td>
                                    <td className="p-2 max-w-xs truncate" title={panel.description}>
                                        {panel.description}
                                    </td>
                                    <td className="p-2 text-center">{panel.responseTime}</td>
                                    <td className="p-2 text-center text-blue-600 font-semibold">
                                        {formatPrice(panel.price)}
                                    </td>
                                    <td className="p-2 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPanelTypeColor(panel.panelType)}`}>
                                            {formatPanelType(panel.panelType)}
                                        </span>
                                    </td>
                                    <td className="p-2 text-center">
                                        <button 
                                            className="inline-block mr-2" 
                                            title="View Details"
                                            onClick={() => handleViewDetails(panel)}
                                        >
                                            <img src={eyeIcon} alt="view" className="w-4 h-4"/>
                                        </button>
                                        <button 
                                            className="inline-block mr-2" 
                                            title="Edit"
                                            onClick={() => handleEditPanel(panel)}
                                        >
                                            <img src={editIcon} alt="edit" className="w-4 h-4"/>
                                        </button>
                                        <button 
                                            className="inline-block" 
                                            title="Delete"
                                            onClick={() => handleDeletePanel(panel)}
                                        >
                                            <img src={deleteIcon} alt="delete" className="w-4 h-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-2 px-6 py-4 text-xs text-gray-500 border-t">
                    <span>
                        Displaying {Math.min((currentPage - 1) * pageSize + 1, totalItems)}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems.toLocaleString()} panels
                    </span>
                </div>
            </div>

            {totalItems > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded font-semibold ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                    >
                        Next
                    </button>
                </div>
            )}

            {}
            <PanelModal
                isOpen={isPanelModalOpen}
                onClose={() => {
                    setIsPanelModalOpen(false);

                    const filters = {
                        page: currentPage - 1,
                        size: pageSize,
                        keyword: search.trim() || undefined
                    };
                    fetchPanels(filters);
                }}
                onSubmit={handlePanelSubmit}
                panel={selectedPanel}
                mode={modalMode}
            />

            {}
            <TestTypeModal
                isOpen={isTestTypeModalOpen}
                onClose={() => {
                    setIsTestTypeModalOpen(false);

                    const filters = {
                        page: currentPage - 1,
                        size: pageSize,
                        keyword: search.trim() || undefined
                    };
                    fetchPanels(filters);
                    fetchTestTypes(); // This will ensure PanelModal has latest test types
                }}
                onSubmit={handleTestTypeSubmit}
            />

            {}
            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                title="Delete Panel"
                message={`Are you sure you want to delete "${panelToDelete?.panelName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDeletePanel}
                onCancel={cancelDeletePanel}
                type="danger"
            />

            {}
            {isDetailsModalOpen && panelForDetails && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col">
                        {}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">Panel Details</h2>
                                <p className="text-sm text-gray-600">Comprehensive information about {panelForDetails.panelName}</p>
                            </div>
                            <button
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {}
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {}
                                <div className="space-y-6">
                                    {}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Basic Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Panel Name</label>
                                                <p className="text-base text-gray-900 font-medium bg-white p-2 rounded border">{panelForDetails.panelName}</p>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                                <div className="text-sm text-gray-900 bg-white p-3 rounded border leading-relaxed">
                                                    {panelForDetails.description}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Technical Details
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                                                <p className="text-lg font-bold text-blue-600">{panelForDetails.duration} <span className="text-sm font-normal text-gray-600">minutes</span></p>
                                            </div>
                                            
                                            <div className="bg-white rounded-lg p-3 border border-blue-200">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Response Time</label>
                                                <p className="text-lg font-bold text-blue-600">{panelForDetails.responseTime} <span className="text-sm font-normal text-gray-600">hours</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {}
                                <div className="space-y-6">
                                    {}
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            Pricing & Classification
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="bg-white rounded-lg p-3 border border-green-200">
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                                                <p className="text-2xl font-bold text-green-600">{formatPrice(panelForDetails.price)}</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                                                    <span className={`px-3 py-2 rounded-full text-sm font-medium ${getPanelTypeColor(panelForDetails.panelType)} block text-center`}>
                                                        {formatPanelType(panelForDetails.panelType)}
                                                    </span>
                                                </div>
                                                
                                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tag</label>
                                                    <span className={`px-3 py-2 rounded-full text-sm font-medium ${getPanelTagColor(panelForDetails.panelTag)} block text-center`}>
                                                        {formatPanelTag(panelForDetails.panelTag)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {}
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                            Test Types ({panelForDetails.testTypes.length})
                                        </h3>
                                        <div className="bg-white rounded-lg p-4 border border-purple-200 max-h-48 overflow-y-auto">
                                            {panelForDetails.testTypes.length > 0 ? (
                                                <ul className="space-y-2">
                                                    {panelForDetails.testTypes.map((testType, index) => (
                                                        <li key={index} className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-md p-2">
                                                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                                                            <span className="font-medium">{testType.name}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="text-center text-gray-500 py-4">
                                                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <p className="text-sm">No test types assigned</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {}
                        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-md"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {}
            <SuccessNotification
                isOpen={successNotification.isOpen}
                onClose={closeSuccessNotification}
                title={successNotification.title}
                message={successNotification.message}
            />

            {}
            <ErrorNotification
                isOpen={errorNotification.isOpen}
                onClose={closeErrorNotification}
                title={errorNotification.title}
                message={errorNotification.message}
            />
        </div>
    );
};

export default TestPanels;

