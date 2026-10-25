import React from 'react';
import { Search, X, Tag } from 'lucide-react';
import type { Category, TaskStatus } from '../../types';

export type StatusFilterOption = 'ALL' | TaskStatus;

interface TaskFiltersProps {
  status: StatusFilterOption;
  onStatusChange: (status: StatusFilterOption) => void;
  categoryId: string;
  onCategoryChange: (categoryId: string) => void;
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  taskCounts: {
    all: number;
    todo: number;
    in_progress: number;
    done: number;
  };
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  status,
  onStatusChange,
  categoryId,
  onCategoryChange,
  categories,
  searchQuery,
  onSearchChange,
  taskCounts,
}) => {
  const tabs: Array<{ id: StatusFilterOption; label: string; count: number }> = [
    { id: 'ALL', label: 'Todas', count: taskCounts.all },
    { id: 'TODO', label: 'A Fazer', count: taskCounts.todo },
    { id: 'IN_PROGRESS', label: 'Em Andamento', count: taskCounts.in_progress },
    { id: 'DONE', label: 'Concluídas', count: taskCounts.done },
  ];

  return (
    <div className="space-y-4">
      {/* Abas de Status com semântica e suporte a teclado */}
      <nav
        aria-label="Filtro de tarefas por status"
        className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] overflow-x-auto"
      >
        {tabs.map((tab) => {
          const isActive = status === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onStatusChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] ${
                isActive
                  ? 'bg-[var(--bg-surface)] text-[var(--brand-primary)] shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-[var(--brand-subtle)] text-[var(--brand-primary)]'
                    : 'bg-[var(--border-default)] text-[var(--text-muted)]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Linha Secundária: Barra de Busca e Filtro de Categorias */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Campo de Busca Acessível */}
        <div className="relative flex-1 max-w-md">
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]"
            aria-hidden="true"
          >
            <Search className="w-4 h-4" />
          </div>
          <input
            type="search"
            aria-label="Buscar tarefas por título ou descrição"
            placeholder="Buscar tarefas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-9 pr-9 text-xs sm:text-sm rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)] transition-all outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Limpar busca"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Seletor de Categorias */}
        <div className="flex items-center gap-2">
          <label htmlFor="category-filter" className="sr-only">
            Filtrar por Categoria
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-[var(--text-muted)] pointer-events-none" aria-hidden="true">
              <Tag className="w-3.5 h-3.5" />
            </div>
            <select
              id="category-filter"
              value={categoryId}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-10 pl-8 pr-8 text-xs font-medium rounded-xl bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)] transition-all outline-none cursor-pointer"
            >
              <option value="ALL">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
