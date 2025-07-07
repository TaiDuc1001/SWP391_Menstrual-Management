import React from 'react';
import Popup from './ExitPopup';
import '../../../styles/components/predictions-analysis-popup.css';

interface PredictionsAnalysisPopupProps {
    open: boolean;
    onClose: () => void;
    selectedDate?: string;
    onOpenSymptomPopup?: () => void;
    cycles?: any[];
}

const PredictionsAnalysisPopup: React.FC<PredictionsAnalysisPopupProps> = ({
    open,
    onClose,
    selectedDate,
    onOpenSymptomPopup,
    cycles = []
}) => {
    const formatSelectedDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const calculateNextPeriod = () => {
        if (!cycles || cycles.length === 0) return null;
        
        const sortedCycles = cycles.sort((a, b) => 
            new Date(a.cycleStartDate).getTime() - new Date(b.cycleStartDate).getTime()
        );
        
        const lastCycle = sortedCycles[sortedCycles.length - 1];
        if (!lastCycle) return null;
        
        const avgCycleLength = cycles.length > 1 
            ? cycles.reduce((sum, cycle) => sum + (cycle.cycleLength || 28), 0) / cycles.length
            : 28;
        
        const lastCycleDate = new Date(lastCycle.cycleStartDate);
        const nextPeriodDate = new Date(lastCycleDate.getTime() + avgCycleLength * 24 * 60 * 60 * 1000);
        
        return nextPeriodDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const analyzeStatus = () => {
        if (!cycles || cycles.length === 0) return 'No data';
        
        if (cycles.length === 1) return 'Normal';
        
        const cycleLengths = cycles.map(cycle => cycle.cycleLength || 28);
        const avgLength = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length;
        
        if (avgLength >= 21 && avgLength <= 35) {
            return 'Normal';
        } else if (avgLength < 21) {
            return 'Short cycle';
        } else {
            return 'Long cycle';
        }
    };

    const nextPeriod = calculateNextPeriod();
    const cycleStatus = analyzeStatus();

    return (
        <Popup open={open} onClose={onClose} className="predictions-analysis-popup">
            <div className="predictions-analysis-content">
                <h3 className="predictions-analysis-title">Predictions & Analysis</h3>
                
                <div className="prediction-date">
                    {formatSelectedDate(selectedDate)}
                </div>

                <div className="prediction-items">
                    <div className="prediction-item">
                        <div className="prediction-icon period-icon"></div>
                        <div className="prediction-text">
                            <span className="prediction-label">Next period expected</span>
                            <span className="prediction-status normal">Normal</span>
                        </div>
                        <div className="prediction-date-value">{nextPeriod || '12/06/2024'}</div>
                    </div>

                    <div className="prediction-item">
                        <div className="prediction-icon cycle-icon"></div>
                        <div className="prediction-text">
                            <span className="prediction-label">Cycle alert</span>
                            <span className="prediction-status normal">Normal</span>
                        </div>
                        <div className="prediction-value">{cycleStatus}</div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button 
                        className="symptom-button"
                        onClick={() => {
                            onClose();
                            onOpenSymptomPopup?.();
                        }}
                    >
                        Ghi chú triệu chứng
                    </button>
                    <button 
                        className="close-button"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </Popup>
    );
};

export default PredictionsAnalysisPopup;
