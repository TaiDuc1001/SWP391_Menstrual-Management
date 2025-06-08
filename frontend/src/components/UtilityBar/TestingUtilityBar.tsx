import React from 'react';
import UtilityBar from './UtilityBar';

interface TestingUtilityBarProps {
  children: React.ReactNode;
}

const TestingUtilityBar: React.FC<TestingUtilityBarProps> = ({ children }) => (
  <UtilityBar>
    {children}
  </UtilityBar>
);

export default TestingUtilityBar;
