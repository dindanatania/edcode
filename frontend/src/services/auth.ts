import { apiFetch } from '@/lib/api';
import { AuthResponse, RegisterData, User } from '@/types/auth';

export const authService = {
  async login(formData: FormData): Promise<AuthResponse> {
    const res = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: formData,
    });
    if (res.access_token) {
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('user', JSON.stringify(res.user));
    }
    return res;
  },

  async register(data: RegisterData): Promise<User> {
    return apiFetch<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getCurrentUser(): Promise<User> {
    return apiFetch<User>('/auth/me');
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getSavedUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

