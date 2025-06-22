import React from 'react';
import Button from './Button';

interface RoundedButtonProps extends React.ComponentProps<typeof Button> {
}

const RoundedButton: React.FC<RoundedButtonProps> = ({className = '', ...props}) => (
    <Button
        className={`rounded-lg bg-pink-50 text-pink-500 border border-pink-300 transition-colors duration-200 px-3 py-2 text-sm
      hover:bg-pink-500 hover:text-white hover:shadow-lg hover:border-pink-500 ${className}`}
        {...props}
    />
);

export default RoundedButton;
