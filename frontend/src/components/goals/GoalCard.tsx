import React, { useState, useMemo } from 'react';
import { Target, Calendar, AlertTriangle, Edit2, Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle, ShoppingBag, ExternalLink } from 'lucide-react';
import type { Goal, TaskStatus } from '../../types';
import { parseGoalDescription, formatCurrencyBRL } from '../../lib/goalHelper';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleTaskStatus?: (taskId: string, currentStatus: TaskStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onToggleTaskStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Extrai informações ricas (incluindo se a meta é uma compra)
  const { cleanDescription, isPurchase, targetPrice, productUrl } = useMemo(
    () => parseGoalDescription(goal.description),
    [goal.description]
  );

  const tasks = goal.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const isCompleted = totalTasks > 0 && completedTasks === totalTasks;

  // Verificação de prazo de vencimento da meta
  const isOverdue = useMemo(() => {
    if (!goal.deadline || isCompleted) return false;
    const due = new Date(goal.deadline);
    return due.getTime() < Date.now();
  }, [goal.deadline, isCompleted]);

  // Formatação de data da meta
  const formattedDeadline = useMemo(() => {
    if (!goal.deadline) return null;
    try {
      const date = new Date(goal.deadline);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return null;
    }
  }, [goal.deadline]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Deseja realmente excluir a meta "${goal.title}"? Todas as tarefas continuarão existindo, mas sem o vínculo desta meta.`
      )
    ) {
      try {
        setIsDeleting(true);
        await onDelete(goal.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <article
      aria-label={`Meta: ${goal.title}`}
      className={`p-6 rounded-2xl bg-[var(--bg-surface)] border shadow-xs transition-all duration-200 flex flex-col justify-between space-y-5 ${
        isPurchase
          ? 'border-indigo-500/30 hover:border-indigo-500/60'
          : 'border-[var(--border-default)] hover:border-[var(--border-hover)]'
      }`}
    >
      <div className="space-y-3.5">
        {/* Cabeçalho da Meta com Ícone e Ações */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isCompleted
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : isPurchase
                  ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                  : 'bg-[var(--brand-subtle)] text-[var(--brand-primary)]'
              }`}
            >
              {isPurchase ? (
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Target className="w-5 h-5" aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-base font-bold tracking-tight text-[var(--text-primary)] truncate">
                {goal.title}
              </h3>
              {isPurchase && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Meta de Compra
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              aria-label={`Editar meta: ${goal.title}`}
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-subtle)] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]"
            >
              <Edit2 className="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label={`Excluir meta: ${goal.title}`}
              disabled={isDeleting}
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--state-danger)] hover:bg-[var(--state-danger-bg)] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--state-danger)]"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Informações Específicas de Compra (Preço Alvo e Link) */}
        {isPurchase && (targetPrice !== null || productUrl) && (
          <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/15 flex flex-wrap items-center justify-between gap-2 text-xs">
            {targetPrice !== null && (
              <div>
                <span className="text-[var(--text-muted)] text-[11px] block">Valor Alvo</span>
                <span className="font-bold text-sm text-[var(--text-primary)]">
                  {formatCurrencyBRL(targetPrice)}
                </span>
              </div>
            )}

            {productUrl && (
              <a
                href={productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400 hover:underline"
              >
                <span>Ver produto</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        )}

        {/* Descrição opcional */}
        {cleanDescription && (
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
            {cleanDescription}
          </p>
        )}

        {/* Prazo Limite */}
        {formattedDeadline && (
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            {isOverdue ? (
              <span className="inline-flex items-center gap-1 font-semibold text-[var(--state-danger)]">
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Prazo expirado em {formattedDeadline}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Conclusão até {formattedDeadline}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Seção de Progresso e Métricas */}
      <div className="space-y-2 pt-2 border-t border-[var(--border-default)]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[var(--text-secondary)]">
            {totalTasks === 0
              ? 'Nenhuma tarefa associada'
              : `${completedTasks} de ${totalTasks} etapas concluídas`}
          </span>
          <span
            className={`font-bold ${
              isCompleted
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-[var(--brand-primary)]'
            }`}
          >
            {progressPercent}%
          </span>
        </div>

        {/* Barra de Progresso Acessível */}
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso da meta ${goal.title}: ${progressPercent}%`}
          className="w-full h-2 rounded-full bg-[var(--bg-subtle)] overflow-hidden"
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-emerald-500'
                : isPurchase
                ? 'bg-purple-500'
                : 'bg-[var(--brand-primary)]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Acordeão de Tarefas Vinculadas */}
        {totalTasks > 0 && (
          <div className="pt-2">
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] rounded"
            >
              <span>Ver etapas vinculadas ({totalTasks})</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
              )}
            </button>

            {isExpanded && (
              <ul
                role="list"
                aria-label={`Tarefas vinculadas à meta ${goal.title}`}
                className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs"
              >
                {tasks.map((task) => {
                  const isTaskDone = task.status === 'DONE';
                  return (
                    <li
                      key={task.id}
                      className="p-2 rounded-lg bg-[var(--bg-subtle)] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {onToggleTaskStatus ? (
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={isTaskDone}
                            aria-label={`Marcar etapa "${task.title}" como ${
                              isTaskDone ? 'pendente' : 'concluída'
                            }`}
                            onClick={() => onToggleTaskStatus(task.id, task.status)}
                            className="cursor-pointer text-[var(--brand-primary)] focus-visible:outline-none"
                          >
                            {isTaskDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-[var(--text-muted)]" />
                            )}
                          </button>
                        ) : (
                          <span className="text-[var(--text-muted)]">
                            {isTaskDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-[var(--text-muted)]" />
                            )}
                          </span>
                        )}
                        <span
                          className={`truncate ${
                            isTaskDone
                              ? 'line-through text-[var(--text-muted)]'
                              : 'text-[var(--text-primary)]'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] shrink-0">
                        {task.status === 'DONE'
                          ? 'Concluída'
                          : task.status === 'IN_PROGRESS'
                          ? 'Em Andamento'
                          : 'A Fazer'}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </article>
  );
};
