import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores';
import { dashboardService, taskService } from '../services';
import { getApiErrorMessage } from '../lib/api';
import { MetricCards, AlertsBanner, GoalsProgressSection, CategoryDistribution } from '../components/dashboard';
import { Button } from '../components/ui';
import { RefreshCw, AlertCircle } from 'lucide-react';
import type { DashboardInsightsResponse, TaskAlertsResponse } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const [insights, setInsights] = useState<DashboardInsightsResponse | null>(null);
  const [alerts, setAlerts] = useState<TaskAlertsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [insightsData, alertsData] = await Promise.all([
        dashboardService.getInsights(),
        taskService.getAlerts(),
      ]);

      setInsights(insightsData);
      setAlerts(alertsData);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Não foi possível carregar os dados do dashboard.');
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-8">
      {/* Banner de Boas-vindas e Ação de Atualização */}
      <section
        aria-labelledby="welcome-heading"
        className="p-6 md:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--brand-subtle)] text-[var(--brand-primary)] mb-3">
            Visão Geral de Produtividade
          </span>
          <h1 id="welcome-heading" className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Olá, {user?.name || 'Usuário'}! 👋
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            Aqui está o panorama completo das suas metas, tarefas concluídas e prazos em aberto.
          </p>
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            isLoading={isLoading}
            loadingText="Atualizando..."
            leftIcon={<RefreshCw className="w-4 h-4" />}
            aria-label="Atualizar dados do dashboard"
          >
            Atualizar
          </Button>
        </div>
      </section>

      {/* Tratamento de Erro */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 rounded-xl bg-[var(--state-danger-bg)] border border-[var(--state-danger)]/20 text-[var(--state-danger)] text-sm font-medium flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
          <Button variant="danger" size="sm" onClick={loadData}>
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Estado de Carregamento com Skeletons Acessíveis */}
      {isLoading && !insights && (
        <div aria-busy="true" aria-label="Carregando informações do painel" className="space-y-6">
          <div className="h-20 rounded-2xl bg-[var(--bg-subtle)] animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-[var(--bg-subtle)] animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 rounded-2xl bg-[var(--bg-subtle)] animate-pulse" />
            <div className="h-64 rounded-2xl bg-[var(--bg-subtle)] animate-pulse" />
          </div>
        </div>
      )}

      {/* Dados Carregados */}
      {!isLoading && insights && (
        <>
          {/* Banner de Alertas (Prazos Críticos e Atrasados) */}
          {alerts && <AlertsBanner alerts={alerts} />}

          {/* Cartões com Métricas de Resumo */}
          <MetricCards overview={insights.overview} />

          {/* Seções Analíticas: Progresso de Metas e Distribuição por Categorias */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <GoalsProgressSection goalsProgress={insights.goalsProgress} />
            <CategoryDistribution tasksByCategory={insights.tasksByCategory} />
          </div>
        </>
      )}
    </div>
  );
};
