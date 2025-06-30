import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExaminationDetail } from '../../../api/hooks';
import { TestResult } from '../../../api/services';
import StatusBadge from '../../../components/common/Badge/StatusBadge';
import calendarIcon from '../../../assets/icons/calendar.svg';
import clockIcon from '../../../assets/icons/clock.svg';
import userIcon from '../../../assets/icons/profile.svg';
import testIcon from '../../../assets/icons/tube.svg';
import { exportNodeToPDF } from '../../../utils/exportPdf';

const ExaminationDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { examination, loading, error } = useExaminationDetail(id);
    const printableRef = useRef<HTMLDivElement>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const getResultIndicator = (diagnosis: boolean, testIndex: string, normalRange: string) => {
        if (diagnosis) {
            return (
                <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            ⚠️ Positive
          </span>
                    <span className="text-red-600 text-sm">Requires attention</span>
                </div>
            );
        }

        const isNumeric = !isNaN(parseFloat(testIndex));
        if (isNumeric && normalRange) {
            const value = parseFloat(testIndex);
            let isNormal = false;

            if (normalRange.includes('<')) {
                const threshold = parseFloat(normalRange.replace('<', '').trim());
                isNormal = value < threshold;
            } else if (normalRange.includes('>')) {
                const threshold = parseFloat(normalRange.replace('>', '').trim());
                isNormal = value > threshold;
            } else if (normalRange.includes('-')) {
                const [min, max] = normalRange.split('-').map(s => parseFloat(s.trim()));
                isNormal = value >= min && value <= max;
            } else {
                const ranges = normalRange.match(/(\d+\.?\d*)/g);
                if (ranges && ranges.length >= 2) {
                    const min = parseFloat(ranges[0]);
                    const max = parseFloat(ranges[1]);
                    isNormal = value >= min && value <= max;
                }
            }

            return (
                <div className="flex items-center space-x-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isNormal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isNormal ? '✅ Normal' : '⚠️ Outside Range'}
        </span>
                </div>
            );
        }

        return (
            <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        ✅ Negative
      </span>
        );
    };

    const handleDownloadPDF = async () => {
        if (printableRef.current && examination) {
            await exportNodeToPDF(printableRef.current, `ExaminationResult_${examination.id}.pdf`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading examination details...</p>
                </div>
            </div>
        );
    }

    if (error || !examination) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-4">{error || 'Examination not found'}</p>
                    <button
                        onClick={() => navigate('/customer/sti-tests')}
                        className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        Back to STI Tests
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div style={{position: 'absolute', left: '-9999px', top: 0}}>
                <div ref={printableRef} style={{
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    padding: 32,
                    color: '#111',
                    minWidth: 700,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 2px 16px #0002',
                    maxWidth: 700,
                    margin: '0 auto'
                }}>
                    <div style={{fontSize: 16, marginBottom: 8}}>
                        <span style={{fontWeight: 600}}>Doctor:</span> <span>{examination?.staffName || '-'}</span>
                    </div>
                    <div style={{fontSize: 16, marginBottom: 8}}>
                        <span style={{fontWeight: 600}}>Date:</span> <span>{examination?.date ? formatDate(examination.date) : '-'}</span>
                    </div>
                    <div style={{fontSize: 16, marginBottom: 8}}>
                        <span style={{fontWeight: 600}}>Time:</span> <span>{examination?.timeRange || '-'}</span>
                    </div>
                    <div style={{fontSize: 16, marginBottom: 8}}>
                        <span style={{fontWeight: 600}}>Type:</span> <span>{examination?.panelName || 'STI Test Panel'}</span>
                    </div>
                    <div style={{fontSize: 16, marginBottom: 8}}>
                        <span style={{fontWeight: 600}}>Code:</span> <span>{examination?.id ? `EXM-${examination.id.toString().padStart(4, '0')}` : '-'}</span>
                    </div>
                    <div style={{
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 8,
                        marginTop: 24,
                        color: '#222'
                    }}>Detailed result table:
                    </div>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: 15,
                        marginBottom: 16,
                        tableLayout: 'fixed',
                        borderRadius: 8,
                        overflow: 'hidden',
                        boxShadow: '0 1px 4px #0001'
                    }}>
                        <colgroup>
                            <col style={{width: '20%'}}/>
                            <col style={{width: '20%'}}/>
                            <col style={{width: '20%'}}/>
                            <col style={{width: '20%'}}/>
                            <col style={{width: '20%'}}/>
                        </colgroup>
                        <thead style={{background: '#f1f5f9'}}>
                        <tr>
                            <th style={{
                                textAlign: 'left',
                                fontWeight: 600,
                                padding: 8
                            }}>Item</th>
                            <th style={{
                                textAlign: 'left',
                                fontWeight: 600,
                                padding: 8
                            }}>Result</th>
                            <th style={{
                                textAlign: 'left',
                                fontWeight: 600,
                                padding: 8
                            }}>Value</th>
                            <th style={{
                                textAlign: 'left',
                                fontWeight: 600,
                                padding: 8
                            }}>Normal range</th>
                            <th style={{
                                textAlign: 'left',
                                fontWeight: 600,
                                padding: 8
                            }}>Note</th>
                        </tr>
                        </thead>
                        <tbody>
                            {examination?.testResults && examination.testResults.length > 0 ? (
                            examination.testResults.map((tr: TestResult, idx: number) => (
                                <tr key={idx}>
                                    <td style={{
                                        padding: 8,
                                        verticalAlign: 'top',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-line',
                                        borderBottom: '1px solid #eee'
                                    }}>{tr.name}</td>
                                    <td style={{
                                        padding: 8,
                                        verticalAlign: 'top',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-line',
                                        borderBottom: '1px solid #eee'
                                    }}>{tr.diagnosis === true ? 'Positive' : tr.diagnosis === false ? 'Negative' : '-'}</td>
                                    <td style={{
                                        padding: 8,
                                        verticalAlign: 'top',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-line',
                                        borderBottom: '1px solid #eee'
                                    }}>{tr.testIndex || '-'}</td>
                                    <td style={{
                                        padding: 8,
                                        verticalAlign: 'top',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-line',
                                        borderBottom: '1px solid #eee'
                                    }}>{tr.normalRange || '-'}</td>
                                    <td style={{
                                        padding: 8,
                                        verticalAlign: 'top',
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-line',
                                        borderBottom: '1px solid #eee'
                                    }}>{tr.note || ''}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{
                                    padding: 8,
                                    textAlign: 'center',
                                    color: '#888'
                                }}>No test results available.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    {examination?.testResults && examination.testResults.some((tr: TestResult) => tr.diagnosis === true) && (
                        <div style={{
                            background: '#fff7ed',
                            borderLeft: '4px solid #fb923c',
                            padding: 16,
                            borderRadius: 8,
                            marginBottom: 16,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        }}>
                        </div>
                    )}
                    
                    {examination?.overallNote && (
                        <div style={{marginTop: 24}}>
                            <div style={{
                                fontSize: 18,
                                fontWeight: 600,
                                marginBottom: 12,
                                color: '#222'
                            }}>Medical Assessment & Recommendations:</div>
                            <div style={{
                                background: examination?.testResults && examination.testResults.some((tr: TestResult) => tr.diagnosis === true) ? '#fff7ed' : '#f0fdf4',
                                border: examination?.testResults && examination.testResults.some((tr: TestResult) => tr.diagnosis === true) ? '1px solid #fb923c' : '1px solid #22c55e',
                                borderRadius: 8,
                                padding: 16,
                                whiteSpace: 'pre-line',
                                lineHeight: 1.6,
                                fontSize: 14
                            }}>
                                {examination.overallNote}
                            </div>
                        </div>
                    )}
                    
                    <div style={{
                        marginTop: 24,
                        padding: 16,
                        background: '#f8fafc',
                        borderRadius: 8,
                        fontSize: 12,
                        color: '#64748b',
                        borderLeft: '4px solid #3b82f6'
                    }}>
                        <strong>Medical Disclaimer:</strong> This assessment is provided for informational purposes and should not replace professional medical consultation. Please discuss these results with your healthcare provider for proper medical advice and treatment planning.
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/customer/sti-tests')}
                        className="flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-4"
                    >
                        <span className="mr-2">←</span>
                        Back to STI Tests
                    </button>

                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Examination Details</h1>
                                <p className="text-gray-600 mt-1">EXM-{examination.id.toString().padStart(4, '0')}</p>
                            </div>
                            <StatusBadge status={examination.examinationStatus}/>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Examination Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-pink-100 p-3 rounded-lg">
                                        <img src={calendarIcon} alt="Date" className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Test Date</p>
                                        <p className="font-semibold text-gray-800">{formatDate(examination.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <img src={clockIcon} alt="Time" className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Time Slot</p>
                                        <p className="font-semibold text-gray-800">{examination.timeRange}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <img src={userIcon} alt="Staff" className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Staff Member</p>
                                        <p className="font-semibold text-gray-800">{examination.staffName || 'Not assigned'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <img src={testIcon} alt="Panel" className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Test Panel</p>
                                        <p className="font-semibold text-gray-800">{examination.panelName || 'STI Test Panel'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {examination.examinationStatus.toLowerCase() === 'completed' && examination.testResults && examination.testResults.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Results</h2>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Test Item
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Result
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Value
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Normal Range
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Note
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {examination.testResults.map((result: TestResult, index: number) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div
                                                        className="text-sm font-medium text-gray-900">{result.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {getResultIndicator(result.diagnosis, result.testIndex, result.normalRange)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{result.testIndex}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{result.normalRange}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-500">{result.note || '-'}</div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {examination.examinationStatus.toLowerCase() === 'completed' && examination.testResults && examination.testResults.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="text-blue-500">🩺</span>
                                    Medical Assessment
                                </h2>                                {examination.testResults.some(result => result.note && result.note.trim()) && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-700 mb-3">Individual Test Notes</h3>
                                        <div className="space-y-3">
                                            {examination.testResults.filter(result => result.note && result.note.trim()).map((result, index) => (
                                                <div key={index} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-400">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-medium text-gray-800">{result.name}</h4>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            result.diagnosis 
                                                                ? 'bg-red-100 text-red-800' 
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {result.diagnosis ? 'Positive' : 'Negative'}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 text-sm leading-relaxed">{result.note}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}                                {examination.overallNote ? (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-700 mb-3">Overall Assessment & Recommendations</h3>
                                        <div className={`rounded-lg p-4 border-l-4 ${
                                            examination.testResults.some(tr => tr.diagnosis === true)
                                                ? 'bg-orange-50 border-orange-400'
                                                : 'bg-green-50 border-green-400'
                                        }`}>
                                            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                                                {examination.overallNote}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    (() => {
                                        const positiveResults = examination.testResults.filter(tr => tr.diagnosis === true);
                                        const hasPositive = positiveResults.length > 0;
                                        
                                        let generatedAssessment = '';
                                        if (hasPositive) {
                                            const recommendations = positiveResults.map(result => {
                                                const testName = result.name.toLowerCase();
                                                if (testName.includes('hiv')) {
                                                    return '⚠️ HIV screening reactive requires confirmatory testing with HIV-1/2 differentiation assay. Immediate referral to infectious disease specialist for evaluation and potential treatment initiation.';
                                                } else if (testName.includes('chlamydia')) {
                                                    return '⚠️ Chlamydia positive indicates active infection. Immediate antibiotic treatment required. Partner notification and testing essential.';
                                                } else {
                                                    return `⚠️ ${result.name} positive requires clinical correlation and appropriate medical management.`;
                                                }
                                            });
                                            generatedAssessment = recommendations.join('\n\n') + '\n\n🏥 URGENT: Schedule consultation within 24-48 hours for proper diagnosis confirmation, treatment initiation, and partner notification if applicable.';
                                        } else {
                                            generatedAssessment = '✅ All test results are within normal range. No sexually transmitted infections detected. Continue safe sexual practices and regular screening as recommended by healthcare provider.';
                                        }
                                        
                                        return (
                                            <div>
                                                <div className={`rounded-lg p-4 border-l-4 ${
                                                    hasPositive ? 'bg-orange-50 border-orange-400' : 'bg-green-50 border-green-400'
                                                }`}>
                                                    <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                                                        {generatedAssessment}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()
                                )}
                            </div>
                        )}

                        {examination.examinationStatus.toLowerCase() === 'pending' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="text-center py-8">
                                    <div className="text-orange-500 text-6xl mb-4">💳</div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Required</h3>
                                    <p className="text-gray-600 mb-4">Please complete payment to confirm your examination.</p>
                                    <button
                                        onClick={() => navigate(`/customer/vnpay-examination-checkout/${examination.id}`)}
                                        className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors font-semibold"
                                    >
                                        Complete Payment
                                    </button>
                                </div>
                            </div>
                        )}

                        {examination.examinationStatus.toLowerCase() === 'in_progress' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="text-center py-8">
                                    <div className="text-blue-500 text-6xl mb-4">🔬</div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Test in Progress</h3>
                                    <p className="text-gray-600">Your samples are currently being processed. Results
                                        will be available soon.</p>
                                </div>
                            </div>
                        )}

                        {examination.examinationStatus.toLowerCase() === 'sampled' && (
                            <div className="bg-white rounded-2xl shadow-sm p-6">
                                <div className="text-center py-8">
                                    <div className="text-yellow-500 text-6xl mb-4">⏳</div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Sample Collected</h3>
                                    <p className="text-gray-600">Your samples have been collected and sent to the
                                        laboratory for analysis.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    
                    <div className="space-y-6">
                        
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>                            <div className="space-y-3">
                                {examination.examinationStatus.toLowerCase() === 'pending' && (
                                    <button
                                        onClick={() => navigate(`/customer/vnpay-examination-checkout/${examination.id}`)}
                                        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-semibold"
                                    >
                                        Complete Payment
                                    </button>
                                )}
                                {examination.examinationStatus.toLowerCase() === 'completed' && (
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                                    >
                                        Download Results
                                    </button>
                                )}

                                <button
                                    onClick={() => navigate('/customer/sti-tests/packages')}
                                    className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors font-semibold"
                                >
                                    View Test Packages
                                </button>

                                <button
                                    onClick={() => navigate('/customer/sti-tests')}
                                    className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                                >
                                    Back to Tests
                                </button>
                            </div>
                        </div>

                        
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Timeline</h2>                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="font-medium text-gray-800">Test Scheduled</p>
                                        <p className="text-sm text-gray-500">Examination booked</p>
                                    </div>
                                </div>

                                {examination.examinationStatus.toLowerCase() !== 'pending' && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-800">Payment Completed</p>
                                            <p className="text-sm text-gray-500">Examination confirmed</p>
                                        </div>
                                    </div>
                                )}

                                {!['pending', 'in_progress'].includes(examination.examinationStatus.toLowerCase()) && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-800">Sample Collected</p>
                                            <p className="text-sm text-gray-500">Samples taken for analysis</p>
                                        </div>
                                    </div>
                                )}

                                {['examined', 'completed'].includes(examination.examinationStatus.toLowerCase()) && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-800">Results Available</p>
                                            <p className="text-sm text-gray-500">Analysis completed</p>
                                        </div>
                                    </div>
                                )}

                                {examination.examinationStatus.toLowerCase() === 'completed' && (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="font-medium text-gray-800">Test Completed</p>
                                            <p className="text-sm text-gray-500">All procedures finished</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Important Notes</h2>

                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex items-start space-x-2">
                                    <span className="text-blue-500 mt-0.5">ℹ️</span>
                                    <p>Results are for informational purposes only and should be discussed with your
                                        healthcare provider.</p>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <span className="text-yellow-500 mt-0.5">⚠️</span>
                                    <p>If you have any concerns about your results, please consult with a medical
                                        professional.</p>
                                </div>

                                <div className="flex items-start space-x-2">
                                    <span className="text-green-500 mt-0.5">📞</span>
                                    <p>Contact our support team if you have questions about your test or results.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExaminationDetail;
