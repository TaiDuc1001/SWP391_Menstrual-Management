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

    const getCurrentUserId = (): string => {
        try {
            const userProfile = localStorage.getItem('userProfile');
            if (userProfile) {
                const parsed = JSON.parse(userProfile);
                return parsed.id?.toString() || 'default';
            }
        } catch (error) {
            console.error('Error getting user ID:', error);
        }
        return 'default';
    };

    const getStorageKey = (): string => {
        const userId = getCurrentUserId();
        return `menstrual_symptoms_detailed_${userId}`;
    };

    const getFlowLevelData = () => {
        if (!selectedDate) return null;
        
        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        const savedData = saved ? JSON.parse(saved) : {};
        const dayData = savedData[selectedDate];
        
        if (!dayData || !dayData.flowLevel || dayData.flowLevel === 0) {
            return null;
        }

        const flowLevelMessages = {
            1: 'Rất ít',
            2: 'Ít',
            3: 'Bình thường',
            4: 'Nhiều',
            5: 'Rất nhiều'
        };

        return {
            level: dayData.flowLevel,
            message: flowLevelMessages[dayData.flowLevel as keyof typeof flowLevelMessages]
        };
    };

    const flowData = getFlowLevelData();

    return (
        <Popup open={open} onClose={onClose} className="predictions-analysis-popup">
            <div className="predictions-analysis-content">
                <h3 className="predictions-analysis-title">Predictions & Analysis</h3>
                
                <div className="prediction-date">
                    {formatSelectedDate(selectedDate)}
                </div>

                <div className="prediction-items">
                    {flowData && (
                        <div className="flow-info">
                            <span className="flow-label">Lượng kinh lần này</span>
                            <span className="flow-level" style={{ color: '#ff69b4' }}>
                                {flowData.message}
                            </span>
                        </div>
                    )}
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
