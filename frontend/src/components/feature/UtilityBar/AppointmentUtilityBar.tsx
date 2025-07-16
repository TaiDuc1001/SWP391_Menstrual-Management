import React from 'react';
import UtilityBar from './UtilityBar';

interface AppointmentUtilityBarProps {
    children: React.ReactNode;
}

const AppointmentUtilityBar: React.FC<AppointmentUtilityBarProps> = ({children}) => (
    <UtilityBar>
        {children}
    </UtilityBar>
);

export default AppointmentUtilityBar;

