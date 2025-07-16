import React, { useState, useEffect } from 'react';
import { CreatePanelRequest, UpdatePanelRequest, Panel, TestType, CreateTestTypeRequest } from '../../../api/services/panelService';
import { useTestTypes } from '../../../api/hooks/useTestTypes';
import { useNotification } from '../../../context/NotificationContext';
import TestTypeModal from './TestTypeModal';

interface PanelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreatePanelRequest | UpdatePanelRequest) => Promise<void>;
    panel?: Panel | null;
    mode: 'create' | 'edit';
}

const PanelModal: React.FC<PanelModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    panel,
    mode
}) => {
    const { testTypes, loading: testTypesLoading, createTestType, fetchTestTypes } = useTestTypes();
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState<CreatePanelRequest>({
        panelName: '',
        description: '',
        price: 0,
        responseTime: 1,
        duration: 1,
        panelType: 'COMPREHENSIVE',
        panelTag: 'RECOMMENDED',
        testTypeIds: []
    });
    const [selectedTestTypes, setSelectedTestTypes] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [isTestTypeModalOpen, setIsTestTypeModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTestTypes();
        }
    }, [isOpen]);

    useEffect(() => {
        if (panel && mode === 'edit') {
            setFormData({
                panelName: panel.panelName,
                description: panel.description,
                price: panel.price,
                responseTime: panel.responseTime,
                duration: panel.duration,
                panelType: panel.panelType,
                panelTag: panel.panelTag,
                testTypeIds: panel.testTypes.map(t => t.id)
            });
            setSelectedTestTypes(panel.testTypes.map(t => t.id));
        } else {
            setFormData({
                panelName: '',
                description: '',
                price: 0,
                responseTime: 1,
                duration: 1,
                panelType: 'COMPREHENSIVE',
                panelTag: 'RECOMMENDED',
                testTypeIds: []
            });
            setSelectedTestTypes([]);
        }
    }, [panel, mode, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'responseTime' || name === 'duration' 
                ? value === '' ? 0 : parseFloat(value.replace(/[^\d.]/g, '')) || 0
                : value
        }));
    };

    const handleTestTypeToggle = (testTypeId: number) => {
        setSelectedTestTypes(prev => {
            const newSelection = prev.includes(testTypeId)
                ? prev.filter(id => id !== testTypeId)
                : [...prev, testTypeId];
            
            setFormData(prevData => ({
                ...prevData,
                testTypeIds: newSelection
            }));
            
            return newSelection;
        });
    };

    const handleTestTypeSubmit = async (data: CreateTestTypeRequest) => {
        try {
            const newTestType = await createTestType(data);
            if (newTestType) {
                setSelectedTestTypes(prev => [...prev, newTestType.id]);
                setFormData(prevData => ({
                    ...prevData,
                    testTypeIds: [...selectedTestTypes, newTestType.id]
                }));
                
                addNotification({
                    type: 'success',
                    title: 'Success',
                    message: 'Test type created and added to panel'
                });
            }
        } catch (error) {
            console.error('Error creating test type:', error);
            addNotification({
                type: 'error',
                title: 'Error',
                message: 'Failed to create test type. Please try again.'
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.panelName.trim()) {
            addNotification({
                type: 'error',
                title: 'Validation Error',
                message: 'Panel name is required'
            });
            return;
        }
        
        if (!formData.description.trim()) {
            addNotification({
                type: 'error',
                title: 'Validation Error',
                message: 'Description is required'
            });
            return;
        }
        
        if (formData.price <= 0) {
            addNotification({
                type: 'error',
                title: 'Validation Error',
                message: 'Price must be greater than 0'
            });
            return;
        }
        
        if (selectedTestTypes.length === 0) {
            addNotification({
                type: 'warning',
                title: 'Warning',
                message: 'Consider adding at least one test type to this panel'
            });
        }
        
        setLoading(true);
        try {
            await onSubmit({
                ...formData,
                testTypeIds: selectedTestTypes
            });
            onClose();
        } catch (error) {
            console.error('Error submitting panel:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                {}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {mode === 'create' ? 'Create New Panel' : 'Edit Panel'}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                {mode === 'create' ? 'Add a new medical test panel to the system' : 'Update panel information and settings'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {}
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Basic Information
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Panel Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="panelName"
                                                value={formData.panelName}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter panel name"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Description *
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                required
                                                rows={4}
                                                placeholder="Describe the panel and its purpose"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                            />
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
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Duration (minutes) *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="duration"
                                                    value={formData.duration}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Enter duration"
                                                    className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                                <span className="absolute right-3 top-3 text-sm text-gray-500">min</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Response Time (hours) *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="responseTime"
                                                    value={formData.responseTime}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Enter response time"
                                                    className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                                <span className="absolute right-3 top-3 text-sm text-gray-500">hrs</span>
                                            </div>
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
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Price (VND) *
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Enter price"
                                                    className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                />
                                                <span className="absolute right-3 top-3 text-sm text-gray-500">VND</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Panel Type *
                                                </label>
                                                <select
                                                    name="panelType"
                                                    value={formData.panelType}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                                                >
                                                    <option value="COMPREHENSIVE">Comprehensive</option>
                                                    <option value="SPECIALIZED">Specialized</option>
                                                    <option value="PREVENTIVE">Preventive</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Panel Tag *
                                                </label>
                                                <select
                                                    name="panelTag"
                                                    value={formData.panelTag}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white"
                                                >
                                                    <option value="RECOMMENDED">Recommended</option>
                                                    <option value="BEST_VALUE">Best Value</option>
                                                    <option value="BUDGET_FRIENDLY">Budget Friendly</option>
                                                    <option value="POPULAR">Popular</option>
                                                    <option value="EXPRESS">Express</option>
                                                    <option value="NEW">New</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {}
                                <div className="bg-purple-50 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                            Test Types ({selectedTestTypes.length})
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setIsTestTypeModalOpen(true)}
                                            className="text-sm bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Add New
                                        </button>
                                    </div>
                                    
                                    {testTypesLoading ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                                            <p className="text-sm text-gray-600 mt-2">Loading test types...</p>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-lg border border-purple-200 max-h-64 overflow-y-auto">
                                            {testTypes.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <p className="text-gray-500 text-sm">No test types available</p>
                                                    <p className="text-gray-400 text-xs mt-1">Create one using the button above</p>
                                                </div>
                                            ) : (
                                                <div className="p-2">
                                                    {testTypes.map((testType) => (
                                                        <label key={testType.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedTestTypes.includes(testType.id)}
                                                                onChange={() => handleTestTypeToggle(testType.id)}
                                                                className="rounded mt-1 text-purple-600 focus:ring-purple-500"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium text-gray-900">{testType.name}</span>
                                                                    {selectedTestTypes.includes(testType.id) && (
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                                            Selected
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {testType.description && (
                                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{testType.description}</p>
                                                                )}
                                                                {(testType.normalRange || testType.unit) && (
                                                                    <div className="flex gap-4 mt-2">
                                                                        {testType.normalRange && (
                                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                                Range: {testType.normalRange}
                                                                            </span>
                                                                        )}
                                                                        {testType.unit && (
                                                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                                                Unit: {testType.unit}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {mode === 'create' ? 'Create Panel' : 'Update Panel'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {}
            <TestTypeModal
                isOpen={isTestTypeModalOpen}
                onClose={() => setIsTestTypeModalOpen(false)}
                onSubmit={handleTestTypeSubmit}
            />
        </div>
    );
};

export default PanelModal;

