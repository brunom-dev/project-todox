import React from 'react';

export type BadgeVariant = 'todo' | 'in_progress' | 'done' | 'neutral' | 'custom';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  colorHex?: string | null;
  showDot?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  colorHex,
  showDot = true,
  children,
  className = '',
  style,
  ...props
}) => {
  const variantStyles: Record<Exclude<BadgeVariant, 'custom'>, { container: string; dot: string }> = {
    todo: {
      container: 'bg-[var(--status-todo-bg)] text-[var(--status-todo)] border-[var(--status-todo-bg)]',
      dot: 'bg-[var(--status-todo)]',
    },
    in_progress: {
      container: 'bg-[var(--status-in-progress-bg)] text-[var(--status-in-progress)] border-[var(--status-in-progress-bg)]',
      dot: 'bg-[var(--status-in-progress)]',
    },
    done: {
      container: 'bg-[var(--status-done-bg)] text-[var(--status-done)] border-[var(--status-done-bg)]',
      dot: 'bg-[var(--status-done)]',
    },
    neutral: {
      container: 'bg-[var(--bg-subtle)] text-[var(--text-secondary)] border-[var(--border-default)]',
      dot: 'bg-[var(--text-muted)]',
    },
  };

  // Suporte a cores dinâmicas customizadas de categorias (ex: HEX vindo do backend)
  const isCustom = variant === 'custom' && Boolean(colorHex);

  const customStyle: React.CSSProperties = isCustom
    ? {
        backgroundColor: `${colorHex}1a`, // 10% opacidade
        color: colorHex || undefined,
        borderColor: `${colorHex}33`,
        ...style,
      }
    : (style || {});

  const currentVariant = isCustom ? null : variantStyles[variant as Exclude<BadgeVariant, 'custom'>] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors select-none ${
        currentVariant ? currentVariant.container : ''
      } ${className}`}
      style={customStyle}
      {...props}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentVariant ? currentVariant.dot : ''}`}
          style={isCustom && colorHex ? { backgroundColor: colorHex } : undefined}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
