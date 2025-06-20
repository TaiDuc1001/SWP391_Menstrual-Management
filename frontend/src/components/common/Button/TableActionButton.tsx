import React from 'react';
import '../../../../styles/components/table-actions.css';

interface TableActionButtonProps {
  label: string;
  onClick: () => void;
  variant: 'view' | 'checkout' | 'confirm' | 'join' | 'cancel' | 'result';
  disabled?: boolean;
}

const TableActionButton: React.FC<TableActionButtonProps> = ({
  label,
  onClick,
  variant,
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`table-action-button table-action-${variant}`}
    >
      {label}
    </button>
  );
};

export default TableActionButton;
