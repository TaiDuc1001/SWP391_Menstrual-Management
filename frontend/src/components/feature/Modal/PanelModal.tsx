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
    const { testTypes, loading: testTypesLoading, createTestType } = useTestTypes();
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
            // Reset form for create mode
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
                ? parseFloat(value) || 0 
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
                // Auto-select the newly created test type
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
        
        // Basic validation
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {mode === 'create' ? 'Create New Panel' : 'Edit Panel'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Panel Name *
                        </label>
                        <input
                            type="text"
                            name="panelName"
                            value={formData.panelName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price (VND) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                min="0"
                                step="1000"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Response Time (hours) *
                            </label>
                            <input
                                type="number"
                                name="responseTime"
                                value={formData.responseTime}
                                onChange={handleInputChange}
                                required
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (minutes) *
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                required
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Panel Type *
                            </label>
                            <select
                                name="panelType"
                                value={formData.panelType}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="COMPREHENSIVE">Comprehensive</option>
                                <option value="SPECIALIZED">Specialized</option>
                                <option value="PREVENTIVE">Preventive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Panel Tag *
                        </label>
                        <select
                            name="panelTag"
                            value={formData.panelTag}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="RECOMMENDED">Recommended</option>
                            <option value="BEST_VALUE">Best Value</option>
                            <option value="BUDGET_FRIENDLY">Budget Friendly</option>
                            <option value="POPULAR">Popular</option>
                            <option value="EXPRESS">Express</option>
                            <option value="NEW">New</option>
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Test Types
                            </label>
                            <button
                                type="button"
                                onClick={() => setIsTestTypeModalOpen(true)}
                                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                                + Add New Test Type
                            </button>
                        </div>
                        {testTypesLoading ? (
                            <div className="text-center py-4">Loading test types...</div>
                        ) : (
                            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                                {testTypes.length === 0 ? (
                                    <div className="text-gray-500 text-sm text-center py-4">
                                        No test types available. Create one first.
                                    </div>
                                ) : (
                                    testTypes.map((testType) => (
                                        <label key={testType.id} className="flex items-start space-x-2 py-2 border-b last:border-b-0">
                                            <input
                                                type="checkbox"
                                                checked={selectedTestTypes.includes(testType.id)}
                                                onChange={() => handleTestTypeToggle(testType.id)}
                                                className="rounded mt-1"
                                            />
                                            <div className="flex-1">
                                                <span className="text-sm font-medium">{testType.name}</span>
                                                {testType.description && (
                                                    <p className="text-xs text-gray-500 mt-1">{testType.description}</p>
                                                )}
                                                {(testType.normalRange || testType.unit) && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {testType.normalRange && `Range: ${testType.normalRange}`}
                                                        {testType.normalRange && testType.unit && ' | '}
                                                        {testType.unit && `Unit: ${testType.unit}`}
                                                    </p>
                                                )}
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : mode === 'create' ? 'Create Panel' : 'Update Panel'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Test Type Modal */}
            <TestTypeModal
                isOpen={isTestTypeModalOpen}
                onClose={() => setIsTestTypeModalOpen(false)}
                onSubmit={handleTestTypeSubmit}
            />
        </div>
    );
};

export default PanelModal;
