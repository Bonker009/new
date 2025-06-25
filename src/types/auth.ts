export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'USER' | 'OWNER';
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'USER' | 'OWNER';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role: 'USER' | 'OWNER';
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}