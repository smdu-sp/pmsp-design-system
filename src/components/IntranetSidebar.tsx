import * as React from "react";
import { LifeBuoy } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/Button";
import {
  type IntranetSidebarItem,
  INTRANET_DEFAULT_SIDEBAR_ITEMS,
  getIntranetSidebarContainerClass,
  getIntranetSidebarItemClass,
  getIntranetSupportCardClass,
} from "@/utils/intranetSidebar";

export {
  type IntranetSidebarItem,
  INTRANET_DEFAULT_SIDEBAR_ITEMS,
  getIntranetSidebarContainerClass,
  getIntranetSidebarItemClass,
  getIntranetSupportCardClass,
};

export interface IntranetSidebarProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Itens da lista de navegação do menu */
  items?: IntranetSidebarItem[];
  /** ID do item atualmente selecionado/ativo (modo controlado) */
  activeItemId?: string;
  /** ID do item selecionado por padrão (modo não controlado, padrão: 'inicio') */
  defaultActiveItemId?: string;
  /** Callback disparado ao selecionar um item de navegação */
  onItemSelect?: (item: IntranetSidebarItem) => void;
  /** Título da seção de navegação (padrão: 'NAVEGACAO') */
  sectionTitle?: string;
  /** Exibir card inferior de suporte técnico (padrão: true) */
  showSupportCard?: boolean;
  /** Título do card de suporte técnico (padrão: 'Suporte tecnico') */
  supportTitle?: string;
  /** Primeira linha descritiva do card de suporte (padrão: 'Precisa de ajuda com sistemas ou equipamentos?') */
  supportDescription1?: string;
  /** Segunda linha descritiva do card de suporte (padrão: 'Abra um chamado para receber atendimento da equipe responsavel.') */
  supportDescription2?: string;
  /** Texto do botão de ação de suporte (padrão: 'Abrir chamado') */
  supportButtonText?: string;
  /** Ícone exibido no título do card de suporte (padrão: LifeBuoy azul) */
  supportIcon?: React.ReactNode;
  /** Callback acionado ao clicar no botão de abrir chamado */
  onSupportClick?: () => void;
}

/**
 * Componente Sidebar da **SMUL Intranet (Secretaria Municipal de Urbanismo e Licenciamento)**.
 *
 * Apresenta:
 * - Seção superior **NAVEGACAO** com lista de itens interativos (Inicio, Aniversários, Comunicados, Diretório, Eventos, Meu perfil).
 * - Destaque visual refinado para o item ativo em azul institucional (`#0b3299`) com fundo azul suave (`#f0f4ff`).
 * - Card inferior integrado **Suporte técnico** com ícone de boia, textos de orientação e botão de ação *"Abrir chamado"*.
 */
export const IntranetSidebar = React.forwardRef<HTMLElement, IntranetSidebarProps>(
  (
    {
      className,
      items = INTRANET_DEFAULT_SIDEBAR_ITEMS,
      activeItemId: controlledActiveId,
      defaultActiveItemId = "inicio",
      onItemSelect,
      sectionTitle = "NAVEGACAO",
      showSupportCard = true,
      supportTitle = "Suporte tecnico",
      supportDescription1 = "Precisa de ajuda com sistemas ou equipamentos?",
      supportDescription2 = "Abra um chamado para receber atendimento da equipe responsavel.",
      supportButtonText = "Abrir chamado",
      supportIcon,
      onSupportClick,
      ...props
    },
    ref,
  ) => {
    const [internalActiveId, setInternalActiveId] = React.useState<string>(defaultActiveItemId);

    const isControlled = controlledActiveId !== undefined;
    const currentActiveId = isControlled ? controlledActiveId : internalActiveId;

    const handleItemClick = (item: IntranetSidebarItem, e: React.MouseEvent) => {
      if (item.disabled) {
        e.preventDefault();
        return;
      }

      if (!isControlled) {
        setInternalActiveId(item.id);
      }

      if (onItemSelect) {
        onItemSelect(item);
      }
    };

    return (
      <aside
        ref={ref}
        aria-label="Barra lateral da Intranet"
        className={getIntranetSidebarContainerClass(className)}
        {...props}
      >
        {/* Bloco de Navegação Superior */}
        <nav aria-label="Menu principal da Intranet">
          {sectionTitle && (
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mb-3 px-1">
              {sectionTitle}
            </h2>
          )}

          <ul className="space-y-1">
            {items.map((item) => {
              const isActive = item.id === currentActiveId;

              return (
                <li key={item.id}>
                  <a
                    href={item.href || "#"}
                    onClick={(e) => handleItemClick(item, e)}
                    tabIndex={item.disabled ? -1 : undefined}
                    aria-current={isActive ? "page" : undefined}
                    aria-disabled={item.disabled ? "true" : undefined}
                    className={getIntranetSidebarItemClass(isActive, item.disabled)}
                  >
                    {item.icon && (
                      <span
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive ? "text-[#0b3299]" : "text-slate-700",
                        )}
                        aria-hidden="true"
                      >
                        {item.icon}
                      </span>
                    )}

                    <span className="flex-1 truncate">{item.label}</span>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "ml-auto text-xs font-semibold px-2 py-0.5 rounded-full shrink-0",
                          isActive
                            ? "bg-[#0b3299]/10 text-[#0b3299]"
                            : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Card Inferior de Suporte Técnico */}
        {showSupportCard && (
          <section aria-label={supportTitle} className={getIntranetSupportCardClass()}>
            <div className="flex items-center gap-2 mb-2">
              {supportIcon ?? (
                <LifeBuoy className="w-4 h-4 text-[#0b3299] shrink-0" aria-hidden="true" />
              )}
              <h3 className="text-sm font-semibold text-slate-900 leading-none">
                {supportTitle}
              </h3>
            </div>

            {supportDescription1 && (
              <p className="text-xs text-slate-500 leading-relaxed font-normal">
                {supportDescription1}
              </p>
            )}

            {supportDescription2 && (
              <p className="text-xs text-slate-500 leading-relaxed font-normal mt-3 mb-4">
                {supportDescription2}
              </p>
            )}

            <Button
              theme="intranet"
              variant="primary"
              rounded="lg"
              className="w-full text-sm font-medium py-2.5 shadow-2xs"
              aria-label={`${supportButtonText}: ${supportTitle}`}
              onClick={onSupportClick}
            >
              {supportButtonText}
            </Button>
          </section>
        )}
      </aside>
    );
  },
);

IntranetSidebar.displayName = "IntranetSidebar";
