import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
}

const Input: React.FC<InputProps> = ({
  icon,
  rightIcon,
  wrapperClassName = '',
  inputClassName = '',
  iconClassName = '',
  ...props
}) => {
  return (
    <div className={`input-wrapper ${wrapperClassName}`}>
      {icon && (
        <span className={`input-icon ${iconClassName}`}>{icon}</span>
      )}
      <input className={`input ${inputClassName}`} {...props} />
      {rightIcon && (
        <span className="input-right-icon">{rightIcon}</span>
      )}
    </div>
  );
};

export default Input;
