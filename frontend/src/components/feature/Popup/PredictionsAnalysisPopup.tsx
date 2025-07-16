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
            0: 'Không có',
            1: 'Rất ít',
            2: 'Ít',
            3: 'Vừa phải',
            4: 'Nhiều',
            5: 'Rất nhiều'
        };

        return {
            level: dayData.flowLevel,
            message: flowLevelMessages[dayData.flowLevel as keyof typeof flowLevelMessages]
        };
    };

    const getCrampsLevelData = () => {
        if (!selectedDate) return null;
        
        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        const savedData = saved ? JSON.parse(saved) : {};
        const dayData = savedData[selectedDate];
        
        if (!dayData || !dayData.crampsLevel || dayData.crampsLevel === 0) {
            return null;
        }

        const crampsLevelMessages = {
            1: 'Về cơ bản không đau',
            2: 'Hơi đau',
            3: 'Rất đau',
            4: 'Cực đau',
            5: 'Đau không chịu nổi'
        };

        return {
            level: dayData.crampsLevel,
            message: crampsLevelMessages[dayData.crampsLevel as keyof typeof crampsLevelMessages]
        };
    };

    const flowData = getFlowLevelData();
    const crampsData = getCrampsLevelData();

    return (
        <Popup open={open} onClose={onClose} className="predictions-analysis-popup">
            <div className="predictions-analysis-content">
                <h3 className="predictions-analysis-title">Predictions & Analysis</h3>
                
                <div className="prediction-date">
                    {formatSelectedDate(selectedDate)}
                </div>

                <div className="prediction-items">
                    {flowData && (
                        <div className="symptom-card">
                            <div className="symptom-header">
                                <div className="symptom-icon flow-icon"></div>
                                <span className="symptom-title">Lượng kinh</span>
                            </div>
                            <div className="symptom-content">
                                <span className="symptom-description">Lượng kinh lần này</span>
                                <span className="symptom-value" style={{ color: '#ff69b4' }}>
                                    {flowData.message}
                                </span>
                            </div>
                        </div>
                    )}
                    {crampsData && (
                        <div className="symptom-card">
                            <div className="symptom-header">
                                <div className="symptom-icon cramps-icon"></div>
                                <span className="symptom-title">Đau bụng kinh</span>
                            </div>
                            <div className="symptom-content">
                                <span className="symptom-description">Đau bụng kinh lần này</span>
                                <span className="symptom-value" style={{ color: '#ff69b4' }}>
                                    {crampsData.message}
                                </span>
                            </div>
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

