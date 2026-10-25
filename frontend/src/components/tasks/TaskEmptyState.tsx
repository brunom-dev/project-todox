import React from 'react';
import { CheckCircle2, ListFilter, Plus } from 'lucide-react';
import { Button } from '../ui';

interface TaskEmptyStateProps {
  isFiltered?: boolean;
  onClearFilters?: () => void;
  onCreateTask?: () => void;
}

export const TaskEmptyState: React.FC<TaskEmptyStateProps> = ({
  isFiltered = false,
  onClearFilters,
  onCreateTask,
}) => {
  return (
    <div
      role="region"
      aria-label="Nenhuma tarefa encontrada"
      className="p-10 rounded-2xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-default)] text-center flex flex-col items-center justify-center space-y-4 my-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)] flex items-center justify-center">
        {isFiltered ? (
          <ListFilter className="w-7 h-7" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
        )}
      </div>

      <div className="max-w-sm space-y-1">
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          {isFiltered ? 'Nenhuma tarefa com os filtros atuais' : 'Tudo em dia por aqui!'}
        </h3>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {isFiltered
            ? 'Tente ajustar ou limpar seus filtros de status e categoria para visualizar mais itens.'
            : 'Você não possui tarefas pendentes cadastradas no momento. Que tal registrar sua próxima meta?'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {isFiltered && onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Limpar Filtros
          </Button>
        )}
        {onCreateTask && (
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateTask}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nova Tarefa
          </Button>
        )}
      </div>
    </div>
  );
};
