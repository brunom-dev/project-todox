import { api } from '../lib/api';
import type { Category } from '../types';

export interface CreateCategoryInput {
  name: string;
  color?: string | null;
  parentId?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  color?: string | null;
  parentId?: string | null;
}

export const categoryService = {
  /**
   * Obtém a lista de categorias do usuário
   */
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },

  /**
   * Cria uma nova categoria
   */
  async createCategory(payload: CreateCategoryInput): Promise<Category> {
    const { data } = await api.post<Category>('/categories', payload);
    return data;
  },

  /**
   * Atualiza uma categoria existente
   */
  async updateCategory(id: string, payload: UpdateCategoryInput): Promise<Category> {
    const { data } = await api.put<Category>(`/categories/${id}`, payload);
    return data;
  },

  /**
   * Exclui uma categoria
   */
  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
