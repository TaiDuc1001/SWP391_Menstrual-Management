import React, { useState, useEffect } from 'react';
import { cycleService, CycleData } from '../../../api/services/cycleService';

interface PredictedCalendarPopupProps {
    open: boolean;
    onClose: () => void;
    selectedMonth: string;
}

const PredictedCalendarPopup: React.FC<PredictedCalendarPopupProps> = ({ open, onClose, selectedMonth }) => {
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const [predictedCycle, setPredictedCycle] = useState<CycleData | null>(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const fetchPrediction = async () => {
            if (!selectedMonth || !open) return;
            
            setLoading(true);
            try {
                const [year, month] = selectedMonth.split('-');
                const prediction = await cycleService.predictCycleForMonth(parseInt(year), parseInt(month));
                setPredictedCycle(prediction);
            } catch (error) {
                console.error('Error fetching cycle prediction:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPrediction();
    }, [selectedMonth, open]);
    
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

    const getDayStatus = (day: number) => {
        if (!predictedCycle || !selectedMonth) return null;
        
        const [year, month] = selectedMonth.split('-');
        const dayDate = new Date(parseInt(year), parseInt(month) - 1, day);
        const dayStr = dayDate.toISOString().split('T')[0];
        
        const cycleStart = new Date(predictedCycle.cycleStartDate);
        const cycleEnd = new Date(cycleStart);
        cycleEnd.setDate(cycleStart.getDate() + predictedCycle.periodDuration - 1);
        
        const ovulationDate = new Date(predictedCycle.ovulationDate);
        const fertilityStart = new Date(predictedCycle.fertilityWindowStart);
        const fertilityEnd = new Date(predictedCycle.fertilityWindowEnd);
        
        if (dayDate >= cycleStart && dayDate <= cycleEnd) {
            return 'period';
        } else if (dayStr === ovulationDate.toISOString().split('T')[0]) {
            return 'ovulation';
        } else if (dayDate >= fertilityStart && dayDate <= fertilityEnd) {
            return 'fertile';
        }
        
        return null;
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
                
                {loading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                        <p className="mt-2 text-gray-600">Loading prediction...</p>
                    </div>
                )}
                
                {!loading && !predictedCycle && (
                    <div className="text-center py-8">
                        <p className="text-gray-600">No prediction available for this month. Please add more cycle data.</p>
                    </div>
                )}
                
                {!loading && predictedCycle && (
                    <>
                        <div className="grid grid-cols-7 gap-1 mb-3">
                            {weekDays.map((wd, idx) => (
                                <div key={idx} className="text-center text-xs font-medium text-gray-700 py-2 bg-gradient-to-b from-gray-50 to-gray-100 rounded shadow-sm">
                                    {wd}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {days.map((day, idx) => {
                                const dayStatus = day ? getDayStatus(day) : null;
                                return (
                                    <div key={idx} className="flex justify-center items-center h-10">
                                        {day ? (
                                            <div className={`w-8 h-8 flex items-center justify-center text-sm rounded-full transition-colors duration-200 ${
                                                dayStatus === 'period' ? 'bg-red-600 text-white font-semibold' :
                                                dayStatus === 'ovulation' ? 'bg-yellow-400 text-white font-semibold' :
                                                dayStatus === 'fertile' ? 'bg-teal-400 text-white font-semibold' :
                                                'hover:bg-gray-100 cursor-pointer'
                                            }`}>
                                                {day}
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8"></div>
                                        )}
                                    </div>
                                );
                            })}
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
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 text-sm">
                            <h4 className="font-semibold text-gray-800 mb-2">Prediction Details:</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>Period Start: <span className="font-medium">{new Date(predictedCycle.cycleStartDate).toLocaleDateString()}</span></div>
                                <div>Period Duration: <span className="font-medium">{predictedCycle.periodDuration} days</span></div>
                                <div>Cycle Length: <span className="font-medium">{predictedCycle.cycleLength} days</span></div>
                                <div>Ovulation: <span className="font-medium">{new Date(predictedCycle.ovulationDate).toLocaleDateString()}</span></div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PredictedCalendarPopup;
