import React from 'react';

interface RatingProps {
    score: number;
    maxScore?: number;
    showText?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const Rating: React.FC<RatingProps> = ({ 
    score, 
    maxScore = 5, 
    showText = true,
    size = 'medium'
}) => {
    const renderStars = () => {
        return Array.from({ length: maxScore }, (_, index) => (
            <span
                key={index}
                className={`
                    ${index < score ? 'text-yellow-400' : 'text-gray-300'}
                    ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-xl' : 'text-base'}
                `}
            >
                ★
            </span>
        ));
    };

    const getRatingText = (score: number) => {
        if (score === 1) return 'Poor';
        if (score === 2) return 'Fair';
        if (score === 3) return 'Good';
        if (score === 4) return 'Very Good';
        if (score === 5) return 'Excellent';
        return '';
    };

    return (
        <div className="rating-display">
            <div className="stars">
                {renderStars()}
            </div>
            {showText && score > 0 && (
                <span className={`rating-text ${size === 'small' ? 'text-xs' : 'text-sm'} text-gray-600 ml-1`}>
                    {getRatingText(score)} ({score}/{maxScore})
                </span>
            )}
        </div>
    );
};

export default Rating;

