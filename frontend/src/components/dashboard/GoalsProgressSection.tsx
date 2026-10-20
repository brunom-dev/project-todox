import React from 'react';
import { Target } from 'lucide-react';
import type { GoalProgress } from '../../types';

interface GoalsProgressSectionProps {
  goalsProgress: GoalProgress[];
}

export const GoalsProgressSection: React.FC<GoalsProgressSectionProps> = ({ goalsProgress }) => {
  return (
    <section aria-labelledby="goals-heading" className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Target className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2 id="goals-heading" className="text-base font-bold text-[var(--text-primary)]">
              Progresso das Metas
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">Evolução automática baseada nas tarefas concluídas</p>
          </div>
        </div>
      </div>

      {goalsProgress.length === 0 ? (
        <div className="p-6 text-center rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
          <p className="text-sm font-medium text-[var(--text-primary)]">Nenhuma meta cadastrada ainda</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Cadastre metas de médio e longo prazo para acompanhar o seu avanço diário.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {goalsProgress.map((goal) => {
            const percent = Math.min(100, Math.max(0, Math.round(goal.progress)));

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[var(--text-primary)] truncate max-w-[75%]">
                    {goal.title}
                  </span>
                  <span className="font-bold text-[var(--brand-primary)] tabular-nums">
                    {percent}%
                  </span>
                </div>

                <div
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Progresso da meta ${goal.title}: ${percent}%`}
                  className="w-full h-2.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden border border-[var(--border-default)]/40"
                >
                  <div
                    className="h-full bg-[var(--brand-primary)] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
