import { api } from '../lib/api';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
  User,
} from '../types';

export const authService = {
  /**
   * Realiza login do usuário com email e senha
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  /**
   * Cadastra novo usuário
   */
  async register(registerData: RegisterData): Promise<User> {
    const { data } = await api.post<User>('/users', registerData);
    return data;
  },

  /**
   * Obtém os dados do perfil autenticado
   */
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  },

  /**
   * Atualiza dados de perfil ou senha
   */
  async updateProfile(updateData: UpdateProfileData): Promise<User> {
    const { data } = await api.put<User>('/users/profile', updateData);
    return data;
  },
};
