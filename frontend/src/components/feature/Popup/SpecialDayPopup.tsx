import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../../styles/components/datepicker.css';
import pen from '../../../assets/icons/pen.svg';

interface SpecialDayPopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: { ovulationDays: string; fertileWindow: string }) => void;
    defaultMonth?: number;
    defaultYear?: number;
}

const SpecialDayPopup: React.FC<SpecialDayPopupProps> = ({ open, onClose, onSave, defaultMonth, defaultYear }) => {
    const [ovulationStartDate, setOvulationStartDate] = useState<Date | null>(null);
    const [ovulationEndDate, setOvulationEndDate] = useState<Date | null>(null);
    const [fertileStartDate, setFertileStartDate] = useState<Date | null>(null);
    const [fertileEndDate, setFertileEndDate] = useState<Date | null>(null);
    
    const [activeDatePicker, setActiveDatePicker] = useState<'ovulation' | 'fertile' | null>(null);
    
    const ovulationPickerRef = useRef<DatePicker>(null);
    const fertilePickerRef = useRef<DatePicker>(null);

    const formatDateRange = (startDate: Date | null, endDate: Date | null): string => {
        if (!startDate) return '';
        
        const formatDate = (date: Date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        };
        
        if (!endDate || startDate.getTime() === endDate.getTime()) {
            return formatDate(startDate);
        }
        
        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const handleDatePickerSave = (type: 'ovulation' | 'fertile') => {
        setActiveDatePicker(null);
        if (type === 'ovulation' && ovulationPickerRef.current) {
            ovulationPickerRef.current.setOpen(false);
        } else if (type === 'fertile' && fertilePickerRef.current) {
            fertilePickerRef.current.setOpen(false);
        }
    };

    const handleDatePickerClear = (type: 'ovulation' | 'fertile') => {
        if (type === 'ovulation') {
            setOvulationStartDate(null);
            setOvulationEndDate(null);
        } else if (type === 'fertile') {
            setFertileStartDate(null);
            setFertileEndDate(null);
        }
    };

    const handleDatePickerToday = (type: 'ovulation' | 'fertile') => {
        const today = new Date();
        if (type === 'ovulation') {
            setOvulationStartDate(today);
            setOvulationEndDate(today);
        } else if (type === 'fertile') {
            setFertileStartDate(today);
            setFertileEndDate(today);
        }
    };

    const CustomDatePickerFooter = ({ type }: { type: 'ovulation' | 'fertile' }) => (
        <div className="flex justify-between items-center px-3 py-2 border-t bg-gray-50">
            <button
                type="button"
                onClick={() => handleDatePickerClear(type)}
                className="text-blue-500 hover:text-blue-700 text-sm px-3 py-1 rounded hover:bg-blue-50 transition-colors"
            >
                Clear
            </button>
            <button
                type="button"
                onClick={() => handleDatePickerSave(type)}
                className="bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-1 rounded transition-colors"
            >
                Save
            </button>
            <button
                type="button"
                onClick={() => handleDatePickerToday(type)}
                className="text-blue-500 hover:text-blue-700 text-sm px-3 py-1 rounded hover:bg-blue-50 transition-colors"
            >
                Today
            </button>
        </div>
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const ovulationDays = formatDateRange(ovulationStartDate, ovulationEndDate);
        const fertileWindow = formatDateRange(fertileStartDate, fertileEndDate);
        
        if (onSave) {
            onSave({
                ovulationDays,
                fertileWindow
            });
        }
        
        onClose();
    };    return (
        <div className={`fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40 ${open ? '' : 'hidden'}`}>
            <div className="bg-white rounded-xl shadow-lg relative animate-fade-in max-w-md w-full p-6"
                 onClick={e => e.stopPropagation()}>
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-2xl z-10 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-full bg-white shadow-md w-10 h-10 flex items-center justify-center"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="inline-block w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center">
                            <img src={pen} alt="Pen" className="w-4 h-4"/>
                        </span>
                        Special Day
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Ovulation Days</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-pink-400 text-base placeholder-gray-400 cursor-pointer"
                                value={formatDateRange(ovulationStartDate, ovulationEndDate)}
                                placeholder="dd/mm/yyyy - dd/mm/yyyy"
                                readOnly
                                onClick={() => {
                                    setActiveDatePicker('ovulation');
                                    if (ovulationPickerRef.current) {
                                        ovulationPickerRef.current.setOpen(true);
                                    }
                                }}
                            />
                            <DatePicker
                                ref={ovulationPickerRef}
                                selected={ovulationStartDate}
                                onChange={(dates) => {
                                    const [start, end] = dates as [Date | null, Date | null];
                                    setOvulationStartDate(start);
                                    setOvulationEndDate(end);
                                }}
                                startDate={ovulationStartDate}
                                endDate={ovulationEndDate}
                                selectsRange
                                inline={false}
                                open={activeDatePicker === 'ovulation'}
                                onClickOutside={() => setActiveDatePicker(null)}
                                customInput={<div style={{ display: 'none' }} />}
                                openToDate={defaultMonth !== undefined && defaultYear !== undefined ? new Date(defaultYear, defaultMonth, 1) : new Date()}
                                children={<CustomDatePickerFooter type="ovulation" />}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Fertile Window</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-pink-400 text-base placeholder-gray-400 cursor-pointer"
                                value={formatDateRange(fertileStartDate, fertileEndDate)}
                                placeholder="dd/mm/yyyy - dd/mm/yyyy"
                                readOnly
                                onClick={() => {
                                    setActiveDatePicker('fertile');
                                    if (fertilePickerRef.current) {
                                        fertilePickerRef.current.setOpen(true);
                                    }
                                }}
                            />
                            <DatePicker
                                ref={fertilePickerRef}
                                selected={fertileStartDate}
                                onChange={(dates) => {
                                    const [start, end] = dates as [Date | null, Date | null];
                                    setFertileStartDate(start);
                                    setFertileEndDate(end);
                                }}
                                startDate={fertileStartDate}
                                endDate={fertileEndDate}
                                selectsRange
                                inline={false}
                                open={activeDatePicker === 'fertile'}
                                onClickOutside={() => setActiveDatePicker(null)}
                                customInput={<div style={{ display: 'none' }} />}
                                openToDate={defaultMonth !== undefined && defaultYear !== undefined ? new Date(defaultYear, defaultMonth, 1) : new Date()}
                                children={<CustomDatePickerFooter type="fertile" />}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded px-8 py-2 transition-all text-base shadow"
                            style={{minWidth: 100}}
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SpecialDayPopup;

