import { useMutation } from '@tanstack/react-query';
import { postRegister } from '../services/register';

interface LoginBody {
  email: string;
  password: string;
  role: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (variables: LoginBody) => postRegister(variables.email, variables.password, variables.role),
  });
};
