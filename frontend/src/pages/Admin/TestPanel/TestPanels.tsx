import React, {useState, useEffect} from 'react';
import plusWhiteIcon from '../../../assets/icons/plus-white.svg';
import searchIcon from '../../../assets/icons/search.svg';
import editIcon from '../../../assets/icons/edit.svg';
import deleteIcon from '../../../assets/icons/trash-bin.svg';
import NewServiceButton from '../../../components/common/Button/AdminCreateButton';
import { usePanels } from '../../../api/hooks/usePanels';
import { useTestTypes } from '../../../api/hooks/useTestTypes';
import { Panel, CreatePanelRequest, UpdatePanelRequest, CreateTestTypeRequest } from '../../../api/services/panelService';
import PanelModal from '../../../components/feature/Modal/PanelModal';
import TestTypeModal from '../../../components/feature/Modal/TestTypeModal';
import ConfirmDialog from '../../../components/common/Dialog/ConfirmDialog';
import { useNotification } from '../../../context/NotificationContext';

const tabs = [
    {label: 'Service Management'},
    {label: 'Consultation Packages'},
    {label: 'Promotions'},
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
        case 'BASIC':
            return 'Basic';
        case 'ADVANCED':
            return 'Advanced';
        default:
            return type;
    }
};

const formatPanelTag = (tag: string) => {
    switch (tag) {
        case 'RECOMMENDED':
            return 'Recommended';
        case 'POPULAR':
            return 'Popular';
        case 'NEW':
            return 'New';
        case 'STANDARD':
            return 'Standard';
        default:
            return tag;
    }
};

const getPanelTypeColor = (type: string) => {
    switch (type) {
        case 'COMPREHENSIVE':
            return 'bg-purple-100 text-purple-800';
        case 'BASIC':
            return 'bg-blue-100 text-blue-800';
        case 'ADVANCED':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getPanelTagColor = (tag: string) => {
    switch (tag) {
        case 'RECOMMENDED':
            return 'bg-yellow-100 text-yellow-800';
        case 'POPULAR':
            return 'bg-red-100 text-red-800';
        case 'NEW':
            return 'bg-green-100 text-green-800';
        case 'STANDARD':
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const TestPanels: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    
    // Modal states
    const [isPanelModalOpen, setIsPanelModalOpen] = useState(false);
    const [isTestTypeModalOpen, setIsTestTypeModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedPanel, setSelectedPanel] = useState<Panel | null>(null);
    const [panelToDelete, setPanelToDelete] = useState<Panel | null>(null);
    
    // API hooks
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
        createTestType 
    } = useTestTypes();

    // Notification hook
    const { addNotification } = useNotification();

    // Fetch panels on component mount and when filters change
    useEffect(() => {
        const filters = {
            page: currentPage - 1, // API uses 0-based indexing
            size: pageSize,
            keyword: search.trim() || undefined
        };
        fetchPanels(filters);
    }, [currentPage, search]);

    const handleCreatePanel = () => {
        setModalMode('create');
        setSelectedPanel(null);
        setIsPanelModalOpen(true);
    };

    const handleEditPanel = (panel: Panel) => {
        setModalMode('edit');
        setSelectedPanel(panel);
        setIsPanelModalOpen(true);
    };

    const handleDeletePanel = (panel: Panel) => {
        setPanelToDelete(panel);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeletePanel = async () => {
        if (panelToDelete) {
            const success = await deletePanel(panelToDelete.id);
            if (success) {
                addNotification({
                    type: 'success',
                    title: 'Success',
                    message: 'Panel deleted successfully'
                });
            } else {
                addNotification({
                    type: 'error',
                    title: 'Error',
                    message: 'Failed to delete panel'
                });
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
                addNotification({
                    type: 'success',
                    title: 'Success',
                    message: 'Panel created successfully'
                });
            } else if (selectedPanel) {
                await updatePanel(Number(selectedPanel.id), data as UpdatePanelRequest);
                addNotification({
                    type: 'success',
                    title: 'Success',
                    message: 'Panel updated successfully'
                });
            }
        } catch (error) {
            console.error('Error submitting panel:', error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Failed to save panel. Please try again.'
            });
        }
    };

    const handleTestTypeSubmit = async (data: CreateTestTypeRequest) => {
        try {
            await createTestType(data);
            addNotification({
                type: 'success',
                title: 'Success',
                message: 'Test type created successfully'
            });
        } catch (error) {
            console.error('Error creating test type:', error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Failed to create test type. Please try again.'
            });
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white p-4 rounded shadow w-full mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">
                    Service Management
                </h1>
            </div>
            <div className="bg-white rounded shadow w-full p-4">
                <div className="flex border-b mb-4">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab.label}
                            className={`px-6 py-2 font-medium border-b-2 transition ${activeTab === idx ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'}`}
                            onClick={() => setActiveTab(idx)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
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
                            <th className="p-2 text-center">Duration (min)</th>
                            <th className="p-2 text-center">Response Time (h)</th>
                            <th className="p-2 text-center">Price</th>
                            <th className="p-2 text-center">Type</th>
                            <th className="p-2 text-center">Tag</th>
                            <th className="p-2 text-center">Test Types</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {panelsLoading ? (
                            <tr>
                                <td colSpan={9} className="p-4 text-center">
                                    Loading panels...
                                </td>
                            </tr>
                        ) : panels.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="p-4 text-center text-gray-500">
                                    No panels found
                                </td>
                            </tr>
                        ) : (
                            panels.map((panel: Panel) => (
                                <tr key={panel.id} className="border-b last:border-b-0">
                                    <td className="p-2 whitespace-nowrap font-medium">{panel.panelName}</td>
                                    <td className="p-2 max-w-xs truncate" title={panel.description}>
                                        {panel.description}
                                    </td>
                                    <td className="p-2 text-center">{panel.duration}</td>
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
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPanelTagColor(panel.panelTag)}`}>
                                            {formatPanelTag(panel.panelTag)}
                                        </span>
                                    </td>
                                    <td className="p-2 text-center">
                                        <span className="text-xs text-gray-600">
                                            {(panel.testTypeIds ? panel.testTypeIds.length : 0)} test(s)
                                        </span>
                                    </td>
                                    <td className="p-2 text-center">
                                        <button 
                                            className="inline-block mr-4" 
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

                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>
                        Displaying {Math.min((currentPage - 1) * pageSize + 1, totalItems)}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} panels
                    </span>
                    <div className="flex items-center gap-1">
                        <button 
                            disabled={currentPage === 1} 
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`px-2 py-1 rounded ${currentPage === 1 ? 'bg-gray-200' : 'bg-white border hover:bg-gray-50'}`}
                        >
                            {'<'}
                        </button>
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                            const page = i + 1;
                            return (
                                <button 
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-2 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-50'}`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                        {totalPages > 5 && (
                            <>
                                <button disabled className="px-2 py-1 rounded bg-white border">...</button>
                                <button 
                                    onClick={() => handlePageChange(totalPages)}
                                    className="px-2 py-1 rounded bg-white border hover:bg-gray-50"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}
                        <button 
                            disabled={currentPage === totalPages} 
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`px-2 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200' : 'bg-white border hover:bg-gray-50'}`}
                        >
                            {'>'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel Modal */}
            <PanelModal
                isOpen={isPanelModalOpen}
                onClose={() => setIsPanelModalOpen(false)}
                onSubmit={handlePanelSubmit}
                panel={selectedPanel}
                mode={modalMode}
            />

            {/* Test Type Modal */}
            <TestTypeModal
                isOpen={isTestTypeModalOpen}
                onClose={() => setIsTestTypeModalOpen(false)}
                onSubmit={handleTestTypeSubmit}
            />

            {/* Delete Confirmation Dialog */}
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
        </div>
    );
};

export default TestPanels;
