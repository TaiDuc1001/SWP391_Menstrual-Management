import api from '../axios';

export interface VNPayPaymentRequest {
    amount: number;
    serviceId: string;
    service: string;
}

export interface VNPayPaymentResponse {
    paymentUrl: string;
}

export const vnpayService = {
    createPayment: async (data: VNPayPaymentRequest): Promise<string> => {
        const response = await api.post('/payments', data);
        return response.data;
    },

    handlePaymentReturn: async (queryParams: Record<string, string>) => {
        const response = await api.get('/payments/payment-return', {
            params: queryParams
        });
        return response.data;
    }
};

