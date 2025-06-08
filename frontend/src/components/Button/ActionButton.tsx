import React from 'react';
import SquaredButton from './SquaredButton';
import RoundedButton from './RoundedButton';

interface ActionButtonProps extends React.ComponentProps<typeof SquaredButton> {
  label?: string;
  variant?: 'primary' | 'secondary';
  outlined?: boolean;
  actionType?: 'learn-more' | 'book'; // renamed from 'type' to 'actionType'
}

const ICONS: Record<string, string> = {
  'learn-more': require('../../assets/icons/search.svg').default,
  'book': require('../../assets/icons/calendar.svg').default,
};

const ActionButton: React.FC<ActionButtonProps> = ({
  label = 'Book',
  variant = 'primary',
  outlined = false,
  className = '',
  children,
  actionType,
  ...props
}) => {
  let variantClass = '';
  let ButtonComponent = SquaredButton;
  if (outlined) {
    ButtonComponent = RoundedButton;
    variantClass = 'bg-pink-50 text-pink-500 border border-pink-300 transition-colors duration-200 px-6 py-2 text-sm font-semibold flex items-center gap-2 hover:bg-pink-500 hover:text-white hover:shadow-lg hover:border-pink-500';
  } else if (variant === 'primary') {
    variantClass = 'bg-pink-500 text-white hover:bg-pink-600 px-6 py-2 font-semibold flex items-center gap-2';
  } else if (variant === 'secondary') {
    variantClass = 'bg-pink-100 text-pink-600 hover:bg-pink-200 px-6 py-2 font-semibold flex items-center gap-2';
  }

  // Icon logic
  let icon = null;
  if (actionType && ICONS[actionType]) {
    icon = <img src={ICONS[actionType]} alt={actionType} className="w-5 h-5" />;
  }

  return (
    <ButtonComponent
      className={`inline-flex items-center justify-center flex-nowrap whitespace-nowrap gap-2 min-w-0 ${variantClass} ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2 whitespace-nowrap">
        {icon}
        {children || label}
      </span>
    </ButtonComponent>
  );
};

export default ActionButton;
