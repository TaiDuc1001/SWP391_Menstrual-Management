import React from 'react';
import Badge from './Badge';

interface TagBadgeProps {
    label: string;
    className?: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({label, className = ''}) => {
    return (
        <Badge className={`text-xs font-semibold px-2 py-1 rounded ${className}`}>{label}</Badge>
    );
};

export default TagBadge;
