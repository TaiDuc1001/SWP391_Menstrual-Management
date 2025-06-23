import React, {useEffect, useState, useRef} from 'react';
import Popup from './ExitPopup';
import {useNavigate} from 'react-router-dom';
import api from '../../../api/axios';
import { exportNodeToPDF } from '../../../utils/exportPdf';

interface TestResultPopupProps {
    onClose: () => void;
    examinationId?: number;
}

const TestResultPopup: React.FC<TestResultPopupProps> = ({onClose, examinationId}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<any>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const printableRef = useRef<HTMLDivElement>(null);

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

    const handleDownloadPDF = async () => {
        if (printableRef.current) {
            await exportNodeToPDF(printableRef.current, `TestResult_${code}.pdf`);
        }
    };

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
            <div style={{position: 'absolute', left: '-9999px', top: 0}}>
                <div ref={printableRef} style={{ fontFamily: 'Arial, Helvetica, sans-serif', padding: 32, color: '#111', minWidth: 700, background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px #0002', maxWidth: 700, margin: '0 auto' }}>
                    <div style={{ fontSize: 16, marginBottom: 8 }}><span style={{fontWeight:600}}>Doctor:</span> <span>{staffName}</span></div>
                    <div style={{ fontSize: 16, marginBottom: 8 }}><span style={{fontWeight:600}}>Date:</span> <span>{testDate}</span></div>
                    <div style={{ fontSize: 16, marginBottom: 8 }}><span style={{fontWeight:600}}>Time:</span> <span>{testTime}</span></div>
                    <div style={{ fontSize: 16, marginBottom: 8 }}><span style={{fontWeight:600}}>Type:</span> <span>{panels}</span></div>
                    <div style={{ fontSize: 16, marginBottom: 8 }}><span style={{fontWeight:600}}>Code:</span> <span>{code}</span></div>
                    <div style={{ fontSize: 16, marginBottom: 24 }}><span style={{fontWeight:600}}>Note:</span> <span>{result?.note || '-'}</span></div>
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, marginTop: 24, color: '#222' }}>Detailed result table:</div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, marginBottom: 16, tableLayout: 'fixed', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px #0001' }}>
                        <colgroup>
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '20%' }} />
                        </colgroup>
                        <thead style={{ background: '#f1f5f9' }}>
                        <tr>
                            <th style={{ textAlign: 'left', fontWeight: 600, padding: 8 }}>Item</th>
                            <th style={{ textAlign: 'left', fontWeight: 600, padding: 8 }}>Result</th>
                            <th style={{ textAlign: 'left', fontWeight: 600, padding: 8 }}>Normal range</th>
                            <th style={{ textAlign: 'left', fontWeight: 600, padding: 8 }}>Test index</th>
                            <th style={{ textAlign: 'left', fontWeight: 600, padding: 8 }}>Note</th>
                        </tr>
                        </thead>
                        <tbody>
                        {testResults.length > 0 ? (
                            testResults.map((tr: any, idx: number) => (
                                <tr key={idx}>
                                    <td style={{ padding: 8, verticalAlign: 'top', wordBreak: 'break-word', whiteSpace: 'pre-line', borderBottom: '1px solid #eee' }}>{tr.name}</td>
                                    <td style={{ padding: 8, verticalAlign: 'top', wordBreak: 'break-word', whiteSpace: 'pre-line', borderBottom: '1px solid #eee' }}>{tr.diagnosis === true ? 'Positive' : tr.diagnosis === false ? 'Negative' : '-'}</td>
                                    <td style={{ padding: 8, verticalAlign: 'top', wordBreak: 'break-word', whiteSpace: 'pre-line', borderBottom: '1px solid #eee' }}>{tr.normalRange || '-'}</td>
                                    <td style={{ padding: 8, verticalAlign: 'top', wordBreak: 'break-word', whiteSpace: 'pre-line', borderBottom: '1px solid #eee' }}>{tr.testIndex || '-'}</td>
                                    <td style={{ padding: 8, verticalAlign: 'top', wordBreak: 'break-word', whiteSpace: 'pre-line', borderBottom: '1px solid #eee' }}>{tr.note || ''}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ padding: 8, textAlign: 'center', color: '#888' }}>No test results available.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    {testResults.some((tr: any) => tr.diagnosis === true)}
                </div>
            </div>
            <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors text-2xl z-10 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full bg-white shadow-md w-10 h-10 flex items-center justify-center"
                onClick={onClose}
                aria-label="Close"
            >
                &times;
            </button>
            <div ref={contentRef}>
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
                    {testResults.some((tr: any) => tr.diagnosis === true)}
                    <div className="flex gap-3 mt-4 justify-end">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600"
                            onClick={handleDownloadPDF}
                        >Download PDF
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
