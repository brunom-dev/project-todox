import React, { useState } from 'react';
import { Check, Calendar, AlertTriangle, Trash2 } from 'lucide-react';
import { Badge } from '../ui';
import type { Task, TaskStatus } from '../../types';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string, currentStatus: TaskStatus) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
  isToggling?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onDelete,
  onStatusChange,
  isToggling = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isDone = task.status === 'DONE';

  // Verificação de prazo de vencimento (Overdue)
  const isOverdue = React.useMemo(() => {
    if (!task.dueDate || isDone) return false;
    const due = new Date(task.dueDate);
    const now = new Date();
    // Vencido se a data for estritamente anterior ao momento atual
    return due.getTime() < now.getTime();
  }, [task.dueDate, isDone]);

  // Formatação de data em pt-BR
  const formattedDueDate = React.useMemo(() => {
    if (!task.dueDate) return null;
    try {
      const date = new Date(task.dueDate);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return null;
    }
  }, [task.dueDate]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Deseja realmente excluir a tarefa "${task.title}"?`)) {
      try {
        setIsDeleting(true);
        await onDelete(task.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusBadgeVariant = (status: TaskStatus) => {
    switch (status) {
      case 'DONE':
        return 'done';
      case 'IN_PROGRESS':
        return 'in_progress';
      default:
        return 'todo';
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'DONE':
        return 'Concluída';
      case 'IN_PROGRESS':
        return 'Em Andamento';
      default:
        return 'A Fazer';
    }
  };

  return (
    <article
      aria-label={`Tarefa: ${task.title}`}
      className={`group p-4 sm:p-5 rounded-2xl bg-[var(--bg-surface)] border transition-all duration-200 flex items-start gap-3.5 ${
        isDone
          ? 'border-[var(--border-default)]/60 bg-[var(--bg-surface)]/60 opacity-80'
          : 'border-[var(--border-default)] hover:border-[var(--border-hover)] shadow-xs hover:shadow-sm'
      }`}
    >
      {/* Botão de Checkbox Acessível para Alternar Status */}
      <button
        type="button"
        role="checkbox"
        aria-checked={isDone}
        aria-label={isDone ? `Marcar tarefa "${task.title}" como pendente` : `Marcar tarefa "${task.title}" como concluída`}
        disabled={isToggling}
        onClick={() => onToggleStatus(task.id, task.status)}
        className={`w-5 h-5 rounded-full mt-0.5 shrink-0 flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] ${
          isDone
            ? 'bg-[var(--status-done)] text-white shadow-xs'
            : task.status === 'IN_PROGRESS'
            ? 'border-2 border-[var(--status-in-progress)] bg-[var(--status-in-progress-bg)]'
            : 'border-2 border-[var(--border-hover)] hover:border-[var(--brand-primary)] bg-transparent'
        }`}
      >
        {isDone ? (
          <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
        ) : task.status === 'IN_PROGRESS' ? (
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--status-in-progress)]" aria-hidden="true" />
        ) : null}
      </button>

      {/* Conteúdo Central da Tarefa */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`text-sm sm:text-base font-semibold leading-snug tracking-tight break-words transition-all duration-150 ${
              isDone
                ? 'line-through text-[var(--text-muted)]'
                : 'text-[var(--text-primary)]'
            }`}
          >
            {task.title}
          </h3>

          {/* Ação de Exclusão */}
          <button
            type="button"
            aria-label={`Excluir tarefa: ${task.title}`}
            disabled={isDeleting}
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--state-danger)] hover:bg-[var(--state-danger-bg)] transition-all shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--state-danger)]"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Descrição opcional */}
        {task.description && (
          <p
            className={`text-xs sm:text-sm leading-relaxed break-words line-clamp-2 ${
              isDone ? 'text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Metadados: Badges de Categoria, Meta, Prazo e Status */}
        <div className="flex flex-wrap items-center gap-2 pt-1.5">
          {/* Badge de Status */}
          <Badge variant={getStatusBadgeVariant(task.status)}>
            {getStatusLabel(task.status)}
          </Badge>

          {/* Badge de Categoria */}
          {task.category && (
            <Badge
              variant={task.category.color ? 'custom' : 'neutral'}
              colorHex={task.category.color}
            >
              {task.category.name}
            </Badge>
          )}

          {/* Prazo de Vencimento */}
          {formattedDueDate && (
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${
                isOverdue
                  ? 'bg-[var(--state-danger-bg)] text-[var(--state-danger)] border-[var(--state-danger)]/20'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-default)]'
              }`}
            >
              {isOverdue ? (
                <AlertTriangle className="w-3.5 h-3.5 text-[var(--state-danger)]" aria-hidden="true" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
              )}
              <span>{isOverdue ? `Atrasada (${formattedDueDate})` : formattedDueDate}</span>
            </span>
          )}

          {/* Seletor rápido de Status (opcional para transição direta entre TODO, IN_PROGRESS e DONE) */}
          {onStatusChange && (
            <div className="ml-auto">
              <select
                aria-label={`Alterar status da tarefa ${task.title}`}
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                className="text-xs bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] rounded-md px-2 py-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]"
              >
                <option value="TODO">A Fazer</option>
                <option value="IN_PROGRESS">Em Andamento</option>
                <option value="DONE">Concluída</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
