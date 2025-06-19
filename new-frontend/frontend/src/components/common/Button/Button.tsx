import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export function Button({ children, variant = 'primary', className = '', type = 'button', ...props }: ButtonProps) {
  const base = 'btn-base';
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-outline';
  return (
    <button
      type={type}
      className={`${base} ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
