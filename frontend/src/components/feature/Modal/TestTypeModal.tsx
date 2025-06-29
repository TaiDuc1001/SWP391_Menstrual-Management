import React, { useState } from 'react';
import { CreateTestTypeRequest } from '../../../api/services/panelService';

interface TestTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTestTypeRequest) => Promise<void>;
}

const TestTypeModal: React.FC<TestTypeModalProps> = ({
    isOpen,
    onClose,
    onSubmit
}) => {
    const [formData, setFormData] = useState<CreateTestTypeRequest>({
        name: '',
        description: '',
        normalRange: '',
        unit: ''
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            // Reset form
            setFormData({
                name: '',
                description: '',
                normalRange: '',
                unit: ''
            });
            onClose();
        } catch (error) {
            console.error('Error submitting test type:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setFormData({
            name: '',
            description: '',
            normalRange: '',
            unit: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Create New Test Type</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Test Type Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            maxLength={100}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter test type name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            maxLength={1000}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter description (optional)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Normal Range
                        </label>
                        <input
                            type="text"
                            name="normalRange"
                            value={formData.normalRange}
                            onChange={handleInputChange}
                            maxLength={100}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 0-10 mg/L"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit
                        </label>
                        <input
                            type="text"
                            name="unit"
                            value={formData.unit}
                            onChange={handleInputChange}
                            maxLength={50}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., mg/L, IU/mL"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Test Type'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestTypeModal;
