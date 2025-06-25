import { create } from 'zustand';
import { User } from '@/types/auth';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user: User, token: string) => {
    setCookie('auth-token', token);
    setCookie('user-role', user.role);
    setCookie('user-data', JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    removeCookie('auth-token');
    removeCookie('user-role');
    removeCookie('user-data');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initializeAuth: () => {
    const token = getCookie('auth-token');
    const role = getCookie('user-role') as 'USER' | 'OWNER';
    const userData = getCookie('user-data');
    
    if (token && role) {
      let user = null;
      if (userData) {
        try {
          user = JSON.parse(userData);
        } catch (error) {
          // Handle parsing error silently
        }
      }
      
      // If we have user data, use it; otherwise create minimal user object
      if (user) {
        set({ 
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Create minimal user object with role
        set({ 
          user: {
            id: '',
            username: '',
            email: '',
            fullName: 'User',
            role,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));