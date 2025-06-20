import React from 'react';

interface TitleBarProps {
  text: string;
  buttonLabel: React.ReactNode;
  onButtonClick: () => void;
}

const TitleBar: React.FC<TitleBarProps> = ({ text, buttonLabel, onButtonClick }) => (
  <div className="bg-white p-4 rounded shadow w-full mb-6 flex justify-between items-center">
    <h1 className="text-2xl font-bold text-pink-600">{text}</h1>
    <button onClick={onButtonClick} className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
      {buttonLabel}
    </button>
  </div>
);

export default TitleBar;
