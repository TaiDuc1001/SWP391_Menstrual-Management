import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';

interface DayNotePopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: { symptom: string; period: string; flow: string; note: string }) => void;
    defaultValue?: { symptom: string; period: string; flow: string };
    defaultNote?: string;
}

const symptomOptions = [
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

const DayNotePopup: React.FC<DayNotePopupProps> = ({open, onClose, onSave, defaultValue, defaultNote}) => {
    const [symptom, setSymptom] = useState('');
    const [period, setPeriod] = useState('');
    const [flow, setFlow] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (open) {
            setSymptom(defaultValue?.symptom || '');
            setPeriod(defaultValue?.period || '');
            setFlow(defaultValue?.flow || '');
            setNote(defaultNote || '');
        }
    }, [open, defaultValue, defaultNote]);

    useEffect(() => {
        if (!open) {
            setSymptom('');
            setPeriod('');
            setFlow('');
            setNote('');
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSave) onSave({symptom, period, flow, note});
        onClose();
    };

    return (
        <Popup open={open} onClose={onClose} className="max-w-2xl w-full p-8 relative">
            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-2xl z-10 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-full bg-white shadow-md w-10 h-10 flex items-center justify-center"
                onClick={onClose}
                aria-label="Close"
            >
                &times;
            </button>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="text-pink-600 font-bold text-xl mb-2 flex items-center gap-2">
                    <span className="inline-block w-5 h-5 bg-pink-400 rounded-full"></span>
                    Day Note
                </div>
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Symptom</label>
                    <select className="w-full border rounded-lg px-4 py-3 focus:outline-pink-400" value={symptom}
                            onChange={e => setSymptom(e.target.value)} required>
                        <option value="">Select</option>
                        {symptomOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Menstrual period</label>
                    <select className="w-full border rounded-lg px-4 py-3 focus:outline-pink-400" value={period}
                            onChange={e => setPeriod(e.target.value)} required>
                        <option value="">Select</option>
                        {periodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Menstrual flow</label>
                    <select className="w-full border rounded-lg px-4 py-3 focus:outline-pink-400" value={flow}
                            onChange={e => setFlow(e.target.value)} required>
                        <option value="">Select</option>
                        {flowOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 mb-2 font-medium">Personal Note</label>
                    <textarea 
                        className="w-full border rounded-lg px-4 py-3 focus:outline-pink-400 resize-none" 
                        rows={4}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Add your personal notes for this day..."
                    />
                </div>
                <button type="submit"
                        className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition mt-4 text-lg">Save
                </button>
            </form>
        </Popup>
    );
};

export default DayNotePopup;

