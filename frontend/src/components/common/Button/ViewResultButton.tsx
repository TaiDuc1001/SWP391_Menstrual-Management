import React from 'react';
import SquaredButton from './SquaredButton';

interface ViewResultsButtonProps {
    onClick?: () => void;
}

const ViewResultButton: React.FC<ViewResultsButtonProps> = ({onClick}) => (
    <SquaredButton onClick={onClick}>
        View
    </SquaredButton>
);

export default ViewResultButton;

