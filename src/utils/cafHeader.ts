import * as React from "react";
import { cn } from "./cn";

export interface CafHeaderNavItem {
  /** Identificador único do item de navegação */
  id: string;
  /** Rótulo textual ou elemento renderizado do item */
  label: React.ReactNode;
  /** URL de destino do item de navegação */
  href: string;
  /** Rota interna opcional do Next.js */
  route?: string;
  /** Ícone opcional exibido ao lado do texto */
  icon?: React.ReactNode;
  /** Badge numérico ou tag informativa complementar */
  badge?: React.ReactNode;
  /** Se o item está desabilitado para interação */
  disabled?: boolean;
}

/**
 * Itens padrão de navegação do Sistema-CAF extraídos diretamente do design de referência.
 * Cada item possui id, label e href associado.
 */
export const CAF_DEFAULT_HEADER_ITEMS: CafHeaderNavItem[] = [
  { id: "avaliacoes", label: "Avaliações", href: "/avaliacoes" },
  { id: "categorias", label: "Categorias", href: "/categorias" },
  { id: "criterios", label: "Critérios de Avaliação", href: "/criterios" },
  { id: "salas", label: "Salas", href: "/salas" },
];

/**
 * Garante que todos os itens de navegação recebam um href definido (usando href, route ou derivando de id).
 */
export function resolveCafHeaderItems<
  T extends { id: string; label: React.ReactNode; href?: string; route?: string },
>(items: T[]): Array<T & { href: string }> {
  return items.map((item) => ({
    ...item,
    href: item.href || item.route || `/${item.id}`,
  }));
}

/**
 * Renderiza o elemento de badge de um item do CafHeader com estilos adequados ao estado (ativo ou inativo).
 * Se o badge for um número ou texto simples recebido externamente, aplica automaticamente a pílula adaptativa.
 */
export function renderCafHeaderBadge(
  badge: React.ReactNode,
  isActive: boolean,
): React.ReactNode {
  if (badge === null || badge === undefined || badge === false) {
    return null;
  }

  if (typeof badge === "number" || typeof badge === "string") {
    return React.createElement(
      "span",
      {
        className: cn(
          "px-1.5 py-0.5 text-[10px] font-bold rounded-full transition-colors",
          isActive
            ? "bg-white text-[#0b3299]"
            : "bg-slate-200 text-slate-700",
        ),
      },
      badge,
    );
  }

  return badge;
}

export interface GetCafHeaderItemClassOptions {
  isActive: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Retorna as classes utilitárias de estilo para cada botão/item de navegação do Header do Sistema-CAF.
 *
 * Estados visuais:
 * - Ativo / Selecionado: Fundo azul escuro anil sólido (#0b3299), texto branco em negrito, sombra sutil.
 * - Inativo Hover: Fundo em tom azul suave/translúcido (#0b3299 com 10% de opacidade ou blue-50), texto em azul anil.
 * - Inativo Padrão: Fundo transparente, texto cinza ardósia suave (text-slate-600).
 */
export function getCafHeaderItemClass({
  isActive,
  disabled = false,
  className,
}: GetCafHeaderItemClassOptions): string {
  if (disabled) {
    return cn(
      "inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all select-none opacity-40 cursor-not-allowed text-slate-400",
      className,
    );
  }

  if (isActive) {
    return cn(
      "inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl select-none transition-all duration-150",
      "bg-[#0b3299] text-white shadow-2xs cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299] focus-visible:ring-offset-2",
      className,
    );
  }

  return cn(
    "inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-normal rounded-xl select-none transition-all duration-150",
    "text-slate-600 cursor-pointer",
    // Hover com tom azul suave (azul mais fraco)
    "hover:bg-[#0b3299]/10 hover:text-[#0b3299] hover:font-medium active:bg-[#0b3299]/15",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299]/50 focus-visible:ring-offset-2",
    className,
  );
}

export type CafHeaderVariant = "floating" | "fixed" | "full";

export interface ResolveCafHeaderContainerClassOptions {
  variant?: CafHeaderVariant;
  className?: string;
}

/**
 * Retorna as classes CSS para o container externo do CafHeader.
 */
export function resolveCafHeaderContainerClass({
  variant = "floating",
  className,
}: ResolveCafHeaderContainerClassOptions): string {
  const base = "w-full transition-all duration-200";

  switch (variant) {
    case "floating":
      return cn(
        base,
        "rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs p-2 sm:px-4 sm:py-2.5",
        className,
      );
    case "fixed":
      return cn(
        base,
        "sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs px-4 py-2.5 sm:px-6",
        className,
      );
    case "full":
      return cn(
        base,
        "border-b border-slate-200/90 bg-white px-4 py-2.5 sm:px-6",
        className,
      );
    default:
      return cn(base, className);
  }
}

export interface UseCafHeaderStateParams {
  items?: CafHeaderNavItem[];
  activeId?: string | null;
  defaultActiveId?: string | null;
  onItemClick?: (item: CafHeaderNavItem, index: number) => void;
  onActiveChange?: (id: string | null) => void;
  allowDeselect?: boolean;
}

/**
 * Hook utilitário que isola o gerenciamento de seleção de itens e navegação do CafHeader.
 */
export function useCafHeaderState({
  items = CAF_DEFAULT_HEADER_ITEMS,
  activeId,
  defaultActiveId,
  onItemClick,
  onActiveChange,
  allowDeselect = true,
}: UseCafHeaderStateParams) {
  const [internalActiveId, setInternalActiveId] = React.useState<string | null | undefined>(
    defaultActiveId,
  );

  React.useEffect(() => {
    setInternalActiveId(defaultActiveId);
  }, [defaultActiveId]);

  const isControlled = activeId !== undefined;
  const currentActiveId = isControlled ? activeId : internalActiveId;

  const handleSelect = React.useCallback(
    (item: CafHeaderNavItem, index: number) => {
      if (item.disabled) return;

      const nextId = allowDeselect && currentActiveId === item.id ? null : item.id;

      if (!isControlled) {
        setInternalActiveId(nextId);
      }

      onActiveChange?.(nextId);
      onItemClick?.(item, index);
    },
    [isControlled, currentActiveId, allowDeselect, onActiveChange, onItemClick],
  );

  return {
    currentActiveId,
    handleSelect,
    items,
  };
}
