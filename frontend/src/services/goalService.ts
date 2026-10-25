import { api } from '../lib/api';
import type { Goal } from '../types';

export interface CreateGoalInput {
  title: string;
  description?: string | null;
  deadline?: string | null;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string | null;
  deadline?: string | null;
}

export const goalService = {
  /**
   * Obtém a lista de metas do usuário autenticado
   */
  async getGoals(): Promise<Goal[]> {
    const { data } = await api.get<Goal[]>('/goals');
    return data;
  },

  /**
   * Cria uma nova meta
   */
  async createGoal(payload: CreateGoalInput): Promise<Goal> {
    const { data } = await api.post<Goal>('/goals', payload);
    return data;
  },

  /**
   * Atualiza uma meta existente
   */
  async updateGoal(id: string, payload: UpdateGoalInput): Promise<Goal> {
    const { data } = await api.put<Goal>(`/goals/${id}`, payload);
    return data;
  },

  /**
   * Exclui uma meta
   */
  async deleteGoal(id: string): Promise<void> {
    await api.delete(`/goals/${id}`);
  },
};
