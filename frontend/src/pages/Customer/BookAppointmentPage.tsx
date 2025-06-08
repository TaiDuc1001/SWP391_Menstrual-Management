import React, { useState } from 'react';
import TitleBar from '../../components/TitleBar/TitleBar';
import calendarIcon from '../../assets/icons/calendar.svg';
import { useNavigate } from 'react-router-dom';
import DropdownSelect from '../../components/Filter/DropdownSelect';
import SearchInput from '../../components/Filter/SearchInput';
import BookingSuccessPopup from '../../components/Popup/BookingSuccessPopup';

const mockAdvisors = [
  {
    id: 1,
    name: 'Dr. Nguyễn Văn A',
    avatar: '', // You can use a placeholder image or avatar
    rating: 4.5,
    reviews: 45,
    appointments: 133,
    specialization: 'General',
  },
  {
    id: 2,
    name: 'Dr. Trần Thị B',
    avatar: '', // You can use a placeholder image or avatar
    rating: 4.8,
    reviews: 60,
    appointments: 200,
    specialization: 'Gynecology',
  },
  {
    id: 3,
    name: 'Dr. Lê Văn C',
    avatar: '', // You can use a placeholder image or avatar
    rating: 4.2,
    reviews: 30,
    appointments: 90,
    specialization: 'Endocrinology',
  },
  {
    id: 4,
    name: 'Dr. Phạm Thị D',
    avatar: '', // You can use a placeholder image or avatar
    rating: 4.9,
    reviews: 80,
    appointments: 250,
    specialization: 'Obstetrics',
  },
  {
    id: 5,
    name: 'Dr. Nguyễn Thị E',
    avatar: '',
    rating: 4.7,
    reviews: 55,
    appointments: 180,
    specialization: 'General',
  },
  {
    id: 6,
    name: 'Dr. Đặng Văn F',
    avatar: '',
    rating: 4.3,
    reviews: 38,
    appointments: 120,
    specialization: 'Gynecology',
  },
  {
    id: 7,
    name: 'Dr. Hồ Thị G',
    avatar: '',
    rating: 4.6,
    reviews: 70,
    appointments: 210,
    specialization: 'Obstetrics',
  },
  {
    id: 8,
    name: 'Dr. Vũ Văn H',
    avatar: '',
    rating: 4.1,
    reviews: 25,
    appointments: 80,
    specialization: 'Endocrinology',
  },
];

const timeSlots = [
  '09:00-09:30',
  '10:00-10:30',
  '11:00-11:30',
  '14:00-14:30',
];

const reviewOptions = [
  { value: '', label: 'Reviews' },
  { value: 'high', label: 'Highest Rated' },
  { value: 'low', label: 'Lowest Rated' },
];
const specializationOptions = [
  { value: '', label: 'Specialization' },
  ...Array.from(new Set(mockAdvisors.map(a => a.specialization))).map(s => ({ value: s, label: s }))
];

const BookAppointmentPage: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [problem, setProblem] = useState('');
  const [reviewFilter, setReviewFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      navigate('/appointments');
    }, 10000);
  };

  const advisor = mockAdvisors.find(a => a.id === selectedAdvisor);

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
            {/* Left: Advisor, Time, Problem */}
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
                {/* Advisor List - allow dropdown selection */}
                <div className="bg-gray-50 rounded-xl p-4 cursor-pointer border border-pink-200 max-h-64 overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    {mockAdvisors
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
                              {/* Avatar placeholder */}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-800">{a.name}</div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="text-yellow-500 font-bold">{a.rating} ★</span>
                                <span>({a.reviews} reviews)</span>
                                <span className="ml-2 text-xs text-gray-400">({a.appointments} appointments given)</span>
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
                  onChange={e => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  style={{ width: 220 }}
                />
              </div>
              <div className="mb-6">
                <div className="font-semibold text-gray-700 mb-2">Choose your time</div>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map(slot => (
                    <label key={slot} className="flex items-center gap-2 cursor-pointer border rounded-lg px-3 py-2 hover:border-pink-400 transition-all">
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slot}
                        checked={selectedTime === slot}
                        onChange={() => setSelectedTime(slot)}
                        className="accent-pink-400"
                        required
                      />
                      <span>{slot}</span>
                    </label>
                  ))}
                </div>
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
                className="w-full bg-pink-400 text-white font-bold py-3 rounded-lg mt-4 text-lg hover:bg-pink-500 transition shadow flex items-center justify-center gap-2"
                disabled={!selectedTime || !selectedDate}
              >
                <img src={calendarIcon} alt="calendar" className="w-6 h-6" />
                Book
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
            time={selectedTime}
            note={problem || '[Nội dung bạn đã nhập trong mô tả]'}
            onGoHome={() => navigate('/')}
            onViewHistory={() => navigate('/appointments')}
            onBookNew={() => { setShowSuccess(false); setSelectedDate(''); setSelectedTime(''); setProblem(''); }}
          />
        )}
      </div>
    </div>
  );
};

export default BookAppointmentPage;
