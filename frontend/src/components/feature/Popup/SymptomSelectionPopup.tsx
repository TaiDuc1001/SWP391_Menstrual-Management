import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';
import '../../../styles/components/symptom-selection-popup.css';

interface SymptomSelectionPopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (selectedSymptoms: string[]) => void;
    selectedDate?: string;
    currentSymptoms?: string[];
}

const SymptomSelectionPopup: React.FC<SymptomSelectionPopupProps> = ({
    open, 
    onClose, 
    onSave, 
    selectedDate,
    currentSymptoms = []
}) => {
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(currentSymptoms);

    const symptomCategories = {
        'Toàn thân': [
            { name: 'Da khô', icon: '👤' },
            { name: 'Sưng tấy', icon: '🫧' },
            { name: 'Sốt', icon: '🌡️' },
            { name: 'Đau mỏi cơ thể', icon: '💆' }
        ],
        'Khác': [
            { name: 'Căng ngực', icon: '👗' },
            { name: 'Dịch âm đạo bất thường', icon: '⚠️' },
            { name: 'Cảm cúm', icon: '🤧' },
            { name: 'Ra máu nhỏ giọt', icon: '💧' }
        ],
        'Eo và mông': [
            { name: 'Đau lưng', icon: '🦴' },
            { name: 'Táo bón', icon: '😣' }
        ],
        'Các triệu chứng kinh nguyệt': [
            { name: 'Đau bụng rõ rệt', icon: '🫄' },
            { name: 'Đau bụng không chịu nổi', icon: '😰' },
            { name: 'Hoa mắt chóang váng', icon: '😵' },
            { name: 'Bốn chốn', icon: '🌀' },
            { name: 'Mỏ hôi lạnh', icon: '❄️' },
            { name: 'Đau lưng dưới', icon: '🫄' },
            { name: 'Buồn nôn và ói mửa', icon: '🤢' },
            { name: 'Sưng hậu môn', icon: '🔄' },
            { name: 'Chân tay lạnh', icon: '🥶' },
            { name: 'Tiêu chảy nặng', icon: '💩' },
            { name: 'Tai nhọt', icon: '👂' },
            { name: 'Sốc', icon: '😱' }
        ]
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
        return `symptom_selection_${userId}`;
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

        savedData[selectedDate] = {
            symptoms: selectedSymptoms
        };

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
                    {Object.entries(symptomCategories).map(([category, symptoms]) => (
                        <div key={category} className="symptom-category">
                            <h4 className="category-title">{category}</h4>
                            <div className="symptom-list">
                                {symptoms.map((symptom) => (
                                    <div 
                                        key={symptom.name}
                                        className="symptom-item"
                                        onClick={() => handleSymptomToggle(symptom.name)}
                                    >
                                        <div className="symptom-icon">{symptom.icon}</div>
                                        <span className="symptom-name">{symptom.name}</span>
                                        <div className={`symptom-checkbox ${selectedSymptoms.includes(symptom.name) ? 'active' : ''}`}>
                                            {selectedSymptoms.includes(symptom.name) && '✓'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    <div className="custom-symptoms-section">
                        <h4 className="category-title">Các triệu chứng tùy chỉnh</h4>
                        <div className="add-custom-symptom">
                            <span className="add-icon">+</span>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default SymptomSelectionPopup;
