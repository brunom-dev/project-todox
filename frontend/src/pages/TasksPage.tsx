import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui';
import {
  TaskCard,
  TaskFilters,
  TaskSkeleton,
  TaskEmptyState,
  TaskFormModal,
  type StatusFilterOption,
} from '../components/tasks';
import { taskService, categoryService, goalService } from '../services';
import { getApiErrorMessage } from '../lib/api';
import type { Task, Category, Goal, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../types';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Estados de Filtros
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);

  // Estados do Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Carrega as tarefas, categorias e metas
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [tasksData, categoriesData, goalsData] = await Promise.all([
        taskService.getTasks(),
        categoryService.getCategories(),
        goalService.getGoals(),
      ]);

      setTasks(tasksData);
      setCategories(categoriesData);
      setGoals(goalsData);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Não foi possível carregar as tarefas.');
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Contadores para as abas
  const taskCounts = useMemo(() => {
    const all = tasks.length;
    const todo = tasks.filter((t) => t.status === 'TODO').length;
    const in_progress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const done = tasks.filter((t) => t.status === 'DONE').length;

    return { all, todo, in_progress, done };
  }, [tasks]);

  // Filtragem combinada (Status, Categoria e Busca por Texto)
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Filtro por status
      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }

      // 2. Filtro por categoria
      if (categoryFilter !== 'ALL' && task.categoryId !== categoryFilter) {
        return false;
      }

      // 3. Filtro por busca
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description?.toLowerCase().includes(query) || false;
        if (!matchTitle && !matchDesc) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, statusFilter, categoryFilter, searchQuery]);

  // Alternância rápida de status (com atualização otimista)
  const handleToggleStatus = async (id: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';

    // Atualização otimista
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
    setTogglingTaskId(id);

    try {
      await taskService.updateTask(id, { status: nextStatus });
      if (nextStatus === 'DONE') {
        setSuccessToast('Tarefa concluída com sucesso! 🎉');
        setTimeout(() => setSuccessToast(''), 3000);
      }
    } catch (error) {
      // Reversão em caso de falha
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: currentStatus } : t))
      );
      const message = getApiErrorMessage(error, 'Erro ao atualizar status da tarefa.');
      setErrorMessage(message);
    } finally {
      setTogglingTaskId(null);
    }
  };

  // Alteração direta de status
  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    const previousTask = tasks.find((t) => t.id === id);
    if (!previousTask || previousTask.status === newStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTask(id, { status: newStatus });
    } catch (error) {
      // Reversão
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: previousTask.status } : t))
      );
      const message = getApiErrorMessage(error, 'Erro ao alterar status da tarefa.');
      setErrorMessage(message);
    }
  };

  // Exclusão de tarefa
  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setSuccessToast('Tarefa excluída.');
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao excluir tarefa.');
      setErrorMessage(message);
    }
  };

  // Handlers do Modal de Tarefa
  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleSaveTask = async (data: CreateTaskInput | UpdateTaskInput) => {
    try {
      if (taskToEdit) {
        const updated = await taskService.updateTask(taskToEdit.id, data);
        // Atualiza a tarefa na lista local
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setSuccessToast('Tarefa atualizada com sucesso!');
      } else {
        const created = await taskService.createTask(data as CreateTaskInput);
        // Insere a nova tarefa no início da lista
        setTasks((prev) => [created, ...prev]);
        setSuccessToast('Nova tarefa criada com sucesso!');
      }
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao salvar a tarefa.');
      setErrorMessage(message);
      throw error;
    }
  };

  const isFiltered = statusFilter !== 'ALL' || categoryFilter !== 'ALL' || searchQuery.trim().length > 0;

  const handleClearFilters = () => {
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Toast de Sucesso com A11y */}
      {successToast && (
        <div
          role="status"
          aria-live="polite"
          className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in"
        >
          <CheckCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Cabeçalho da Página */}
      <section
        aria-labelledby="tasks-page-heading"
        className="p-6 md:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1
              id="tasks-page-heading"
              className="text-2xl font-bold tracking-tight text-[var(--text-primary)]"
            >
              Minhas Tarefas
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              {taskCounts.todo} a fazer
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Organize, filtre e acompanhe todas as suas atividades em um só lugar.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            isLoading={isLoading}
            loadingText="Atualizando..."
            leftIcon={<RefreshCw className="w-4 h-4" />}
            aria-label="Atualizar lista de tarefas"
          >
            Atualizar
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nova Tarefa
          </Button>
        </div>
      </section>

      {/* Alerta de Erro */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 rounded-xl bg-[var(--state-danger-bg)] border border-[var(--state-danger)]/20 text-[var(--state-danger)] text-xs sm:text-sm font-medium flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
          <Button variant="danger" size="sm" onClick={loadData}>
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <TaskFilters
        status={statusFilter}
        onStatusChange={setStatusFilter}
        categoryId={categoryFilter}
        onCategoryChange={setCategoryFilter}
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        taskCounts={taskCounts}
      />

      {/* Lista de Tarefas / Skeletons / Estado Vazio */}
      <section aria-label="Lista de Tarefas">
        {isLoading && tasks.length === 0 ? (
          <TaskSkeleton />
        ) : filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
                isToggling={togglingTaskId === task.id}
              />
            ))}
          </div>
        ) : (
          <TaskEmptyState
            isFiltered={isFiltered}
            onClearFilters={handleClearFilters}
            onCreateTask={handleOpenCreateModal}
          />
        )}
      </section>

      {/* Modal Acessível de Criação / Edição de Tarefas */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        taskToEdit={taskToEdit}
        categories={categories}
        goals={goals}
        onSubmit={handleSaveTask}
      />
    </div>
  );
};
