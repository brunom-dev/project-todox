import { useState, useEffect } from 'react';
import { Button, Input, Badge } from '../components/ui';
import { Sun, Moon, CheckCircle2, Plus, Search, ArrowRight, User as UserIcon, LogOut, Key } from 'lucide-react';
import { useAuthStore } from '../stores';

export function ShowcasePage() {
  const { user, setAuth, logout } = useAuthStore();
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('todox-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const [sampleError, setSampleError] = useState('');

  // Aplica a classe .dark no HTML raiz e persiste a preferência no localStorage
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('todox-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('todox-theme', 'light');
    }
  }, [isDark]);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between pb-6 border-b border-[var(--border-default)]">
        <div>
          <h1 className="text-xl font-bold tracking-tight">TodoX Design System</h1>
          <p className="text-xs text-[var(--text-secondary)]">Tokens, primitivos e estado reativo de sessão</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDark(!isDark)}
          aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          leftIcon={isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        >
          {isDark ? 'Modo Claro' : 'Modo Escuro'}
        </Button>
      </div>

      {/* Seção de Badges */}
      <section aria-labelledby="section-badges" className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4">
        <h2 id="section-badges" className="text-sm font-bold tracking-wide uppercase text-[var(--text-secondary)]">
          1. Badges & Indicadores de Status (A11y)
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="todo">Pendente (TODO)</Badge>
          <Badge variant="in_progress">Em Andamento</Badge>
          <Badge variant="done">Concluído</Badge>
          <Badge variant="neutral">Geral</Badge>
          <Badge variant="custom" colorHex="#8b5cf6">Faculdade (#8b5cf6)</Badge>
          <Badge variant="custom" colorHex="#06b6d4">Trabalho (#06b6d4)</Badge>
          <Badge variant="custom" colorHex="#ec4899">Saúde (#ec4899)</Badge>
        </div>
      </section>

      {/* Seção de Botões */}
      <section aria-labelledby="section-buttons" className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-6">
        <div className="flex items-center justify-between">
          <h2 id="section-buttons" className="text-sm font-bold tracking-wide uppercase text-[var(--text-secondary)]">
            2. Botões com Estados e Variantes
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBtnLoading(!btnLoading)}
          >
            Alternar Loading: {btnLoading ? 'Ativo' : 'Inativo'}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-xs font-medium text-[var(--text-muted)]">Variantes:</div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" isLoading={btnLoading} leftIcon={<Plus className="w-4 h-4" />}>
              Criar Nova Tarefa
            </Button>
            <Button variant="secondary" isLoading={btnLoading}>
              Salvar Rascunho
            </Button>
            <Button variant="outline" isLoading={btnLoading}>
              Filtrar Metas
            </Button>
            <Button variant="ghost" isLoading={btnLoading}>
              Cancelar
            </Button>
            <Button variant="danger" isLoading={btnLoading}>
              Excluir Tarefa
            </Button>
            <Button variant="primary" disabled>
              Desabilitado
            </Button>
          </div>

          <div className="text-xs font-medium text-[var(--text-muted)] pt-2">Tamanhos:</div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Tamanho Pequeno (sm)</Button>
            <Button size="md">Tamanho Médio (md)</Button>
            <Button size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Tamanho Grande (lg)
            </Button>
          </div>
        </div>
      </section>

      {/* Seção de Inputs */}
      <section aria-labelledby="section-inputs" className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-6">
        <div className="flex items-center justify-between">
          <h2 id="section-inputs" className="text-sm font-bold tracking-wide uppercase text-[var(--text-secondary)]">
            3. Inputs com Labels Acessíveis e Estados de Erro
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSampleError(sampleError ? '' : 'Este campo é obrigatório para continuar.')}
          >
            Simular Erro de Validação
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Título da Tarefa"
            placeholder="Ex: Entregar relatório de métricas"
            required
            helperText="Dê um nome claro e objetivo para sua atividade."
            error={sampleError}
          />

          <Input
            label="Buscar Tarefas"
            placeholder="Pesquisar por nome ou tag..."
            leftIcon={<Search className="w-4 h-4" />}
          />

          <Input
            label="Data de Entrega"
            type="date"
            helperText="Defina o prazo limite para a conclusão."
          />

          <Input
            label="Campo Bloqueado"
            value="Apenas para leitura"
            disabled
            helperText="Usuário não possui permissão para editar."
          />
        </div>
      </section>

      {/* Seção 4: Estado de Autenticação Reativo (useAuthStore) */}
      <section aria-labelledby="section-auth" className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="section-auth" className="text-sm font-bold tracking-wide uppercase text-[var(--text-secondary)]">
            4. Estado de Sessão Reativo (Zustand + Persist)
          </h2>
          <Badge variant={user ? 'done' : 'neutral'}>
            {user ? 'Autenticado' : 'Desconectado'}
          </Badge>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--brand-subtle)] text-[var(--brand-primary)] flex items-center justify-center font-bold">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {user ? user.name : 'Nenhum usuário logado'}
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                {user ? `${user.email} • ID: ${user.id}` : 'Acesse com suas credenciais ou teste a sessão'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Encerrar Sessão
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  setAuth(
                    {
                      id: 'usr-demo-123',
                      name: 'Bruno Macedo',
                      email: 'bruno@todox.dev',
                    },
                    'mock-jwt-token-xyz'
                  )
                }
                leftIcon={<Key className="w-4 h-4" />}
              >
                Simular Login
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Status de Validação */}
      <section className="p-4 rounded-xl bg-[var(--status-done-bg)] text-[var(--status-done)] border border-[var(--status-done-bg)] flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium">
          <strong>Módulos 1 e 2 Concluídos:</strong> Tokens semânticos, componentes primitivos acessíveis, cliente Axios centralizado e Store Zustand com persistência no LocalStorage.
        </p>
      </section>
    </div>
  );
}
