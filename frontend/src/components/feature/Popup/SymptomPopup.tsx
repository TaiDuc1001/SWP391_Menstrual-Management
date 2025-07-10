import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';
import '../../../styles/components/symptom-selection-popup.css';

interface SymptomPopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (selectedSymptoms: string[]) => void;
    selectedDate?: string;
    currentSymptoms?: string[];
}

const SymptomPopup: React.FC<SymptomPopupProps> = ({
    open, 
    onClose, 
    onSave, 
    selectedDate,
    currentSymptoms = []
}) => {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(currentSymptoms);

    const symptomOptions = [
        { name: 'Đau đầu', icon: '🧠' },
        { name: 'Đau lưng', icon: '🔽' },
        { name: 'Buồn nôn', icon: '🤢' },
        { name: 'Mệt mỏi', icon: '😴' },
        { name: 'Căng thẳng', icon: '😰' },
        { name: 'Khó ngủ', icon: '🛌' },
        { name: 'Đau ngực', icon: '💚' },
        { name: 'Tiêu chảy', icon: '💧' },
        { name: 'Táo bón', icon: '🚫' },
        { name: 'Thèm ăn', icon: '🍴' },
        { name: 'Chóng mặt', icon: '💫' },
        { name: 'Cáu kỉnh', icon: '😤' }
    ];

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
        return `symptoms_selection_${userId}`;
    };

    useEffect(() => {
        if (open && selectedDate) {
            const storageKey = getStorageKey();
            const saved = localStorage.getItem(storageKey);
            const savedData = saved ? JSON.parse(saved) : {};
            
            const dayData = savedData[selectedDate];
            if (dayData && dayData.symptoms) {
                setSelectedSymptoms(dayData.symptoms);
            } else {
                setSelectedSymptoms(currentSymptoms);
            }
        }
    }, [open, selectedDate, currentSymptoms]);

    const handleSymptomToggle = (symptom: string) => {
        setSelectedSymptoms(prev => 
            prev.includes(symptom) 
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        );
    };

    const handleSave = () => {
        if (!selectedDate) return;

        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        const savedData = saved ? JSON.parse(saved) : {};

        if (selectedSymptoms.length > 0) {
            savedData[selectedDate] = {
                symptoms: selectedSymptoms
            };
        } else {
            delete savedData[selectedDate];
        }

        localStorage.setItem(storageKey, JSON.stringify(savedData));
        
        if (onSave) {
            onSave(selectedSymptoms);
        }
        onClose();
    };

    const handleCancel = () => {
        setSelectedSymptoms(currentSymptoms);
        onClose();
    };

    if (!open) return null;

    return (
        <Popup open={open} onClose={onClose}>
            <div className="symptom-selection-popup-container">
                <div className="symptom-selection-popup-header">
                    <button className="back-button" onClick={handleCancel}>
                        Hủy
                    </button>
                    <h3 className="symptom-selection-popup-title">Triệu chứng</h3>
                    <button className="confirm-button" onClick={handleSave}>
                        Xác nhận
                    </button>
                </div>
                
                <div className="symptom-selection-content">
                    <div className="symptom-list">
                        {symptomOptions.map((option) => (
                            <div 
                                key={option.name}
                                className="symptom-item"
                                onClick={() => handleSymptomToggle(option.name)}
                            >
                                <div className="symptom-item-icon">{option.icon}</div>
                                <span className="symptom-item-name">{option.name}</span>
                                <div className={`symptom-checkbox ${selectedSymptoms.includes(option.name) ? 'active' : ''}`}>
                                    {selectedSymptoms.includes(option.name) && '✓'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default SymptomPopup;
