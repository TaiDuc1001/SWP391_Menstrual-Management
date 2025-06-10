import React from 'react';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';

interface TestResultPopupProps {
  onClose: () => void;
}

const TestResultPopup: React.FC<TestResultPopupProps> = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <Popup open={true} onClose={onClose} className="w-full max-w-6xl p-8 relative">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-2xl z-10 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full bg-white shadow-md w-10 h-10 flex items-center justify-center"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <div>
        <div className="mb-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
            <span className="w-10 h-10 rounded-full bg-gray-300 block"></span>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-700 mb-1">DETAILED TEST RESULT</div>
            <div className="text-sm text-gray-500">Code: <span className="bg-blue-100 text-blue-600 rounded px-2 py-0.5">STXN-20250522-001</span></div>
          </div>
        </div>
        <div className="mb-2 text-sm text-gray-600 flex gap-8">
          <div>Test date: <span className="font-medium text-gray-800">22/05/2025</span></div>
          <div>Test time: <span className="font-medium text-gray-800">09:00 - 11:00</span></div>
          <div>Staff: <span className="font-medium text-gray-800">Staff XYZ</span></div>
          <div>Type: <span className="font-medium text-gray-800">HIV, Gonorrhea, Syphilis</span></div>
        </div>
        <div className="mt-4">
          <div className="font-semibold text-gray-700 mb-2">Detailed result table</div>
          <table className="w-full text-sm border rounded overflow-hidden mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 font-medium">Item</th>
                <th className="p-2 font-medium">Result</th>
                <th className="p-2 font-medium">Normal range</th>
                <th className="p-2 font-medium">Test index</th>
                <th className="p-2 font-medium">Normal range</th>
                <th className="p-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">HIV Ag/Ab Combo</td>
                <td className="p-2">Negative</td>
                <td className="p-2">Negative</td>
                <td className="p-2">S/CO = 0.38</td>
                <td className="p-2">S/CO {'<'} 1.0</td>
                <td className="p-2"></td>
              </tr>
              <tr>
                <td className="p-2">Syphilis (TPHA)</td>
                <td className="p-2">Negative</td>
                <td className="p-2">Negative</td>
                <td className="p-2">Not detected</td>
                <td className="p-2">Negative</td>
                <td className="p-2"></td>
              </tr>
              <tr className="bg-red-50">
                <td className="p-2">Gonorrhea</td>
                <td className="p-2 text-red-600 font-semibold">
                  <div className="flex items-center h-full min-h-[32px]">{/* min-h to help vertical align */}
                    <span>Positive</span>
                    <span className="text-xl flex items-center ml-1">⚠️</span>
                  </div>
                </td>
                <td className="p-2">Negative</td>
                <td className="p-2">A450 = 1.12 (PCR)</td>
                <td className="p-2">A450 {'≤'} 0.2</td>
                <td className="p-2 text-red-500 font-semibold">Need consultation & treatment</td>
              </tr>
            </tbody>
          </table>
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded mb-4 flex items-center gap-3">
            <span className="text-orange-500 text-xl">⚠️</span>
            <span className="text-orange-700 font-medium">You have a positive result for Gonorrhea</span>
            <span className="text-gray-600">Please schedule a consultation soon for timely treatment support.</span>
          </div>
          <div className="flex gap-3 mt-4 justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600">Download PDF</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600" onClick={() => navigate('/appointments/book')}>Book consultation</button>
            <button className="bg-yellow-400 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-500">Review</button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default TestResultPopup;
