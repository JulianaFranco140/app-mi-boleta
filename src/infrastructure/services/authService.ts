import { apiClient } from '../http/apiClient';

export interface LoginProps {
  email: string;
  password: string;
}

export interface RegisterProps {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginProps) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  register: async (data: RegisterProps) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  }
};
