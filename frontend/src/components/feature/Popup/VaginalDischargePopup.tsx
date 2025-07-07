import React, {useState, useEffect} from 'react';
import Popup from './ExitPopup';
import '../../../styles/components/vaginal-discharge-popup.css';

interface VaginalDischargePopupProps {
    open: boolean;
    onClose: () => void;
    onSave?: (selectedDischarge: string) => void;
    selectedDate?: string;
    currentDischarge?: string;
}

const VaginalDischargePopup: React.FC<VaginalDischargePopupProps> = ({
    open, 
    onClose, 
    onSave, 
    selectedDate,
    currentDischarge = ''
}) => {
    const [selectedDischarge, setSelectedDischarge] = useState<string>(currentDischarge);

    const dischargeOptions = [
        { name: 'Khô', icon: '🌵' },
        { name: 'Đặc định', icon: '🥛' },
        { name: 'Dạng sữa', icon: '🥛' },
        { name: 'Dạng nước', icon: '💧' },
        { name: 'Dạng lòng trắng trứng', icon: '🥚' }
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
        return `vaginal_discharge_${userId}`;
    };

    useEffect(() => {
        if (open && selectedDate) {
            const storageKey = getStorageKey();
            const saved = localStorage.getItem(storageKey);
            const savedData = saved ? JSON.parse(saved) : {};
            
            const dayData = savedData[selectedDate];
            if (dayData && dayData.discharge) {
                setSelectedDischarge(dayData.discharge);
            } else {
                setSelectedDischarge(currentDischarge);
            }
        }
    }, [open, selectedDate, currentDischarge]);

    const handleDischargeToggle = (discharge: string) => {
        setSelectedDischarge(prev => 
            prev === discharge ? '' : discharge
        );
    };

    const handleSave = () => {
        if (!selectedDate) return;

        const storageKey = getStorageKey();
        const saved = localStorage.getItem(storageKey);
        const savedData = saved ? JSON.parse(saved) : {};

        if (selectedDischarge) {
            savedData[selectedDate] = {
                discharge: selectedDischarge
            };
        } else {
            delete savedData[selectedDate];
        }

        localStorage.setItem(storageKey, JSON.stringify(savedData));
        
        if (onSave) {
            onSave(selectedDischarge);
        }
        onClose();
    };

    const handleCancel = () => {
        setSelectedDischarge(currentDischarge);
        onClose();
    };

    if (!open) return null;

    return (
        <Popup open={open} onClose={onClose}>
            <div className="vaginal-discharge-popup-container">
                <div className="vaginal-discharge-popup-header">
                    <button className="back-button" onClick={handleCancel}>
                        Hủy
                    </button>
                    <h3 className="vaginal-discharge-popup-title">Dịch âm đạo</h3>
                    <button className="confirm-button" onClick={handleSave}>
                        Xác nhận
                    </button>
                </div>
                
                <div className="vaginal-discharge-content">
                    <div className="discharge-list">
                        {dischargeOptions.map((option) => (
                            <div 
                                key={option.name}
                                className="discharge-item"
                                onClick={() => handleDischargeToggle(option.name)}
                            >
                                <div className="discharge-icon">{option.icon}</div>
                                <span className="discharge-name">{option.name}</span>
                                <div className={`discharge-checkbox ${selectedDischarge === option.name ? 'active' : ''}`}>
                                    {selectedDischarge === option.name && '✓'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default VaginalDischargePopup;
