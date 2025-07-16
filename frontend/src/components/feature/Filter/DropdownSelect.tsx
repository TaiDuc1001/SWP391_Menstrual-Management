import React from 'react';
import DropdownBase from './DropdownBase';

interface DropdownSelectProps {
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    className?: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({value, onChange, options, placeholder, className = ""}) => {
    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder || 'Select';
    const [showDropdown, setShowDropdown] = React.useState(false);

    const handleClickOutside = React.useCallback((event: MouseEvent) => {
        const target = event.target as Element;
        if (!target.closest('.dropdown-container')) {
            setShowDropdown(false);
        }
    }, []);

    React.useEffect(() => {
        if (showDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showDropdown, handleClickOutside]);

    return (
        <div className={`dropdown-container relative min-w-[8rem] ${className}`}>
            <DropdownBase onClick={() => setShowDropdown(!showDropdown)} isOpen={showDropdown} minWidth="min-w-[8rem]">
                {selectedLabel}
            </DropdownBase>
            {showDropdown && (
                <div className="dropdown-menu absolute z-50 bg-white border border-gray-200 rounded-md shadow-lg min-w-max mt-1">
                    {options.map(opt => (
                        <div
                            key={opt.value}
                            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm whitespace-nowrap ${
                                value === opt.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                            }`}
                            onClick={() => {
                                onChange(opt.value);
                                setShowDropdown(false);
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownSelect;

