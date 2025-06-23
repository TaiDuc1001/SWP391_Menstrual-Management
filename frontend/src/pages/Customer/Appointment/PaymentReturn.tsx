import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { vnpayService } from '../../../api/services/vnpayService';

const PaymentReturn: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
    const [message, setMessage] = useState('Processing payment...');    useEffect(() => {
        const handlePaymentReturn = async () => {
            try {
                
                const status = searchParams.get('status');
                const vnpResponseCode = searchParams.get('vnp_ResponseCode');
                
                
                const responseCode = status || vnpResponseCode;
                
                if (responseCode === '00') {
                    
                    setStatus('success');
                    setMessage('Payment successful! Your appointment has been confirmed.');
                    
                    
                    setTimeout(() => {
                        navigate('/customer/appointments');
                    }, 3000);
                } else if (responseCode && responseCode !== '00') {
                    
                    setStatus('failed');
                    setMessage('Payment failed. Your appointment has been cancelled.');
                    
                    
                    setTimeout(() => {
                        navigate('/customer/appointments');
                    }, 3000);
                } else {
                    
                    setStatus('failed');
                    setMessage('Payment status could not be determined.');
                    
                    setTimeout(() => {
                        navigate('/customer/appointments');
                    }, 3000);
                }
            } catch (error) {
                console.error('Error processing payment return:', error);
                setStatus('failed');
                setMessage('An error occurred while processing your payment.');
                
                setTimeout(() => {
                    navigate('/customer/appointments');
                }, 3000);
            }
        };

        handlePaymentReturn();
    }, [searchParams, navigate]);

    const getStatusIcon = () => {
        switch (status) {
            case 'processing':
                return (
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                );
            case 'success':
                return (
                    <div className="text-6xl text-green-500 mb-4">✅</div>
                );
            case 'failed':
                return (
                    <div className="text-6xl text-red-500 mb-4">❌</div>
                );
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'processing':
                return 'text-blue-600';
            case 'success':
                return 'text-green-600';
            case 'failed':
                return 'text-red-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                {getStatusIcon()}
                
                <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
                    {status === 'processing' && 'Processing Payment'}
                    {status === 'success' && 'Payment Successful'}
                    {status === 'failed' && 'Payment Failed'}
                </h1>
                
                <p className="text-gray-700 mb-6">
                    {message}
                </p>

                {status !== 'processing' && (
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/customer/appointments')}
                            className="w-full px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-all duration-300"
                        >
                            Go to Appointments
                        </button>
                        
                        {status === 'failed' && (
                            <button
                                onClick={() => navigate('/customer/appointments/book')}
                                className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-300"
                            >
                                Book New Appointment
                            </button>
                        )}
                    </div>
                )}

                {status !== 'processing' && (
                    <p className="text-sm text-gray-500 mt-4">
                        You will be redirected automatically in a few seconds...
                    </p>
                )}
            </div>
        </div>
    );
};

export default PaymentReturn;
