import React from 'react';
import Button from './Button';

interface RoundedButtonProps extends React.ComponentProps<typeof Button> {}

const RoundedButton: React.FC<RoundedButtonProps> = ({ className = '', ...props }) => (
  <Button
    className={`rounded-full bg-pink-500 text-white hover:bg-pink-600 hover:shadow-md ${className}`}
    {...props}
  />
);

export default RoundedButton;
