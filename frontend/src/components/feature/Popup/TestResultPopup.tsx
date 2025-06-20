import React, {useEffect, useState} from 'react';
import Popup from './ExitPopup';
import {useNavigate} from 'react-router-dom';
import api from '../../../api/axios';

interface TestResultPopupProps {
    onClose: () => void;
    examinationId?: number;
}

const TestResultPopup: React.FC<TestResultPopupProps> = ({onClose, examinationId}) => {
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

    if (loading) return <Popup open={true} onClose={onClose}>
        <div className="p-8 text-center">Loading...</div>
    </Popup>;
    if (!result) return <Popup open={true} onClose={onClose}>
        <div className="p-8 text-center">{'No result found.'}</div>
    </Popup>;

    const code = result.id;
    const testDate = result.date ? new Date(result.date).toLocaleDateString('en-GB') : '-';
    const testTime = result.timeRange || result.slot || '-';
    const staffName = result.staffName || '-';
    const panels = result.panelName || '-';
    const testResults = Array.isArray(result.testResults) ? result.testResults : [];

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
                    <div
                        className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                        <span className="w-10 h-10 rounded-full bg-gray-300 block"></span>
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-gray-700 mb-1">DETAILED TEST RESULT</div>
                        <div className="text-sm text-gray-500">Code: <span
                            className="bg-blue-100 text-blue-600 rounded px-2 py-0.5">{code}</span></div>
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
                            <tr>
                                <td colSpan={5} className="p-2 text-center text-gray-400">No test results available.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    {testResults.some((tr: any) => tr.diagnosis === true) && (
                        <div
                            className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded mb-4 flex items-center gap-3">
                            <span className="text-orange-500 text-xl">⚠️</span>
                            <span className="text-orange-700 font-medium">You have a positive result. Please schedule a consultation soon for timely treatment support.</span>
                        </div>
                    )}
                    <div className="flex gap-3 mt-4 justify-end">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600">Download
                            PDF
                        </button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded font-semibold hover:bg-green-600"
                                onClick={() => navigate('/customer/appointments/book')}>Book consultation
                        </button>
                        <button
                            className="bg-yellow-400 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-500">Review
                        </button>
                    </div>
                </div>
            </div>
        </Popup>
    );
};

export default TestResultPopup;
