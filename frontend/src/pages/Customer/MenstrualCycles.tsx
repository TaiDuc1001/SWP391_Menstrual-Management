// Menstrual Cycles page for authenticated users
import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';

// Import SVG icons
import thunderIcon from '../../assets/icons/thunder.svg';
import clockIcon from '../../assets/icons/clock.svg';
import historyIcon from '../../assets/icons/history.svg';
import lightBulbIcon from '../../assets/icons/light-bulb.svg';

interface CycleHistory {
    start: string;
    end: string;
    days: number;
    cycle: number;
}

const MenstrualCycles: React.FC = () => {
    const days: number[] = [27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];
    const cycleHistory: CycleHistory[] = [
        { start: "13/05/2024", end: "17/05/2024", days: 5, cycle: 28 },
        { start: "15/04/2024", end: "19/04/2024", days: 5, cycle: 28 },
        { start: "16/03/2024", end: "20/03/2024", days: 5, cycle: 28 }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <Header isAuthenticated={true} onAuthToggle={() => {}} />
            <div className="grid grid-cols-4 gap-6 p-6">
                <aside className="col-span-1">
                    <Sidebar />
                </aside>
                <main className="col-span-2">
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-red-500">Chu Kỳ Tới</h2>
                            <nav className="flex space-x-2">
                                <button className="bg-pink-500 text-white px-4 py-2 rounded mr-2">Khai Báo Chu Kỳ</button>
                                <button className="bg-pink-500 text-white px-4 py-2 rounded mr-2">Triệu chứng</button>
                                <button className="bg-pink-500 text-white px-4 py-2 rounded">Cài đặt</button>
                            </nav>
                        </div>
                        <div className="flex items-center mb-4">
                            <h3 className="text-lg font-semibold mr-4">Lịch chu kỳ tháng 5/2025</h3>
                            <button className="text-gray-500">&lt;</button>
                            <button className="text-gray-500 ml-2">&gt;</button>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(day => (
                                <div key={day} className="text-center font-bold text-gray-600">{day}</div>
                            ))}
                            {days.map(day => (
                                <button
                                    key={day}
                                    className={`p-2 rounded ${day === 1 || day === 2 || day === 3 ? 'bg-red-500 text-white' : day === 4 ? 'bg-blue-200' : 'bg-yellow-200'} hover:bg-gray-200`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm mt-2 text-gray-600 flex gap-4 items-center">
                            <span className="flex items-center"><img src={thunderIcon} alt="Period" className="w-5 h-5 mr-1" />Ngày có kinh</span>
                            <span className="flex items-center"><img src={clockIcon} alt="Ovulation" className="w-5 h-5 mr-1" />Ngày rụng trứng</span>
                            <span className="flex items-center"><img src={historyIcon} alt="Tested" className="w-5 h-5 mr-1" />Đã thử thai</span>
                            <span className="flex items-center"><img src={lightBulbIcon} alt="Checked" className="w-5 h-5 mr-1" />Có thử chiều</span>
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4">Lịch sử chu kỳ</h2>
                        <ul className="space-y-2">
                            {cycleHistory.map((cycle, index) => (
                                <li key={index} className="border-t pt-2">
                                    <span>Ngày bắt đầu: {cycle.start}</span> | <span>Kết thúc: {cycle.end}</span> | <span>Số ngày: {cycle.days}</span> | <span>Chu kỳ: {cycle.cycle} ngày</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </main>
                <aside className="col-span-1">
                    <div className="bg-white p-4 rounded shadow mb-6">
                        <h2 className="text-xl font-semibold mb-4">Dự đoán & Phân tích</h2>
                        <ul className="space-y-2">
                            <li className="flex items-center"><img src={thunderIcon} alt="Next period" className="w-5 h-5 mr-2" />18/05/2024 - Kỳ kinh tiếp theo</li>
                            <li className="flex items-center"><img src={clockIcon} alt="Fertile" className="w-5 h-5 mr-2" />15/05-19/05 - Kỳ kinh có thể thụ thai</li>
                            <li className="flex items-center"><img src={historyIcon} alt="Delayed" className="w-5 h-5 mr-2" />12/06/2024 - Kỳ kinh bị trì hoãn</li>
                            <li className="flex items-center"><img src={lightBulbIcon} alt="Warning" className="w-5 h-5 mr-2" />Bình thường</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-4">Đề xuất từ AI</h2>
                        <ul className="space-y-2">
                            <li className="flex items-center"><img src={lightBulbIcon} alt="Temp" className="w-5 h-5 mr-2" />Khu vực nhiệt độ cơ thể: Đo đặn, 6 lần/ngày.</li>
                            <li className="flex items-center"><img src={thunderIcon} alt="Reminder" className="w-5 h-5 mr-2" />Nhắc nhở: Nếu nhiệt độ cơ thể tăng bất thường, hãy đến khám phụ khoa định kỳ.</li>
                            <li className="flex items-center"><img src={clockIcon} alt="Note" className="w-5 h-5 mr-2" />Lưu ý: Nếu cảm thấy stress kéo dài, hãy thử dùng liệu pháp thư giãn và nghỉ ngơi.</li>
                            <li className="flex items-center"><img src={historyIcon} alt="Suggestion" className="w-5 h-5 mr-2" />Đề xuất: Thử uống trà hoa cúc hoặc tập yoga nhẹ nhàng để giảm căng thẳng.</li>
                        </ul>
                    </div>
                </aside>
            </div>
            <footer className="mt-6 text-center text-gray-500">
                <span>❤️ GenHealth © 2024</span> | <a href="#" className="underline">Chính sách bảo mật</a> | <a href="#" className="underline">Điều khoản sử dụng</a> | <a href="#" className="underline">Liên hệ & hỗ trợ</a>
            </footer>
        </div>
    );
};

export default MenstrualCycles;