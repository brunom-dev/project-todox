export interface GoalPurchaseMeta {
  isPurchase: boolean;
  targetPrice?: number | null;
  productUrl?: string | null;
}

export interface ParsedGoalDescription {
  cleanDescription: string;
  isPurchase: boolean;
  targetPrice: number | null;
  productUrl: string | null;
}

const PURCHASE_TAG_PREFIX = '<!-- TODOX_PURCHASE:';
const PURCHASE_TAG_SUFFIX = '-->';

/**
 * Extrai metadados de compra embutidos de forma não-destrutiva e retrocompatível na descrição da meta.
 */
export function parseGoalDescription(rawDescription?: string | null): ParsedGoalDescription {
  if (!rawDescription) {
    return {
      cleanDescription: '',
      isPurchase: false,
      targetPrice: null,
      productUrl: null,
    };
  }

  const trimmed = rawDescription.trim();
  const tagStart = trimmed.indexOf(PURCHASE_TAG_PREFIX);
  const tagEnd = trimmed.indexOf(PURCHASE_TAG_SUFFIX);

  if (tagStart !== -1 && tagEnd !== -1 && tagEnd > tagStart) {
    try {
      const jsonStr = trimmed
        .substring(tagStart + PURCHASE_TAG_PREFIX.length, tagEnd)
        .trim();
      const parsed = JSON.parse(jsonStr) as {
        isPurchase?: boolean;
        targetPrice?: number | null;
        productUrl?: string | null;
      };

      const cleanDescription = (
        trimmed.substring(0, tagStart) + trimmed.substring(tagEnd + PURCHASE_TAG_SUFFIX.length)
      ).trim();

      return {
        cleanDescription,
        isPurchase: Boolean(parsed.isPurchase),
        targetPrice: typeof parsed.targetPrice === 'number' ? parsed.targetPrice : null,
        productUrl: typeof parsed.productUrl === 'string' ? parsed.productUrl : null,
      };
    } catch {
      return {
        cleanDescription: rawDescription,
        isPurchase: false,
        targetPrice: null,
        productUrl: null,
      };
    }
  }

  return {
    cleanDescription: rawDescription,
    isPurchase: false,
    targetPrice: null,
    productUrl: null,
  };
}

/**
 * Serializa os metadados de compra na descrição mantendo o texto limpo legível.
 */
export function serializeGoalDescription(
  cleanDescription: string,
  purchaseMeta: GoalPurchaseMeta
): string {
  const desc = cleanDescription.trim();

  if (!purchaseMeta.isPurchase) {
    return desc;
  }

  const metaTag = `${PURCHASE_TAG_PREFIX} ${JSON.stringify({
    isPurchase: true,
    targetPrice: purchaseMeta.targetPrice || null,
    productUrl: purchaseMeta.productUrl || null,
  })} ${PURCHASE_TAG_SUFFIX}`;

  if (!desc) {
    return metaTag;
  }

  return `${desc}\n\n${metaTag}`;
}

/**
 * Formata um valor numérico para a moeda brasileira (BRL).
 */
export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
