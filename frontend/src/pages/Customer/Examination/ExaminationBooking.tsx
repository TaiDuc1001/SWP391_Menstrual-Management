import React, {useEffect, useState} from 'react';
import TitleBar from '../../../components/feature/TitleBar/TitleBar';
import calendarIcon from '../../../assets/icons/calendar.svg';
import bloodTestingImage from '../../../assets/images/blood-testing.svg';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import api from '../../../api/axios';
import BookingSuccessPopup from '../../../components/feature/Popup/BookingSuccessPopup';

const ExaminationBooking: React.FC = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [date, setDate] = useState('');
    const [slot, setSlot] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [slotOptions, setSlotOptions] = useState<{ value: string; label: string }[]>([]);
    const [slotLabelMap, setSlotLabelMap] = useState<{ [key: string]: string }>({});
    const [panelName, setPanelName] = useState('');
    const navigate = useNavigate();
    const {panelId: panelIdParam} = useParams();
    const location = useLocation();
    const panelId = panelIdParam || (location.state && location.state.panelId);
    useEffect(() => {
        api.get('/enumerators/slots')
            .then(res => {
                const options: { value: string; label: string }[] = [];
                const labelMap: { [key: string]: string } = {};
                (res.data as { timeRange: string }[]).forEach((slot) => {
                    if (slot.timeRange !== 'Filler slot, not used') {
                        options.push({value: slot.timeRange, label: slot.timeRange});
                        labelMap[slot.timeRange] = slot.timeRange;
                    }
                });
                setSlotOptions(options);
                setSlotLabelMap(labelMap);
            })
            .catch(() => {
            });
    }, [date]);

    useEffect(() => {
        if (panelId) {
            api.get(`/panels/${panelId}`)
                .then(res => {
                    setPanelName(res.data.panelName || 'Test Panel');
                })
                .catch(() => {
                    setPanelName('Test Panel');
                });
        }
    }, [panelId]);

    if (!panelId) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="text-2xl font-bold text-red-500 mb-4">Panel ID is missing!</div>
                    <div className="text-gray-600">Please select a test package to book.</div>
                </div>
            </div>
        );
    }    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!date || !slot) {
            setError('Please select date and time slot.');
            return;
        }
        try {
            await api.post(`/panels/${panelId}`, {date, slot, note});
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate('/customer/sti-tests');
            }, 1500);
        } catch (err) {
            setError('Booking failed. Please try again.');
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <TitleBar
                    text="Book a Testing"
                    buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
                    onButtonClick={() => window.history.back()}
                />
                <div className="bg-white rounded-xl shadow-md p-8 mt-4 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 min-w-[300px]">
                        <div className="flex items-center gap-2 mb-6">
                            <img src={require('../../../assets/icons/calendar.svg').default} alt="calendar"
                                 className="w-8 h-8 text-pink-500"/>
                            <span className="text-xl font-bold text-pink-600">Book a Testing</span>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-gray-700 font-semibold mb-1">Date</label>
                                    <input type="date" className="w-full border rounded px-4 py-2" value={date}
                                           onChange={e => {
                                               setDate(e.target.value);
                                               setSlot('');
                                           }}/>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 font-semibold mb-1">Time Slot</label>
                                    <select className="w-full border rounded px-4 py-2" value={slot}
                                            onChange={e => setSlot(e.target.value)}>
                                        <option value="">Select slot</option>
                                        {slotOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Additional Notes</label>
                                <input type="text" className="w-full border rounded px-4 py-2"
                                       placeholder="Enter any notes if needed..." value={note}
                                       onChange={e => setNote(e.target.value)}/>
                            </div>
                            {error && <div className="text-red-500 text-sm">{error}</div>}
                            <button type="submit"
                                    className="w-full bg-pink-400 text-white font-bold py-3 rounded-lg mt-4 flex items-center justify-center gap-2 text-lg hover:bg-pink-500 transition">
                                <img src={calendarIcon} alt="calendar" className="w-6 h-6"/>                                Book
                            </button>
                        </form>
                    </div>
                    <div className="hidden md:block">
                        <img src={bloodTestingImage} alt="lab test" className="w-80 h-auto"/>
                    </div>
                </div>
            </div>
            <BookingSuccessPopup 
                open={showSuccess} 
                onClose={() => setShowSuccess(false)} 
                doctor={panelName}
                date={date ? new Date(date).toLocaleDateString() : ''}
                time={slotLabelMap[slot] || slot}
                note={note || 'No additional notes'}
                onViewHistory={() => {
                    setShowSuccess(false);
                    navigate('/customer/sti-tests');
                }}
                onBookNew={() => {
                    setShowSuccess(false);
                    navigate('/customer/sti-tests/packages');
                }}
            />
        </div>
    );
};

export default ExaminationBooking;
