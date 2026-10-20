import { api } from '../lib/api';
import type { DashboardInsightsResponse } from '../types';

export const dashboardService = {
  /**
   * Obtém os indicadores agregados do painel de controle (resumo, tarefas por categoria e metas)
   */
  async getInsights(): Promise<DashboardInsightsResponse> {
    const { data } = await api.get<DashboardInsightsResponse>('/dashboard/insights');
    return data;
  },
};
