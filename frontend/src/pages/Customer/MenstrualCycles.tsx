import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

import thunderIcon from '../../assets/icons/thunder.svg';
import clockIcon from '../../assets/icons/clock.svg';
import historyIcon from '../../assets/icons/history.svg';
import lightBulbIcon from '../../assets/icons/light-bulb.svg';

const MenstrualCycles: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(4); // May 2025 (0-indexed)
    const [currentYear, setCurrentYear] = useState(2025);

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
        if ([15, 16, 17].includes(day)) return 'predicted';
        return 'normal';
    };

    const getDayStyle = (day: number | null, type: string) => {
        const baseStyle = "w-10 h-8 m-0 rounded-full flex items-center justify-center text-sm font-medium transition-all hover:scale-110";
        switch (type) {
            case 'period': return `${baseStyle} bg-red-500 text-white`;
            case 'fertile': return `${baseStyle} bg-green-500 text-white`;
            case 'ovulation': return `${baseStyle} bg-yellow-400 text-gray-800`;
            case 'predicted': return `${baseStyle} bg-blue-200 text-blue-800`;
            default: return `${baseStyle} bg-gray-100 text-gray-600 hover:bg-gray-200`;
        }
    };

    const historyData = [
        { startDate: '13/05/2024', endDate: '17/05/2024', duration: 5, cycle: 28 },
        { startDate: '16/04/2024', endDate: '19/04/2024', duration: 4, cycle: 29 },
        { startDate: '16/03/2024', endDate: '20/03/2024', duration: 5, cycle: 28 }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Header isAuthenticated={true} onAuthToggle={() => {}} />
            <div className="flex gap-2 p-6">
                <aside className="w-64 flex-shrink-0">
                    <Sidebar />
                </aside>
                <main className="flex-1 ml-2">
                    {/* Navigation buttons */}
                    <nav className="flex space-x-2 mb-4">
                        <button className="bg-pink-500 text-white px-4 py-2 rounded mr-2">Khai Báo Chu Kỳ</button>
                        <button className="bg-pink-500 text-white px-4 py-2 rounded mr-2">Triệu chứng</button>
                        <button className="bg-pink-500 text-white px-4 py-2 rounded">Cài đặt</button>
                    </nav>

                    {/* Top row: Calendar and Predictions */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* Calendar */}
                        <div className="bg-white p-4 rounded shadow">
                            <div className="flex items-center mb-4">
                                <h3 className="text-lg font-semibold mr-4">Lịch chu kỳ tháng {currentMonth + 1}/{currentYear}</h3>
                                <button className="text-gray-500" onClick={() => setCurrentMonth(prev => prev > 0 ? prev - 1 : 11)}>&lt;</button>
                                <button className="text-gray-500 ml-2" onClick={() => setCurrentMonth(prev => prev < 11 ? prev + 1 : 0)}>&gt;</button>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {weekDays.map(day => (
                                    <div key={day} className="w-10 h-8 flex items-center justify-center text-center font-bold text-gray-600 text-sm">{day}</div>
                                ))}
                                {days.map((day, idx) => {
                                    const type = getDayType(day);
                                    return (
                                        <button
                                            key={idx}
                                            className={day ? getDayStyle(day, type) : "w-10 h-8 m-0"}
                                            disabled={!day}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="text-sm mt-4 text-gray-600 space-y-1">
                                <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>Ngày có kinh</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>Ngày rụng trứng</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>Đã thử thai</div>
                                <div className="flex items-center"><div className="w-3 h-3 bg-blue-200 rounded-full mr-2"></div>Có thể thụ thai</div>
                            </div>
                        </div>

                        {/* Predictions */}
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-semibold mb-4">Dự đoán & Phân tích</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center"><img src={thunderIcon} alt="Next period" className="w-5 h-5 mr-2" />18/05/2024 - Kỳ kinh tiếp theo</li>
                                <li className="flex items-center"><img src={clockIcon} alt="Fertile" className="w-5 h-5 mr-2" />15/05-19/05 - Kỳ kinh có thể thụ thai</li>
                                <li className="flex items-center"><img src={historyIcon} alt="Delayed" className="w-5 h-5 mr-2" />12/06/2024 - Kỳ kinh bị trì hoãn</li>
                                <li className="flex items-center"><img src={lightBulbIcon} alt="Warning" className="w-5 h-5 mr-2" />Bình thường</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom row: History and AI Suggestions */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* History */}
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-semibold mb-4">Lịch sử chu kỳ</h3>
                            <ul className="space-y-2">
                                {historyData.map((cycle, index) => (
                                    <li key={index} className="border-t pt-2 text-sm">
                                        <span>Ngày bắt đầu: {cycle.startDate}</span> | <span>Kết thúc: {cycle.endDate}</span> | <span>Số ngày: {cycle.duration}</span> | <span>Chu kỳ: {cycle.cycle} ngày</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* AI Suggestions */}
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-semibold mb-4">Đề xuất từ AI</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start"><img src={lightBulbIcon} alt="Temp" className="w-5 h-5 mr-2 mt-0.5" />Khu vực nhiệt độ cơ thể: Đo đặn, 6 lần/ngày.</li>
                                <li className="flex items-start"><img src={thunderIcon} alt="Reminder" className="w-5 h-5 mr-2 mt-0.5" />Nhắc nhở: Nếu nhiệt độ cơ thể tăng bất thường, hãy đến khám phụ khoa định kỳ.</li>
                                <li className="flex items-start"><img src={clockIcon} alt="Note" className="w-5 h-5 mr-2 mt-0.5" />Lưu ý: Nếu cảm thấy stress kéo dài, hãy thử dùng liệu pháp thư giãn và nghỉ ngơi.</li>
                                <li className="flex items-start"><img src={historyIcon} alt="Suggestion" className="w-5 h-5 mr-2 mt-0.5" />Đề xuất: Thử uống trà hoa cúc hoặc tập yoga nhẹ nhàng để giảm căng thẳng.</li>
                            </ul>
                        </div>
                    </div>
                </main>
            </div>
            <footer className="mt-6 text-center text-gray-500">
                <span>❤️ GenHealth © 2024</span> | <a href="#" className="underline">Chính sách bảo mật</a> | <a href="#" className="underline">Điều khoản sử dụng</a> | <a href="#" className="underline">Liên hệ & hỗ trợ</a>
            </footer>
        </div>
    );
};

export default MenstrualCycles;