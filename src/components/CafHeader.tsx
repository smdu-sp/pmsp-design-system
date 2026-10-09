import * as React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import {
  type CafHeaderNavItem,
  type CafHeaderVariant,
  CAF_DEFAULT_HEADER_ITEMS,
  getCafHeaderItemClass,
  renderCafHeaderBadge,
  resolveCafHeaderContainerClass,
  resolveCafHeaderItems,
  useCafHeaderState,
} from "@/utils/cafHeader";

export {
  CAF_DEFAULT_HEADER_ITEMS,
  getCafHeaderItemClass,
  renderCafHeaderBadge,
  resolveCafHeaderContainerClass,
  resolveCafHeaderItems,
  useCafHeaderState,
};
export type { CafHeaderNavItem, CafHeaderVariant };

export interface CafHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Lista de itens de navegação do header (cada item possui id, label e href) */
  items?: CafHeaderNavItem[];
  /** Valores de badges recebidos externamente indexados pelo id do item (ex: { avaliacoes: 12, salas: 48 }) */
  badges?: Record<string, React.ReactNode>;
  /** Identificador do item atualmente ativo (modo controlado, use null para nenhum) */
  activeId?: string | null;
  /** Identificador do item ativo inicial (modo não controlado, use null para nenhum) */
  defaultActiveId?: string | null;
  /** Permite desselecionar o item clicando novamente sobre ele (padrão: true) */
  allowDeselect?: boolean;
  /** Callback acionado ao alterar o item ativo */
  onActiveChange?: (id: string | null) => void;
  /** Callback acionado ao clicar em um item de navegação */
  onItemClick?: (item: CafHeaderNavItem, index: number) => void;
  /** Alinhamento horizontal dos itens ('start' | 'center' | 'end' | 'between') */
  align?: "start" | "center" | "end" | "between";
  /** Variante visual de container ('floating' | 'fixed' | 'full') */
  variant?: CafHeaderVariant;
  /** Elemento opcional exibido no canto esquerdo (ex: logotipo da instituição ou título) */
  logo?: React.ReactNode;
  /** Elemento opcional exibido no canto direito (ex: usuário logado, notificações, botão de sair) */
  rightContent?: React.ReactNode;
  /** Estilo inline adicional para customização */
  style?: React.CSSProperties;
}

/**
 * Componente de Cabeçalho / Barra de Navegação especializado para o **Sistema-CAF**.
 *
 * Apresenta:
 * - Fundo branco puro em container arredondado (`rounded-2xl`) com borda suave.
 * - Efeito ao clicar / selecionar: fundo azul anil sólido (#0b3299) com texto em branco (`font-semibold`).
 * - Efeito no hover de itens não selecionados: fundo azul suave/translúcido (#0b3299/10) com texto em azul anil.
 * - Cada item possui rota/URL de destino (`href`), garantindo navegação com Next.js Link e acessibilidade.
 */
export const CafHeader = React.forwardRef<HTMLElement, CafHeaderProps>(
  (
    {
      items = CAF_DEFAULT_HEADER_ITEMS,
      badges,
      activeId,
      defaultActiveId,
      allowDeselect = true,
      onActiveChange,
      onItemClick,
      align = "center",
      variant = "floating",
      logo,
      rightContent,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const resolvedItems = React.useMemo(() => resolveCafHeaderItems(items), [items]);

    const { currentActiveId, handleSelect } = useCafHeaderState({
      items: resolvedItems,
      activeId,
      defaultActiveId,
      allowDeselect,
      onItemClick,
      onActiveChange,
    });

    const alignClass =
      align === "start"
        ? "justify-start"
        : align === "end"
          ? "justify-end"
          : align === "between"
            ? "justify-between"
            : "justify-center";

    return (
      <header
        ref={ref}
        role="banner"
        className={resolveCafHeaderContainerClass({ variant, className })}
        style={style}
        {...props}
      >
        <div className="w-full flex items-center justify-between gap-4">
          {/* Logo / Conteúdo à esquerda (se fornecido) */}
          {logo && <div className="shrink-0 flex items-center">{logo}</div>}

          {/* Região central de navegação */}
          <nav
            role="navigation"
            aria-label="Navegação principal do Sistema-CAF"
            className={cn("grow flex items-center gap-1 sm:gap-2 flex-wrap", alignClass)}
          >
            {resolvedItems.map((item, index) => {
              const isActive = Boolean(currentActiveId && item.id === currentActiveId);
              const itemClassName = getCafHeaderItemClass({
                isActive,
                disabled: item.disabled,
              });

              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (item.disabled) {
                  e.preventDefault();
                  return;
                }
                handleSelect(item, index);
              };

              const rawBadge = badges?.[item.id] !== undefined ? badges[item.id] : item.badge;
              const renderedBadge = renderCafHeaderBadge(rawBadge, isActive);

              const content = (
                <>
                  {item.icon && (
                    <span className="mr-1.5 inline-flex items-center" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                  {renderedBadge && (
                    <span className="ml-1.5 inline-flex items-center" aria-hidden="true">
                      {renderedBadge}
                    </span>
                  )}
                </>
              );

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={handleClick}
                  aria-current={isActive ? "page" : undefined}
                  aria-disabled={item.disabled}
                  className={itemClassName}
                >
                  {content}
                </Link>
              );
            })}
          </nav>

          {/* Conteúdo / Ações à direita (se fornecido) */}
          {rightContent && (
            <div className="shrink-0 flex items-center gap-2">{rightContent}</div>
          )}
        </div>
      </header>
    );
  },
);

CafHeader.displayName = "CafHeader";
