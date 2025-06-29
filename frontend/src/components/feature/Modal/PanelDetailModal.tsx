import React from 'react';
import { Panel } from '../../../api/services/panelService';

interface PanelDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    panel: Panel | null;
}

const formatPanelType = (type: string) => {
    switch (type) {
        case 'COMPREHENSIVE':
            return 'Comprehensive';
        case 'PREVENTIVE':
            return 'Preventive';
        case 'SPECIALIZED':
            return 'Specialized';
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
        case 'PREVENTIVE':
            return 'bg-blue-100 text-blue-800';
        case 'SPECIALIZED':
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

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};

const PanelDetailModal: React.FC<PanelDetailModalProps> = ({
    isOpen,
    onClose,
    panel
}) => {
    if (!isOpen || !panel) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Panel Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-xl font-extrabold text-blue-700 mb-4 border-b-2 border-blue-200 pb-2 uppercase tracking-wide">Basic Information</h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Panel Name</label>
                                    <p className="text-gray-900 font-medium">{panel.panelName}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                                    <p className="text-gray-900">{panel.description}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Price</label>
                                    <p className="text-blue-600 font-semibold text-lg">{formatPrice(panel.price)}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Response Time</label>
                                    <p className="text-gray-900">{panel.responseTime} hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories and Test Types */}
                    <div className="space-y-4">
                        {/* Categories */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-xl font-extrabold text-purple-700 mb-4 border-b-2 border-purple-200 pb-2 uppercase tracking-wide">Categories</h3>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Panel Type</label>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPanelTypeColor(panel.panelType)}`}>
                                        {formatPanelType(panel.panelType)}
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Panel Tag</label>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPanelTagColor(panel.panelTag)}`}>
                                        {formatPanelTag(panel.panelTag)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Test Types */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-xl font-extrabold text-green-700 mb-4 border-b-2 border-green-200 pb-2 uppercase tracking-wide">
                                Test Types ({panel.testTypes.length})
                            </h3>
                            
                            {panel.testTypes.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No test types associated with this panel</p>
                            ) : (
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {panel.testTypes.map((testType) => (
                                        <div key={testType.id} className="bg-white p-3 rounded-lg border border-gray-200">
                                            <h4 className="font-medium text-gray-900 mb-1">{testType.name}</h4>
                                            {testType.description && (
                                                <p className="text-gray-600 text-sm mb-2">{testType.description}</p>
                                            )}
                                            <div className="flex flex-wrap gap-2 text-xs">
                                                {testType.normalRange && (
                                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                        Range: {testType.normalRange}
                                                    </span>
                                                )}
                                                {testType.unit && (
                                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                                        Unit: {testType.unit}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Timestamps */}
                {(panel.createdAt || panel.updatedAt) && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <h3 className="text-xl font-extrabold text-gray-700 mb-4 border-b-2 border-gray-200 pb-2 uppercase tracking-wide">Timestamps</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {panel.createdAt && (
                                <div>
                                    <label className="block text-gray-600 mb-1">Created At</label>
                                    <p className="text-gray-900">{new Date(panel.createdAt).toLocaleString()}</p>
                                </div>
                            )}
                            {panel.updatedAt && (
                                <div>
                                    <label className="block text-gray-600 mb-1">Last Updated</label>
                                    <p className="text-gray-900">{new Date(panel.updatedAt).toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Close Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PanelDetailModal;
