import React from 'react';
import TitleBar from './TitleBar';

interface AppointmentTitleBarProps {
    title: string;
    onNewAppointment: () => void;
    icon: React.ReactNode;
    buttonText: string;
}

const AppointmentTitleBar: React.FC<AppointmentTitleBarProps> = ({title, onNewAppointment, icon, buttonText}) => (
    <TitleBar
        text={title}
        buttonLabel={
            <span className="flex items-center gap-2">
        {icon}
                {buttonText}
      </span>
        }
        onButtonClick={onNewAppointment}
    />
);

export default AppointmentTitleBar;

