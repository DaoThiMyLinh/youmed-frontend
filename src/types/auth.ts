export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  role?: string;
  fullName?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface AuthState {
  token: string | null;
  role: string | null;
  fullName: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
