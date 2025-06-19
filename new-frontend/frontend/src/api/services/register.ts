import api from '../axios';

export const postRegister = async (email: string, password: string, role: string) => {
    role = role.toUpperCase();
    const response = await api.post('/accounts/register', { email, password, role });
    return response.data;
};
