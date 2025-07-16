import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TitleBar from '../../../components/feature/TitleBar/TitleBar';

const ExaminationPaymentReturn: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'success' | 'failed' | 'processing'>('processing');
    useEffect(() => {
        const responseCode = searchParams.get('vnp_ResponseCode') || searchParams.get('status');
        
        if (responseCode === '00') {
            setStatus('success');
        } else if (responseCode) {
            setStatus('failed');
        } else {
            setStatus('processing');
        }
    }, [searchParams]);

    const handleContinue = () => {
        navigate('/customer/sti-tests');
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <TitleBar
                    text="Payment Result"
                    buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back to Tests</>}
                    onButtonClick={() => navigate('/customer/sti-tests')}
                />

                <div className="bg-white rounded-xl shadow-md p-8 mt-4">
                    <div className="text-center">
                        {status === 'processing' && (
                            <>
                                <div className="text-6xl mb-4">⏳</div>
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Processing Payment...</h2>
                                <p className="text-gray-600">Please wait while we verify your payment.</p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-2xl font-semibold text-green-600 mb-4">Payment Successful!</h2>
                                <p className="text-gray-600 mb-6">
                                    Your examination payment has been processed successfully. 
                                    Your examination is now confirmed and scheduled.
                                </p>
                                <button
                                    onClick={handleContinue}
                                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300"
                                >
                                    View My Tests
                                </button>
                            </>
                        )}

                        {status === 'failed' && (
                            <>
                                <div className="text-6xl mb-4">❌</div>
                                <h2 className="text-2xl font-semibold text-red-600 mb-4">Payment Failed</h2>
                                <p className="text-gray-600 mb-6">
                                    Unfortunately, your payment could not be processed. 
                                    Your examination has been cancelled. Please try booking again.
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => navigate('/customer/sti-tests/packages')}
                                        className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-all duration-300"
                                    >
                                        Book New Test
                                    </button>
                                    <button
                                        onClick={handleContinue}
                                        className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
                                    >
                                        View My Tests
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExaminationPaymentReturn;

