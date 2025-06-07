import React from 'react';
import greenCheckIcon from '../../assets/icons/green-check.svg';
import yellowClockIcon from '../../assets/icons/yellow-clock.svg';
import pendingIcon from '../../assets/icons/pending.svg';

const inProgressIcon = yellowClockIcon;

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeClass = '';
  let icon = null;
  switch (status) {
    case 'Completed':
      badgeClass = 'bg-green-100 text-green-800';
      icon = greenCheckIcon;
      break;
    case 'Pending':
      badgeClass = 'bg-gray-200';
      icon = pendingIcon;
      break;
    case 'In progress':
      badgeClass = 'bg-yellow-100';
      icon = inProgressIcon;
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800';
  }
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded font-medium text-sm ${badgeClass}`}
      style={{ minWidth: '120px', justifyContent: 'start', position: 'relative' }}
    >
      {icon && (
        <span className="flex-shrink-0 flex items-center" style={{ width: 20, justifyContent: 'center' }}>
          <img src={icon} alt={status + ' icon'} className="w-4 h-4" />
        </span>
      )}
      <span
        className="flex-1 text-center w-full ml-1 tracking-wide capitalize"
        style={{
          display: 'block',
          color:
            status === 'Pending' ? '#8E8484' :
            status === 'In progress' ? '#EAB308' :
            status === 'Completed' ? '#34D399' :
            undefined
        }}
      >
        {status}
      </span>
    </span>
  );
};

export default StatusBadge;
