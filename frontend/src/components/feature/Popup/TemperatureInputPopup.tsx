import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';
import '../../../styles/components/temperature-input-popup.css';

interface TemperatureInputPopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (temperature: string) => void;
    selectedDate?: string;
    currentTemperature?: string;
}

const TemperatureInputPopup: React.FC<TemperatureInputPopupProps> = ({
    open, 
    onClose, 
    onSave, 
    selectedDate,
    currentTemperature = ''
}) => {
    const [temperature, setTemperature] = useState<string>(currentTemperature);

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
        return `temperature_input_${userId}`;
    };

    useEffect(() => {
        if (open && selectedDate) {
            const storageKey = getStorageKey();
            const saved = localStorage.getItem(storageKey);
            const savedData = saved ? JSON.parse(saved) : {};
            
            const dayData = savedData[selectedDate];
            if (dayData && dayData.temperature) {
                setTemperature(dayData.temperature);
            } else {
                setTemperature(currentTemperature);
            }
        }
    }, [open, selectedDate, currentTemperature]);

    const handleNumberClick = (num: string) => {
        if (num === '.') {
            if (!temperature.includes('.')) {
                setTemperature(prev => prev + num);
            }
        } else {
            setTemperature(prev => prev + num);
        }
    };

    const handleDelete = () => {
        setTemperature(prev => prev.slice(0, -1));
    };

    const handleSave = () => {
        if (!selectedDate) return;

        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        const savedData = saved ? JSON.parse(saved) : {};

        if (temperature) {
            savedData[selectedDate] = {
                temperature: temperature
            };
        } else {
            delete savedData[selectedDate];
        }

        localStorage.setItem(storageKey, JSON.stringify(savedData));
        
        if (onSave) {
            onSave(temperature);
        }
        onClose();
    };

    const handleCancel = () => {
        setTemperature(currentTemperature);
        onClose();
    };

    if (!open) return null;

    return (
        <Popup open={open} onClose={onClose}>
            <div className="temperature-input-popup-container">
                <div className="temperature-input-popup-header">
                    <button className="back-button" onClick={handleCancel}>
                        Hủy
                    </button>
                    <h3 className="temperature-input-popup-title">Thân nhiệt</h3>
                    <button className="confirm-button" onClick={handleSave}>
                        Xác nhận
                    </button>
                </div>
                
                <div className="temperature-input-content">
                    <div className="temperature-display">
                        <span className="temperature-value">{temperature || '0'}</span>
                        <span className="temperature-unit">°C</span>
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

export default TemperatureInputPopup;

