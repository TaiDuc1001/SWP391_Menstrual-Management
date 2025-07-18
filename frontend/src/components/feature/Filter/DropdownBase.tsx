import React from 'react';
import dropDownIcon from '../../../assets/icons/drop-down.svg';

interface DropdownBaseProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    isOpen?: boolean;
    minWidth?: string;
}

const DropdownBase: React.FC<DropdownBaseProps> = ({className = '', children, onClick, isOpen, minWidth}) => (
    <div className={`relative ${minWidth ? minWidth : 'min-w-[8rem]'} ${className}`}>
        <button
            type="button"
            className="border rounded p-2 pr-8 appearance-none w-full flex items-center justify-between bg-white hover:border-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
            onClick={onClick}
            tabIndex={0}
        >
            <span className="truncate text-left">{children}</span>
            <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                <img 
                    src={dropDownIcon} 
                    alt="Dropdown" 
                    className={`w-4 h-4 text-gray-400 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </span>
        </button>
    </div>
);

export default DropdownBase;

