export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  oldPassword?: string;
  newPassword?: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: Array<{ path: string; message: string }>;
}
