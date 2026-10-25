import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Target, Plus, RefreshCw, AlertCircle, CheckCircle, TrendingUp, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui';
import {
  GoalCard,
  GoalFormModal,
  GoalSkeleton,
  GoalEmptyState,
} from '../components/goals';
import { goalService, taskService } from '../services';
import { getApiErrorMessage } from '../lib/api';
import { parseGoalDescription, formatCurrencyBRL } from '../lib/goalHelper';
import type { Goal, TaskStatus } from '../types';
import type { CreateGoalInput, UpdateGoalInput } from '../services';

type GoalTypeFilter = 'ALL' | 'GENERAL' | 'PURCHASE';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Filtro por tipo de meta
  const [typeFilter, setTypeFilter] = useState<GoalTypeFilter>('ALL');

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Não foi possível carregar o painel de metas.');
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Métricas Consolidadas das Metas (incluindo totais de compras)
  const metrics = useMemo(() => {
    const total = goals.length;
    let completed = 0;
    let totalProgressSum = 0;
    let purchaseCount = 0;
    let totalPurchaseValue = 0;

    goals.forEach((g) => {
      const tasks = g.tasks || [];
      const totalTasks = tasks.length;
      const doneTasks = tasks.filter((t) => t.status === 'DONE').length;

      if (totalTasks > 0 && doneTasks === totalTasks) {
        completed++;
      }

      if (totalTasks > 0) {
        totalProgressSum += (doneTasks / totalTasks) * 100;
      }

      const parsed = parseGoalDescription(g.description);
      if (parsed.isPurchase) {
        purchaseCount++;
        if (parsed.targetPrice) {
          totalPurchaseValue += parsed.targetPrice;
        }
      }
    });

    const generalCount = total - purchaseCount;
    const averageProgress = total === 0 ? 0 : Math.round(totalProgressSum / total);

    return { total, completed, averageProgress, purchaseCount, generalCount, totalPurchaseValue };
  }, [goals]);

  // Filtragem por tipo
  const filteredGoals = useMemo(() => {
    if (typeFilter === 'ALL') return goals;
    return goals.filter((g) => {
      const parsed = parseGoalDescription(g.description);
      if (typeFilter === 'PURCHASE') return parsed.isPurchase;
      return !parsed.isPurchase;
    });
  }, [goals, typeFilter]);

  // Abertura do Modal de Criação / Edição
  const handleOpenCreateModal = () => {
    setGoalToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (goal: Goal) => {
    setGoalToEdit(goal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setGoalToEdit(null);
  };

  // Criação ou Edição
  const handleSaveGoal = async (data: CreateGoalInput | UpdateGoalInput) => {
    try {
      if (goalToEdit) {
        const updated = await goalService.updateGoal(goalToEdit.id, data);
        // Preserva as tarefas já carregadas
        setGoals((prev) =>
          prev.map((g) => (g.id === updated.id ? { ...updated, tasks: g.tasks } : g))
        );
        setSuccessToast('Meta atualizada com sucesso!');
      } else {
        const created = await goalService.createGoal(data as CreateGoalInput);
        setGoals((prev) => [{ ...created, tasks: [] }, ...prev]);
        setSuccessToast('Nova meta cadastrada com sucesso!');
      }
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao salvar meta.');
      setErrorMessage(message);
      throw error;
    }
  };

  // Exclusão
  const handleDeleteGoal = async (id: string) => {
    try {
      await goalService.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
      setSuccessToast('Meta excluída com sucesso.');
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao excluir meta.');
      setErrorMessage(message);
    }
  };

  // Alternância rápida de status de uma tarefa vinculada diretamente pelo card da meta
  const handleToggleTaskStatus = async (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';

    // Atualização otimista
    setGoals((prev) =>
      prev.map((g) => ({
        ...g,
        tasks: g.tasks?.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
      }))
    );

    try {
      await taskService.updateTask(taskId, { status: nextStatus });
    } catch (error) {
      // Reversão em caso de erro
      setGoals((prev) =>
        prev.map((g) => ({
          ...g,
          tasks: g.tasks?.map((t) => (t.id === taskId ? { ...t, status: currentStatus } : t)),
        }))
      );
      const message = getApiErrorMessage(error, 'Erro ao atualizar tarefa da meta.');
      setErrorMessage(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast de Sucesso */}
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

      {/* Cabeçalho da Página de Metas */}
      <section
        aria-labelledby="goals-page-heading"
        className="p-6 md:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1
              id="goals-page-heading"
              className="text-2xl font-bold tracking-tight text-[var(--text-primary)]"
            >
              Painel de Metas & Compras
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
              {metrics.total} {metrics.total === 1 ? 'meta ativa' : 'metas ativas'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Acompanhe seus objetivos estratégicos, metas de compras e a evolução das etapas vinculadas.
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
            aria-label="Atualizar lista de metas"
          >
            Atualizar
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nova Meta
          </Button>
        </div>
      </section>

      {/* Cartões de Resumo Analítico com Destaque de Compras */}
      {goals.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[var(--brand-subtle)] text-[var(--brand-primary)] flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Total de Metas</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">{metrics.total}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">100% Concluídas</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">{metrics.completed}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Metas de Compra</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">{metrics.purchaseCount}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Total Planejado (Compras)</p>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {metrics.totalPurchaseValue > 0
                  ? formatCurrencyBRL(metrics.totalPurchaseValue)
                  : `${metrics.averageProgress}% med.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Abas de Filtro por Tipo de Meta */}
      {goals.length > 0 && !isLoading && (
        <nav
          aria-label="Filtro de metas por tipo"
          className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] max-w-md overflow-x-auto"
        >
          <button
            type="button"
            onClick={() => setTypeFilter('ALL')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>Todas</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[var(--border-default)] text-[var(--text-muted)]">
              {metrics.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter('GENERAL')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              typeFilter === 'GENERAL'
                ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <span>Objetivos Gerais</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[var(--border-default)] text-[var(--text-muted)]">
              {metrics.generalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setTypeFilter('PURCHASE')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              typeFilter === 'PURCHASE'
                ? 'bg-[var(--bg-surface)] text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Compras</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-[var(--border-default)] text-[var(--text-muted)]">
              {metrics.purchaseCount}
            </span>
          </button>
        </nav>
      )}

      {/* Mensagem de Erro */}
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

      {/* Lista de Metas / Skeletons / Estado Vazio */}
      <section aria-label="Painel de Metas">
        {isLoading && goals.length === 0 ? (
          <GoalSkeleton />
        ) : filteredGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteGoal}
                onToggleTaskStatus={handleToggleTaskStatus}
              />
            ))}
          </div>
        ) : (
          <GoalEmptyState onCreateGoal={handleOpenCreateModal} />
        )}
      </section>

      {/* Modal de Criação / Edição de Metas */}
      <GoalFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        goalToEdit={goalToEdit}
        onSubmit={handleSaveGoal}
      />
    </div>
  );
};
