import React, { useState } from 'react';
import TitleBar from '../../components/TitleBar/TitleBar';
import calendarIcon from '../../assets/icons/calendar.svg';
import bloodTestingImage from '../../assets/images/blood-testing.svg';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../../api/axios';

const BookTestPage: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { panelId: panelIdParam } = useParams();
  const location = useLocation();
  // Prefer panelId from params, fallback to location.state
  const panelId = panelIdParam || (location.state && location.state.panelId);

  if (!panelId) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-2xl font-bold text-red-500 mb-4">Panel ID is missing!</div>
          <div className="text-gray-600">Please select a test package to book.</div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!date || !slot) {
      setError('Please select date and time slot.');
      return;
    }
    try {
      console.log('Booking: sending POST to /panels/' + panelId, { date, slot });
      const res = await api.post(`/panels/${panelId}`, { date, slot });
      console.log('Booking: response', res);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/sti-tests');
      }, 1800);
    } catch (err) {
      console.error('Booking: error', err);
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
              <img src={require('../../assets/icons/calendar.svg').default} alt="calendar" className="w-8 h-8 text-pink-500" />
              <span className="text-xl font-bold text-pink-600">Book a Testing</span>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-semibold mb-1">Date</label>
                  <input type="date" className="w-full border rounded px-4 py-2" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-semibold mb-1">Time Slot</label>
                  <select className="w-full border rounded px-4 py-2" value={slot} onChange={e => setSlot(e.target.value)}>
                    <option value="">Select slot</option>
                    <option value="ONE">07:00 - 09:00</option>
                    <option value="TWO">09:00 - 11:00</option>
                    <option value="THREE">13:00 - 15:00</option>
                    <option value="FOUR">15:00 - 17:00</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Additional Notes</label>
                <input type="text" className="w-full border rounded px-4 py-2" placeholder="Enter any notes if needed..." disabled />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button type="submit" className="w-full bg-pink-400 text-white font-bold py-3 rounded-lg mt-4 flex items-center justify-center gap-2 text-lg hover:bg-pink-500 transition">
                <img src={calendarIcon} alt="calendar" className="w-6 h-6" />
                Book
              </button>
            </form>
            {showSuccess && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-4 animate-fade-in">
                  <img src={calendarIcon} alt="success" className="w-12 h-12 text-pink-500" />
                  <div className="text-xl font-bold text-pink-500">Booking Successful!</div>
                  <div className="text-gray-600">You will be redirected to your test history page...</div>
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:block">
            <img src={bloodTestingImage} alt="lab test" className="w-80 h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTestPage;
