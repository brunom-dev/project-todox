import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = 'button',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    // Variantes de estilo com base nos tokens semânticos
    const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-[var(--brand-primary)] hover:bg-[var(--brand-hover)] text-[var(--brand-contrast)] shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2',
      secondary:
        'bg-[var(--bg-subtle)] hover:bg-[var(--border-default)] text-[var(--text-primary)] border border-[var(--border-default)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2',
      outline:
        'bg-transparent hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-default)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2',
      ghost:
        'bg-transparent hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2',
      danger:
        'bg-[var(--state-danger)] hover:bg-[var(--state-danger-hover)] text-white shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--state-danger)] focus-visible:ring-offset-2',
    };

    // Tamanhos ergonômicos e acessíveis ao toque (mínimo recomendado para touch targets: 44px)
    const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-9 px-3 text-xs gap-1.5 rounded-md min-w-[36px]',
      md: 'h-11 px-4 text-sm gap-2 rounded-lg min-w-[44px]',
      lg: 'h-12 px-6 text-base gap-2.5 rounded-xl min-w-[48px]',
    };

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        className={`inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98] disabled:active:scale-100 ${
          fullWidth ? 'w-full' : ''
        } ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="sr-only">Carregando...</span>
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0" aria-hidden="true">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0" aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
