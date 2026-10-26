import * as React from "react";

export interface IntranetEventCardData {
  id?: string;
  /** Dia do evento (ex: '08' ou 8) */
  day?: string | number;
  /** Mês abreviado do evento em maiúsculas (ex: 'JUL', 'AGO') */
  month?: string;
  /** Objeto Date ou string para resolução automática de dia e mês */
  date?: Date | string;
  /** Categoria do card (padrão: 'Evento') */
  category?: string;
  /** Título principal do evento */
  title: string;
  /** Descrição completa do evento (ex: 'Auditorio principal, 10h - apresentacao de resultados do semestre.') */
  description?: string;
  /** Local do evento (ex: 'Auditorio principal') */
  location?: string;
  /** Horário do evento (ex: '10h') */
  time?: string;
  /** Detalhes adicionais do evento */
  details?: string;
  /** Badge opcional de status (ex: 'Online', 'Hoje', 'Novo') */
  badge?: string;
  /** Link de destino se o card for clicável */
  href?: string;
  /** Define onde abrir o link vinculado (ex: '_blank' para abrir em nova janela/aba) */
  target?: string;
  /** Atributo rel para segurança (padrão: 'noopener noreferrer' se target='_blank') */
  rel?: string;
}

/**
 * Evento padrão idêntico à imagem de referência da SMUL Intranet.
 */
export const INTRANET_SAMPLE_EVENT: IntranetEventCardData = {
  id: "evento-smul-1",
  day: "08",
  month: "JUL",
  category: "Evento",
  title: "Reuniao geral SMUL",
  description: "Auditorio principal, 10h - apresentacao de resultados do semestre.",
  location: "Auditorio principal",
  time: "10h",
};

/**
 * Lista de exemplos de eventos para demonstração em grade ou feed.
 */
export const INTRANET_SAMPLE_EVENTS_LIST: IntranetEventCardData[] = [
  {
    id: "evento-smul-1",
    day: "08",
    month: "JUL",
    category: "Evento",
    title: "Reuniao geral SMUL",
    description: "Auditorio principal, 10h - apresentacao de resultados do semestre.",
    location: "Auditorio principal",
    time: "10h",
  },
  {
    id: "evento-smul-2",
    day: "15",
    month: "JUL",
    category: "Reunião",
    title: "Reunião Ordinária da CIPA - Gestão 2026",
    description: "Sala 402, 14h - alinhamento dos novos planos de prevenção e segurança.",
    location: "Sala 402",
    time: "14h",
  },
  {
    id: "evento-smul-3",
    day: "22",
    month: "JUL",
    category: "Palestra",
    title: "Palestra sobre Ergonomia e Saúde no Trabalho",
    description: "Auditório principal, 09h30 - com transmissão online para os servidores.",
    location: "Auditório principal",
    time: "09h30",
    badge: "Online",
  },
  {
    id: "evento-smul-4",
    day: "05",
    month: "AGO",
    category: "Treinamento",
    title: "Capacitação no Sistema Eletrônico de Licenciamento",
    description: "Laboratório de Informática 2, 13h - vagas limitadas aos inscritos.",
    location: "Laboratório 2",
    time: "13h",
  },
];

/**
 * Nomes abreviados dos meses em português.
 */
const PT_BR_MONTHS = [
  "JAN",
  "FEV",
  "MAR",
  "ABR",
  "MAI",
  "JUN",
  "JUL",
  "AGO",
  "SET",
  "OUT",
  "NOV",
  "DEZ",
];

/**
 * Extrai dia (dois dígitos) e mês abreviado em maiúsculas a partir de Date ou string.
 */
export function resolveEventDate(
  dayProp?: string | number,
  monthProp?: string,
  dateProp?: Date | string,
): { day: string; month: string } {
  if (dayProp !== undefined && monthProp !== undefined) {
    const formattedDay =
      typeof dayProp === "number"
        ? String(dayProp).padStart(2, "0")
        : dayProp.length === 1
          ? `0${dayProp}`
          : dayProp;
    return { day: formattedDay, month: monthProp.toUpperCase() };
  }

  if (dateProp) {
    let d: Date;
    if (dateProp instanceof Date) {
      d = dateProp;
    } else {
      // Se for formato dd/mm ou dd/mm/yyyy
      if (dateProp.includes("/")) {
        const parts = dateProp.split("/");
        const dayPart = parseInt(parts[0], 10);
        const monthPart = parseInt(parts[1], 10) - 1;
        const yearPart = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear();
        d = new Date(yearPart, monthPart, dayPart);
      } else {
        d = new Date(dateProp);
      }
    }

    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, "0");
      const month = PT_BR_MONTHS[d.getMonth()] || "JUL";
      return {
        day: dayProp !== undefined ? String(dayProp) : day,
        month: monthProp !== undefined ? monthProp.toUpperCase() : month,
      };
    }
  }

  return {
    day: dayProp !== undefined ? String(dayProp) : "08",
    month: monthProp ? monthProp.toUpperCase() : "JUL",
  };
}

/**
 * Monta o texto de descrição estruturado a partir de location, time e details caso não haja description explícita.
 */
export function resolveEventDescription(options: {
  description?: string;
  location?: string;
  time?: string;
  details?: string;
}): string {
  if (options.description) return options.description;

  const parts: string[] = [];
  if (options.location && options.time) {
    parts.push(`${options.location}, ${options.time}`);
  } else if (options.location) {
    parts.push(options.location);
  } else if (options.time) {
    parts.push(options.time);
  }

  if (options.details) {
    if (parts.length > 0) {
      return `${parts.join(", ")} - ${options.details}`;
    }
    return options.details;
  }

  return parts.join(", ") || INTRANET_SAMPLE_EVENT.description || "";
}

export interface ResolveEventInteractiveOptions {
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  action?: React.ReactNode;
}

/**
 * Resolve as propriedades interativas, elemento de componente (a vs article)
 * e manipulador de teclado para o card de evento da Intranet.
 */
export function resolveEventInteractive({
  href,
  target,
  rel,
  onClick,
  action,
}: ResolveEventInteractiveOptions) {
  const isInteractive = Boolean(href || onClick);
  const hasInteractiveAction = Boolean(action);
  const Component: "a" | "article" = href && !hasInteractiveAction ? "a" : "article";

  const resolvedRel = rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

  const interactiveProps: React.HTMLAttributes<HTMLElement> =
    href && !hasInteractiveAction
      ? ({ href, target, rel: resolvedRel } as any)
      : onClick
        ? { role: "button", tabIndex: 0 }
        : {};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(e as unknown as React.MouseEvent<HTMLElement>);
    }
  };

  return {
    Component,
    isInteractive,
    hasInteractiveAction,
    resolvedRel,
    interactiveProps,
    handleKeyDown,
  };
}

