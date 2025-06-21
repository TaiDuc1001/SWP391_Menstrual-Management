import React, { useEffect, useState } from 'react';
import Popup from './ExitPopup';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import jsPDF from 'jspdf';

interface TestResultPopupProps {
  onClose: () => void;
  examinationId?: number;
}

const TestResultPopup: React.FC<TestResultPopupProps> = ({ onClose, examinationId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    console.log('TestResultPopup: examinationId =', examinationId);
    if (!examinationId) {
      console.log('TestResultPopup: No examinationId provided, skipping fetch.');
      return;
    }
    setLoading(true);
    api.get(`/examinations/${examinationId}`)
      .then(res => {
        console.log('TestResultPopup: API response =', res);
        console.log('TestResultPopup: result =', res.data);
        setResult(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('TestResultPopup: API error', err);
        setError('Could not fetch test result.');
        setLoading(false);
      });
  }, [examinationId]);

  if (loading) return <Popup open={true} onClose={onClose}><div className="p-8 text-center">Loading...</div></Popup>;
  if (!result) return <Popup open={true} onClose={onClose}><div className="p-8 text-center">{'No result found.'}</div></Popup>;

  // Map API response to UI fields
  const code = result.id;
  const testDate = result.date ? new Date(result.date).toLocaleDateString('en-GB') : '-';
  const testTime = result.timeRange || result.slot || '-';
  const staffName = result.staffName || '-';
  const panels = result.panelName || '-';
  const testResults = Array.isArray(result.testResults) ? result.testResults : [];

  // PDF download handler
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(16);
    doc.text('Detailed Test Result', 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Code: ${code}`, 10, y);
    y += 8;
    doc.text(`Test date: ${testDate}`, 10, y);
    y += 8;
    doc.text(`Test time: ${testTime}`, 10, y);
    y += 8;
    doc.text(`Staff: ${staffName}`, 10, y);
    y += 8;
    doc.text(`Type: ${panels}`, 10, y);
    y += 12;
    doc.setFontSize(14);
    doc.text('Detailed result table:', 10, y);
    y += 8;
    doc.setFontSize(11);
    // Table header
    doc.text('Item', 10, y, { maxWidth: 38 });
    doc.text('Result', 50, y, { maxWidth: 28 });
    doc.text('Normal range', 80, y, { maxWidth: 38 });
    doc.text('Test index', 120, y, { maxWidth: 28 });
    doc.text('Note', 150, y, { maxWidth: 50 });
    y += 6;
    // Table rows with wrapping
    testResults.forEach((tr: any) => {
      const item = tr.name || '-';
      const result = tr.diagnosis === true ? 'Positive' : tr.diagnosis === false ? 'Negative' : '-';
      const normalRange = tr.normalRange || '-';
      const testIndex = tr.testIndex ? String(tr.testIndex) : '-';
      const note = tr.note || '-';
      // Calculate max lines needed for this row
      const itemLines = doc.splitTextToSize(item, 38);
      const resultLines = doc.splitTextToSize(result, 28);
      const normalRangeLines = doc.splitTextToSize(normalRange, 38);
      const testIndexLines = doc.splitTextToSize(testIndex, 28);
      const noteLines = doc.splitTextToSize(note, 50);
      const maxLines = Math.max(itemLines.length, resultLines.length, normalRangeLines.length, testIndexLines.length, noteLines.length);
      for (let i = 0; i < maxLines; i++) {
        doc.text(itemLines[i] || '', 10, y, { maxWidth: 38 });
        doc.text(resultLines[i] || '', 50, y, { maxWidth: 28 });
        doc.text(normalRangeLines[i] || '', 80, y, { maxWidth: 38 });
        doc.text(testIndexLines[i] || '', 120, y, { maxWidth: 28 });
        doc.text(noteLines[i] || '', 150, y, { maxWidth: 50 });
        y += 6;
        if (y > 270 && i < maxLines - 1) {
          doc.addPage();
          y = 10;
        }
      }
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });
    // Warning if any positive
    if (testResults.some((tr: any) => tr.diagnosis === true)) {
      y += 10;
      doc.setTextColor(255, 140, 0);
      doc.text('⚠️ You have a positive result. Please schedule a consultation soon for timely treatment support.', 10, y, { maxWidth: 180 });
      doc.setTextColor(0, 0, 0);
    }
    doc.save(`TestResult_${code}.pdf`);
  };

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
            <div className="text-sm text-gray-500">Code: <span className="bg-blue-100 text-blue-600 rounded px-2 py-0.5">{code}</span></div>
          </div>
        </div>
        <div className="mb-2 text-sm text-gray-600 flex gap-8">
          <div>Test date: <span className="font-medium text-gray-800">{testDate}</span></div>
          <div>Test time: <span className="font-medium text-gray-800">{testTime}</span></div>
          <div>Staff: <span className="font-medium text-gray-800">{staffName}</span></div>
          <div>Type: <span className="font-medium text-gray-800">{panels}</span></div>
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
                <th className="p-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {testResults.length > 0 ? (
                testResults.map((tr: any, idx: number) => (
                  <tr key={idx}>
                    <td className="p-2">{tr.name}</td>
                    <td className="p-2">{tr.diagnosis === true ? 'Positive' : tr.diagnosis === false ? 'Negative' : '-'}</td>
                    <td className="p-2">{tr.normalRange || '-'}</td>
                    <td className="p-2">{tr.testIndex || '-'}</td>
                    <td className="p-2">{tr.note || ''}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-2 text-center text-gray-400">No test results available.</td></tr>
              )}
            </tbody>
          </table>
          {/* Optionally, show a warning if any result is positive */}
          {testResults.some((tr: any) => tr.diagnosis === true) && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded mb-4 flex items-center gap-3">
              <span className="text-orange-500 text-xl">⚠️</span>
              <span className="text-orange-700 font-medium">You have a positive result. Please schedule a consultation soon for timely treatment support.</span>
            </div>
          )}
          <div className="flex gap-3 mt-4 justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600" onClick={handleDownloadPDF}>Download PDF</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600" onClick={() => navigate('/appointments/book')}>Book consultation</button>
            <button className="bg-yellow-400 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-500">Review</button>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default TestResultPopup;
