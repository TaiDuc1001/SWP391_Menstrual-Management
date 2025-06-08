import React from 'react';
import DropdownBase from './DropdownBase';

interface DropdownSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({ value, onChange, options, placeholder }) => {
  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder || 'Select';
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <div className="relative min-w-[8rem]">
      <DropdownBase onClick={() => setShowDropdown(!showDropdown)} isOpen={showDropdown} minWidth="min-w-[8rem]">
        {selectedLabel}
      </DropdownBase>
      {showDropdown && (
        <div className="absolute z-50 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-auto">
          {options.map(opt => (
            <div
              key={opt.value}
              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${value === opt.value ? 'bg-gray-100 font-semibold' : ''}`}
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
