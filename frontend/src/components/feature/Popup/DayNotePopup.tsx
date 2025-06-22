import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';

interface DayNotePopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: { symptom: string; period: string; flow: string }) => void;
    symptomOptions?: string[];
    defaultValue?: { symptom: string; period: string; flow: string };
}

const defaultSymptomOptions = [
    'Abdominal pain',
    'Back pain',
    'Headache',
    'Nausea',
    'None'
];
const periodOptions = [
    'Menstruating',
    'Not menstruating',
    'About to menstruate'
];
const flowOptions = [
    'Light',
    'Medium',
    'Heavy'
];

const DayNotePopup: React.FC<DayNotePopupProps> = ({open, onClose, onSave, symptomOptions, defaultValue}) => {
    const [symptom, setSymptom] = useState(defaultValue?.symptom || '');
    const [period, setPeriod] = useState(defaultValue?.period || '');
    const [flow, setFlow] = useState(defaultValue?.flow || '');

    // Update state when defaultValue changes
    useEffect(() => {
        setSymptom(defaultValue?.symptom || '');
        setPeriod(defaultValue?.period || '');
        setFlow(defaultValue?.flow || '');
    }, [defaultValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSave) onSave({symptom, period, flow});
        onClose();
    };

    return (
        <Popup open={open} onClose={onClose} className="max-w-xs w-full p-6 relative">
            {/* Close button in the top-right corner */}
            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-2xl z-10 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-full bg-white shadow-md w-10 h-10 flex items-center justify-center"
                onClick={onClose}
                aria-label="Close"
            >
                &times;
            </button>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="text-pink-600 font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="inline-block w-5 h-5 bg-pink-400 rounded-full"></span>
                    Day Note
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Symptom</label>
                    <select className="w-full border rounded px-3 py-2 focus:outline-pink-400" value={symptom}
                            onChange={e => setSymptom(e.target.value)} required>
                        <option value="">Select</option>
                        {(symptomOptions || defaultSymptomOptions).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Menstrual period</label>
                    <select className="w-full border rounded px-3 py-2 focus:outline-pink-400" value={period}
                            onChange={e => setPeriod(e.target.value)} required>
                        <option value="">Select</option>
                        {periodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Menstrual flow</label>
                    <select className="w-full border rounded px-3 py-2 focus:outline-pink-400" value={flow}
                            onChange={e => setFlow(e.target.value)} required>
                        <option value="">Select</option>
                        {flowOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <button type="submit"
                        className="w-full bg-pink-500 text-white py-2 rounded font-semibold hover:bg-pink-600 transition mt-2">Save
                </button>
            </form>
        </Popup>
    );
};

export default DayNotePopup;
