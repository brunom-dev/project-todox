import React from 'react';
import { Target, Plus } from 'lucide-react';
import { Button } from '../ui';

interface GoalEmptyStateProps {
  onCreateGoal: () => void;
}

export const GoalEmptyState: React.FC<GoalEmptyStateProps> = ({ onCreateGoal }) => {
  return (
    <div
      role="region"
      aria-label="Nenhuma meta cadastrada"
      className="p-12 rounded-2xl bg-[var(--bg-surface)] border border-dashed border-[var(--border-default)] text-center flex flex-col items-center justify-center space-y-4 my-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)] flex items-center justify-center">
        <Target className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          Nenhuma meta cadastrada ainda
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Defina seus objetivos estratégicos de médio e longo prazo (como aprovação em provas, projetos profissionais ou saúde) e acompanhe a evolução automática das tarefas vinculadas.
        </p>
      </div>

      <div className="pt-2">
        <Button
          variant="primary"
          size="md"
          onClick={onCreateGoal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Criar Minha Primeira Meta
        </Button>
      </div>
    </div>
  );
};
