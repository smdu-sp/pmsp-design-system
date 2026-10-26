import * as React from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  type IntranetEventCardData,
  INTRANET_SAMPLE_EVENT,
  resolveEventDate,
  resolveEventDescription,
  resolveEventInteractive,
} from "@/utils/intranetEventCard";

export {
  type IntranetEventCardData,
  INTRANET_SAMPLE_EVENT,
  resolveEventDate,
  resolveEventDescription,
  resolveEventInteractive,
};

export interface IntranetEventCardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Dia do evento (ex: '08' ou 8) */
  day?: string | number;
  /** Mês do evento (ex: 'JUL', 'AGO') */
  month?: string;
  /** Objeto Date ou string de data para cálculo automático de dia e mês */
  date?: Date | string;
  /** Categoria temática exibida acima do título (padrão: 'Evento') */
  category?: string;
  /** Ícone personalizado para a categoria (padrão: Lucide Calendar) */
  categoryIcon?: React.ReactNode;
  /** Título principal do evento (ex: 'Reuniao geral SMUL') */
  title?: string;
  /** Descrição completa ou detalhes do evento */
  description?: string;
  /** Local do evento (ex: 'Auditorio principal') */
  location?: string;
  /** Horário do evento (ex: '10h') */
  time?: string;
  /** Detalhes complementares para composição automática da descrição */
  details?: string;
  /** Badge opcional de status no canto superior direito (ex: 'Online', 'Hoje', 'Confirmado') */
  badge?: string;
  /** Cor de fundo personalizada para o bloco de data (padrão: '#0b3299') */
  dateBadgeColor?: string;
  /** Link de destino se o card for clicável */
  href?: string;
  /** Define onde abrir o link vinculado (ex: '_blank' para abrir em nova janela/aba) */
  target?: string;
  /** Atributo rel para segurança ao usar target='_blank' (padrão automático: 'noopener noreferrer') */
  rel?: string;
  /** Ação ou botão extra renderizado no cabeçalho */
  action?: React.ReactNode;
}

/**
 * Componente padrão de **Card de Eventos da SMUL Intranet**.
 *
 * Características:
 * - **Bloco de Data Destacado**: Quadrado azul institucional com dia (`08`) e mês (`JUL`) em contraste branco.
 * - **Linha de Categoria**: Ícone de calendário e identificador da categoria (*"Evento"*, *"Reunião"*, etc.).
 * - **Título em Destaque**: Tipografia sóbria e em negrito (*"Reuniao geral SMUL"*).
 * - **Detalhes & Local**: Linha descritiva informando auditório, horário e pauta do encontro.
 * - **Suporte Interativo**: Pode se comportar como link (`href`) ou botão (`onClick`) com microinterações suaves.
 */
export const IntranetEventCard = React.forwardRef<HTMLElement, IntranetEventCardProps>(
  (
    {
      className,
      day = INTRANET_SAMPLE_EVENT.day,
      month = INTRANET_SAMPLE_EVENT.month,
      date,
      category = INTRANET_SAMPLE_EVENT.category || "Evento",
      categoryIcon,
      title = INTRANET_SAMPLE_EVENT.title,
      description,
      location = INTRANET_SAMPLE_EVENT.location,
      time = INTRANET_SAMPLE_EVENT.time,
      details,
      badge,
      dateBadgeColor,
      href,
      target,
      rel,
      action,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    // Resolução da data (dia com 2 dígitos e mês em maiúsculas)
    const { day: resolvedDay, month: resolvedMonth } = resolveEventDate(day, month, date);

    // Resolução do texto descritivo inferior
    const effectiveDescription = resolveEventDescription({
      description,
      location,
      time,
      details,
    });

    // Resolução de interatividade (comportamento de link/botão e acessibilidade por teclado)
    const { Component, isInteractive, hasInteractiveAction, resolvedRel, interactiveProps, handleKeyDown } =
      resolveEventInteractive({
        href,
        target,
        rel,
        onClick,
        action,
      });

    return (
      <Component
        ref={ref as unknown as React.Ref<never>}
        className={cn(
          "group block w-full max-w-2xl bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 text-left transition-all duration-200",
          isInteractive && "cursor-pointer hover:shadow-md hover:border-slate-300 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299]",
          className,
        )}
        onClick={onClick}
        onKeyDown={onClick ? handleKeyDown : undefined}
        {...interactiveProps}
        {...props}
      >
        {/* Cabeçalho do Card: Bloco de Data + Categoria + Título + Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {/* Bloco de Data Semântico (<time>) */}
            <time
              dateTime={date instanceof Date ? date.toISOString().split("T")[0] : undefined}
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl flex flex-col items-center justify-center shrink-0 shadow-2xs select-none transition-transform duration-200 group-hover:scale-[1.02]"
              style={{
                backgroundColor: dateBadgeColor || "#0b3299",
              }}
              aria-label={`Data do evento: ${resolvedDay} de ${resolvedMonth}`}
            >
              <span className="text-lg sm:text-xl font-bold text-white leading-none tracking-tight">{resolvedDay}</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-white/95 uppercase tracking-wider leading-none mt-1">{resolvedMonth}</span>
            </time>

            {/* Categoria com Ícone + Título */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                {categoryIcon ?? <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />}
                <span>{category}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mt-0.5 truncate transition-colors group-hover:text-[#0b3299]">
                {href && hasInteractiveAction ? (
                  <a href={href} target={target} rel={resolvedRel} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299] rounded">
                    {title}
                  </a>
                ) : (
                  title
                )}
              </h3>
            </div>
          </div>

          {/* Badge ou Ação no Canto Superior Direito */}
          {(badge || action) && (
            <div className="shrink-0 flex items-center gap-2" onClick={(e) => hasInteractiveAction && e.stopPropagation()}>
              {badge && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60 leading-none">{badge}</span>}
              {action}
            </div>
          )}
        </div>

        {/* Linha de Descrição / Local / Horário */}
        {effectiveDescription && <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mt-4 sm:mt-5 wrap-break-word">{effectiveDescription}</p>}

        {/* Conteúdo adicional inserido via children */}
        {children}
      </Component>
    );
  },
);

IntranetEventCard.displayName = "IntranetEventCard";
