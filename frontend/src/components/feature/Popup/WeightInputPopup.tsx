import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';
import '../../../styles/components/weight-input-popup.css';

interface WeightInputPopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (weight: string) => void;
    selectedDate?: string;
    currentWeight?: string;
}

const WeightInputPopup: React.FC<WeightInputPopupProps> = ({
    open, 
    onClose, 
    onSave, 
    selectedDate,
    currentWeight = ''
}) => {
    const [weight, setWeight] = useState<string>(currentWeight);

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
        return `weight_input_${userId}`;
    };

    useEffect(() => {
        if (open && selectedDate) {
            const storageKey = getStorageKey();
            const saved = localStorage.getItem(storageKey);
            const savedData = saved ? JSON.parse(saved) : {};
            
            const dayData = savedData[selectedDate];
            if (dayData && dayData.weight) {
                setWeight(dayData.weight);
            } else {
                setWeight(currentWeight);
            }
        }
    }, [open, selectedDate, currentWeight]);

    const handleNumberClick = (num: string) => {
        if (num === '.') {
            if (!weight.includes('.')) {
                setWeight(prev => prev + num);
            }
        } else {
            setWeight(prev => prev + num);
        }
    };

    const handleDelete = () => {
        setWeight(prev => prev.slice(0, -1));
    };

    const handleSave = () => {
        if (!selectedDate) return;

        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        const savedData = saved ? JSON.parse(saved) : {};

        if (weight) {
            savedData[selectedDate] = {
                weight: weight
            };
        } else {
            delete savedData[selectedDate];
        }

        localStorage.setItem(storageKey, JSON.stringify(savedData));
        
        if (onSave) {
            onSave(weight);
        }
        onClose();
    };

    const handleCancel = () => {
        setWeight(currentWeight);
        onClose();
    };

    if (!open) return null;

    return (
        <Popup open={open} onClose={onClose}>
            <div className="weight-input-popup-container">
                <div className="weight-input-popup-header">
                    <button className="back-button" onClick={handleCancel}>
                        Hủy
                    </button>
                    <h3 className="weight-input-popup-title">Cân nặng</h3>
                    <button className="confirm-button" onClick={handleSave}>
                        Xác nhận
                    </button>
                </div>
                
                <div className="weight-input-content">
                    <div className="weight-display">
                        <span className="weight-value">{weight || '0'}</span>
                        <span className="weight-unit">kg</span>
                    </div>
                    
                    <div className="number-pad">
                        <div className="number-row">
                            <button className="number-btn" onClick={() => handleNumberClick('1')}>1</button>
                            <button className="number-btn" onClick={() => handleNumberClick('2')}>2</button>
                            <button className="number-btn" onClick={() => handleNumberClick('3')}>3</button>
                        </div>
                        <div className="number-row">
                            <button className="number-btn" onClick={() => handleNumberClick('4')}>4</button>
                            <button className="number-btn" onClick={() => handleNumberClick('5')}>5</button>
                            <button className="number-btn" onClick={() => handleNumberClick('6')}>6</button>
                        </div>
                        <div className="number-row">
                            <button className="number-btn" onClick={() => handleNumberClick('7')}>7</button>
                            <button className="number-btn" onClick={() => handleNumberClick('8')}>8</button>
                            <button className="number-btn" onClick={() => handleNumberClick('9')}>9</button>
                        </div>
                        <div className="number-row">
                            <button className="number-btn" onClick={() => handleNumberClick('.')}>.</button>
                            <button className="number-btn" onClick={() => handleNumberClick('0')}>0</button>
                            <button className="delete-btn" onClick={handleDelete}>×</button>
                        </div>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default WeightInputPopup;
