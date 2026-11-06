export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  username: string; // email for OAuth2 password grant
  password: string;
}

export interface RegisterData {
  email: string;
  full_name: string;
  password: string;
  role?: UserRole;
}

