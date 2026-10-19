import React from 'react';
import { useAuthStore } from '../stores';
import { CheckCircle2, Clock, AlertTriangle, Target, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Banner de Boas-vindas */}
      <section aria-labelledby="welcome-heading" className="p-6 md:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-sm">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--brand-subtle)] text-[var(--brand-primary)] mb-3">
            Visão Geral
          </span>
          <h1 id="welcome-heading" className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
            Olá, {user?.name || 'Usuário'}! 👋
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            Acompanhe o ritmo das suas metas, tarefas do dia a dia e compromissos importantes em um só lugar.
          </p>
        </div>
      </section>

      {/* Grid de Métricas Principais (Placeholder responsivo para Issue #4) */}
      <section aria-label="Indicadores Rápidos" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Tarefas Concluídas</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">--</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--status-done-bg)] text-[var(--status-done)] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Taxa de Conclusão</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">--%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Metas Ativas</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">--</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Alertas de Prazo</p>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">--</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[var(--status-in-progress-bg)] text-[var(--status-in-progress)] flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Atalhos Rápidos */}
      <section aria-labelledby="shortcuts-heading" className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4">
        <h2 id="shortcuts-heading" className="text-base font-bold text-[var(--text-primary)]">
          Próximos Passos
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          O roteamento protegido está funcionando perfeitamente! Na próxima etapa (Issue #4), conectaremos os dados reais do Dashboard (`/api/dashboard/insights` e `/api/tasks/alerts`).
        </p>
        <div className="pt-2">
          <Link
            to="/showcase"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-primary)] hover:underline"
          >
            <span>Explorar Showcase de Componentes</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
