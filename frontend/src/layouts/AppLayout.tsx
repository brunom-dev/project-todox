import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut, CheckSquare, BarChart2, Palette } from 'lucide-react';
import { Button } from '../components/ui';
import { useAuthStore, useThemeStore } from '../stores';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <BarChart2 className="w-4 h-4" /> },
    { label: 'Tarefas', path: '/tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { label: 'Design System', path: '/showcase', icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200 flex flex-col">
      {/* Header com semântica estrita e acessibilidade */}
      <header className="border-b border-[var(--border-default)] bg-[var(--bg-surface)] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] rounded-lg">
              <div className="w-9 h-9 rounded-xl bg-[var(--brand-primary)] text-[var(--brand-contrast)] flex items-center justify-center font-bold text-lg shadow-sm">
                T
              </div>
              <span className="font-bold tracking-tight text-lg">TodoX</span>
            </Link>

            <nav aria-label="Navegação Principal" className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--brand-subtle)] text-[var(--brand-primary)] font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Alternador de Tema */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </Button>

            {/* Dados do Usuário e Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-[var(--border-default)]">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate max-w-[150px]">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-[10px] text-[var(--text-secondary)] truncate max-w-[150px]">
                  {user?.email}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                aria-label="Encerrar sessão"
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo dinâmico da rota filha */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};
