import * as React from "react";
import { Button } from "@/components/Button";
import type { ButtonVariant } from "@/utils/button";
import { cn } from "@/utils/cn";
import {
  type IntranetCardVariant,
  type IntranetCardAvatar,
  type IntranetCardTextItem,
  INTRANET_CARD_SAMPLE_NOTICES,
  getIntranetInitials,
  getIntranetAvatarColor,
  getIntranetCardContainerClass,
  isBirthdayToday,
  resolveReferenceDate,
  formatTodayAsBirthdayDate,
} from "@/utils/intranetCard";

export { type IntranetCardVariant, type IntranetCardAvatar, type IntranetCardTextItem };

export interface IntranetCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /**
   * Define o tipo visual do card:
   * - "birthday": Card com avatar, identificação, data, contador/status e botão de ação ("Parabenizar").
   * - "text": Card com apenas títulos e textos (ex: "Comunicados recentes", "Próximos eventos", estado vazio).
   * Padrão: "birthday".
   */
  variant?: IntranetCardVariant;

  // --- Propriedades Comuns / Cabeçalho ---
  /** Título principal (no modo "birthday" é o nome da pessoa; no modo "text" é o título da seção, ex: 'Comunicados recentes') */
  title?: string;
  /** Nome da pessoa (alias específico para o modo "birthday" / aniversariante) */
  name?: string;
  /** Subtítulo descritivo ou departamento/setor (ex: 'Divisão de Gestão de Pessoas') */
  subtitle?: string;
  /** Departamento ou lotação do servidor (alias específico para o modo "birthday") */
  department?: string;

  // --- Propriedades do Modo "birthday" / Aniversariantes ---
  /**
   * Configuração do avatar (foto ou círculo colorido com iniciais).
   * Pode ser um objeto com `{ initials, src, alt, color }` ou controlado via props individuais.
   */
  avatar?: IntranetCardAvatar;
  /** Iniciais exibidas no avatar (ex: 'MT', 'IC', 'SC') */
  avatarInitials?: string;
  /** URL da imagem do avatar */
  avatarSrc?: string;
  /** Cor de fundo personalizada para o círculo de iniciais */
  avatarColor?: string;
  /**
   * Tag/Badge destacada (ex: 'hoje').
   * A badge 'hoje' só fica visível se a data do aniversário for a mesma do dia atual do calendário!
   */
  badge?: string | boolean;
  /** Data do aniversário (ex: '6 de Julho', '19 de Outubro', '19/10' ou objeto Date) */
  date?: string | Date;
  /**
   * Data de referência para verificar se é hoje (padrão: data atual do sistema `new Date()`).
   * Permite simular ou testar datas específicas de calendário.
   */
  referenceDate?: Date | string;
  /** Texto informativo de felicitações ou status (ex: '2 felicitacoes', 'Seja o primeiro a parabenizar') */
  felicitations?: string;
  /** Alias para felicitations */
  status?: string;

  // --- Botão de Ação ---
  /** Texto exibido no botão de ação inferior (padrão: 'Parabenizar') */
  buttonText?: string;
  /** Ícone opcional exibido no botão de ação */
  buttonIcon?: React.ReactNode;
  /** Variante visual do botão (padrão: 'intranet-primary') */
  buttonVariant?: ButtonVariant;
  /** Desabilita o botão de ação */
  buttonDisabled?: boolean;
  /** Callback disparado ao clicar no botão de ação */
  onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  // --- Propriedades do Modo "text" / Comunicados ---
  /** Lista de itens textuais com título e data */
  items?: IntranetCardTextItem[];
  /** Mensagem exibida caso a lista de itens esteja vazia ou quando for um card informativo único (ex: 'Nenhum aniversário hoje.') */
  emptyText?: string;
  /** Parágrafo descritivo textual opcional */
  description?: string;

  // --- Estilização Adicional ---
  /** Raio de borda personalizado (ex: '16px' ou número) */
  borderRadius?: string | number;
  /** Cor de fundo personalizada */
  backgroundColor?: string;
}

/**
 * Componente **IntranetCard** para a **SMUL Intranet (Secretaria Municipal de Urbanismo e Licenciamento)**.
 *
 * Suporta duas variantes principais baseadas no modelo visual de referência:
 * 1. **Variante com Botão (`variant="action"` ou `"birthday"`)**:
 *    - Avatar em círculo com foto ou iniciais em cores temáticas institucionais (`MT`, `IC`, `SC`).
 *    - Nome em destaque com badge opcional (ex: `"hoje"` em verde/teal) e departamento em múltiplas linhas.
 *    - Bloco informativo com data (ex: `"6 de Julho"`) e número de felicitações (`"2 felicitacoes"` / `"Seja o primeiro a parabenizar"`).
 *    - Botão de ação em destaque inferior (`"Parabenizar"`) em azul institucional (`#0b3299`).
 *
 * 2. **Variante com Apenas Textos (`variant="text"` ou `"notice"`)**:
 *    - Título da seção (ex: `"Comunicados recentes"` ou `"Próximos eventos"`).
 *    - Lista de tópicos com título em negrito e datas correspondentes (`"05 jul"`, `"01 jul"`).
 *    - Suporte a itens clicáveis ou estado vazio (`"Nenhum aniversário hoje."`).
 */
export const IntranetCard = React.forwardRef<HTMLElement, IntranetCardProps>(
  (
    {
      className,
      variant = "birthday",
      title,
      name,
      subtitle,
      department,
      avatar,
      avatarInitials,
      avatarSrc,
      avatarColor,
      badge,
      date,
      referenceDate,
      felicitations,
      status,
      buttonText = "Parabenizar",
      buttonIcon,
      buttonVariant = "intranet-primary",
      buttonDisabled = false,
      onButtonClick,
      items,
      emptyText,
      description,
      borderRadius,
      backgroundColor,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isBirthdayVariant = variant === "birthday";

    // Resolução de nomes e textos
    const effectiveName = name || title || "Servidor";
    const effectiveDept = department || subtitle;
    const effectiveStatus = felicitations || status;

    // Resolução da variante "text" (garante que nunca fique em branco)
    const effectiveTextTitle = title || (name && name !== "Servidor" ? name : "Comunicados recentes");
    const effectiveItems = items && items.length > 0 ? items : !emptyText && !description && !children ? INTRANET_CARD_SAMPLE_NOTICES : items;

    // Resolução do Avatar
    const resolvedInitials = avatarInitials || avatar?.initials || getIntranetInitials(effectiveName);
    const resolvedAvatarSrc = avatarSrc || avatar?.src;
    const resolvedAvatarColor = avatarColor || avatar?.color || getIntranetAvatarColor(effectiveName);

    // Validação se o aniversário é no mesmo dia do calendário atual
    const isToday = isBirthdayToday(date, resolveReferenceDate(referenceDate));

    // A badge 'hoje' SÓ fica visível se a data do aniversário for a mesma do dia atual do calendário!
    const hasBadge =
      badge === false
        ? false
        : typeof badge === "string" && badge.toLowerCase() !== "hoje"
          ? true
          : isToday;

    const badgeText =
      typeof badge === "string" && badge.toLowerCase() !== "hoje"
        ? badge
        : "hoje";

    const displayDate =
      date instanceof Date ? formatTodayAsBirthdayDate(date) : date;

    // Estilos inline opcionais
    const inlineStyles: React.CSSProperties = {
      ...(backgroundColor ? { backgroundColor } : {}),
      ...(borderRadius !== undefined
        ? {
            borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
          }
        : {}),
      ...style,
    };

    return (
      <article ref={ref} className={getIntranetCardContainerClass(variant, className)} style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined} {...props}>
        {isBirthdayVariant ? (
          <>
            {/* Bloco Superior: Avatar + Nome + Badge + Departamento */}
            <div className="flex items-start gap-3.5">
              {/* Avatar: Imagem ou Círculo Colorido com Iniciais */}
              <div
                className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm select-none shadow-2xs overflow-hidden"
                style={{
                  backgroundColor: resolvedAvatarSrc ? "transparent" : resolvedAvatarColor,
                }}
                aria-hidden="true"
              >
                {resolvedAvatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resolvedAvatarSrc} alt={avatar?.alt || effectiveName} className="w-full h-full object-cover" />
                ) : (
                  <span>{resolvedInitials}</span>
                )}
              </div>

              {/* Informações da Pessoa */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug truncate" title={effectiveName}>
                  {effectiveName}
                </h3>

                {/* Badge opcional ("hoje") */}
                {hasBadge && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0d9488] text-white leading-tight shadow-2xs">
                      <span className="sr-only">Aniversariante de </span>
                      {badgeText}
                    </span>
                  </div>
                )}

                {/* Lotação / Setor */}
                {effectiveDept && <p className={cn("text-xs text-slate-500 font-normal leading-relaxed break-words", hasBadge ? "mt-1.5" : "mt-1")}>{effectiveDept}</p>}
              </div>
            </div>

            {/* Conteúdo Customizado Injetado */}
            {children}

            {/* Bloco Inferior: Data, Felicitações e Botão de Ação */}
            <div className="mt-6 pt-2">
              {(displayDate || effectiveStatus) && (
                <div className="mb-3.5">
                  {displayDate && <p className="text-sm font-bold text-slate-900 leading-tight">{displayDate}</p>}
                  {effectiveStatus && <p className="text-xs text-slate-500 font-normal mt-0.5 leading-tight">{effectiveStatus}</p>}
                </div>
              )}

              {/* Botão de Ação (Parabenizar) */}
              <Button
                theme="intranet"
                variant={buttonVariant}
                disabled={buttonDisabled}
                onClick={onButtonClick}
                aria-label={`${buttonText}: ${effectiveName}`}
                className="w-full text-sm font-semibold py-2.5 rounded-lg shadow-2xs transition-transform active:scale-[0.99]"
              >
                {buttonIcon && (
                  <span className="mr-1.5 shrink-0" aria-hidden="true">
                    {buttonIcon}
                  </span>
                )}
                {buttonText}
              </Button>
            </div>
          </>
        ) : (
          /* Variante com Apenas Textos (Comunicados Recentes / Avisos / Feed) */
          <div className="flex flex-col w-full h-full justify-between">
            <div>
              {/* Título do Card */}
              {effectiveTextTitle && <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug mb-3.5">{effectiveTextTitle}</h3>}

              {/* Descrição Opcional */}
              {description && <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">{description}</p>}

              {/* Lista de Itens Textuais */}
              {effectiveItems && effectiveItems.length > 0 ? (
                <ul className="space-y-4">
                  {effectiveItems.map((item, index) => {
                    const itemId = item.id || `item-${index}`;
                    const isClickable = Boolean(item.href || item.onClick);

                    const content = (
                      <div>
                        <p className={cn("text-sm font-bold text-slate-900 leading-snug transition-colors", isClickable && "hover:text-[#0b3299] group-hover:text-[#0b3299]")}>{item.title}</p>
                        {item.date && <p className="text-xs text-slate-500 font-normal leading-none pt-1.5">{item.date}</p>}
                        {item.subtitle && <p className="text-xs text-slate-600 leading-relaxed pt-1">{item.subtitle}</p>}
                      </div>
                    );

                    return (
                      <li key={itemId} className="group">
                        {item.href ? (
                          <a href={item.href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299] rounded-md transition-colors">
                            {content}
                          </a>
                        ) : item.onClick ? (
                          <button
                            type="button"
                            onClick={item.onClick}
                            className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299] rounded-md transition-colors cursor-pointer"
                          >
                            {content}
                          </button>
                        ) : (
                          content
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : emptyText ? (
                <p className="text-sm text-slate-500 font-normal py-1">{emptyText}</p>
              ) : null}

              {/* Elementos Filhos Adicionais */}
              {children}
            </div>
          </div>
        )}
      </article>
    );
  },
);

IntranetCard.displayName = "IntranetCard";
