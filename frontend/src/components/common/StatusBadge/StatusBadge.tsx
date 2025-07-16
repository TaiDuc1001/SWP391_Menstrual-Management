import React from 'react';

interface StatusBadgeProps {
    status: string;
    className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({status, className = ''}) => {
    const getStatusClasses = (status: string) => {
        const normalizedStatus = status.toLowerCase();

        switch (normalizedStatus) {
            case 'active':
            case 'confirmed':
            case 'completed':
            case 'success':
                return 'status-badge-active';
            case 'pending':
            case 'processing':
            case 'waiting':
                return 'status-badge-pending';
            case 'cancelled':
            case 'failed':
            case 'rejected':
                return 'status-badge-cancelled';
            case 'scheduled':
            case 'booked':
                return 'status-badge-confirmed';
            default:
                return 'status-badge-default';
        }
    };

    const classes = `status-badge-base ${getStatusClasses(status)} ${className}`;

    return (
        <span className={classes}>
      {status}
    </span>
    );
};

export default StatusBadge;

