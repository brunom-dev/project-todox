import { api } from '../lib/api';
import type { Task, TaskAlertsResponse } from '../types';

export interface TaskFilterParams {
  status?: string;
  categoryId?: string;
  goalId?: string;
  date?: string;
}

export const taskService = {
  /**
   * Obtém a lista de tarefas com suporte a filtros opcionais
   */
  async getTasks(params?: TaskFilterParams): Promise<Task[]> {
    const { data } = await api.get<Task[]>('/tasks', { params });
    return data;
  },

  /**
   * Obtém as tarefas atrasadas e aquelas com prazo nos próximos 3 dias
   */
  async getAlerts(): Promise<TaskAlertsResponse> {
    const { data } = await api.get<TaskAlertsResponse>('/tasks/alerts');
    return data;
  },
};
