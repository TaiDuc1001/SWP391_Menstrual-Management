import React from 'react';
import Popup from './Popup';

interface TestResultPopupProps {
  onClose: () => void;
}

const TestResultPopup: React.FC<TestResultPopupProps> = ({ onClose }) => {
  return (
    <Popup open={true} onClose={onClose} className="w-full max-w-2xl p-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-gray-700 mb-1">DETAILED TEST RESULT</div>
            <div className="text-sm text-gray-500">Code: <span className="bg-blue-100 text-blue-600 rounded px-2 py-0.5">STXN-20250522-001</span></div>
          </div>
          <div className="text-green-600 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Completed
          </div>
        </div>
        <div className="mb-2 text-sm text-gray-600 flex gap-8">
          <div>Test date: <span className="font-medium text-gray-800">22/05/2025</span></div>
          <div>Examiner: <span className="font-medium text-gray-800">Staff XYZ</span></div>
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
                <td className="p-2 text-red-600 font-semibold flex items-center gap-1">Positive <span className="ml-1">⚠️</span></td>
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
          <div className="flex gap-3 mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600">Download PDF</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600">Book consultation</button>
            <button className="bg-yellow-400 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-500">Review</button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default TestResultPopup;
