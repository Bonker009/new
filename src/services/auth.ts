import api from '@/lib/api';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    console.log('Making login request with credentials:', credentials);
    try {
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response);
      return response.data;
    } catch (error) {
      // Handle error silently without console logging
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    console.log('Making register request with userData:', userData);
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Register response:', response);
      return response.data;
    } catch (error) {
      // Handle error silently without console logging
      throw error;
    }
  },
};