import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';
import Toast from '../../common/Toast';
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
    const [bodyTemp, setBodyTemp] = useState('');
    const [weight, setWeight] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const defaultSymptoms = ['Đau lưng dưới', 'Đau đầu', 'Buồn nôn', 'Mệt mỏi'];
    const currentSymptom = symptoms.length > 0 ? symptoms[0] : defaultSymptoms[0];

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
                ? prev.filter(m => m !== moodItem)
                : [...prev, moodItem]
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
        setCrampsLevel(level);
        const message = crampLevelMessages[level as keyof typeof crampLevelMessages];
        setToastMessage(message);
        setShowToast(true);
    };

    const handleFlowLevelSelect = (level: number) => {
        setFlowLevel(level);
        const message = flowLevelMessages[level as keyof typeof flowLevelMessages];
        setToastMessage(message);
        setShowToast(true);
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

                    <div className="symptom-row" onClick={() => setSex(!sex)}>
                        <div className="symptom-icon">💕</div>
                        <span className="symptom-label">Ân ái</span>
                        <div className={`add-button ${sex ? 'active' : ''}`}>
                            {sex ? '✓' : '+'}
                        </div>
                    </div>

                    <div className="symptom-row">
                        <div className="symptom-icon">💎</div>
                        <span className="symptom-label">Triệu chứng</span>
                        <span className="symptom-status">
                            {currentSymptom}
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

                    <div className="symptom-row" onClick={() => setDischarge(!discharge)}>
                        <div className="symptom-icon">💜</div>
                        <span className="symptom-label">Dịch âm đạo</span>
                        <div className={`add-button ${discharge ? 'active' : ''}`}>
                            {discharge ? '✓' : '+'}
                        </div>
                    </div>

                    <div className="symptom-row">
                        <div className="symptom-icon">💜</div>
                        <span className="symptom-label">Cân nặng</span>
                        <div className="add-button">+</div>
                    </div>

                    <div className="symptom-row">
                        <div className="symptom-icon">🌡️</div>
                        <span className="symptom-label">Thân nhiệt</span>
                        <div className="add-button">+</div>
                    </div>
                </div>

                <div className="popup-actions">
                    <button className="cancel-btn" onClick={onClose}>Hủy</button>
                    <button className="save-btn" onClick={handleSave}>Lưu</button>
                </div>
            </div>
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
