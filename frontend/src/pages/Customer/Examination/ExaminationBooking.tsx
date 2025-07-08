import React, {useEffect, useState} from 'react';
import TitleBar from '../../../components/feature/TitleBar/TitleBar';
import calendarIcon from '../../../assets/icons/calendar.svg';
import bloodTestingImage from '../../../assets/images/blood-testing.svg';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import api from '../../../api/axios';
import BookingSuccessPopup from '../../../components/feature/Popup/BookingSuccessPopup';
import { examinationService } from '../../../api/services/examinationService';

const ExaminationBooking: React.FC = () => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [date, setDate] = useState('');
    const [slot, setSlot] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [slotOptions, setSlotOptions] = useState<{ value: string; label: string }[]>([]);
    const [slotLabelMap, setSlotLabelMap] = useState<{ [key: string]: string }>({});
    const [panelName, setPanelName] = useState('');    
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {panelId: panelIdParam} = useParams();
    const location = useLocation();

    const panelId = panelIdParam || (location.state && location.state.panelId);

    // Get current date and minimum allowed date
    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };

    const getMinDate = () => {
        // Allow booking from tomorrow onwards
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    // Validate if selected date is in the future
    const isDateInFuture = (dateString: string) => {
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate > today;
    };

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
    }, []);

    useEffect(() => {
        if (date) {
            setLoadingSlots(true);
            examinationService.getAvailableSlots(date)
                .then(slots => {
                    setAvailableSlots(slots || []);
                })
                .finally(() => {
                    setLoadingSlots(false);
                });
        } else {
            setAvailableSlots([]);
        }
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

        // Validate date is in the future
        if (!isDateInFuture(date)) {
            setError('You can only book examinations for future dates. Please select a date starting from tomorrow.');
            return;
        }

        // Additional validation for past dates
        const selectedDateObj = new Date(date);
        const currentDate = new Date();
        if (selectedDateObj < currentDate) {
            setError('Cannot book examination for past dates. Please select a future date.');
            setDate('');
            setSlot('');
            return;
        }

        setLoading(true);

        try {
            const result = await examinationService.createExamination(Number(panelId), {
                date,
                slot,
                note
            });

            if (result.error) {
                setError(result.error.message);
                if (result.error.isConflict) {
                    setSlot('');
                    if (date) {
                        const updatedSlots = await examinationService.getAvailableSlots(date);
                        setAvailableSlots(updatedSlots);
                    }
                }
            } else if (result.data) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    navigate('/customer/sti-tests');
                }, 1500);
            }
        } catch (error) {
            console.error('Unexpected error during examination creation:', error);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (        <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-6xl">
                <TitleBar
                    text="Book a Testing"
                    buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
                    onButtonClick={() => window.history.back()}
                />
                <div className="bg-white rounded-xl shadow-lg p-8 mt-4 animate-fade-in">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                            <img src={require('../../../assets/icons/calendar.svg').default} alt="calendar"
                                 className="w-7 h-7 text-pink-500"/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Book a Testing</h1>
                            <p className="text-pink-600 font-medium">{panelName}</p>
                        </div>
                    </div>
                    
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-3 text-lg">Select Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-pink-400 focus:outline-none transition-colors" 
                                        value={date}
                                        min={getMinDate()}
                                        onChange={e => {
                                            const newDate = e.target.value;
                                            // Additional validation on change
                                            if (newDate && !isDateInFuture(newDate)) {
                                                setError('Please select a future date. You can only book examinations starting from tomorrow.');
                                                return;
                                            }
                                            setDate(newDate);
                                            setSlot('');
                                            setError(''); // Clear any previous error
                                        }}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        You can book examinations starting from tomorrow ({new Date(getMinDate()).toLocaleDateString('vi-VN')})
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-3 text-lg">Additional Notes</label>
                                    <textarea 
                                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:border-pink-400 focus:outline-none transition-colors resize-none"
                                        placeholder="Enter any notes if needed..."
                                        rows={4}
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-3 text-lg">Choose Time Slot</label>
                                {!date && (
                                    <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                        Please select a date first
                                    </div>
                                )}
                                {date && loadingSlots && (
                                    <div className="text-gray-500 text-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
                                        Loading available slots...
                                    </div>
                                )}                                {date && !loadingSlots && (
                                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                        {slotOptions.map(opt => {
                                            const isSelected = slot === String(opt.value);
                                            const isAvailable = availableSlots.includes(String(opt.value));
                                            const isDisabled = !isAvailable;
                                            return (
                                                <label
                                                    key={String(opt.value)}
                                                    className={[
                                                        "flex items-center gap-4 border-2 rounded-xl px-5 py-4 transition-all duration-200 cursor-pointer hover:shadow-sm",
                                                        isSelected ? "slot-selected border-pink-400 bg-pink-50" : "",
                                                        isDisabled ? "slot-unavailable border-gray-200 bg-gray-50" : "slot-available border-gray-200 hover:border-pink-300"
                                                    ].join(" ")}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="timeSlot"
                                                        value={String(opt.value)}
                                                        checked={slot === String(opt.value)}
                                                        onChange={e => setSlot(String(e.target.value))}
                                                        className="w-5 h-5 accent-pink-500"
                                                        disabled={isDisabled}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`text-lg font-semibold ${isDisabled ? "text-gray-400" : isSelected ? "text-pink-600" : "text-gray-800"}`}>
                                                            {opt.label}
                                                        </div>
                                                        <div className="text-sm mt-1">
                                                            {isDisabled && (
                                                                <span className="text-red-500 font-medium">Already booked</span>
                                                            )}
                                                            {isSelected && !isDisabled && (
                                                                <span className="text-pink-600 font-medium">✓ Selected</span>
                                                            )}
                                                            {isAvailable && !isSelected && (
                                                                <span className="text-green-600 font-medium">Available</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        {isDisabled && (
                                                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                                <span className="text-red-500 text-sm font-bold">✕</span>
                                                            </div>
                                                        )}
                                                        {isSelected && !isDisabled && (
                                                            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                                                <span className="text-pink-500 text-sm font-bold">✓</span>
                                                            </div>
                                                        )}
                                                        {isAvailable && !isSelected && (
                                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                                <span className="text-green-500 text-sm font-bold">◯</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                                <div className="text-red-700 font-medium">{error}</div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button 
                                type="button"
                                onClick={() => window.history.back()}
                                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-4 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                className="flex-2 bg-pink-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-pink-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                disabled={!slot || !date || loading}
                            >
                                <img src={calendarIcon} alt="calendar" className="w-6 h-6"/>
                                <span className="text-lg">{loading ? 'Booking...' : 'Book Examination'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <BookingSuccessPopup 
                open={showSuccess} 
                onClose={() => setShowSuccess(false)}
                doctor={panelName}
                date={date ? new Date(date).toLocaleDateString() : ''}
                time={slotLabelMap[slot] || slot}
                note={note || 'No additional notes'}
                onGoHome={() => navigate('/customer/dashboard')}
                onViewHistory={() => navigate('/customer/sti-tests')}
                onBookNew={() => {
                    setShowSuccess(false);
                    setDate('');
                    setSlot('');
                    setNote('');
                }}
            />
        </div>
    );
};

export default ExaminationBooking;
