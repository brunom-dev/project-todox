import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      id: customId,
      required,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    // Conecta mensagens informativas e de erro ao leitor de tela
    const describedBy = [
      error ? errorId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide flex items-center gap-1 select-none"
        >
          <span>{label}</span>
          {required && (
            <span className="text-[var(--state-danger)]" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <div className="relative flex items-center">
          {leftIcon && (
            <div
              className="absolute left-3.5 flex items-center pointer-events-none text-[var(--text-muted)]"
              aria-hidden="true"
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full h-11 px-3.5 text-sm rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] border transition-all duration-150 outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-[var(--state-danger)] focus:border-[var(--state-danger)] focus:ring-2 focus:ring-[var(--state-danger-bg)]'
                : 'border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)]'
            } ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-[var(--text-muted)]">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-xs text-[var(--state-danger)] font-medium flex items-center gap-1 mt-0.5"
          >
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p
            id={helperId}
            className="text-xs text-[var(--text-muted)] mt-0.5"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
