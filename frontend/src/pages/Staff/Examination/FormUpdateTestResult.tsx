import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { getCurrentStaffId } from '../../../utils/auth';

interface TestDetail {
    id: string;
    name: string;
    result: string;
    normal: string;
    value: string;
    normalValue: string;
    note: string;
    unit: string;
    isBoolean: boolean;
}

interface SampledData {
    id: number;
    date: string;
    timeRange: string;
    customerName: string;
    staffName: string;
    examinationStatus: string;
    panelId?: number;
}

interface FormUpdateTestResultProps {
    open: boolean;
    onClose: () => void;
    request: any;
    onUpdateSuccess?: () => void;
}

const FormUpdateTestResult: React.FC<FormUpdateTestResultProps> = ({open, onClose, request, onUpdateSuccess}) => {
    const [details, setDetails] = useState<TestDetail[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [note, setNote] = useState('');
    const [sampledData, setSampledData] = useState<SampledData | null>(null);
    const [panelId, setPanelId] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        if (!(open && request?.id)) return;
        let isMounted = true;
        const fetchSampledData = async () => {
            try {
                const response = await api.get(`/examinations/${request.id}`);
                if (isMounted) {
                    setSampledData(response.data);
                    if (response.data && response.data.panelId) {
                        setPanelId(response.data.panelId);
                    }
                }
            } catch (error) {
                setError('Unable to fetch test sample data.');
            }
        };
        fetchSampledData();
        return () => {
            isMounted = false;
        };
    }, [open, request?.id]);

    useEffect(() => {
        if (!panelId) return;
        let isMounted = true;
        const fetchPanelTestTypes = async () => {
            try {
                const response = await api.get(`/panels/${panelId}`);
                const panel = response.data;
                const testTypesNames = panel.testTypesNames || [];
                const testTypesNormalRanges = panel.testTypesNormalRanges || [];
                const testTypesUnits = panel.testTypesUnits || [];
                const testTypesIds = panel.testTypesIds || [];
                if (isMounted) {
                    setDetails(testTypesNames.map((name: string, idx: number) => {
                        const unit = testTypesUnits[idx] || '';
                        const isBoolean = unit.toLowerCase() === 'boolean';
                        return {
                            id: testTypesIds[idx]?.toString() || '',
                            name,
                            result: '',
                            normal: testTypesNormalRanges[idx] || '',
                            value: '',
                            normalValue: testTypesNormalRanges[idx] || '',
                            note: '',
                            unit,
                            isBoolean,
                        };
                    }));
                }
            } catch (error) {
                setError('Unable to fetch test items from the package.');
            }
        };
        fetchPanelTestTypes();
        return () => {
            isMounted = false;
        };
    }, [panelId]);
    const validateForm = (): boolean => {
        for (const detail of details) {
            if (detail.isBoolean) {
                if (!detail.result) {
                    setError('Please select result for all boolean test items.');
                    return false;
                }
            } else {
                if (!detail.value) {
                    setError('Please enter test index for all numerical test items.');
                    return false;
                }
                if (isNaN(Number(detail.value))) {
                    setError('Test index must be a valid number.');
                    return false;
                }
            }
        }
        setError('');
        return true;
    };
    const evaluateResult = (value: string, normalRange: string): string => {
        if (!value || !normalRange) return '';
        
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return '';

        if (normalRange.includes('<')) {
            const threshold = parseFloat(normalRange.replace('<', '').trim());
            return numValue < threshold ? 'Negative' : 'Positive';
        } else if (normalRange.includes('>')) {
            const threshold = parseFloat(normalRange.replace('>', '').trim());
            return numValue > threshold ? 'Negative' : 'Positive';
        } else if (normalRange.includes('-')) {
            const [min, max] = normalRange.split('-').map(s => parseFloat(s.trim()));
            return (numValue >= min && numValue <= max) ? 'Negative' : 'Positive';
        }
        
        return '';
    };
    const generateSpecificRecommendation = (abnormalResults: TestDetail[]): string => {
        const recommendations: string[] = [];
        
        abnormalResults.forEach(result => {
            const testName = result.name.toLowerCase();
            
            if (testName.includes('chlamydia') && testName.includes('pcr')) {
                recommendations.push('⚠️ Chlamydia PCR positive indicates active chlamydia infection. Immediate antibiotic treatment (azithromycin or doxycycline) is required. Partner notification and testing essential.');
            } else if (testName.includes('chlamydia') && testName.includes('igm')) {
                recommendations.push('⚠️ Chlamydia IgM elevated suggests recent or active chlamydia infection. Consider confirmatory PCR testing and antibiotic treatment if clinically indicated.');
            } else if (testName.includes('gonorrhea') || testName.includes('gonorrhoea')) {
                recommendations.push('⚠️ Gonorrhea positive requires immediate dual antibiotic therapy (ceftriaxone + azithromycin). Partner treatment and retesting in 3 months recommended.');
            } else if (testName.includes('hiv')) {
                recommendations.push('⚠️ HIV screening reactive requires confirmatory testing with HIV-1/2 differentiation assay. Immediate referral to infectious disease specialist for evaluation and potential treatment initiation.');
            } else if (testName.includes('syphilis') || testName.includes('vdrl') || testName.includes('rpr')) {
                recommendations.push('⚠️ Syphilis screening positive requires confirmatory treponemal testing and staging. Penicillin-based treatment regimen depends on disease stage.');
            } else if (testName.includes('hepatitis b') || testName.includes('hbv')) {
                recommendations.push('⚠️ Hepatitis B markers positive require liver function assessment and hepatitis B DNA quantification. Antiviral therapy may be indicated.');
            } else if (testName.includes('hepatitis c') || testName.includes('hcv')) {
                recommendations.push('⚠️ Hepatitis C antibody positive requires HCV RNA testing for active infection. Direct-acting antiviral therapy achieves >95% cure rate.');
            } else if (testName.includes('herpes') || testName.includes('hsv')) {
                recommendations.push('⚠️ Herpes simplex positive may indicate active or past infection. Antiviral therapy (acyclovir, valacyclovir) for symptom management and transmission reduction.');
            } else if (testName.includes('trichomonas')) {
                recommendations.push('⚠️ Trichomonas positive requires oral metronidazole or tinidazole treatment. Partner treatment essential to prevent reinfection.');
            } else if (testName.includes('gardnerella') || testName.includes('bacterial vaginosis')) {
                recommendations.push('⚠️ Bacterial vaginosis confirmed requires metronidazole or clindamycin treatment. Consider probiotics for recurrence prevention.');
            } else if (testName.includes('candida') || testName.includes('yeast')) {
                recommendations.push('⚠️ Candida/yeast infection confirmed requires antifungal treatment (fluconazole oral or topical azoles). Address predisposing factors.');
            } else {
                recommendations.push(`⚠️ ${result.name} abnormal (value: ${result.value || 'positive'}) requires clinical correlation and appropriate medical management.`);
            }
        });
        
        let finalRecommendation = recommendations.join('\n\n');
        finalRecommendation += '\n\n\n🏥 URGENT: Schedule consultation within 24-48 hours for proper diagnosis confirmation, treatment initiation, and partner notification if applicable. Avoid sexual contact until treatment completion and clearance.';
        
        return finalRecommendation;
    };

    const evaluateOverallResult = (): { hasAbnormal: boolean, recommendation: string, isIncomplete: boolean } => {
        const incompleteResults = details.filter(detail => {
            if (detail.isBoolean) {
                return !detail.result;
            } else {
                return !detail.value;
            }
        });
        
        const abnormalResults = details.filter(detail => detail.result === 'Positive');
        const hasAbnormal = abnormalResults.length > 0;
        const isIncomplete = incompleteResults.length > 0;
        
        if (isIncomplete) {
            return {
                hasAbnormal: false,
                recommendation: "Please complete all test results before assessment can be generated.",
                isIncomplete: true
            };
        }
        
        if (!hasAbnormal) {
            return {
                hasAbnormal: false,
                recommendation: "✅ All test results are within normal range. No sexually transmitted infections detected. Continue safe sexual practices, regular screening as recommended by healthcare provider, and maintain good reproductive health habits.",
                isIncomplete: false
            };
        }
        
        return {
            hasAbnormal: true,
            recommendation: generateSpecificRecommendation(abnormalResults),
            isIncomplete: false
        };
    };const handleSubmit = async () => {
        if (!validateForm()) return;        try {
            const overallResult = evaluateOverallResult();
            const finalNote = note.trim() 
                ? `${note}\n\nOverall Assessment: ${overallResult.recommendation}`
                : overallResult.recommendation;
                
            const testResults = details.map(detail => ({
                testTypeId: parseInt(detail.id),
                name: detail.name,
                diagnosis: detail.result === 'Positive',
                testIndex: detail.value,
                normalRange: detail.normalValue,
                note: detail.note
            }));
            const payload = {
                id: sampledData?.id,
                date: sampledData?.date,
                timeRange: sampledData?.timeRange,
                testResults: testResults,
                customerName: sampledData?.customerName,
                staffName: sampledData?.staffName,
                examinationStatus: sampledData?.examinationStatus,
                overallNote: finalNote
            };
            
            const staffId = getCurrentStaffId();
            const url = staffId 
                ? `/examinations/examined/${request.id}?staffId=${staffId}`
                : `/examinations/examined/${request.id}`;
            const response = await api.put(url, payload);
            
            if (response.status === 200) {
                setSuccessMessage('Test results updated successfully!');
                setTimeout(() => {
                    setSuccessMessage('');
                    onClose();
                    if (onUpdateSuccess) onUpdateSuccess();
                }, 1500);
            }
        } catch (error) {
            setError('An error occurred while updating the results. Please try again.');
        }
    };

    if (!open) return null;
    const handleDetailChange = (idx: number, key: keyof TestDetail, value: string) => {
        setDetails(prev => prev.map((d, i) => {
            if (i !== idx) return d;
            
            const updated = {...d, [key]: value};
            
            if (key === 'value' && !updated.isBoolean) {
                if (value && !isNaN(Number(value))) {
                    updated.result = evaluateResult(value, updated.normalValue);
                } else {
                    updated.result = '';
                }
            }
            
            return updated;
        }));
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div
                className="bg-white rounded-2xl shadow-xl w-[1000px] max-w-full p-8 relative max-h-screen overflow-y-auto">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
                )}
                {successMessage && (
                    <div
                        className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center justify-center">
                        <img src={require('../../../assets/icons/green-check.svg').default} alt="success"
                             className="w-5 h-5 mr-2"/>
                        {successMessage}
                    </div>
                )}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={require('../../../assets/icons/testing.svg').default} alt="icon" className="w-6 h-6"/>
                        <span className="text-lg font-bold">Update Test Results</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Test Date:</div>
                            <div className="font-semibold">{sampledData?.date || '22/06/2025'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Staff:</div>
                            <div className="font-semibold">{sampledData?.staffName || 'Staff XYZ'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Type:</div>
                            <div className="font-semibold">{request?.panelName || 'Unknown test package'}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Code:</div>
                            <div className="font-semibold">{sampledData?.id || 'STXN-20250522-001'}</div>
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="font-semibold mb-2 flex items-center gap-2">Detailed Test Results Table</div>
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="min-w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700">
                                <th className="p-3 font-semibold border">Item</th>
                                <th className="p-3 font-semibold border">Result</th>
                                <th className="p-3 font-semibold border">Test Index</th>
                                <th className="p-3 font-semibold border">Unit</th>
                                <th className="p-3 font-semibold border whitespace-nowrap">Normal Range</th>
                                <th className="p-3 font-semibold border">Note</th>
                            </tr>
                            </thead>
                            <tbody>
                                {details.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center p-4">No test items available</td>
                                </tr>
                            ) : (
                                details.map((row, idx) => (
                                    <tr key={row.id}>
                                        <td className="p-2 border">
                                            <input
                                                className="bg-gray-100 border rounded px-2 py-1 w-full text-gray-700 cursor-not-allowed"
                                                value={row.name}
                                                readOnly
                                                disabled
                                                placeholder="Item"
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <select
                                                className={`border rounded px-2 py-1 w-full ${
                                                    !row.isBoolean ? 'bg-gray-100 cursor-not-allowed' : 
                                                    row.result === '' ? 'border-red-300 bg-red-50' : ''
                                                }`}
                                                value={row.result}
                                                onChange={e => handleDetailChange(idx, 'result', e.target.value)}
                                                disabled={!row.isBoolean}
                                            >
                                                <option value="">Select Result</option>
                                                <option value="Positive">Positive</option>
                                                <option value="Negative">Negative</option>
                                            </select>
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                className={`border rounded px-2 py-1 w-full ${
                                                    row.isBoolean ? 'bg-gray-100 cursor-not-allowed' : 
                                                    row.value === '' ? 'border-red-300 bg-red-50' : ''
                                                }`}
                                                value={row.value}
                                                onChange={e => {
                                                    const value = e.target.value;
                                                    if (row.isBoolean) return;
                                                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                        handleDetailChange(idx, 'value', value);
                                                    }
                                                }}
                                                placeholder={row.isBoolean ? "N/A" : "Enter number"}
                                                disabled={row.isBoolean}
                                                type="text"
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                className="bg-gray-100 border rounded px-2 py-1 w-full text-gray-700 cursor-not-allowed"
                                                value={row.unit}
                                                readOnly
                                                disabled
                                                placeholder="Unit"
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                className="bg-gray-100 border rounded px-2 py-1 w-full text-gray-700 cursor-not-allowed"
                                                value={row.normalValue}
                                                readOnly
                                                disabled
                                                placeholder="Normal Range"
                                            />
                                        </td>
                                        <td className="p-2 border">
                                            <input
                                                className="border rounded px-2 py-1 w-full"
                                                value={row.note}
                                                onChange={e => handleDetailChange(idx, 'note', e.target.value)}
                                                placeholder="Note"
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>                <div className="mb-6">
                    <div className="font-semibold mb-2 flex items-center gap-2">
                        <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
                        Notes for Customer
                    </div>
                    <textarea
                        className="w-full border rounded-xl p-3 min-h-[60px] text-sm"
                        placeholder="Describe the test results, next instructions, or important notes for the customer."
                        value={note}
                        onChange={e => setNote(e.target.value)}
                    />
                </div>
                  {details.length > 0 && (
                    <div className="mb-6">
                        <div className="font-semibold mb-2 flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                            Overall Assessment Preview
                        </div>
                        <div className={`p-3 rounded-xl border-2 ${
                            evaluateOverallResult().isIncomplete 
                                ? 'border-gray-200 bg-gray-50'
                                : evaluateOverallResult().hasAbnormal 
                                    ? 'border-orange-200 bg-orange-50' 
                                    : 'border-green-200 bg-green-50'
                        }`}>
                            <div className={`text-sm font-medium mb-1 ${
                                evaluateOverallResult().isIncomplete
                                    ? 'text-gray-600'
                                    : evaluateOverallResult().hasAbnormal 
                                        ? 'text-orange-700' 
                                        : 'text-green-700'
                            }`}>
                                {evaluateOverallResult().isIncomplete
                                    ? '⏳ Incomplete Assessment'
                                    : evaluateOverallResult().hasAbnormal 
                                        ? '⚠️ Requires Attention' 
                                        : '✅ Normal Results'
                                }
                            </div>
                            <div className="text-sm text-gray-700">
                                {evaluateOverallResult().recommendation}
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        className="px-6 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50"
                        onClick={handleCancel}
                    >
            <span className="flex items-center gap-2">
              <img src={require('../../../assets/icons/cancel.svg').default} alt="cancel" className="w-4 h-4"/>
              Cancel
            </span>
                    </button>
                    <button
                        className="px-6 py-2 rounded-lg bg-green-400 text-white font-semibold hover:bg-green-500 flex items-center gap-2"
                        onClick={handleSubmit}
                    >
                        <img src={require('../../../assets/icons/green-check.svg').default} alt="update"
                             className="w-4 h-4"/>
                        Update Results
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormUpdateTestResult;