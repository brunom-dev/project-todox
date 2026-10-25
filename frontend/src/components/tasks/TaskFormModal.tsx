import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from '../ui';
import type { Task, Category, Goal, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  categories: Category[];
  goals: Goal[];
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  categories,
  goals,
  onSubmit,
}) => {
  const isEditing = Boolean(taskToEdit);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [goalId, setGoalId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState('');

  // Sincroniza formulário com a tarefa recebida para edição ou limpa para criação
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status);
      setCategoryId(taskToEdit.categoryId || '');
      setGoalId(taskToEdit.goalId || '');

      if (taskToEdit.dueDate) {
        try {
          const d = new Date(taskToEdit.dueDate);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          setDueDate(`${yyyy}-${mm}-${dd}`);
        } catch {
          setDueDate('');
        }
      } else {
        setDueDate('');
      }
    } else {
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setDueDate('');
      setCategoryId('');
      setGoalId('');
    }
    setTitleError('');
  }, [taskToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError('');

    if (!title.trim()) {
      setTitleError('O título da tarefa é obrigatório.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Converte a data selecionada para formato ISO 8601 com horário fim de dia
      let formattedIsoDate: string | null = null;
      if (dueDate) {
        formattedIsoDate = new Date(`${dueDate}T23:59:59.000Z`).toISOString();
      }

      const payload: CreateTaskInput = {
        title: title.trim(),
        description: description.trim() || null,
        status,
        dueDate: formattedIsoDate,
        categoryId: categoryId || null,
        goalId: goalId || null,
      };

      await onSubmit(payload);
      onClose();
    } catch {
      // Erro é tratado e exibido pelo chamador
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
      description={
        isEditing
          ? 'Atualize os dados e vínculos da sua tarefa.'
          : 'Cadastre uma nova atividade com prazo e categoria para acompanhar seu progresso.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Campo de Título */}
        <Input
          id="task-form-title"
          label="Título"
          placeholder="Ex: Finalizar relatório semanal"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          error={titleError}
          disabled={isSubmitting}
        />

        {/* Campo de Descrição */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="task-form-description"
            className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide"
          >
            Descrição (opcional)
          </label>
          <textarea
            id="task-form-description"
            rows={3}
            placeholder="Adicione detalhes, anotações ou observações úteis..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)] transition-all outline-none resize-none"
          />
        </div>

        {/* Grid com Status e Prazo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="task-form-status"
              className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide"
            >
              Status
            </label>
            <select
              id="task-form-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              disabled={isSubmitting}
              className="w-full h-11 px-3 text-sm rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)] transition-all outline-none cursor-pointer"
            >
              <option value="TODO">A Fazer</option>
              <option value="IN_PROGRESS">Em Andamento</option>
              <option value="DONE">Concluída</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="task-form-duedate"
              className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide"
            >
              Prazo de Conclusão
            </label>
            <input
              id="task-form-duedate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isSubmitting}
              className="w-full h-11 px-3 text-sm rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)] transition-all outline-none"
            />
          </div>
        </div>

        {/* Grid com Categoria e Meta Vinculada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="task-form-category"
              className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide"
            >
              Categoria
            </label>
            <select
              id="task-form-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isSubmitting}
              className="w-full h-11 px-3 text-sm rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)] transition-all outline-none cursor-pointer"
            >
              <option value="">Nenhuma Categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="task-form-goal"
              className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide"
            >
              Meta Associada
            </label>
            <select
              id="task-form-goal"
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              disabled={isSubmitting}
              className="w-full h-11 px-3 text-sm rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)] transition-all outline-none cursor-pointer"
            >
              <option value="">Nenhuma Meta</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ações do Rodapé */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border-default)]">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            loadingText={isEditing ? 'Salvando...' : 'Criando...'}
          >
            {isEditing ? 'Salvar Alterações' : 'Criar Tarefa'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
