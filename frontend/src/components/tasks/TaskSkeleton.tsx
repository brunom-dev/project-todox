import React from 'react';

export const TaskSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Carregando tarefas"
      aria-busy="true"
      className="space-y-3"
    >
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-start gap-3.5 animate-pulse"
        >
          {/* Checkbox placeholder */}
          <div className="w-5 h-5 rounded-full bg-[var(--bg-subtle)] mt-0.5 shrink-0" />

          {/* Conteúdo placeholder */}
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center justify-between gap-4">
              <div className="h-4 bg-[var(--bg-subtle)] rounded w-2/5" />
              <div className="h-4 bg-[var(--bg-subtle)] rounded w-16" />
            </div>
            <div className="h-3 bg-[var(--bg-subtle)] rounded w-3/5" />

            <div className="flex items-center gap-2 pt-1">
              <div className="h-5 bg-[var(--bg-subtle)] rounded-full w-20" />
              <div className="h-5 bg-[var(--bg-subtle)] rounded-full w-24" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Carregando lista de tarefas...</span>
    </div>
  );
};
