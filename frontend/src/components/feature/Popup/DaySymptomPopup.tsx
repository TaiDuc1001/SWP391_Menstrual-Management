import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';
import Toast from '../../common/Toast';
import SexActivityPopup from './SexActivityPopup';
import SymptomSelectionPopup from './SymptomSelectionPopup';
import VaginalDischargePopup from './VaginalDischargePopup';
import WeightInputPopup from './WeightInputPopup';
import TemperatureInputPopup from './TemperatureInputPopup';
import '../../../styles/components/symptom-popup.css';

interface DaySymptomPopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: any) => void;
    selectedDate?: string;
}

interface SymptomData {
    [key: string]: {
        periods: boolean;
        flowLevel: number;
        crampsLevel: number;
        sex: boolean;
        symptoms: string[];
        mood: string[];
        habits: string[];
        discharge: boolean;
        bodyTemp: string;
        weight: string;
    };
}

const DaySymptomPopup: React.FC<DaySymptomPopupProps> = ({open, onClose, onSave, selectedDate}) => {
    const [periods, setPeriods] = useState(false);
    const [flowLevel, setFlowLevel] = useState(0);
    const [crampsLevel, setCrampsLevel] = useState(0);
    const [sex, setSex] = useState(false);
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [mood, setMood] = useState<string[]>([]);
    const [habits, setHabits] = useState<string[]>([]);
    const [discharge, setDischarge] = useState(false);
    const [dischargeType, setDischargeType] = useState('');
    const [bodyTemp, setBodyTemp] = useState('');
    const [weight, setWeight] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showSexActivityPopup, setShowSexActivityPopup] = useState(false);
    const [showSymptomSelectionPopup, setShowSymptomSelectionPopup] = useState(false);
    const [showVaginalDischargePopup, setShowVaginalDischargePopup] = useState(false);
    const [showWeightInputPopup, setShowWeightInputPopup] = useState(false);
    const [showTemperatureInputPopup, setShowTemperatureInputPopup] = useState(false);
    const [sexActivityData, setSexActivityData] = useState<any>(null);

    const crampLevelMessages = {
        1: 'Về cơ bản là không đau',
        2: 'Hơi đau',
        3: 'Rất đau',
        4: 'Cực đau',
        5: 'Đau không chịu nổi'
    };

    const flowLevelMessages = {
        1: 'Lượng kinh nguyệt rất ít',
        2: 'Lượng kinh nguyệt có vẻ ít',
        3: 'Kinh nguyệt bình thường',
        4: 'Lượng kinh nguyệt nhiều',
        5: 'Lượng kinh nguyệt rất nhiều'
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

    useEffect(() => {
        if (open && selectedDate) {
            const storageKey = getStorageKey();
            const saved = localStorage.getItem(storageKey);
            const savedData: SymptomData = saved ? JSON.parse(saved) : {};
            
            const dayData = savedData[selectedDate];
            if (dayData) {
                setPeriods(dayData.periods || false);
                setFlowLevel(dayData.flowLevel || 0);
                setCrampsLevel(dayData.crampsLevel || 0);
                setSex(dayData.sex || false);
                setSymptoms(dayData.symptoms || []);
                setMood(dayData.mood || []);
                setHabits(dayData.habits || []);
                setDischarge(dayData.discharge || false);
                setBodyTemp(dayData.bodyTemp || '');
                setWeight(dayData.weight || '');
            } else {
                setPeriods(false);
                setFlowLevel(0);
                setCrampsLevel(0);
                setSex(false);
                setSymptoms([]);
                setMood([]);
                setHabits([]);
                setDischarge(false);
                setBodyTemp('');
                setWeight('');
            }

            const userId = getCurrentUserId();
            const dischargeStorageKey = `vaginal_discharge_${userId}`;
            const dischargeSaved = localStorage.getItem(dischargeStorageKey);
            const dischargeData = dischargeSaved ? JSON.parse(dischargeSaved) : {};
            
            const dayDischargeData = dischargeData[selectedDate];
            if (dayDischargeData && dayDischargeData.discharge) {
                setDischargeType(dayDischargeData.discharge);
                setDischarge(true);
            } else {
                setDischargeType('');
                setDischarge(false);
            }

            const weightStorageKey = `weight_input_${userId}`;
            const weightSaved = localStorage.getItem(weightStorageKey);
            const weightData = weightSaved ? JSON.parse(weightSaved) : {};
            
            const dayWeightData = weightData[selectedDate];
            if (dayWeightData && dayWeightData.weight) {
                setWeight(dayWeightData.weight);
            } else {
                setWeight('');
            }
        }
    }, [open, selectedDate]);

    const handleSymptomToggle = (symptom: string) => {
        setSymptoms(prev => 
            prev.includes(symptom) 
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        );
    };

    const handleMoodToggle = (moodItem: string) => {
        setMood(prev => 
            prev.includes(moodItem) 
                ? []
                : [moodItem]
        );
    };

    const handleHabitToggle = (habit: string) => {
        setHabits(prev => 
            prev.includes(habit) 
                ? prev.filter(h => h !== habit)
                : [...prev, habit]
        );
    };

    const handleCrampLevelSelect = (level: number) => {
        if (crampsLevel === level) {
            setCrampsLevel(0);
            setToastMessage('Đã hủy chọn mức đau bụng kinh');
        } else {
            setCrampsLevel(level);
            const message = crampLevelMessages[level as keyof typeof crampLevelMessages];
            setToastMessage(message);
        }
        setShowToast(true);
    };

    const handleFlowLevelSelect = (level: number) => {
        if (flowLevel === level) {
            setFlowLevel(0);
            setToastMessage('Đã hủy chọn mức lượng kinh');
        } else {
            setFlowLevel(level);
            const message = flowLevelMessages[level as keyof typeof flowLevelMessages];
            setToastMessage(message);
        }
        setShowToast(true);
    };

    const handleSexActivitySave = (data: any) => {
        setSexActivityData(data);
        setSex(!!data);
    };

    const handleSymptomSelectionSave = (selectedSymptoms: string[]) => {
        setSymptoms(selectedSymptoms);
    };

    const handleVaginalDischargeSave = (selectedDischarge: string) => {
        setDischarge(!!selectedDischarge);
        setDischargeType(selectedDischarge);
    };

    const handleWeightSave = (weightValue: string) => {
        setWeight(weightValue);
    };

    const handleTemperatureSave = (temperatureValue: string) => {
        setBodyTemp(temperatureValue);
    };

    const handleSave = () => {
        if (!selectedDate) return;

        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        const savedData: SymptomData = saved ? JSON.parse(saved) : {};

        savedData[selectedDate] = {
            periods,
            flowLevel,
            crampsLevel,
            sex,
            symptoms,
            mood,
            habits,
            discharge,
            bodyTemp,
            weight
        };

        localStorage.setItem(storageKey, JSON.stringify(savedData));
        
        if (onSave) {
            onSave(savedData[selectedDate]);
        }
        onClose();
    };

    if (!open) return null;

    return (
        <Popup open={open} onClose={onClose}>
            <div className="symptom-popup-container">
                <div className="symptom-popup-header">
                    <h3 className="symptom-popup-title">Ghi chú triệu chứng</h3>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>
                
                <div className="symptom-section">
                    <div className="symptom-row">
                        <div className="symptom-icon periods-icon">🩸</div>
                        <span className="symptom-label">Ngày đến đỏ hết rồi</span>
                        <div className="symptom-toggle">
                            <div 
                                className={`toggle-option ${periods ? 'active' : ''}`}
                                onClick={() => setPeriods(true)}
                            >
                                Có
                            </div>
                            <div 
                                className={`toggle-option ${!periods ? 'active' : ''}`}
                                onClick={() => setPeriods(false)}
                            >
                                Ko
                            </div>
                        </div>
                    </div>

                    <div className="symptom-row">
                        <div className="symptom-icon">💗</div>
                        <span className="symptom-label">Lượng kinh</span>
                        <div className="flow-options">
                            {[1, 2, 3, 4, 5].map(level => (
                                <div 
                                    key={level} 
                                    className={`flow-dot ${flowLevel >= level ? 'active' : ''}`}
                                    onClick={() => handleFlowLevelSelect(level)}
                                ></div>
                            ))}
                        </div>
                    </div>

                    <div className="symptom-row">
                        <div className="symptom-icon">🩷</div>
                        <span className="symptom-label">Đau bụng kinh</span>
                        <div className="cramps-options">
                            {[1, 2, 3, 4, 5].map(level => (
                                <div 
                                    key={level} 
                                    className={`cramps-level ${crampsLevel >= level ? 'active' : ''}`}
                                    onClick={() => handleCrampLevelSelect(level)}
                                >
                                    ⚡
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="symptom-row" onClick={() => {
                        if (sex) {
                            setSex(false);
                            setSexActivityData(null);
                        } else {
                            setShowSexActivityPopup(true);
                        }
                    }}>
                        <div className="symptom-icon">💕</div>
                        <span className="symptom-label">Ân ái</span>
                        <div className={`add-button ${sex ? 'active' : ''}`}>
                            {sex ? '✓' : '+'}
                        </div>
                    </div>

                    <div className="symptom-row" onClick={() => setShowSymptomSelectionPopup(true)}>
                        <div className="symptom-icon">💎</div>
                        <span className="symptom-label">Triệu chứng</span>
                        <span className="symptom-status">
                            {symptoms.length > 0 ? `${symptoms.length} triệu chứng` : 'Chưa chọn'}
                        </span>
                    </div>

                    <div className="symptom-row">
                        <div className="symptom-icon">😊</div>
                        <span className="symptom-label">Tâm trạng</span>
                        <div className="mood-options">
                            {['😔', '😐', '😊', '😄', '😍'].map((emoji, index) => (
                                <div 
                                    key={index} 
                                    className={`mood-emoji ${mood.includes(emoji) ? 'active' : ''}`}
                                    onClick={() => handleMoodToggle(emoji)}
                                >
                                    {emoji}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="symptom-row">
                        <div className="symptom-icon">💧</div>
                        <span className="symptom-label">Thói quen</span>
                        <div className="habit-options">
                            {['💊', '💤', '🏃', '🚬', '🍷'].map((emoji, index) => (
                                <div 
                                    key={index} 
                                    className={`habit-emoji ${habits.includes(emoji) ? 'active' : ''}`}
                                    onClick={() => handleHabitToggle(emoji)}
                                >
                                    {emoji}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="symptom-row" onClick={() => {
                        if (discharge) {
                            setDischarge(false);
                            setDischargeType('');
                        } else {
                            setShowVaginalDischargePopup(true);
                        }
                    }}>
                        <div className="symptom-icon">💜</div>
                        <span className="symptom-label">Dịch âm đạo</span>
                        <div className={`discharge-display ${discharge ? 'active' : ''}`}>
                            {discharge ? dischargeType : '+'}
                        </div>
                    </div>

                    <div className="symptom-row" onClick={() => {
                        if (weight) {
                            setWeight('');
                        } else {
                            setShowWeightInputPopup(true);
                        }
                    }}>
                        <div className="symptom-icon">💜</div>
                        <span className="symptom-label">Cân nặng</span>
                        <div className={`weight-display ${weight ? 'active' : ''}`}>
                            {weight ? `${weight} kg` : '+'}
                        </div>
                    </div>

                    <div className="symptom-row" onClick={() => {
                        if (bodyTemp) {
                            setBodyTemp('');
                        } else {
                            setShowTemperatureInputPopup(true);
                        }
                    }}>
                        <div className="symptom-icon">🌡️</div>
                        <span className="symptom-label">Thân nhiệt</span>
                        <div className={`temperature-display ${bodyTemp ? 'active' : ''}`}>
                            {bodyTemp ? `${bodyTemp} °C` : '+'}
                        </div>
                    </div>
                </div>

                <div className="popup-actions">
                    <button className="cancel-btn" onClick={onClose}>Hủy</button>
                    <button className="save-btn" onClick={handleSave}>Lưu</button>
                </div>
            </div>
            <SexActivityPopup
                open={showSexActivityPopup}
                onClose={() => setShowSexActivityPopup(false)}
                onSave={handleSexActivitySave}
                selectedDate={selectedDate}
            />
            <SymptomSelectionPopup
                open={showSymptomSelectionPopup}
                onClose={() => setShowSymptomSelectionPopup(false)}
                onSave={handleSymptomSelectionSave}
                selectedDate={selectedDate}
                currentSymptoms={symptoms}
            />
            <VaginalDischargePopup
                open={showVaginalDischargePopup}
                onClose={() => setShowVaginalDischargePopup(false)}
                onSave={handleVaginalDischargeSave}
                selectedDate={selectedDate}
                currentDischarge={dischargeType}
            />
            <WeightInputPopup
                open={showWeightInputPopup}
                onClose={() => setShowWeightInputPopup(false)}
                onSave={handleWeightSave}
                selectedDate={selectedDate}
                currentWeight={weight}
            />
            <TemperatureInputPopup
                open={showTemperatureInputPopup}
                onClose={() => setShowTemperatureInputPopup(false)}
                onSave={handleTemperatureSave}
                selectedDate={selectedDate}
                currentTemperature={bodyTemp}
            />
            <Toast 
                message={toastMessage}
                isVisible={showToast}
                onClose={() => setShowToast(false)}
                duration={2000}
            />
        </Popup>
    );
};

export default DaySymptomPopup;
