import React from 'react';
import DropdownBase from './DropdownBase';

interface MultiSelectDropdownProps {
    selected: string[];
    setSelected: (v: string[]) => void;
    options: string[];
    showDropdown: boolean;
    setShowDropdown: (v: boolean) => void;
    placeholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
                                                                     selected,
                                                                     setSelected,
                                                                     options,
                                                                     showDropdown,
                                                                     setShowDropdown,
                                                                     placeholder
                                                                 }) => (
    <div className="relative min-w-[12rem]">
        <DropdownBase
            onClick={() => setShowDropdown(!showDropdown)}
            isOpen={showDropdown}
            minWidth="min-w-[12rem]"
        >
            {selected.length === 0 ? (placeholder || 'All') : selected.join(', ')}
        </DropdownBase>
        {showDropdown && (
            <div className="absolute z-50 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-auto">
                <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={selected.length === 0}
                        onChange={() => setSelected([])}
                        className="mr-2"
                    />
                    {placeholder || 'All'}
                </label>
                {options.map(type => (
                    <label key={type} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selected.includes(type)}
                            onChange={() => {
                                if (selected.includes(type)) {
                                    setSelected(selected.filter(t => t !== type));
                                } else {
                                    setSelected([...selected, type]);
                                }
                            }}
                            className="mr-2"
                        />
                        {type}
                    </label>
                ))}
            </div>
        )}
    </div>
);

export default MultiSelectDropdown;
