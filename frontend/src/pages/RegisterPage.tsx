import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle, ArrowRight, Sun, Moon } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { authService } from '../services';
import { useAuthStore, useThemeStore } from '../stores';
import { getApiErrorMessage } from '../lib/api';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      setIsLoading(true);
      // 1. Cadastra o novo usuário
      await authService.register({ name, email, password });

      // 2. Realiza o login automático para fluidez da experiência (UX)
      const authData = await authService.login({ email, password });
      setAuth(authData.user, authData.token);

      navigate('/', { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, 'Não foi possível concluir o cadastro.');
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 transition-colors duration-200 relative">
      {/* Botão de Alternância de Tema */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </Button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] mx-auto flex items-center justify-center font-bold text-2xl shadow-md">
          T
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Crie sua conta no TodoX
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Comece a gerenciar suas tarefas e metas com clareza
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--bg-surface)] py-8 px-6 shadow-sm border border-[var(--border-default)] rounded-2xl sm:px-10">
          {/* Feedback de erro acessível */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-6 p-3.5 rounded-xl bg-[var(--state-danger-bg)] border border-[var(--state-danger)]/20 text-[var(--state-danger)] text-xs font-medium flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              id="register-name"
              label="Nome Completo"
              required
              autoComplete="name"
              placeholder="Ex: Bruno Macedo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              id="register-email"
              label="E-mail"
              type="email"
              required
              autoComplete="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              id="register-password"
              label="Senha"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Mínimo de 6 caracteres"
              helperText="Escolha uma senha segura com números e símbolos."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              id="register-confirm-password"
              label="Confirmar Senha"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                loadingText="Criando conta..."
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Cadastrar e Começar
              </Button>
            </div>
          </form>

          <footer className="mt-6 pt-6 border-t border-[var(--border-default)] text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-semibold text-[var(--brand-primary)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] rounded"
              >
                Entrar com e-mail e senha
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
