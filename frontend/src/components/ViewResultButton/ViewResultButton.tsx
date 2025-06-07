import React from 'react';
import SquaredButton from '../Button/SquaredButton';

interface ViewResultsButtonProps {
  onClick?: () => void;
}

const ViewResultButton: React.FC<ViewResultsButtonProps> = ({ onClick }) => (
  <SquaredButton onClick={onClick}>
    View results
  </SquaredButton>
);

export default ViewResultButton;
