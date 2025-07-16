import React from 'react';
import Badge from './Badge';

interface TypeBadgeProps {
    label: string;
    className?: string;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({label, className = ''}) => {
    return (
        <Badge className={`text-xs font-semibold px-2 py-1 rounded ${className}`}>{label}</Badge>
    );
};

export default TypeBadge;

