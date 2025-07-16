import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';
import '../../../styles/components/sex-activity-popup.css';

interface SexActivityPopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (data: any) => void;
    selectedDate?: string;
}

const SexActivityPopup: React.FC<SexActivityPopupProps> = ({open, onClose, onSave, selectedDate}) => {
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedMethod, setSelectedMethod] = useState('');

    const timeSlots = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            timeSlots.push(timeString);
        }
    }

    const contraceptiveMethods = [
        'Không biện pháp tránh thai',
        'Bao cao su',
        'Thuốc tránh thai khẩn cấp',
        'Thuốc tránh thai 21 viên',
        'Vòng tránh thai',
        'Xuất tinh ngoài',
        'Chưa xuất tinh'
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
        return `sex_activity_${userId}`;
    };

    useEffect(() => {
        if (open && selectedDate) {
            const storageKey = getStorageKey();
            const saved = localStorage.getItem(storageKey);
            const savedData = saved ? JSON.parse(saved) : {};
            
            const dayData = savedData[selectedDate];
            if (dayData) {
                setSelectedTime(dayData.time || '');
                setSelectedMethod(dayData.method || '');
            } else {
                setSelectedTime('');
                setSelectedMethod('');
            }
        }
    }, [open, selectedDate]);

    const handleSave = () => {
        if (!selectedDate) return;

        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        const savedData = saved ? JSON.parse(saved) : {};

        if (selectedTime || selectedMethod) {
            savedData[selectedDate] = {
                time: selectedTime,
                method: selectedMethod
            };
        } else {
            delete savedData[selectedDate];
        }

        localStorage.setItem(storageKey, JSON.stringify(savedData));
        
        if (onSave) {
            onSave(savedData[selectedDate] || null);
        }
        onClose();
    };

    if (!open) return null;

    return (
        <Popup open={open} onClose={onClose}>
            <div className="sex-activity-popup-container">
                <div className="sex-activity-popup-header">
                    <h3 className="sex-activity-popup-title">Ghi chép ân ái</h3>
                    <button className="close-button" onClick={onClose}>
                        ×
                    </button>
                </div>
                
                <div className="sex-activity-content">
                    <div className="time-section">
                        <h4 className="section-title">Thời gian</h4>
                        <div className="time-list">
                            {timeSlots.map((time) => (
                                <div 
                                    key={time}
                                    className={`time-item ${selectedTime === time ? 'active' : ''}`}
                                    onClick={() => setSelectedTime(selectedTime === time ? '' : time)}
                                >
                                    {time}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="method-section">
                        <h4 className="section-title">Biện pháp tránh thai</h4>
                        <div className="method-list">
                            {contraceptiveMethods.map((method) => (
                                <div 
                                    key={method}
                                    className={`method-item ${selectedMethod === method ? 'active' : ''}`}
                                    onClick={() => setSelectedMethod(selectedMethod === method ? '' : method)}
                                >
                                    {method}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="popup-actions">
                    <button className="cancel-btn" onClick={onClose}>Hủy</button>
                    <button className="save-btn" onClick={handleSave}>Xác nhận</button>
                </div>
            </div>
        </Popup>
    );
};

export default SexActivityPopup;

