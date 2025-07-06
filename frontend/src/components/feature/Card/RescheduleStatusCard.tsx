import React from 'react';
import { RescheduleRequest } from '../../../api/services/rescheduleService';

interface RescheduleStatusCardProps {
    rescheduleRequest: RescheduleRequest;
    onCancel?: (requestId: number) => void;
}

const RescheduleStatusCard: React.FC<RescheduleStatusCardProps> = ({ 
    rescheduleRequest, 
    onCancel 
}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PENDING':
                return {
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-800',
                    badgeColor: 'bg-yellow-100 text-yellow-800',
                    icon: '⏳',
                    title: 'Reschedule Request Pending',
                    description: 'Your doctor is reviewing your reschedule options'
                };
            case 'APPROVED':
                return {
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-800',
                    badgeColor: 'bg-green-100 text-green-800',
                    icon: '✅',
                    title: 'Reschedule Request Approved',
                    description: 'Your appointment has been rescheduled successfully'
                };
            case 'REJECTED':
                return {
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-800',
                    badgeColor: 'bg-red-100 text-red-800',
                    icon: '❌',
                    title: 'Reschedule Request Rejected',
                    description: 'Unfortunately, your reschedule request was not approved'
                };
            case 'CANCELLED':
                return {
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-800',
                    badgeColor: 'bg-gray-100 text-gray-800',
                    icon: '🚫',
                    title: 'Reschedule Request Cancelled',
                    description: 'You cancelled this reschedule request'
                };
            default:
                return {
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-800',
                    badgeColor: 'bg-gray-100 text-gray-800',
                    icon: 'ℹ️',
                    title: 'Reschedule Request',
                    description: ''
                };
        }
    };

    const config = getStatusConfig(rescheduleRequest.status);

    return (
        <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-6`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="text-lg">{config.icon}</span>
                    <h3 className={`font-semibold ${config.textColor}`}>
                        {config.title}
                    </h3>
                </div>
                <span className={`${config.badgeColor} px-2 py-1 rounded-full text-xs font-medium`}>
                    {rescheduleRequest.status}
                </span>
            </div>
            
            <p className={`text-sm ${config.textColor} mb-3`}>
                {config.description}
            </p>

            {/* Show reason if exists */}
            {rescheduleRequest.customerNote && (
                <div className="mb-3 bg-white bg-opacity-60 rounded p-3">
                    <p className="text-xs font-medium text-gray-600 mb-1">Reason:</p>
                    <p className="text-sm text-gray-700">{rescheduleRequest.customerNote}</p>
                </div>
            )}

            {/* Show options for pending/rejected requests */}
            {(rescheduleRequest.status === 'PENDING' || rescheduleRequest.status === 'REJECTED') && (
                <div className="mb-3">
                    <p className="text-xs font-medium text-gray-600 mb-2">Your requested options:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rescheduleRequest.options.map((option, index) => (
                            <div 
                                key={option.id || index} 
                                className="bg-white bg-opacity-60 rounded p-2 text-sm"
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">📅</span>
                                    <span>{formatDate(option.date)}</span>
                                    <span className="text-gray-500">🕒</span>
                                    <span>{option.timeRange || option.slot}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Show approved option */}
            {rescheduleRequest.status === 'APPROVED' && (
                <div className="mb-3">
                    {rescheduleRequest.options
                        .filter(option => option.isSelected)
                        .map(selectedOption => (
                            <div key={selectedOption.id || 0} className="bg-white bg-opacity-60 rounded p-3">
                                <p className="text-xs font-medium text-gray-600 mb-1">New appointment time:</p>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">📅</span>
                                    <span className="font-medium">{formatDate(selectedOption.date)}</span>
                                    <span className="text-gray-500">🕒</span>
                                    <span className="font-medium">{selectedOption.timeRange || selectedOption.slot}</span>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* Actions */}
            {rescheduleRequest.status === 'PENDING' && onCancel && (
                <div className="flex justify-end">
                    <button
                        onClick={() => onCancel(rescheduleRequest.id)}
                        className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                        Cancel Request
                    </button>
                </div>
            )}

            {/* Created timestamp */}
            {rescheduleRequest.createdAt && (
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                    Requested on: {new Date(rescheduleRequest.createdAt).toLocaleString('en-GB')}
                </div>
            )}
        </div>
    );
};

export default RescheduleStatusCard;
