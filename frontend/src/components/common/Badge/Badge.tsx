import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const Badge: React.FC<BadgeProps> = ({children, className = '', style}) => {
    return (
        <span
            className={`inline-flex items-center px-2 py-1 rounded font-medium text-xs ${className}`}
            style={style}
        >
      {children}
    </span>
    );
};

export default Badge;

