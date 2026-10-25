import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Modal, Button, Input } from '../ui';
import type { Goal } from '../../types';
import type { CreateGoalInput, UpdateGoalInput } from '../../services';
import { parseGoalDescription, serializeGoalDescription } from '../../lib/goalHelper';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: Goal | null;
  onSubmit: (data: CreateGoalInput | UpdateGoalInput) => Promise<void>;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
  onSubmit,
}) => {
  const isEditing = Boolean(goalToEdit);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isPurchase, setIsPurchase] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [productUrl, setProductUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);

      const parsed = parseGoalDescription(goalToEdit.description);
      setDescription(parsed.cleanDescription);
      setIsPurchase(parsed.isPurchase);
      setTargetPrice(parsed.targetPrice !== null ? String(parsed.targetPrice) : '');
      setProductUrl(parsed.productUrl || '');

      if (goalToEdit.deadline) {
        try {
          const d = new Date(goalToEdit.deadline);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          setDeadline(`${yyyy}-${mm}-${dd}`);
        } catch {
          setDeadline('');
        }
      } else {
        setDeadline('');
      }
    } else {
      setTitle('');
      setDescription('');
      setDeadline('');
      setIsPurchase(false);
      setTargetPrice('');
      setProductUrl('');
    }
    setTitleError('');
  }, [goalToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError('');

    if (!title.trim()) {
      setTitleError('O título da meta é obrigatório.');
      return;
    }

    try {
      setIsSubmitting(true);

      let formattedIsoDeadline: string | null = null;
      if (deadline) {
        formattedIsoDeadline = new Date(`${deadline}T23:59:59.000Z`).toISOString();
      }

      // Converte preço digitado (suporta vírgula ou ponto)
      let parsedPrice: number | null = null;
      if (isPurchase && targetPrice.trim()) {
        const cleaned = targetPrice.replace(/\./g, '').replace(',', '.');
        const num = parseFloat(cleaned);
        if (!isNaN(num) && num > 0) {
          parsedPrice = num;
        }
      }

      // Serializa os metadados de compra de forma não invasiva na descrição
      const finalDescription = serializeGoalDescription(description, {
        isPurchase,
        targetPrice: parsedPrice,
        productUrl: productUrl.trim() || null,
      });

      const payload: CreateGoalInput = {
        title: title.trim(),
        description: finalDescription || null,
        deadline: formattedIsoDeadline,
      };

      await onSubmit(payload);
      onClose();
    } catch {
      // O erro é tratado pelo chamador
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Meta' : 'Nova Meta'}
      description={
        isEditing
          ? 'Atualize o título, descrição ou prazo da sua meta estratégica.'
          : 'Cadastre um objetivo pessoal ou uma meta de compra de médio/longo prazo.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Título */}
        <Input
          id="goal-form-title"
          label="Título da Meta"
          placeholder="Ex: Comprar Notebook Novo ou Passar no Semestre"
          required
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          error={titleError}
          disabled={isSubmitting}
        />

        {/* Bloco de Opção: Meta de Compra */}
        <div className="p-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-subtle)]/50 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPurchase}
              onChange={(e) => setIsPurchase(e.target.checked)}
              disabled={isSubmitting}
              className="w-4 h-4 rounded text-[var(--brand-primary)] border-[var(--border-default)] focus:ring-[var(--brand-primary)] cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-500" aria-hidden="true" />
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                Esta meta representa uma Compra / Aquisição
              </span>
            </div>
          </label>

          {/* Campos adicionais para meta de compra */}
          {isPurchase && (
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-[var(--border-default)] animate-in fade-in">
              <Input
                id="goal-form-price"
                label="Valor Estimado / Alvo (R$)"
                placeholder="Ex: 3500,00"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                disabled={isSubmitting}
              />

              <Input
                id="goal-form-url"
                label="Link do Produto / Loja"
                placeholder="https://..."
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          )}
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="goal-form-description"
            className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide"
          >
            Descrição (opcional)
          </label>
          <textarea
            id="goal-form-description"
            rows={3}
            placeholder="Detalhes, especificações ou motivações do objetivo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)] transition-all outline-none resize-none"
          />
        </div>

        {/* Prazo Final */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="goal-form-deadline"
            className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide"
          >
            Prazo Final de Conclusão (opcional)
          </label>
          <input
            id="goal-form-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            disabled={isSubmitting}
            className="w-full h-11 px-3 text-sm rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-subtle)] transition-all outline-none"
          />
        </div>

        {/* Botões do Rodapé */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-[var(--border-default)]">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            loadingText={isEditing ? 'Salvando...' : 'Criando...'}
          >
            {isEditing ? 'Salvar Alterações' : 'Criar Meta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
