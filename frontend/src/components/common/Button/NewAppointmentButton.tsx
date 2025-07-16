import React from 'react';
import SquaredButton from './SquaredButton';

interface NewAppointmentButtonProps extends React.ComponentProps<typeof SquaredButton> {
    icon?: React.ReactNode;
}

const NewAppointmentButton: React.FC<NewAppointmentButtonProps> = ({icon, children = 'New appointment', ...props}) => (
    <SquaredButton icon={icon} {...props}>{children}</SquaredButton>
);

export default NewAppointmentButton;

