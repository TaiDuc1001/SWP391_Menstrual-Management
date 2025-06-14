import React from 'react';
import Badge from './Badge';
import greenCheckIcon from '../../assets/icons/green-check.svg';
import yellowClockIcon from '../../assets/icons/yellow-clock.svg';
import pendingIcon from '../../assets/icons/pending.svg';
import confirmedIcon from '../../assets/icons/confirm.svg';
import cancelIcon from '../../assets/icons/cancel.svg';
import upcomingIcon from '../../assets/icons/upcoming.svg';

const inProgressIcon = yellowClockIcon;

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeClass = '';
  let icon = null;
  let textColor;
  let border = '';
  let shadow = '';
  switch (status) {
    case 'Completed':
      badgeClass = 'bg-green-50 text-green-700';
      icon = greenCheckIcon;
      textColor = '#059669';
      border = 'border border-green-200';
      shadow = 'shadow-green-100';
      break;
    case 'Pending':
      badgeClass = 'bg-gray-100 text-gray-600';
      icon = pendingIcon;
      textColor = '#6B7280';
      border = 'border border-gray-200';
      shadow = 'shadow-gray-100';
      break;
    case 'In progress':
      badgeClass = 'bg-yellow-50 text-yellow-700';
      icon = inProgressIcon;
      textColor = '#B45309';
      border = 'border border-yellow-200';
      shadow = 'shadow-yellow-100';
      break;
    case 'Sampled':
      badgeClass = 'bg-blue-50 text-blue-700';
      textColor = '#1D4ED8';
      border = 'border border-blue-200';
      shadow = 'shadow-blue-100';
      break;
    case 'Examined':
      badgeClass = 'bg-purple-50 text-purple-700';
      textColor = '#6B21A8';
      border = 'border border-purple-200';
      shadow = 'shadow-purple-100';
      break;
    case 'Upcoming':
      badgeClass = 'bg-blue-50 text-blue-700';
      icon = upcomingIcon;
      textColor = '#54A8A0';
      border = 'border border-blue-200';
      shadow = 'shadow-blue-100';
      break;
    case 'Cancelled':
      badgeClass = 'bg-red-50 text-red-500';
      icon = cancelIcon;
      textColor = '#EF4444';
      border = 'border border-red-200';
      shadow = 'shadow-red-100';
      break;
    case 'Confirmed':
      badgeClass = 'bg-blue-100 text-blue-700';
      icon = confirmedIcon;
      textColor = '#2563EB';
      border = 'border border-blue-200';
      shadow = 'shadow-blue-100';
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800';
      border = 'border border-gray-200';
      shadow = 'shadow-gray-100';
  }
  return (
    <Badge
      className={`flex items-center px-2 py-1 font-semibold text-sm rounded-lg gap-2 ${badgeClass} ${border} ${shadow}`}
      style={{ minWidth: '120px', justifyContent: 'start', position: 'relative', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
    >
      {icon && (
        <span className="flex-shrink-0 flex items-center justify-center" style={{ width: 22, height: 22 }}>
          <img src={icon} alt={status + ' icon'} className="w-4 h-4" />
        </span>
      )}
      <span
        className="flex-1 text-center w-full ml-1 tracking-wide capitalize"
        style={{
          display: 'block',
          color: textColor,
          fontWeight: 600,
          letterSpacing: '0.01em',
        }}
      >
        {status}
      </span>
    </Badge>
  );
};

export default StatusBadge;
