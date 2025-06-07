import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ icon, children, className = '', ...props }) => (
  <button
    className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors duration-200 focus:outline-none ${className}`}
    {...props}
  >
    {icon && <span className="flex-shrink-0">{icon}</span>}
    <span>{children}</span>
  </button>
);

export default Button;
