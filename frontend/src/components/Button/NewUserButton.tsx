import React from 'react';
import SquaredButton from '../Button/SquaredButton';

interface NewUserButtonProps extends React.ComponentProps<typeof SquaredButton> {
    icon?: React.ReactNode;
}

const NewUserButton: React.FC<NewUserButtonProps> = ({ icon, children = 'Create new user', ...props }) => (
    <SquaredButton icon={icon} {...props}>{children}</SquaredButton>
);

export default NewUserButton;
