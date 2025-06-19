import { useMutation } from '@tanstack/react-query';
import { postLogin } from '../services/login';

interface LoginBody {
  email: string;
  password: string;
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (variables: LoginBody) => postLogin(variables.email, variables.password)
  });
};
