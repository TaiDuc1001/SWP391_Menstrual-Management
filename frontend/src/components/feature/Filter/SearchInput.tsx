import React from 'react';
import searchIcon from '../../../assets/icons/search.svg';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => (
  <div className="relative flex-1 min-w-0">
    <input
      type="text"
      placeholder={placeholder || 'Search...'}
      className="border rounded p-2 w-full pr-10"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
      <img src={searchIcon} alt="Search" className="w-5 h-5 text-gray-400" />
    </span>
  </div>
);

export default SearchInput;
