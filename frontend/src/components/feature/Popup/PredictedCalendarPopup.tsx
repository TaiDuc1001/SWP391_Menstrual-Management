import React from 'react';

interface PredictedCalendarPopupProps {
    open: boolean;
    onClose: () => void;
    selectedMonth: string;
}

const PredictedCalendarPopup: React.FC<PredictedCalendarPopupProps> = ({ open, onClose, selectedMonth }) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const getMonthData = () => {
        if (!selectedMonth) return { days: [], monthName: '', year: '' };
        
        const [year, month] = selectedMonth.split('-');
        const monthNum = parseInt(month) - 1;
        const yearNum = parseInt(year);
        
        const firstDay = new Date(yearNum, monthNum, 1);
        const lastDay = new Date(yearNum, monthNum + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days: (number | null)[] = [];
        for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
        for (let day = 1; day <= daysInMonth; day++) days.push(day);
        
        const monthName = firstDay.toLocaleDateString('en-US', { month: 'long' });
        
        return { days, monthName, year };
    };

    const { days, monthName, year } = getMonthData();

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <span className="w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full"></span>
                        Cycle calendar for {monthName} {year}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all duration-200"
                    >
                        ×
                    </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-3">
                    {weekDays.map((wd, idx) => (
                        <div key={idx} className="text-center text-xs font-medium text-gray-700 py-2 bg-gradient-to-b from-gray-50 to-gray-100 rounded shadow-sm">
                            {wd}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 mb-4">
                    {days.map((day, idx) => (
                        <div key={idx} className="flex justify-center items-center h-10">
                            {day ? (
                                <div className="w-8 h-8 flex items-center justify-center text-sm rounded-full hover:bg-gray-100 cursor-pointer transition-colors duration-200">
                                    {day}
                                </div>
                            ) : (
                                <div className="w-8 h-8"></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 text-xs items-center mb-4">
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-red-600 rounded-full inline-block"></span>
                        Period days
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
                        Ovulation day
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-teal-400 rounded-full inline-block"></span>
                        Fertile window
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-indigo-400 rounded-full inline-block"></span>
                        Has symptoms
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictedCalendarPopup;
