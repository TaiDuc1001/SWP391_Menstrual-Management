import React from 'react';

interface UtilityBarProps {
  children: React.ReactNode;
}

const UtilityBar: React.FC<UtilityBarProps> = ({ children }) => (
  <div className="mb-4 flex space-x-4 w-full" style={{ maxWidth: '100%' }}>
    {children}
  </div>
);

export default UtilityBar;
