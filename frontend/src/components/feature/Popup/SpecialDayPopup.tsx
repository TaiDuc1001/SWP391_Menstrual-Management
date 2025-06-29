import React, { useState } from 'react';
import pen from '../../../assets/icons/pen.svg';

interface SpecialDayPopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: { periodDays: string; ovulationDays: string; fertileWindow: string }) => void;
}

const SpecialDayPopup: React.FC<SpecialDayPopupProps> = ({ open, onClose, onSave }) => {
    const [periodDays, setPeriodDays] = useState('');
    const [ovulationDays, setOvulationDays] = useState('');
    const [fertileWindow, setFertileWindow] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSave) onSave({ periodDays, ovulationDays, fertileWindow });
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
                        <label className="block text-gray-700 mb-2 font-medium">Period Days</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-pink-400 text-base placeholder-gray-400"
                            value={periodDays}
                            onChange={e => setPeriodDays(e.target.value)}
                            placeholder="dd/mm/yyyy"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Ovulation Days</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-pink-400 text-base placeholder-gray-400"
                            value={ovulationDays}
                            onChange={e => setOvulationDays(e.target.value)}
                            placeholder="dd/mm/yyyy"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2 font-medium">Fertile Window</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-pink-400 text-base placeholder-gray-400"
                            value={fertileWindow}
                            onChange={e => setFertileWindow(e.target.value)}
                            placeholder="dd/mm/yyyy"
                            required
                        />
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
