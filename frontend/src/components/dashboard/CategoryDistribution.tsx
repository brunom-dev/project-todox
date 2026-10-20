import React from 'react';
import { PieChart } from 'lucide-react';
import { Badge } from '../ui';
import type { TaskByCategory } from '../../types';

interface CategoryDistributionProps {
  tasksByCategory: TaskByCategory[];
}

export const CategoryDistribution: React.FC<CategoryDistributionProps> = ({ tasksByCategory }) => {
  const totalCompletedWithCategory = tasksByCategory.reduce((sum, item) => sum + item.count, 0);

  return (
    <section aria-labelledby="category-dist-heading" className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-xs space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand-subtle)] text-[var(--brand-primary)] flex items-center justify-center">
            <PieChart className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2 id="category-dist-heading" className="text-base font-bold text-[var(--text-primary)]">
              Conclusão por Categoria
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">Distribuição das tarefas concluídas organizadas por contexto</p>
          </div>
        </div>
      </div>

      {tasksByCategory.length === 0 ? (
        <div className="p-6 text-center rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)]">
          <p className="text-sm font-medium text-[var(--text-primary)]">Nenhuma tarefa categorizada concluída</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Ao vincular categorias às suas tarefas e concluí-las, o gráfico de distribuição aparecerá aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {tasksByCategory.map((item) => (
              <Badge
                key={item.categoryId}
                variant="custom"
                colorHex={item.color}
                className="py-1 px-3 text-xs"
              >
                <span>{item.name}:</span>
                <span className="font-bold tabular-nums ml-1">{item.count}</span>
              </Badge>
            ))}
          </div>

          {/* Barra de distribuição percentual proporcional */}
          <div
            className="w-full h-3 rounded-full overflow-hidden flex bg-[var(--bg-subtle)] border border-[var(--border-default)]/30"
            role="img"
            aria-label="Gráfico de proporção de tarefas por categoria"
          >
            {tasksByCategory.map((item) => {
              const share = totalCompletedWithCategory > 0 ? (item.count / totalCompletedWithCategory) * 100 : 0;
              return (
                <div
                  key={item.categoryId}
                  style={{
                    width: `${share}%`,
                    backgroundColor: item.color || 'var(--brand-primary)',
                  }}
                  title={`${item.name}: ${item.count} (${share.toFixed(0)}%)`}
                  className="h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full"
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
