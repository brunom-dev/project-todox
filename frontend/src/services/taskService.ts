import { api } from '../lib/api';
import type { Task, TaskAlertsResponse, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../types';

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

  /**
   * Cria uma nova tarefa
   */
  async createTask(payload: CreateTaskInput): Promise<Task> {
    const { data } = await api.post<Task>('/tasks', payload);
    return data;
  },

  /**
   * Atualiza uma tarefa existente
   */
  async updateTask(id: string, payload: UpdateTaskInput): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${id}`, payload);
    return data;
  },

  /**
   * Exclui uma tarefa
   */
  async deleteTask(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  /**
   * Alterna rapidamente o status de uma tarefa (TODO <-> DONE)
   */
  async toggleTaskStatus(id: string, currentStatus: TaskStatus): Promise<Task> {
    const nextStatus: TaskStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    return this.updateTask(id, { status: nextStatus });
  },
};
