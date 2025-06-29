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

const roleMapping: Record<string, string> = {
    'CUSTOMER': 'Customer',
    'DOCTOR': 'Consultant',
    'STAFF': 'Staff',
    'ADMIN': 'Manager'
};

const mapAccountToUI = (account: Account): AccountForUI => ({
    id: account.id,
    name: account.name,
    email: account.email,
    password: '********',
    role: roleMapping[account.role] || account.role,
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
    }
};
