// Dashboard page for authenticated users
import React from 'react';
import { useNavigate } from 'react-router-dom';
import plusIcon from '../../assets/icons/plus-white.svg';
import calendarIcon from '../../assets/icons/calendar.svg';
import notificationIcon from '../../assets/icons/notification.svg';
import hospitalIcon from '../../assets/icons/hospital.svg';
import pdfIcon from '../../assets/icons/pdf.svg';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // Mock data
  const userName = 'Thiên An';
  const cycleStart = '10/05/2025';
  const ovulationDate = '18/05';
  const daysToOvulation = 3;
  const cycleStatus = 'Girlie cramps';
  const cycleEmojis = ['🍓', '🩸', '😡'];
  const appointments = [
    { id: 1, name: 'Dr. Jack97', date: '21/05/2025', time: '15:00', avatar: '', rating: 5 },
    { id: 2, name: 'Dr. Thịnh Thất Bồng Lai', date: '21/05/2025', time: '15:00', avatar: '', rating: 4.5 },
    { id: 3, name: 'Dr. PewPew', date: '18/05/2025', time: '15:00', avatar: '', rating: 4 },
  ];
  const screenings = [
    { name: 'HPV', result: 'Negative', pdf: true },
  ];
  const examinations = [
    { name: 'HIV, Giang mai', date: '26/05/2024', time: '10:00 - 12:00', place: 'Viện Pasteur', status: 'Sắp diễn ra' },
    { name: 'Gói tổng quát STIs', date: '05/06/2024', time: '15:30', place: 'Viện Pasteur', status: 'Chưa xác nhận' },
    { name: 'Khám Thai', date: '05/11/2024', time: '15:30', place: 'Viện Pasteur', status: 'Chưa xác nhận' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Greeting and actions */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow p-6 mb-6">
        <div>
          <h2 className="text-xl font-bold text-pink-600 mb-1">Xin chào, {userName} <span className="inline-block">👋</span></h2>
          <p className="text-gray-500">Hôm nay bạn cảm thấy thế nào? Hãy kiểm tra nhanh sức khỏe & cập nhật lịch chu kỳ nhé!</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
            onClick={() => navigate('/menstrual-cycles', { state: { openCyclePopup: true } })}
          >
            <img src={plusIcon} alt="New" className="w-4 h-4" /> New menstrual cycle
          </button>
          <button
            className="bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold px-4 py-2 rounded-lg shadow transition flex items-center gap-2"
            onClick={() => navigate('/appointments/book')}
          >
            <img src={calendarIcon} alt="Calendar" className="w-4 h-4" /> Book an appointment
          </button>
        </div>
      </div>
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Cycle calendar */}
        <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-pink-500 font-semibold">
            <img src={calendarIcon} alt="Calendar" className="w-5 h-5" /> Cycle calendar
          </div>
          <div className="text-gray-500 text-sm">Starting date: <span className="text-pink-600 font-bold">{cycleStart}</span></div>
          <div className="bg-pink-100 rounded-xl p-4 flex flex-col items-center">
            <div className="text-2xl font-bold text-pink-600 mb-1">{cycleStatus}</div>
            <div className="text-2xl">{cycleEmojis.join(' ')}</div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500 text-sm">Ovulation: <span className="text-pink-600 font-bold">{ovulationDate}</span></span>
            <button className="text-pink-500 hover:underline text-sm">Xem lịch</button>
          </div>
        </div>
        {/* Cycle chart */}
        <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
          {/* Simple donut chart mockup */}
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="#fde8f3" />
            <path d="M60 10 A50 50 0 1 1 110 60" stroke="#f472b6" strokeWidth="15" fill="none" />
            <circle cx="60" cy="60" r="35" fill="#fff" />
            <polygon points="60,35 65,55 60,50 55,55" fill="#f472b6" />
          </svg>
          <div className="text-center mt-2">
            <div className="text-gray-500 text-sm">Ovulation: <span className="text-pink-600 font-bold">{ovulationDate}</span></div>
            <button className="text-pink-500 hover:underline text-sm">View cycle</button>
          </div>
        </div>
        {/* Menstrual reminder */}
        <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-pink-500 font-semibold">
            <img src={notificationIcon} alt="Reminder" className="w-5 h-5" /> Your menstrual reminder
          </div>
          <div className="flex items-center gap-2 text-pink-600 font-bold text-lg">
            <span>Only <span className="text-pink-500">{daysToOvulation} days</span> until your next <span className="underline">ovulation</span> ({ovulationDate})</span>
          </div>
          <button className="bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold px-4 py-2 rounded-lg shadow transition w-max">Set reminder</button>
        </div>
      </div>
      {/* Lower grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upcoming appointments */}
        <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-pink-500 font-semibold">
            <img src={hospitalIcon} alt="Doctor" className="w-5 h-5" /> Upcoming appointments
          </div>
          <div className="flex flex-col gap-2">
            {appointments.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-pink-500">{a.name.split(' ')[1]?.[0] || 'D'}</div>
                <div>
                  <div className="font-semibold text-gray-700">{a.name} <span className="text-yellow-400">{'★'.repeat(Math.round(a.rating))}</span></div>
                  <div className="text-xs text-gray-500">{a.date}, {a.time}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="text-pink-500 hover:underline text-sm mt-2 w-max">Xem chi tiết</button>
        </div>
        {/* Latest screenings */}
        <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-pink-500 font-semibold">
            <img src={pdfIcon} alt="PDF" className="w-5 h-5" /> Latest screenings
          </div>
          <div className="flex flex-col gap-2">
            {screenings.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">{s.name} - <span className="text-green-600">{s.result}</span></span>
                {s.pdf && <button className="text-pink-500 hover:underline text-sm">Xem file PDF</button>}
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2">Bảo mật qua OTP</div>
        </div>
        {/* Upcoming examinations */}
        <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-pink-500 font-semibold">
            <img src={calendarIcon} alt="Calendar" className="w-5 h-5" /> Upcoming examinations
          </div>
          <div className="flex flex-col gap-2">
            {examinations.map((e, idx) => (
              <div key={idx} className="flex flex-col gap-1 bg-pink-50 rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-pink-600">{e.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${e.status === 'Sắp diễn ra' ? 'bg-pink-200 text-pink-700' : 'bg-gray-200 text-gray-500'}`}>{e.status}</span>
                </div>
                <div className="text-xs text-gray-500">{e.place} | {e.date} - {e.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
