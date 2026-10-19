import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { ApiErrorResponse } from '../types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de Request: Injeta o token Bearer JWT dinamicamente
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Response: Trata 401 (Sessão Expirada/Não Autorizado) de forma resiliente
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      const { logout, token } = useAuthStore.getState();
      
      // Apenas faz logout e redireciona se havia token (sessão expirou)
      if (token) {
        logout();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Utilitário seguro para extrair mensagem amigável de erro de uma resposta HTTP
 */
export function getApiErrorMessage(error: unknown, fallbackMessage = 'Ocorreu um erro inesperado. Tente novamente.'): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.data?.details && error.response.data.details.length > 0) {
      return error.response.data.details.map((d) => d.message).join(', ');
    }
    if (error.message === 'Network Error') {
      return 'Não foi possível conectar ao servidor. Verifique se a API está ativa.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'A requisição demorou muito para responder. Verifique sua conexão.';
    }
  }
  return fallbackMessage;
}
