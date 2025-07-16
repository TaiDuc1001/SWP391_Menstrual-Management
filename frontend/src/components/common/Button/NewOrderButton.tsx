import React from 'react';
import SquaredButton from './SquaredButton';

interface NewOrderButtonProps extends React.ComponentProps<typeof SquaredButton> {
    icon?: React.ReactNode;
}

const NewOrderButton: React.FC<NewOrderButtonProps> = ({icon, children = 'New order', ...props}) => (
    <SquaredButton icon={icon} {...props}>{children}</SquaredButton>
);

export default NewOrderButton;

