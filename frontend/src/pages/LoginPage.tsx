import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { authService } from '../services';
import { useAuthStore } from '../stores';
import { getApiErrorMessage } from '../lib/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Verifica se o usuário foi redirecionado por sessão expirada
  const searchParams = new URLSearchParams(location.search);
  const isSessionExpired = searchParams.get('expired') === 'true';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setIsLoading(true);
      const data = await authService.login({ email, password });
      setAuth(data.user, data.token);

      // Redireciona para a página que tentou acessar ou para a raiz
      const from = (location.state as { from?: Location })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, 'E-mail ou senha incorretos.');
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 transition-colors duration-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] mx-auto flex items-center justify-center font-bold text-2xl shadow-md">
          T
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Entrar no TodoX
        </h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Organize sua rotina, metas e tarefas diárias
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[var(--bg-surface)] py-8 px-6 shadow-sm border border-[var(--border-default)] rounded-2xl sm:px-10">
          {/* Mensagem de sessão expirada */}
          {isSessionExpired && !errorMessage && (
            <div
              role="status"
              className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Sua sessão expirou. Por favor, faça login novamente.</span>
            </div>
          )}

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

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Input
              id="login-email"
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
              id="login-password"
              label="Senha"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              loadingText="Entrando..."
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Acessar Conta
            </Button>
          </form>

          <footer className="mt-6 pt-6 border-t border-[var(--border-default)] text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="font-semibold text-[var(--brand-primary)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)] rounded"
              >
                Cadastre-se gratuitamente
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};
