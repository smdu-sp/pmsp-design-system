import * as React from "react";
import { cn } from "@/utils/cn";

export type IntranetCardVariant = "birthday" | "text";

export interface IntranetCardAvatar {
  /** Iniciais para exibição no círculo quando não houver foto (ex: 'MT', 'IC') */
  initials?: string;
  /** URL da imagem do avatar */
  src?: string;
  /** Texto alternativo para acessibilidade */
  alt?: string;
  /** Cor de fundo personalizada para o avatar com iniciais (ex: '#b57a18', '#db2777', '#7c3aed') */
  color?: string;
}

export interface IntranetCardTextItem {
  /** Identificador único do item */
  id?: string;
  /** Título principal ou chamada da notícia/comunicado */
  title: string;
  /** Data ou carimbo temporal (ex: '05 jul', '10 out') */
  date?: string;
  /** Descrição ou resumo complementar */
  subtitle?: string;
  /** URL de destino se o item for um link */
  href?: string;
  /** Callback acionado ao clicar no item */
  onClick?: () => void;
}

/**
 * Cores padrão refinadas utilizadas nos avatares de iniciais da SMUL Intranet,
 * extraídas diretamente do modelo institucional da aplicação.
 */
export const INTRANET_AVATAR_COLORS = {
  yellow: "#b57a18",
  pink: "#db2777",
  purple: "#7c3aed",
  blue: "#0b3299",
  teal: "#0d9488",
  slate: "#475569",
} as const;

/**
 * Dados de exemplo fiéis à foto de referência: cards de aniversariantes da Intranet.
 */
export const INTRANET_CARD_SAMPLE_BIRTHDAYS = [
  {
    id: "mieco",
    name: "Mieco Miyazato Ric...",
    fullName: "Mieco Miyazato Ricci",
    department: "Coordenadoria de Cadastro, Análise de Dados e Sistema Eletrônico de Licenciamento - CASE",
    badge: "hoje",
    date: "6 de Julho",
    felicitations: "2 felicitacoes",
    avatar: {
      initials: "MT",
      color: INTRANET_AVATAR_COLORS.yellow,
    },
    buttonText: "Parabenizar",
  },
  {
    id: "ingrid",
    name: "Ingrid Jesus Costa",
    fullName: "Ingrid Jesus Costa",
    department: "Divisão de Gestão de Pessoas",
    badge: "hoje",
    date: "6 de Julho",
    felicitations: "Seja o primeiro a parabenizar",
    avatar: {
      initials: "IC",
      color: INTRANET_AVATAR_COLORS.pink,
    },
    buttonText: "Parabenizar",
  },
  {
    id: "sandra",
    name: "Sandra Maria Coelh...",
    fullName: "Sandra Maria Coelho",
    department: "SERVIN / DSIGP",
    badge: undefined,
    date: "11 de Julho",
    felicitations: "1 felicitacao",
    avatar: {
      initials: "SC",
      color: INTRANET_AVATAR_COLORS.purple,
    },
    buttonText: "Parabenizar",
  },
];

/**
 * Dados de exemplo fiéis à foto de referência: card com apenas textos ("Comunicados recentes").
 */
export const INTRANET_CARD_SAMPLE_NOTICES: IntranetCardTextItem[] = [
  {
    id: "aviso-cadastro",
    title: "Já conferiu se o seu cadastro está atualizado?",
    date: "05 jul",
  },
  {
    id: "aviso-horario",
    title: "Novo horário de atendimento presencial",
    date: "01 jul",
  },
];

/**
 * Dados de exemplo para o bloco "Próximos eventos".
 */
export const INTRANET_CARD_SAMPLE_EVENTS: IntranetCardTextItem[] = [
  {
    id: "evento-cipa",
    title: "Reunião Ordinária da CIPA - Gestão 2026",
    date: "15 jul",
  },
  {
    id: "evento-palestra",
    title: "Palestra sobre Ergonomia e Saúde no Trabalho",
    date: "22 jul",
  },
];

/**
 * Extrai iniciais (até 2 caracteres) de um nome completo caso não tenham sido informadas explicitamente.
 */
export function getIntranetInitials(name?: string): string {
  if (!name) return "US";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "US";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Retorna uma cor consistente da paleta da Intranet baseada no texto/nome.
 */
export function getIntranetAvatarColor(key?: string): string {
  if (!key) return INTRANET_AVATAR_COLORS.blue;
  const colors = [
    INTRANET_AVATAR_COLORS.yellow,
    INTRANET_AVATAR_COLORS.pink,
    INTRANET_AVATAR_COLORS.purple,
    INTRANET_AVATAR_COLORS.teal,
    INTRANET_AVATAR_COLORS.blue,
  ];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = key.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

/**
 * Dicionário de meses em português (0-indexado) para parsing flexível de datas.
 */
export const PT_MONTHS_MAP: Record<string, number> = {
  janeiro: 0,
  jan: 0,
  fevereiro: 1,
  fev: 1,
  marco: 2,
  março: 2,
  mar: 2,
  abril: 3,
  abr: 3,
  maio: 4,
  mai: 4,
  junho: 5,
  jun: 5,
  julho: 6,
  jul: 6,
  agosto: 7,
  ago: 7,
  setembro: 8,
  set: 8,
  outubro: 9,
  out: 9,
  novembro: 10,
  nov: 10,
  dezembro: 11,
  dez: 11,
};

/**
 * Converte qualquer referência de data (Date ou string) para objeto Date válido.
 */
export function resolveReferenceDate(ref?: Date | string): Date {
  if (!ref) return new Date();
  if (ref instanceof Date) return ref;
  const parsed = new Date(ref);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Extrai dia e mês (0 a 11) de formatos variados de data de aniversário:
 * - "6 de Julho", "19 de Outubro", "06 de jul"
 * - "19/10", "19/10/1990", "06-07"
 * - "1990-10-19", "2026-10-19" (ISO)
 * - Objeto Date nativo
 */
export function parseBirthdayDayMonth(
  birthdayDate?: string | Date | null,
): { day: number; month: number } | null {
  if (!birthdayDate) return null;

  if (birthdayDate instanceof Date) {
    if (isNaN(birthdayDate.getTime())) return null;
    return { day: birthdayDate.getDate(), month: birthdayDate.getMonth() };
  }

  const clean = String(birthdayDate).trim().toLowerCase();

  // 1. Formato textual em português: ex "6 de Julho", "19 de outubro", "06 jul"
  const ptMatch = clean.match(/^(\d{1,2})\s*(?:de|\/|-)?\s*([a-záéíóúç]+)/i);
  if (ptMatch) {
    const day = parseInt(ptMatch[1], 10);
    const monthStr = ptMatch[2]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // remove acentos
    if (monthStr in PT_MONTHS_MAP) {
      const month = PT_MONTHS_MAP[monthStr];
      if (day >= 1 && day <= 31) {
        return { day, month };
      }
    }
  }

  // 2. Formato numérico DD/MM ou DD/MM/AAAA: ex "19/10", "06/07/1995", "19-10"
  const numMatch = clean.match(/^(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?$/);
  if (numMatch) {
    const day = parseInt(numMatch[1], 10);
    const month = parseInt(numMatch[2], 10) - 1;
    if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
      return { day, month };
    }
  }

  // 3. Formato ISO AAAA-MM-DD: ex "2026-10-19", "1990-07-06"
  const isoMatch = clean.match(/^(\d{4})[\-](\d{1,2})[\-](\d{1,2})/);
  if (isoMatch) {
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    if (day >= 1 && day <= 31 && month >= 0 && month <= 11) {
      return { day, month };
    }
  }

  // 4. Fallback com Date nativo
  const fallbackDate = new Date(clean);
  if (!isNaN(fallbackDate.getTime())) {
    return { day: fallbackDate.getDate(), month: fallbackDate.getMonth() };
  }

  return null;
}

/**
 * Retorna true se a data de aniversário corresponder exatamente ao mesmo dia e mês do calendário atual.
 */
export function isBirthdayToday(
  birthdayDate?: string | Date | null,
  referenceDate: Date = new Date(),
): boolean {
  if (!birthdayDate) return false;
  const parsed = parseBirthdayDayMonth(birthdayDate);
  if (!parsed) return false;

  const targetDay = referenceDate.getDate();
  const targetMonth = referenceDate.getMonth();

  return parsed.day === targetDay && parsed.month === targetMonth;
}

/**
 * Formata a data atual em português para exibição (ex: "19 de Outubro").
 */
export function formatTodayAsBirthdayDate(date: Date = new Date()): string {
  const day = date.getDate();
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return `${day} de ${months[date.getMonth()]}`;
}

/**
 * Gera as classes base de container do Card para a Intranet.
 */
export function getIntranetCardContainerClass(
  variant: IntranetCardVariant = "birthday",
  className?: string,
): string {
  return cn(
    "bg-white rounded-2xl border border-slate-200/90 shadow-2xs transition-all duration-200",
    "hover:border-slate-300 hover:shadow-xs",
    variant === "birthday"
      ? "p-5 sm:p-6 flex flex-col justify-between w-full max-w-sm min-h-[300px]"
      : "p-5 sm:p-6 flex flex-col w-full max-w-sm",
    className,
  );
}
