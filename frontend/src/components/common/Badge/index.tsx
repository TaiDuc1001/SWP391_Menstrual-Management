import React from 'react';

interface BadgeProps {
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
    children: React.ReactNode;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
                                                variant = 'primary',
                                                children,
                                                className = '',
                                            }) => {
    const baseStyles = 'inline-flex px-2 py-1 rounded-full text-xs font-medium';

    const variantStyles = {
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-purple-100 text-purple-800'
    };

    return (
        <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
    );
};

