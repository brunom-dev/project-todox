import React from 'react';
import { CheckCircle2, Clock, CalendarCheck, Layers } from 'lucide-react';
import type { DashboardOverview } from '../../types';

interface MetricCardsProps {
  overview: DashboardOverview;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ overview }) => {
  const cards = [
    {
      label: 'Total de Tarefas',
      value: overview.totalTasks,
      icon: <Layers className="w-5 h-5 text-[var(--brand-primary)]" />,
      bgIcon: 'bg-[var(--brand-subtle)]',
    },
    {
      label: 'Tarefas Concluídas',
      value: overview.completedTasks,
      icon: <CheckCircle2 className="w-5 h-5 text-[var(--status-done)]" />,
      bgIcon: 'bg-[var(--status-done-bg)]',
    },
    {
      label: 'Taxa de Conclusão',
      value: `${overview.completionRate.toFixed(0)}%`,
      icon: <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      bgIcon: 'bg-amber-500/10',
    },
    {
      label: 'Concluídas na Semana',
      value: overview.weeklyCompletedTasks,
      icon: <CalendarCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      bgIcon: 'bg-blue-500/10',
    },
  ];

  return (
    <section aria-label="Resumo dos Indicadores" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xs flex items-center justify-between transition-all duration-150 hover:border-[var(--border-hover)]"
        >
          <div>
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              {card.label}
            </h3>
            <p className="text-2xl font-bold text-[var(--text-primary)] mt-1.5 tabular-nums">
              {card.value}
            </p>
          </div>
          <div
            className={`w-11 h-11 rounded-xl ${card.bgIcon} flex items-center justify-center shrink-0`}
            aria-hidden="true"
          >
            {card.icon}
          </div>
        </article>
      ))}
    </section>
  );
};
