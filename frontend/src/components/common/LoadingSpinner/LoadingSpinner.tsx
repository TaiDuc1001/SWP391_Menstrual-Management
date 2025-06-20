import React from 'react';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'white';
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 'medium',
                                                           color = 'primary',
                                                           className = ''
                                                       }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    const colorClasses = {
        primary: 'border-pink-500',
        secondary: 'border-blue-500',
        white: 'border-white'
    };

    const classes = `animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

    return <div className={classes}/>;
};

export default LoadingSpinner;
