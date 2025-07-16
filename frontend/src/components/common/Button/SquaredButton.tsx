import React from 'react';
import Button from './Button';

interface SquaredButtonProps extends React.ComponentProps<typeof Button> {
}

const SquaredButton: React.FC<SquaredButtonProps> = ({className = '', ...props}) => (
    <Button
        className={`rounded bg-pink-500 text-white hover:bg-pink-600 hover:shadow-md ${className}`}
        {...props}
    />
);

export default SquaredButton;

