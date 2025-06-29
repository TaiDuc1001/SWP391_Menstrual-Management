import api from '../axios';

export interface Account {
    id: number;
    email: string;
    role: string;
    status: boolean;
    name: string;
    phoneNumber: string | null;
    avatar: string | null;
}

export interface AccountForUI {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    phone: string;
    status: string;
    avatar: string;
}

export interface CreateAccountRequest {
    email: string;
    password: string;
    role: 'CUSTOMER' | 'DOCTOR' | 'STAFF' | 'ADMIN';
    name: string;
    phoneNumber: string;
    status: boolean;
}

export interface UpdateAccountRequest {
    email: string;
    password: string;
    role: 'CUSTOMER' | 'DOCTOR' | 'STAFF' | 'ADMIN';
    status: boolean;
    name: string;
    phoneNumber: string;
}

const mapAccountToUI = (account: Account): AccountForUI => ({
    id: account.id,
    name: account.name,
    email: account.email,
    password: '********',
    role: account.role,
    phone: account.phoneNumber || 'N/A',
    status: account.status ? 'Active' : 'Inactive',
    avatar: account.avatar || ''
});

export const accountService = {
    getAllAccounts: async (): Promise<AccountForUI[]> => {
        try {
            const response = await api.get<Account[]>('/accounts/admin');
            return response.data.map(mapAccountToUI);
        } catch (error) {
            console.error('Error fetching accounts:', error);
            throw error;
        }
    },

    createAccount: async (accountData: CreateAccountRequest): Promise<Account> => {
        try {
            const response = await api.post<Account>('/accounts/admin', accountData);
            return response.data;
        } catch (error: any) {
            console.error('Error creating account:', error);
            
            // Extract error message from different possible response formats
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.response?.data || 
                               error.message;
            
            console.log('Backend error message:', errorMessage);
            
            // Handle specific email already exists error - check for the exact backend message
            if (typeof errorMessage === 'string' && 
                errorMessage.includes('Email already exists:')) {
                const email = errorMessage.split('Email already exists: ')[1] || 'này';
                throw new Error(`Email ${email} đã tồn tại. Vui lòng sử dụng email khác.`);
            }
            
            // Fallback for other email duplicate patterns
            if (typeof errorMessage === 'string' && 
                (errorMessage.toLowerCase().includes('email') && 
                 (errorMessage.toLowerCase().includes('exists') || 
                  errorMessage.toLowerCase().includes('duplicate')))) {
                throw new Error('Email đã tồn tại. Vui lòng sử dụng email khác.');
            }
            
            // Handle other backend validation errors
            if (errorMessage && typeof errorMessage === 'string') {
                throw new Error(errorMessage);
            }
            
            // Handle network or other errors
            if (error.response?.status === 400) {
                throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
            }
            
            if (error.response?.status === 409) {
                throw new Error('Email đã tồn tại. Vui lòng sử dụng email khác.');
            }
            
            throw new Error('Tạo tài khoản thất bại. Vui lòng thử lại.');
        }
    },

    updateAccount: async (id: number, accountData: UpdateAccountRequest): Promise<Account> => {
        try {
            console.log(`Sending PUT request to /accounts/admin/${id} with data:`, accountData);
            const response = await api.put<Account>(`/accounts/admin/${id}`, accountData);
            console.log('Update response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error updating account:', error);
            console.error('Error response:', error);
            
            // Extract error message from different possible response formats
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.response?.data || 
                               error.message;
            
            console.log('Backend error message:', errorMessage);
            
            // Handle specific email already exists error - check for the exact backend message
            if (typeof errorMessage === 'string' && 
                errorMessage.includes('Email already exists:')) {
                const email = errorMessage.split('Email already exists: ')[1] || 'này';
                throw new Error(`Email ${email} đã tồn tại. Vui lòng sử dụng email khác.`);
            }
            
            // Fallback for other email duplicate patterns
            if (typeof errorMessage === 'string' && 
                (errorMessage.toLowerCase().includes('email') && 
                 (errorMessage.toLowerCase().includes('exists') || 
                  errorMessage.toLowerCase().includes('duplicate')))) {
                throw new Error('Email đã tồn tại. Vui lòng sử dụng email khác.');
            }
            
            // Handle other backend validation errors
            if (errorMessage && typeof errorMessage === 'string') {
                throw new Error(errorMessage);
            }
            
            // Handle network or other errors
            if (error.response?.status === 400) {
                throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
            }
            
            if (error.response?.status === 409) {
                throw new Error('Email đã tồn tại. Vui lòng sử dụng email khác.');
            }
            
            throw new Error('Cập nhật tài khoản thất bại. Vui lòng thử lại.');
        }
    },

    deleteAccount: async (id: number): Promise<Account> => {
        try {
            console.log(`Sending DELETE request to /accounts/admin/${id}`);
            const response = await api.delete<Account>(`/accounts/admin/${id}`);
            console.log('Delete response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Error deleting account:', error);
            console.error('Error response:', error);
            
            // Extract error message from different possible response formats
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               error.response?.data || 
                               error.message;
            
            // Handle specific delete errors
            if (errorMessage && typeof errorMessage === 'string') {
                throw new Error(errorMessage);
            }
            
            // Handle network or other errors
            if (error.response?.status === 404) {
                throw new Error('Không tìm thấy tài khoản.');
            }
            
            if (error.response?.status === 400) {
                throw new Error('Không thể xóa tài khoản. Tài khoản có thể có dữ liệu liên quan.');
            }
            
            throw new Error('Xóa tài khoản thất bại. Vui lòng thử lại.');
        }
    }
};
