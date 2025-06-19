import api from '../axios';

export const postLogin = async (email: string, password: string) => {
  const response = await api.post('/accounts/login', { email, password });
  return response.data;
};
