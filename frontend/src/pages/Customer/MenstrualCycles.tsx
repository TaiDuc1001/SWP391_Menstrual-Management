import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MenstrualCyclePopup from '../../components/Popup/MenstrualCyclePopup';
import SuccessPopup from '../../components/Popup/SuccessPopup';
import ReminderSettingsPopup from '../../components/Popup/ReminderSettingsPopup';
import DayNotePopup from '../../components/Popup/DayNotePopup'; 
import Woman from '../../assets/images/Woman.svg';
import pen from '../../assets/images/pen.svg';
import MenstrualCyclesAll from './MenstrualCyclesAll';
import { MenstrualCycleProvider, useMenstrualCycles } from '../../context/MenstrualCycleContext';

const MenstrualCycles: React.FC = () => {
    const now = new Date();
    const [currentMonth, setCurrentMonth] = useState(now.getMonth());
    const [currentYear, setCurrentYear] = useState(now.getFullYear());
    const [showCyclePopup, setShowCyclePopup] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showReminderPopup, setShowReminderPopup] = useState(false);
    const [showDayNote, setShowDayNote] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number|null>(null);
    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const location = useLocation();
    const navigate = useNavigate();
    const { cycles, setCycles } = useMenstrualCycles();

    useEffect(() => {
        if (location.state && location.state.openCyclePopup) {
            setShowCyclePopup(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const getDaysInMonth = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        const days: (number | null)[] = [];
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
        for (let day = 1; day <= daysInMonth; day++) days.push(day);
        return days;
    };
    const days = getDaysInMonth(currentMonth, currentYear);

    const getDayType = (day: number | null) => {
        if (!day) return '';
        if ([1, 2, 3].includes(day)) return 'period';
        if ([7, 8, 9].includes(day)) return 'fertile';
        if ([5, 6].includes(day)) return 'ovulation';
        if ([4, 10].includes(day)) return 'symptom';
        return 'normal';
    };
    const getDayStyle = (day: number | null, type: string) => {
        const baseStyle = "w-10 h-10 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 hover:scale-105 hover:shadow-md";
        switch (type) {
            case 'period': return `${baseStyle} bg-gradient-to-br from-red-600 via-red-500 to-pink-500 text-white transform hover:rotate-3`;
            case 'fertile': return `${baseStyle} bg-gradient-to-br from-green-400 via-teal-400 to-emerald-500 text-white transform hover:rotate-3`;
            case 'ovulation': return `${baseStyle} bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 text-gray-900 transform hover:rotate-3`;
            case 'symptom': return `${baseStyle} bg-white border-2 border-indigo-300 text-indigo-700 shadow-inner transform hover:rotate-3`;
            default: return `${baseStyle} bg-gray-100 text-gray-600 hover:bg-gray-300 hover:text-gray-800`;
        }
    };

    const historyData = cycles;

    return (
        <div className="p-3 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen w-full">
            <div className="flex w-full">
                <main className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-extrabold text-purple-700 flex items-center gap-2">
                            <span className="inline-block w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></span>
                            Chu Kỳ Của Tôi
                        </h2>
                        <div className="flex gap-2">
                            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-2 rounded-lg font-semibold shadow hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105" onClick={() => setShowCyclePopup(true)}>Khai Báo Chu Kỳ</button>
                            <button className="bg-white border border-purple-400 text-purple-600 px-3 py-2 rounded-lg font-semibold shadow hover:bg-purple-50 transition-all duration-200 transform hover:scale-105" onClick={() => setShowReminderPopup(true)}>Cài đặt</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="col-span-2 bg-white rounded-2xl shadow p-4 flex flex-col border border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                    <span className="inline-block w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></span>
                                    Lịch chu kỳ tháng {currentMonth + 1}/{currentYear}
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={() => setCurrentMonth(m => m === 0 ? 11 : m - 1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-600 transition-all duration-200 hover:scale-105">{'<'}</button>
                                    <button onClick={() => setCurrentMonth(m => m === 11 ? 0 : m + 1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center text-xl font-bold text-purple-600 transition-all duration-200 hover:scale-105">{'>'}</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 mb-3">
                                {weekDays.map((wd, idx) => (
                                    <div key={idx} className="text-center text-xs font-medium text-gray-700 py-1 bg-gradient-to-b from-gray-50 to-gray-100 rounded shadow-sm">{wd}</div>
                                ))}
                                {days.map((day, idx) => {
                                    const type = getDayType(day);
                                    const isPast = day && new Date(currentYear, currentMonth, day) < new Date();
                                    return (
                                        <div key={idx} className="flex justify-center items-center h-10">
                                            {day ? (
                                                <div
                                                    className={getDayStyle(day, type) + (isPast ? ' cursor-pointer' : '')}
                                                    onClick={() => {
                                                        if (isPast) {
                                                            setSelectedDay(day);
                                                            setShowDayNote(true);
                                                        }
                                                    }}
                                                >
                                                    {day}
                                                </div>
                                            ) : <div className="w-10 h-10"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex gap-2 mt-2 text-xs">
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gradient-to-br from-red-600 via-red-500 to-pink-500 rounded-full inline-block"></span> Ngày có kinh</div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 rounded-full inline-block"></span> Ngày rụng trứng</div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gradient-to-br from-green-400 via-teal-400 to-emerald-500 rounded-full inline-block"></span> Dễ thụ thai</div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-indigo-300 rounded-full inline-block"></span> Có triệu chứng</div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 rounded-2xl shadow p-4 flex flex-col gap-2">
                            <h3 className="font-semibold text-lg text-purple-800 mb-2">Dự đoán & Phân tích</h3>
                            <div className="flex flex-col gap-1 text-xs">
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-400 rounded-full inline-block"></span> Ngày rụng trứng tiếp theo <span className="ml-auto font-semibold text-gray-800">18/05/2024</span></div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gradient-to-br from-green-400 via-teal-400 to-emerald-500 rounded-full inline-block"></span> Khả năng thụ thai cao <span className="ml-auto font-semibold text-gray-800">15/05 - 19/05</span></div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-gradient-to-br from-red-600 via-red-500 to-pink-500 rounded-full inline-block"></span> Kỳ kinh tiếp theo dự kiến <span className="ml-auto font-semibold text-gray-800">12/06/2024</span></div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded-full inline-block"></span> Cảnh báo chu kỳ <span className="ml-auto font-semibold text-gray-800">Bình thường</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                        <div className="bg-white rounded-2xl shadow p-4 col-span-1">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                    <span className="inline-block w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></span>
                                    Lịch sử chu kỳ
                                </h3>
                                <a
                                    href="/menstrual-cycles/all"
                                    className="text-purple-600 text-xs font-semibold hover:underline"
                                    onClick={e => {
                                        e.preventDefault();
                                        navigate('/menstrual-cycles/all');
                                    }}
                                >
                                    Xem tất cả
                                </a>
                            </div>
                            <div className={historyData.length > 3 ? "overflow-y-auto max-h-32 transition-all" : ""} id="cycle-history-body">
                                <table className="w-full text-xs mt-2">
                                    <thead>
                                        <tr className="text-gray-600">
                                            <th className="py-1 font-medium">Bắt đầu</th>
                                            <th className="py-1 font-medium">Kết thúc</th>
                                            <th className="py-1 font-medium">Số ngày hành kinh</th>
                                            <th className="py-1 font-medium">Chu kỳ (ngày)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((row, idx) => (
                                            <tr key={idx} className="text-center border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                                                <td className="py-1">{row.startDate}</td>
                                                <td className="py-1">{row.endDate}</td>
                                                <td className="py-1">{row.duration}</td>
                                                <td className="py-1">{row.cycle}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-purple-200 rounded-2xl shadow p-4 col-span-2 flex flex-col gap-2">
                            <h3 className="font-semibold text-lg text-purple-800 mb-2 flex items-center gap-2">
                                <span className="inline-block w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></span>
                                Đề xuất từ AI
                            </h3>
                            <ul className="list-disc pl-4 text-xs text-gray-800 flex flex-col gap-1">
                                <li><span className="font-semibold text-pink-600">Xu hướng chu kỳ:</span> Đều đặn, ổn định. <span className="font-semibold text-pink-600">Gợi ý:</span> Hãy tiếp tục duy trì thói quen sinh hoạt lành mạnh!</li>
                                <li><span className="font-semibold text-yellow-600">Nhắc nhở:</span> Nếu phát hiện kỳ kinh bất thường, hãy cân nhắc <span className="underline">khám phụ khoa định kỳ</span>.</li>
                                <li><span className="font-semibold text-red-500">Lưu ý:</span> Nếu căng thẳng kéo dài, hãy thử dành thời gian thư giãn và nghỉ ngơi nhiều hơn.</li>
                                <li><span className="font-semibold text-green-600">Gợi ý thực phẩm & tập luyện:</span> Ăn nhiều trái cây, rau xanh và tập yoga nhẹ nhàng trong giai đoạn hành kinh để giảm mệt mỏi.</li>
                            </ul>
                        </div>
                    </div>
                    <MenstrualCyclePopup 
                      open={showCyclePopup} 
                      onClose={() => setShowCyclePopup(false)}
                      onSave={(data) => {
                        setShowCyclePopup(false);
                        setShowSuccess(true);
                        setCycles(prev => [
                          ...prev,
                          {
                            id: prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1,
                            startDate: data.startDate,
                            endDate: '',
                            duration: data.duration,
                            cycle: data.cycleLength
                          }
                        ]);
                        setTimeout(() => setShowSuccess(false), 1200);
                      }}
                    />
                    <ReminderSettingsPopup 
                      open={showReminderPopup} 
                      onClose={() => setShowReminderPopup(false)}
                      onSave={() => {
                        setShowReminderPopup(false);
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 1200);
                      }}
                    />
                    <DayNotePopup 
                      open={showDayNote} 
                      onClose={() => setShowDayNote(false)}
                      onSave={() => {
                        setShowDayNote(false);
                        setShowSuccess(true);
                        setTimeout(() => setShowSuccess(false), 1200);
                      }}
                    />
                    <SuccessPopup open={showSuccess} onClose={() => setShowSuccess(false)} message="Successfully!" />
                </main>
            </div>
        </div>
    );
};

export default function MenstrualCyclesWithProvider() {
  return (
    <MenstrualCycleProvider>
      <MenstrualCycles />
    </MenstrualCycleProvider>
  );
}