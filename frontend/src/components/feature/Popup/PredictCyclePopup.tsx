import React, { useState } from 'react';

interface PredictCyclePopupProps {
    open: boolean;
    onClose: () => void;
    onSave: (selectedMonth: string) => void;
}

const PredictCyclePopup: React.FC<PredictCyclePopupProps> = ({ open, onClose, onSave }) => {
    const [selectedMonth, setSelectedMonth] = useState('');
    
    const getNextThreeMonths = () => {
        const months = [];
        const now = new Date();
        
        for (let i = 1; i <= 3; i++) {
            const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
            const monthName = futureDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            const monthValue = `${futureDate.getFullYear()}-${String(futureDate.getMonth() + 1).padStart(2, '0')}`;
            months.push({ name: monthName, value: monthValue });
        }
        
        return months;
    };

    const nextMonths = getNextThreeMonths();

    const handleSubmit = () => {
        if (selectedMonth) {
            onSave(selectedMonth);
            setSelectedMonth('');
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-96 max-w-md mx-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-pink-500">📝</span>
                    Choose month
                </h3>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                    <select 
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all duration-200"
                    >
                        <option value="">Select a month</option>
                        {nextMonths.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedMonth}
                        className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Enter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PredictCyclePopup;

