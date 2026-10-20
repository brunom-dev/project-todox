import React from 'react';
import { AlertCircle, Clock, Calendar, CheckCircle } from 'lucide-react';
import { Badge } from '../ui';
import type { TaskAlertsResponse, Task } from '../../types';

interface AlertsBannerProps {
  alerts: TaskAlertsResponse;
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({ alerts }) => {
  const { overdue, upcoming } = alerts;
  const hasAlerts = overdue.length > 0 || upcoming.length > 0;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Sem prazo';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');
  };

  if (!hasAlerts) {
    return (
      <section
        aria-label="Status de Prazos"
        className="p-4 rounded-2xl bg-[var(--status-done-bg)] border border-[var(--status-done-bg)] flex items-center gap-3 text-[var(--status-done)]"
      >
        <CheckCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
        <p className="text-sm font-medium">
          Tudo sob controle! Você não possui nenhuma tarefa atrasada ou com prazo crítico para os próximos 3 dias.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="alerts-title" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 id="alerts-title" className="text-sm font-bold tracking-wide uppercase text-[var(--text-secondary)] flex items-center gap-2">
          <span>Alertas de Prazos</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--state-danger-bg)] text-[var(--state-danger)] font-semibold">
            {overdue.length + upcoming.length}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tarefas Atrasadas */}
        {overdue.length > 0 && (
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--state-danger)]/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-[var(--state-danger)] font-semibold text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <h3>Atrasadas ({overdue.length})</h3>
            </div>

            <ul className="space-y-2.5" role="list">
              {overdue.map((task: Task) => (
                <li
                  key={task.id}
                  className="p-3 rounded-xl bg-[var(--state-danger-bg)]/40 border border-[var(--state-danger)]/15 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--state-danger)]">
                      <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Venceu em: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>

                  {task.category && (
                    <Badge variant="custom" colorHex={task.category.color} showDot={false}>
                      {task.category.name}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tarefas Próximas (em até 3 dias) */}
        {upcoming.length > 0 && (
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-amber-500/30 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
              <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
              <h3>Vencendo em breve ({upcoming.length})</h3>
            </div>

            <ul className="space-y-2.5" role="list">
              {upcoming.map((task: Task) => (
                <li
                  key={task.id}
                  className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-amber-700 dark:text-amber-300">
                      <Calendar className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>Prazo: {formatDate(task.dueDate)}</span>
                    </div>
                  </div>

                  {task.category && (
                    <Badge variant="custom" colorHex={task.category.color} showDot={false}>
                      {task.category.name}
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
