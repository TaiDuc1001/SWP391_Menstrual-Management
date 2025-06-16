import React from 'react';
import DatePicker from 'react-datepicker';
import calendarIcon from '../../assets/icons/calendar.svg';

interface DatePickerInputProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  selected, onChange, placeholder, minDate, maxDate
}) => (
  <div className="relative w-40 min-w-[10rem]">
    <DatePicker
      selected={selected}
      onChange={onChange}
      placeholderText={placeholder}
      className="border rounded p-2 w-full pr-10 focus:outline-none"
      calendarClassName="z-50"
      minDate={minDate}
      maxDate={maxDate}
      dateFormat="MM/dd/yyyy"
      locale="en"
    />
    <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
      <img src={calendarIcon} alt="Calendar" className="w-5 h-5 text-gray-400" />
    </span>
  </div>
);

export default DatePickerInput;
