import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';
import Toast from '../../common/Toast';
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
        symptoms: string[];
        discharge: boolean;
        bodyTemp: string;
        weight: string;
    };
}

const DaySymptomPopup: React.FC<DaySymptomPopupProps> = ({open, onClose, onSave, selectedDate}) => {
    const [periods, setPeriods] = useState(false);
    const [flowLevel, setFlowLevel] = useState(0);
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [discharge, setDischarge] = useState(false);
    const [dischargeType, setDischargeType] = useState('');
    const [bodyTemp, setBodyTemp] = useState('');
    const [weight, setWeight] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showSymptomDropdown, setShowSymptomDropdown] = useState(false);
    const [showVaginalDischargePopup, setShowVaginalDischargePopup] = useState(false);
    const [showWeightInputPopup, setShowWeightInputPopup] = useState(false);
    const [showTemperatureInputPopup, setShowTemperatureInputPopup] = useState(false);

    const symptomOptions = [
        { name: 'Headache', icon: '🧠' },
        { name: 'Back pain', icon: '🔽' },
        { name: 'Nausea', icon: '🤢' },
        { name: 'Fatigue', icon: '😴' },
        { name: 'Stress', icon: '😰' },
        { name: 'Insomnia', icon: '🛌' },
        { name: 'Breast pain', icon: '💚' },
        { name: 'Diarrhea', icon: '💧' },
        { name: 'Constipation', icon: '🚫' },
        { name: 'Food cravings', icon: '🍴' },
        { name: 'Dizziness', icon: '💫' },
        { name: 'Irritability', icon: '😤' }
    ];

    const flowLevelMessages = {
        0: 'No flow',
        1: 'Very light flow',
        2: 'Light flow',
        3: 'Medium flow',
        4: 'Heavy flow',
        5: 'Very heavy flow'
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
            clearOldSymptomData();
            
            const storageKey = getStorageKey();
            const saved = localStorage.getItem(storageKey);
            const savedData: SymptomData = saved ? JSON.parse(saved) : {};
            
            const dayData = savedData[selectedDate];
            if (dayData) {
                setPeriods(dayData.periods || false);
                setFlowLevel(dayData.flowLevel || 0);
                setSymptoms(dayData.symptoms || []);
                setDischarge(dayData.discharge || false);
                setBodyTemp(dayData.bodyTemp || '');
                setWeight(dayData.weight || '');
            } else {
                setPeriods(false);
                setFlowLevel(0);
                setSymptoms([]);
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.symptom-dropdown-container')) {
                setShowSymptomDropdown(false);
            }
        };

        if (showSymptomDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSymptomDropdown]);

    const handleSymptomSave = (selectedSymptoms: string[]) => {
        setSymptoms(selectedSymptoms);
    };

    const handleSymptomToggle = (symptomName: string) => {
        setSymptoms(prev => {
            if (prev.includes(symptomName)) {
                return prev.filter(s => s !== symptomName);
            } else {
                return [...prev, symptomName];
            }
        });
    };

    const handleFlowLevelSelect = (level: number) => {
        setFlowLevel(level);
        const message = flowLevelMessages[level as keyof typeof flowLevelMessages];
        setToastMessage(message);
        setShowToast(true);
    };

    const handleVaginalDischargeSave = (selectedDischarge: string) => {
        if (!selectedDischarge || selectedDischarge.trim() === '') {
            setDischarge(false);
            setDischargeType('');
        } else {
            setDischarge(true);
            setDischargeType(selectedDischarge);
        }
    };

    const handleWeightSave = (weightValue: string) => {
        if (!weightValue || weightValue.trim() === '') {
            setWeight('');
        } else {
            setWeight(weightValue);
        }
    };

    const handleTemperatureSave = (temperatureValue: string) => {
        if (!temperatureValue || temperatureValue.trim() === '') {
            setBodyTemp('');
        } else {
            setBodyTemp(temperatureValue);
        }
    };

    const handleSave = () => {
        if (!selectedDate) return;

        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        const savedData: SymptomData = saved ? JSON.parse(saved) : {};

        savedData[selectedDate] = {
            periods,
            flowLevel,
            symptoms,
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

    const clearOldSymptomData = () => {
        const userId = getCurrentUserId();
        const oldKeys = [
            `symptom_selection_${userId}`,
            `selected_symptoms_${userId}`,
            `menstrual_symptoms_${userId}`
        ];
        
        oldKeys.forEach(key => {
            localStorage.removeItem(key);
        });
    };



    if (!open) return null;

    return (
        <Popup open={open} onClose={onClose}>
            <div className="symptom-popup-container">
                <div className="symptom-popup-header">
                    <h3 className="symptom-popup-title">Symptom Notes</h3>
                </div>
                
                <div className="symptom-section">
                    <div className="symptom-row">
                        <div className="symptom-icon periods-icon">🍓</div>
                        <span className="symptom-label">Period Day</span>
                        <div className="symptom-checkbox">
                            <input 
                                type="checkbox" 
                                id="period-checkbox"
                                checked={periods}
                                onChange={(e) => setPeriods(e.target.checked)}
                                className="period-checkbox"
                            />
                            <label htmlFor="period-checkbox" className="checkbox-label">
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </div>

                    <div className="symptom-row">
                        <div className="symptom-icon">🩸</div>
                        <span className="symptom-label">Flow Level</span>
                        <div className="flow-slider-container">
                            <input
                                type="range"
                                min="0"
                                max="5"
                                value={flowLevel}
                                onChange={(e) => handleFlowLevelSelect(parseInt(e.target.value))}
                                className="flow-slider"
                            />
                        </div>
                    </div>

                    <div className="symptom-dropdown-container">
                        <div className="symptom-main-row" onClick={() => setShowSymptomDropdown(!showSymptomDropdown)}>
                            <div className="symptom-icon">🤕</div>
                            <span className="symptom-label">Symptoms</span>
                            <div className={`symptom-display ${symptoms.length > 0 ? 'active' : ''}`}>
                                {symptoms.length > 0 ? symptoms.length : ''}
                            </div>
                        </div>
                        {showSymptomDropdown && (
                            <div className="symptom-dropdown">
                                {symptomOptions.map((option) => (
                                    <div 
                                        key={option.name}
                                        className={`symptom-option ${symptoms.includes(option.name) ? 'selected' : ''}`}
                                        onClick={() => handleSymptomToggle(option.name)}
                                    >
                                        <span className="symptom-option-text">
                                            {option.icon} {option.name}
                                        </span>
                                        {symptoms.includes(option.name) && <span>✓</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="symptom-row" onClick={() => setShowVaginalDischargePopup(true)}>
                        <div className="symptom-icon">💜</div>
                        <span className="symptom-label">Vaginal Discharge</span>
                        <div className={`discharge-display ${discharge ? 'active' : ''}`}>
                            {discharge ? dischargeType : '+'}
                        </div>
                    </div>

                    <div className="symptom-row" onClick={() => setShowWeightInputPopup(true)}>
                        <div className="symptom-icon">💜</div>
                        <span className="symptom-label">Weight</span>
                        <div className={`weight-display ${weight ? 'active' : ''}`}>
                            {weight ? `${weight} kg` : '+'}
                        </div>
                    </div>

                    <div className="symptom-row" onClick={() => setShowTemperatureInputPopup(true)}>
                        <div className="symptom-icon">🌡️</div>
                        <span className="symptom-label">Body Temperature</span>
                        <div className={`temperature-display ${bodyTemp ? 'active' : ''}`}>
                            {bodyTemp ? `${bodyTemp} °C` : '+'}
                        </div>
                    </div>
                </div>

                <div className="popup-actions">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="save-btn" onClick={handleSave}>Save</button>
                </div>
            </div>
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

