import React, {useEffect, useState} from 'react';
import TitleBar from '../../../components/feature/TitleBar/TitleBar';
import calendarIcon from '../../../assets/icons/calendar.svg';
import {useNavigate} from 'react-router-dom';
import DropdownSelect from '../../../components/feature/Filter/DropdownSelect';
import {SearchInput} from '../../../components';
import BookingSuccessPopup from '../../../components/feature/Popup/BookingSuccessPopup';
import Rating from '../../../components/feature/Rating/Rating';
import api from '../../../api/axios';
import { appointmentService } from '../../../api/services/appointmentService';

const reviewOptions = [
    {value: '', label: 'Reviews'},
    {value: 'high', label: 'Highest Rated'},
    {value: 'low', label: 'Lowest Rated'},
];

const AppointmentBooking: React.FC = () => {
    const [advisors, setAdvisors] = useState<any[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [selectedAdvisor, setSelectedAdvisor] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [problem, setProblem] = useState('');
    const [reviewFilter, setReviewFilter] = useState('');
    const [specializationFilter, setSpecializationFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);    const [slotOptions, setSlotOptions] = useState<{ value: string; label: string }[]>([]);
    const [slotLabelMap, setSlotLabelMap] = useState<{ [key: string]: string }>({});
    const [showSlotError, setShowSlotError] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [redirectTimeout, setRedirectTimeout] = useState<NodeJS.Timeout | null>(null);
    const navigate = useNavigate();

    const customerId = 3;

    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split('T')[0];
    };

    const getMinDate = () => {

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const isDateInFuture = (dateString: string) => {
        const selectedDate = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        return selectedDate > today;
    };

    useEffect(() => {
        return () => {
            if (redirectTimeout) {
                clearTimeout(redirectTimeout);
            }
        };
    }, [redirectTimeout]);
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
        if (selectedAdvisor && selectedDate) {
            setLoadingSlots(true);
            appointmentService.getAvailableSlots(selectedAdvisor, selectedDate)
                .then(slots => {
                    setAvailableSlots(slots || []);
                })
                .finally(() => {
                    setLoadingSlots(false);
                });
        } else {
            setAvailableSlots([]);
        }
    }, [selectedAdvisor, selectedDate]);

    useEffect(() => {
        const fetchDoctorsWithRatings = async () => {
            try {
                const doctorsResponse = await api.get('/doctors');
                const doctors = doctorsResponse.data;

                const doctorsWithRatings = await Promise.all(
                    doctors.map(async (doctor: any) => {
                        try {
                            const ratingResponse = await api.get(`/appointments/doctor/${doctor.id}/average-rating`);
                            const { averageRating, totalRatings } = ratingResponse.data;
                            return {
                                id: doctor.id,
                                name: doctor.name,
                                avatar: '',
                                rating: averageRating ? Math.round(averageRating * 10) / 10 : 0,
                                reviews: totalRatings || 0,
                                appointments: 0,
                                specialization: doctor.specialization,
                                price: doctor.price,
                                experience: doctor.experience,
                            };
                        } catch (error) {

                            return {
                                id: doctor.id,
                                name: doctor.name,
                                avatar: '',
                                rating: 0,
                                reviews: 0,
                                appointments: 0,
                                specialization: doctor.specialization,
                                price: doctor.price,
                            };
                        }
                    })
                );
                
                setAdvisors(doctorsWithRatings);
            } catch (error) {
                setAdvisors([]);
            }
        };

        fetchDoctorsWithRatings();
    }, []);

    const specializationOptions = [
        {value: '', label: 'Specialization'},
        ...Array.from(new Set(advisors.map(a => a.specialization))).map(s => ({value: s, label: s}))
    ];    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedAdvisor || !selectedDate || !selectedTime) {
            setShowSlotError(!selectedTime);
            return;
        }

        if (!isDateInFuture(selectedDate)) {
            alert('You can only book appointments for future dates. Please select a date starting from tomorrow.');
            return;
        }

        const selectedDateObj = new Date(selectedDate);
        const currentDate = new Date();
        if (selectedDateObj < currentDate) {
            alert('Cannot book appointment for past dates. Please select a future date.');
            setSelectedDate('');
            setSelectedTime('');
            return;
        }

        setShowSlotError(false);
        setLoading(true);
        
        if (redirectTimeout) {
            clearTimeout(redirectTimeout);
            setRedirectTimeout(null);
        }
        
        try {
            const result = await appointmentService.createAppointment({
                doctorId: selectedAdvisor,
                customerId,
                date: selectedDate,
                slot: selectedTime,
                customerNote: problem,
            });
            
            if (result.error) {
                alert(result.error.message);
                if (result.error.isConflict) {
                    setSelectedTime('');
                    if (selectedAdvisor && selectedDate) {
                        const updatedSlots = await appointmentService.getAvailableSlots(selectedAdvisor, selectedDate);
                        setAvailableSlots(updatedSlots);
                    }
                }
            } else if (result.data) {
                setShowSuccess(true);
                const timeout = setTimeout(() => {
                    navigate('/customer/appointments');
                }, 10000);
                setRedirectTimeout(timeout);
            }
        } catch (error) {
            console.error('Unexpected error during appointment creation:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const advisor = advisors.find(a => a.id === selectedAdvisor);
    const displayTime = selectedTime && slotLabelMap[selectedTime] ? slotLabelMap[selectedTime] : 'Unknown time';

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center">
            <div className="w-full max-w-5xl">
                <TitleBar
                    text="Book an appointment"
                    buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
                    onButtonClick={() => window.history.back()}
                />
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md p-8 mt-4 flex flex-col md:flex-row gap-8">
                        <div className="flex-1 min-w-[320px]">
                            <div className="mb-6">
                                <div className="font-semibold text-gray-700 mb-2">Find your advisor</div>
                                <div className="flex gap-2 mb-2">
                                    <SearchInput
                                        value={searchTerm}
                                        onChange={setSearchTerm}
                                        placeholder="Search for a doctor or specialization"
                                    />
                                    <div className="dropdown-full-width">
                                        <DropdownSelect
                                            value={reviewFilter}
                                            onChange={setReviewFilter}
                                            options={reviewOptions}
                                            placeholder="Reviews"
                                        />
                                    </div>
                                    <div className="dropdown-full-width">
                                        <DropdownSelect
                                            value={specializationFilter}
                                            onChange={setSpecializationFilter}
                                            options={specializationOptions}
                                            placeholder="Specialization"
                                        />
                                    </div>
                                </div>
                                <div
                                    className="bg-gray-50 rounded-xl p-4 cursor-pointer border border-pink-200 max-h-64 overflow-y-auto">
                                    <div className="flex flex-col gap-2">
                                        {advisors
                                            .filter(a => {
                                                const specializationMatch = !specializationFilter || a.specialization === specializationFilter;
                                                const searchMatch = !searchTerm || 
                                                    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                    a.specialization.toLowerCase().includes(searchTerm.toLowerCase());
                                                return specializationMatch && searchMatch;
                                            })
                                            .sort((a, b) => {
                                                if (reviewFilter === 'high') return b.rating - a.rating;
                                                if (reviewFilter === 'low') return a.rating - b.rating;
                                                return 0;
                                            })
                                            .map(a => (
                                                <div
                                                    key={a.id}
                                                    className={`flex items-center justify-between rounded-lg px-3 py-2 transition cursor-pointer border hover:border-pink-400 ${selectedAdvisor === a.id ? 'border-pink-400 bg-pink-50' : 'border-transparent bg-white'}`}
                                                    onClick={() => setSelectedAdvisor(a.id)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-800">{a.name}</div>
                                                            <div className="text-sm text-gray-600 mb-1">{a.specialization}</div>
                                                            <div className="text-xs text-gray-500 mb-1">{typeof a.experience === 'number' ? `${a.experience} years experience` : ''}</div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                {a.rating > 0 ? (
                                                                    <>
                                                                        <Rating score={a.rating} size="small" showText={false} />
                                                                        <span className="text-yellow-600 font-semibold">{a.rating}</span>
                                                                        <span>({a.reviews} reviews)</span>
                                                                    </>
                                                                ) : (
                                                                    <span className="text-gray-400">No ratings yet</span>
                                                                )}
                                                                <span className="ml-2 text-xs text-pink-500 font-bold">{a.price ? `${a.price}đ` : ''}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {selectedAdvisor === a.id &&
                                                            <span className="text-pink-400 text-xl font-bold">✓</span>}
                                                        <button
                                                            type="button"
                                                            className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-600 hover:bg-blue-200 font-semibold transition"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                navigate(`/customer/doctors/${a.id}`);
                                                            }}
                                                        >Learn more
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="font-semibold text-gray-700 mb-2">Choose your date</div>
                                <input
                                    type="date"
                                    className="border rounded px-4 py-2 text-lg"
                                    value={selectedDate}
                                    onChange={e => {
                                        const newDate = e.target.value;

                                        if (newDate && !isDateInFuture(newDate)) {
                                            alert('Please select a future date. You can only book appointments starting from tomorrow.');
                                            return;
                                        }
                                        setSelectedDate(newDate);
                                        setSelectedTime('');
                                    }}
                                    min={getMinDate()}
                                    required
                                    style={{width: 220}}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    You can book appointments starting from tomorrow ({new Date(getMinDate()).toLocaleDateString('vi-VN')})
                                </div>
                            </div>                            <div className="mb-6">
                                <div className="font-semibold text-gray-700 mb-2">Choose your time</div>
                                {loadingSlots ? (
                                    <div className="text-gray-500">Loading available slots...</div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        {slotOptions.map(opt => {
                                            const isSelected = selectedTime === String(opt.value);
                                            const isAvailable = selectedAdvisor && selectedDate ? availableSlots.includes(String(opt.value)) : true;
                                            const isDisabled = selectedAdvisor && selectedDate && !isAvailable;
                                              return (
                                                <label
                                                    key={String(opt.value)}
                                                    className={[
                                                        "flex items-center gap-2 border rounded-lg px-3 py-2 transition-all",
                                                        isSelected ? "slot-selected" : "",
                                                        isDisabled ? "slot-unavailable" : "slot-available"
                                                    ].join(" ")}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="timeSlot"
                                                        value={String(opt.value)}
                                                        checked={selectedTime === String(opt.value)}
                                                        onChange={e => setSelectedTime(String(e.target.value))}
                                                        className="accent-pink-400"
                                                        disabled={!!isDisabled}
                                                    />
                                                    <span className={isDisabled ? "text-gray-400" : ""}>
                                                        {opt.label}
                                                        {isDisabled && " (Booked)"}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                                {showSlotError && !selectedTime &&
                                    <div className="text-xs text-red-500 mt-1">Please select a time slot.</div>}
                            </div>
                            <div className="mb-6">
                                <div className="font-semibold text-gray-700 mb-2">Describe your problem</div>
                                <textarea
                                    className="w-full border rounded px-4 py-2 min-h-[80px] resize-none"
                                    maxLength={450}
                                    placeholder="Describe the problem you currently have, or any questions for our advisors (450 characters)"
                                    value={problem}
                                    onChange={e => setProblem(e.target.value)}
                                />
                                <div className="text-xs text-gray-400 text-right mt-1">{450 - problem.length} characters
                                    left
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-pink-400 text-white font-bold py-3 rounded-lg mt-4 text-lg hover:bg-pink-500 transition shadow flex items-center justify-center gap-2 disabled:opacity-60"
                                disabled={!selectedTime || !selectedDate || loading}
                            >
                                <img src={calendarIcon} alt="calendar" className="w-6 h-6"/>
                                {loading ? 'Booking...' : 'Book'}
                            </button>
                        </div>
                    </div>
                    </form>
            </div>            {showSuccess && (
                <BookingSuccessPopup
                    open={showSuccess}
                    onClose={() => {
                        setShowSuccess(false);
                        if (redirectTimeout) {
                            clearTimeout(redirectTimeout);
                            setRedirectTimeout(null);
                        }
                    }}
                    doctor={advisor?.name || ''}
                    date={selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                    time={displayTime}
                    note={problem || '[Content you entered in the description]'}
                    onGoHome={() => {
                        if (redirectTimeout) {
                            clearTimeout(redirectTimeout);
                            setRedirectTimeout(null);
                        }
                        navigate('/customer/dashboard');
                    }}
                    onViewHistory={() => {
                        if (redirectTimeout) {
                            clearTimeout(redirectTimeout);
                            setRedirectTimeout(null);
                        }
                        navigate('/customer/appointments');
                    }}
                    onBookNew={() => { 
                        setShowSuccess(false); 
                        setSelectedDate(''); 
                        setSelectedTime(''); 
                        setProblem('');
                        if (redirectTimeout) {
                            clearTimeout(redirectTimeout);
                            setRedirectTimeout(null);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default AppointmentBooking;

