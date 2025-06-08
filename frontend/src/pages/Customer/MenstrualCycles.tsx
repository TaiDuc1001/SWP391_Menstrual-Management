import React, { useState } from 'react';
import MenstrualCyclePopup from '../../components/Popup/MenstrualCyclePopup';
import SuccessPopup from '../../components/Popup/SuccessPopup';
import ReminderSettingsPopup from '../../components/Popup/ReminderSettingsPopup';
import DayNotePopup from '../../components/Popup/DayNotePopup';
// import Header from '../../components/Header/Header';


const MenstrualCycles: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(4); // May 2025 (0-indexed)
    const [currentYear, setCurrentYear] = useState(2025);
    const [showCyclePopup, setShowCyclePopup] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showReminderPopup, setShowReminderPopup] = useState(false);
    const [showDayNote, setShowDayNote] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number|null>(null);
    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];


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
        const baseStyle = "w-10 h-8 m-0 rounded-full flex items-center justify-center text-sm font-medium transition-all hover:scale-110";
        switch (type) {
            case 'period': return `${baseStyle} bg-red-500 text-white`;
            case 'fertile': return `${baseStyle} bg-green-500 text-white`;
            case 'ovulation': return `${baseStyle} bg-yellow-400 text-gray-800`;
            case 'symptom': return `${baseStyle} border-2 border-blue-400 text-blue-800`;
            default: return `${baseStyle} bg-gray-100 text-gray-600 hover:bg-gray-200`;
        }
    };
    const historyData = [
        { startDate: '13/05/2024', endDate: '17/05/2024', duration: 5, cycle: 28 },
        { startDate: '16/04/2024', endDate: '19/04/2024', duration: 4, cycle: 29 },
        { startDate: '16/03/2024', endDate: '20/03/2024', duration: 5, cycle: 28 },
        { startDate: '15/02/2024', endDate: '19/02/2024', duration: 5, cycle: 28 },
        { startDate: '18/01/2024', endDate: '22/01/2024', duration: 5, cycle: 30 },
        { startDate: '20/12/2023', endDate: '24/12/2023', duration: 5, cycle: 29 },
        { startDate: '22/11/2023', endDate: '26/11/2023', duration: 5, cycle: 28 },
        { startDate: '25/10/2023', endDate: '29/10/2023', duration: 5, cycle: 28 },
        { startDate: '27/09/2023', endDate: '01/10/2023', duration: 5, cycle: 29 },
        { startDate: '29/08/2023', endDate: '02/09/2023', duration: 5, cycle: 28 }
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-full">
            <div className="flex w-full">
                {/* Removed Sidebar */}
                <main className="flex-1 w-full">
                    {/* Top bar */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-pink-600 flex items-center gap-2">
                            <span className="inline-block w-4 h-4 bg-pink-400 rounded-full mr-1"></span>
                            Chu Kỳ Của Tôi
                        </h2>
                        <div className="flex gap-2">
                            <button className="bg-pink-500 text-white px-4 py-2 rounded font-semibold shadow hover:bg-pink-600 transition" onClick={() => setShowCyclePopup(true)}>Khai Báo Chu Kỳ</button>
                            <button className="bg-white border border-pink-400 text-pink-500 px-4 py-2 rounded font-semibold shadow hover:bg-pink-50 transition" onClick={() => setShowReminderPopup(true)}>Cài đặt</button>
                        </div>
                    </div>
                    {/* Main grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Calendar Card */}
                        <div className="col-span-2 bg-white rounded-2xl shadow p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
                                    <span className="inline-block w-4 h-4 bg-pink-400 rounded-full"></span>
                                    Lịch chu kỳ tháng {currentMonth + 1}/{currentYear}
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={() => setCurrentMonth(m => m === 0 ? 11 : m - 1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-pink-100 flex items-center justify-center text-xl font-bold text-pink-500">&#60;</button>
                                    <button onClick={() => setCurrentMonth(m => m === 11 ? 0 : m + 1)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-pink-100 flex items-center justify-center text-xl font-bold text-pink-500">&#62;</button>
                                </div>
                            </div>
                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {weekDays.map((wd, idx) => (
                                    <div key={idx} className="text-center text-xs font-semibold text-gray-500 py-1">{wd}</div>
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
                                            ) : <div className="w-10 h-8"></div>}
                                        </div>
                                    );
                                })}
                            </div>
                            {/* Legend */}
                            <div className="flex gap-4 mt-2 text-xs">
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span> Ngày có kinh</div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span> Ngày rụng trứng</div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span> Dễ thụ thai</div>
                                <div className="flex items-center gap-1"><span className="w-3 h-3 border-2 border-blue-400 rounded-full inline-block"></span> Có triệu chứng</div>
                            </div>
                        </div>
                        {/* Prediction & Analysis Card */}
                        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl shadow p-6 flex flex-col gap-3">
                            <h3 className="font-semibold text-lg text-pink-600 mb-2">Dự đoán & Phân tích</h3>
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-400 rounded-full inline-block"></span> Ngày rụng trứng tiếp theo <span className="ml-auto font-semibold text-gray-700">18/05/2024</span></div>
                                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span> Khả năng thụ thai cao <span className="ml-auto font-semibold text-gray-700">15/05 - 19/05</span></div>
                                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-red-500 rounded-full inline-block"></span> Kỳ kinh tiếp theo dự kiến <span className="ml-auto font-semibold text-gray-700">12/06/2024</span></div>
                                <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-400 rounded-full inline-block"></span> Cảnh báo chu kỳ <span className="ml-auto font-semibold text-gray-700">Bình thường</span></div>
                            </div>
                        </div>
                    </div>
                    {/* Bottom grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        {/* Cycle History Card */}
                        <div className="bg-white rounded-2xl shadow p-6 col-span-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-lg text-gray-700 flex items-center gap-2">
                                    <span className="inline-block w-4 h-4 bg-pink-400 rounded-full"></span>
                                    Lịch sử chu kỳ
                                </h3>
                                <a href="#" className="text-pink-500 text-sm font-semibold hover:underline" onClick={e => {
                                    e.preventDefault();
                                    const tableBody = document.getElementById('cycle-history-body');
                                    if (tableBody) tableBody.classList.toggle('max-h-32');
                                }}>Xem tất cả</a>
                            </div>
                            <div className={historyData.length > 3 ? "overflow-y-auto max-h-32 transition-all" : ""} id="cycle-history-body">
                                <table className="w-full text-sm mt-2">
                                    <thead>
                                        <tr className="text-gray-500">
                                            <th className="py-1 font-medium">Bắt đầu</th>
                                            <th className="py-1 font-medium">Kết thúc</th>
                                            <th className="py-1 font-medium">Số ngày</th>
                                            <th className="py-1 font-medium">Chu kỳ (ngày)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((row, idx) => (
                                            <tr key={idx} className="text-center border-b last:border-b-0">
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
                        {/* AI Suggestion Card */}
                        <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl shadow p-6 col-span-2 flex flex-col gap-3">
                            <h3 className="font-semibold text-lg text-pink-600 mb-2 flex items-center gap-2">
                                <span className="inline-block w-4 h-4 bg-pink-400 rounded-full"></span>
                                Đề xuất từ AI
                            </h3>
                            <ul className="list-disc pl-6 text-sm text-gray-700 flex flex-col gap-2">
                                <li><span className="font-semibold text-pink-500">Xu hướng chu kỳ:</span> Đều đặn, ổn định. <span className="font-semibold">Gợi ý:</span> Hãy tiếp tục duy trì thói quen sinh hoạt lành mạnh!</li>
                                <li><span className="font-semibold text-yellow-600">Nhắc nhở:</span> Nếu phát hiện kỳ kinh bất thường, hãy cân nhắc <span className="underline">khám phụ khoa định kỳ</span>.</li>
                                <li><span className="font-semibold text-red-500">Lưu ý:</span> Nếu căng thẳng kéo dài, hãy thử dành thời gian thư giãn và nghỉ ngơi nhiều hơn.</li>
                                <li><span className="font-semibold text-green-600">Gợi ý thực phẩm & tập luyện:</span> Ăn nhiều trái cây, rau xanh và tập yoga nhẹ nhàng trong giai đoạn hành kinh để giảm mệt mỏi.</li>
                            </ul>
                        </div>
                    </div>
                    <MenstrualCyclePopup 
                      open={showCyclePopup} 
                      onClose={() => setShowCyclePopup(false)}
                      onSave={() => {
                        setShowCyclePopup(false);
                        setShowSuccess(true);
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

export default MenstrualCycles;