import React from 'react';
import TitleBar from './TitleBar';

interface TestingTitleBarProps {
  title: string;
  onNewOrder: () => void;
  newOrderIcon: React.ReactNode;
}

const TestingTitleBar: React.FC<TestingTitleBarProps> = ({ title, onNewOrder, newOrderIcon }) => (
  <TitleBar
    text={title}
    buttonLabel={
      <span className="flex items-center gap-2">
        {newOrderIcon}
        New order
      </span>
    }
    onButtonClick={onNewOrder}
  />
);

export default TestingTitleBar;
