import React from 'react';

export const GoalSkeleton: React.FC = () => {
  return (
    <div
      role="status"
      aria-label="Carregando metas"
      aria-busy="true"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4 animate-pulse"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="h-5 bg-[var(--bg-subtle)] rounded w-3/5" />
            <div className="h-6 w-6 bg-[var(--bg-subtle)] rounded-lg shrink-0" />
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-[var(--bg-subtle)] rounded w-full" />
            <div className="h-3 bg-[var(--bg-subtle)] rounded w-4/5" />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between">
              <div className="h-3 bg-[var(--bg-subtle)] rounded w-20" />
              <div className="h-3 bg-[var(--bg-subtle)] rounded w-10" />
            </div>
            <div className="h-2.5 bg-[var(--bg-subtle)] rounded-full w-full" />
          </div>

          <div className="h-8 bg-[var(--bg-subtle)] rounded-xl w-full" />
        </div>
      ))}
      <span className="sr-only">Carregando painel de metas...</span>
    </div>
  );
};
