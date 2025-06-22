import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axios';
import TitleBar from '../../../components/feature/TitleBar/TitleBar';

interface ExaminationPaymentInfo {
    examinationId: number;
    customerName: string;
    staffName: string;
    date: string;
    timeRange: string;
    amount: number;
    panelName: string;
    qrCodeUrl: string;
}

const ExaminationCheckout: React.FC = () => {
    const { examinationId } = useParams();
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState<ExaminationPaymentInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            try {
                const response = await api.get(`/examinations/payment/${examinationId}`);
                setPaymentInfo(response.data);
            } catch (err) {
                setError('Failed to load payment information');
            } finally {
                setLoading(false);
            }
        };

        if (examinationId) {
            fetchPaymentInfo();
        }
    }, [examinationId]);

    const handleScanPayment = async () => {
        setPaying(true);
        try {
            const response = await api.put(`/examinations/payment/scan/${examinationId}`);
            if (response.data.examinationStatus === 'IN_PROGRESS') {
                alert('Payment successful! Your examination is now confirmed.');
                navigate('/customer/sti-tests');
            } else {
                alert('Payment failed! Your examination has been cancelled.');
                navigate('/customer/sti-tests');
            }
        } catch (err) {
            setError('Payment processing failed. Please try again.');
        } finally {
            setPaying(false);
        }
    };

    const handleCancelPayment = async () => {
        try {
            await api.put(`/examinations/cancel/${examinationId}`);
            alert('Examination cancelled successfully.');
            navigate('/customer/sti-tests');
        } catch (err) {
            setError('Failed to cancel examination');
        }
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading payment information...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!paymentInfo) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Payment information not found</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <TitleBar
                    text="Examination Checkout"
                    buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
                    onButtonClick={() => navigate('/customer/sti-tests')}
                />

                <div className="bg-white rounded-xl shadow-md p-8 mt-4">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Complete Your Payment
                    </h2>

                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Examination Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-gray-600">Test Panel:</span>
                                <div className="font-semibold">{paymentInfo.panelName}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Patient:</span>
                                <div className="font-semibold">{paymentInfo.customerName}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Date:</span>
                                <div className="font-semibold">{new Date(paymentInfo.date).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Time:</span>
                                <div className="font-semibold">{paymentInfo.timeRange}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Staff:</span>
                                <div className="font-semibold">{paymentInfo.staffName}</div>
                            </div>
                            <div>
                                <span className="text-gray-600">Amount:</span>
                                <div className="font-semibold text-2xl text-pink-600">${paymentInfo.amount}</div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Scan QR Code to Pay</h3>
                        <div className="flex justify-center mb-4">
                            <div className="w-64 h-64 bg-white border-2 border-gray-300 flex items-center justify-center rounded-lg shadow-sm">
                                {paymentInfo.qrCodeUrl ? (
                                    <img
                                        src={paymentInfo.qrCodeUrl}
                                        alt="Payment QR Code"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">📱</div>
                                        <div className="text-gray-600">QR Code</div>
                                        <div className="text-sm text-gray-500 mt-2">
                                            Scan with your<br/>banking app
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleScanPayment}
                            disabled={paying}
                            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
                        >
                            {paying ? 'Processing...' : 'Scan (Demo Payment)'}
                        </button>
                        <button
                            onClick={handleCancelPayment}
                            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300"
                        >
                            Cancel Examination
                        </button>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Demo Instructions:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Click "Scan (Demo Payment)" to simulate payment</li>
                            <li>• Payment has 80% success rate for demonstration</li>
                            <li>• After successful payment, examination will be confirmed</li>
                            <li>• You can track your examination progress in STI Tests section</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExaminationCheckout;
