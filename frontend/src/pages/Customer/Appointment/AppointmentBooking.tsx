import React, {useEffect, useState} from 'react';
import TitleBar from '../../../components/feature/TitleBar/TitleBar';
import calendarIcon from '../../../assets/icons/calendar.svg';
import {useNavigate} from 'react-router-dom';
import DropdownSelect from '../../../components/feature/Filter/DropdownSelect';
import SearchInput from '../../../components/feature/Filter/SearchInput';
import BookingSuccessPopup from '../../../components/feature/Popup/BookingSuccessPopup';
import api from '../../../api/axios';

const reviewOptions = [
  { value: '', label: 'Reviews' },
  { value: 'high', label: 'Highest Rated' },
  { value: 'low', label: 'Lowest Rated' },
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
  const [loading, setLoading] = useState(false);
  const [slotOptions, setSlotOptions] = useState<{ value: string; label: string }[]>([]);
  const [slotLabelMap, setSlotLabelMap] = useState<{ [key: string]: string }>({});
  const [showSlotError, setShowSlotError] = useState(false);
  const navigate = useNavigate();

  const customerId = 3;

  useEffect(() => {
    api.get('/enumerators/slots')
      .then(res => {
        const options: { value: string; label: string }[] = [];
        const labelMap: { [key: string]: string } = {};
        (res.data as { timeRange: string }[]).forEach((slot) => {
          if (slot.timeRange !== 'Filler slot, not used') {
            options.push({ value: slot.timeRange, label: slot.timeRange });
            labelMap[slot.timeRange] = slot.timeRange;
          }
        });
        setSlotOptions(options);
        setSlotLabelMap(labelMap);
      })
      .catch(() => {});
  }, [selectedDate]);

  useEffect(() => {
    api.get('/doctors')
      .then(res => {
        const data = res.data;
        setAdvisors(
          data.map((d: any) => ({
            id: d.id,
            name: d.name,
            avatar: '', // Placeholder
            rating: 4.5, // Default or random, since API doesn't provide
            reviews: 10, // Default
            appointments: 0, // Default
            specialization: d.specialization,
            price: d.price,
          }))
        );
      })
      .catch(() => {
        setAdvisors([]);
      });
  }, []);

  const specializationOptions = [
    { value: '', label: 'Specialization' },
    ...Array.from(new Set(advisors.map(a => a.specialization))).map(s => ({ value: s, label: s }))
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvisor || !selectedDate || !selectedTime) {
      setShowSlotError(!selectedTime);
      return;
    }
    setShowSlotError(false);
    setLoading(true);
    try {
      await api.post('/appointments', {
        doctorId: selectedAdvisor,
        customerId,
        date: selectedDate,
        slot: selectedTime,
        customerNote: problem,
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/customer/appointments');
      }, 10000);
    } catch (err) {
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
                  <DropdownSelect
                    value={reviewFilter}
                    onChange={setReviewFilter}
                    options={reviewOptions}
                  />
                  <DropdownSelect
                    value={specializationFilter}
                    onChange={setSpecializationFilter}
                    options={specializationOptions}
                  />
                </div>
                <div className="bg-gray-50 rounded-xl p-4 cursor-pointer border border-pink-200 max-h-64 overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    {advisors
                      .filter(a =>
                        (!specializationFilter || a.specialization === specializationFilter) &&
                        (a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
                      )
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
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{a.name}</div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="text-yellow-500 font-bold">{a.rating} ★</span>
                                <span>({a.reviews} reviews)</span>
                                <span className="ml-2 text-xs text-gray-400">({a.appointments} appointments given)</span>
                                <span className="ml-2 text-xs text-pink-500 font-bold">{a.price ? `${a.price}k` : ''}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedAdvisor === a.id && <span className="text-pink-400 text-xl font-bold">✓</span>}
                            <button
                              type="button"
                              className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-600 hover:bg-blue-200 font-semibold transition"
                              onClick={e => { e.stopPropagation(); navigate(`/doctors/${a.id}`); }}
                            >Learn more</button>
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
                    setSelectedDate(e.target.value)
                    setSelectedTime('')
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  style={{ width: 220 }}
                />
              </div>
              <div className="mb-6">
                <div className="font-semibold text-gray-700 mb-2">Choose your time</div>
                <div className="grid grid-cols-2 gap-3">
                  {slotOptions.map(opt => {
                    const isSelected = selectedTime === String(opt.value);
                    return (
                      <label
                        key={String(opt.value)}
                        className={["flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-2 hover:border-pink-400 transition-all", isSelected ? "border-pink-400 bg-pink-50" : ""].join(" ")}
                      >
                        <input
                          type="radio"
                          name="timeSlot"
                          value={String(opt.value)}
                          checked={selectedTime === String(opt.value)}
                          onChange={e => setSelectedTime(String(e.target.value))}
                          className="accent-pink-400"
                        />
                        <span>{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
                {showSlotError && !selectedTime && <div className="text-xs text-red-500 mt-1">Please select a time slot.</div>}
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
                <div className="text-xs text-gray-400 text-right mt-1">{450 - problem.length} characters left</div>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-400 text-white font-bold py-3 rounded-lg mt-4 text-lg hover:bg-pink-500 transition shadow flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={!selectedTime || !selectedDate || loading}
              >
                <img src={calendarIcon} alt="calendar" className="w-6 h-6" />
                {loading ? 'Booking...' : 'Book'}
              </button>
            </div>
          </div>
        </form>
        {showSuccess && (
          <BookingSuccessPopup
            open={showSuccess}
            onClose={() => setShowSuccess(false)}
            doctor={advisor?.name || ''}
            date={selectedDate ? new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
            time={displayTime}
            note={problem || '[Nội dung bạn đã nhập trong mô tả]'}
            onGoHome={() => navigate('/')}
            onViewHistory={() => navigate('/customer/appointments')}
            onBookNew={() => { setShowSuccess(false); setSelectedDate(''); setSelectedTime(''); setProblem(''); }}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;
