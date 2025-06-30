import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import api from '../../../api/axios';
import { vnpayService } from '../../../api/services/vnpayService';
import TitleBar from '../../../components/feature/TitleBar/TitleBar';

interface PaymentInfo {
    appointmentId: number;
    customerName: string;
    doctorName: string;
    date: string;
    timeRange: string;
    amount: number;
    qrCodeUrl: string;
}

const VNPayCheckout: React.FC = () => {
    const {appointmentId} = useParams();
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentInfo = async () => {
            try {
                const response = await api.get(`/appointments/payment/${appointmentId}`);
                setPaymentInfo(response.data);
            } catch (err) {
                setError('Failed to load payment information');
            } finally {
                setLoading(false);
            }
        };

        if (appointmentId) {
            fetchPaymentInfo();
        }
    }, [appointmentId]);
    const handleVNPayPayment = async () => {
        if (!paymentInfo) return;
        
        setPaying(true);
        try {            const paymentUrl = await vnpayService.createPayment({
                amount: paymentInfo.amount,
                serviceId: appointmentId!,
                service: 'Appointment'
            });
            
            window.open(paymentUrl, '_blank');
            setPaying(false);
        } catch (err) {
            setError('Failed to create payment. Please try again.');
            setPaying(false);
        }
    };

    const handleDemoPayment = async () => {
        setPaying(true);
        try {
            const response = await api.put(`/appointments/payment/scan/${appointmentId}`);
            if (response.data.appointmentStatus === 'CONFIRMED') {
                alert('Payment successful! Your appointment is now confirmed.');
                navigate('/customer/appointments');
            } else {
                alert('Payment failed! Your appointment has been cancelled.');
                navigate('/customer/appointments');
            }
        } catch (err) {
            setError('Payment processing failed. Please try again.');
        } finally {
            setPaying(false);
        }
    };

    const handleCancelPayment = async () => {
        try {
            await api.put(`/appointments/cancel/${appointmentId}`);
            alert('Appointment cancelled successfully.');
            navigate('/customer/appointments');
        } catch (err) {
            setError('Failed to cancel appointment');
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
                    text="Payment Checkout"
                    buttonLabel={<><span style={{fontSize: '1.2em'}}>&larr;</span> Back</>}
                    onButtonClick={() => navigate('/customer/appointments')}
                />

                <div className="bg-white rounded-xl shadow-md p-8 mt-4">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Complete Your Payment
                    </h2>

                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Appointment Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-gray-600">Doctor:</span>
                                <div className="font-semibold">{paymentInfo.doctorName}</div>
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
                            <div className="col-span-2">
                                <span className="text-gray-600">Amount:</span>
                                <div className="font-semibold text-2xl text-pink-600">{paymentInfo.amount.toLocaleString()} VND</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 text-center">Choose Payment Method</h3>
                        
                        <button
                            onClick={handleVNPayPayment}
                            disabled={paying}
                            className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            <div className="text-2xl">💳</div>
                            <div>
                                <div className="text-lg">{paying ? 'Processing...' : 'Pay with VNPay'}</div>
                                <div className="text-sm opacity-90">Secure online payment</div>
                            </div>
                        </button>

                        <div className="text-center text-gray-500 text-sm">
                            OR
                        </div>

                        <button
                            onClick={handleDemoPayment}
                            disabled={paying}
                            className="w-full px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50"
                        >
                            {paying ? 'Processing...' : 'Demo Payment (For Testing)'}
                        </button>
                    </div>

                    <div className="flex gap-4 justify-center mb-8">
                        <button
                            onClick={handleCancelPayment}
                            className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300"
                        >
                            Cancel Appointment
                        </button>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Payment Instructions:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• VNPay payment will redirect you to secure payment gateway</li>
                            <li>• You can pay using any Vietnamese bank account or e-wallet</li>
                            <li>• Payment is processed in real-time and secure</li>
                            <li>• After successful payment, your appointment will be confirmed automatically</li>
                            <li>• Demo payment is available for testing purposes only</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VNPayCheckout;
