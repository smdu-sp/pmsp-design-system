import * as React from "react";
import { cn } from "./cn";
import type { TableColumn } from "./table";

export interface CafTableRowData {
  id: string | number;
  avaliacao: number;
  sala: string;
  periodo: string;
  observacao: string;
  criadoEm: string;
}

export interface FormattedCafScore {
  num: number;
  formatted: string;
  isHigh: boolean;
}

/**
 * Formata a nota de avaliação do Sistema-CAF e verifica se atinge o limiar de destaque (threshold).
 */
export function formatCafScore(
  score: number | string,
  threshold = 7.0,
): FormattedCafScore {
  const num = typeof score === "number" ? score : parseFloat(String(score));
  const formatted = typeof score === "number" ? score.toFixed(2) : String(score);
  const isHigh = !isNaN(num) && num >= threshold;

  return { num, formatted, isHigh };
}

/**
 * Retorna as classes Tailwind para a pílula de nota do Sistema-CAF (CafScoreBadge).
 */
export function getCafScoreBadgeClass(isHigh: boolean, className?: string): string {
  return cn(
    "inline-flex items-center justify-center min-w-[50px] px-2.5 py-0.5 text-xs font-bold rounded-full transition-colors select-none",
    isHigh
      ? "bg-[#0b3299] text-white shadow-2xs"
      : "bg-white border border-slate-300 text-slate-700 shadow-2xs",
    className,
  );
}

/**
 * Avalia se uma coluna da tabela representa o campo 'Avaliação' do Sistema-CAF.
 */
export function isAvaliacaoColumn(col: TableColumn<any>): boolean {
  if (!col) return false;
  if (col.key?.toLowerCase() === "avaliacao") return true;
  if (typeof col.header === "string") {
    const normalized = col.header
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return normalized.includes("avaliacao");
  }
  return false;
}

/**
 * Normaliza a lista de colunas para o Sistema-CAF, garantindo que a coluna 'Avaliação'
 * nunca exiba filtros de coluna, conforme especificação de design.
 */
export function resolveCafColumns<T = any>(
  columns?: TableColumn<T>[],
  defaultColumns?: TableColumn<T>[],
): TableColumn<T>[] {
  const cols = columns ?? defaultColumns ?? [];
  return cols.map((col) => {
    if (isAvaliacaoColumn(col)) {
      return {
        ...col,
        filterable: false,
      };
    }
    return col;
  });
}

/**
 * Retorna as classes CSS padrão para o container do CafTable.
 */
export function resolveCafTableContainerClass(className?: string): string {
  return cn(
    "border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs bg-white",
    className,
  );
}

/**
 * Dados de demonstração inicial extraídos do layout de referência do Sistema-CAF.
 */
export const CAF_TABLE_SAMPLE_DATA: CafTableRowData[] = [
  {
    id: 1,
    avaliacao: 9.17,
    sala: "Sala de Reuniões A",
    periodo: "04/26",
    observacao: "Limpeza geral realizada com sucesso. Sal...",
    criadoEm: "22/04/26",
  },
  {
    id: 2,
    avaliacao: 5.83,
    sala: "Auditório Principal",
    periodo: "04/26",
    observacao: "Alguns pontos precisam de melhoria na li...",
    criadoEm: "21/04/26",
  },
  {
    id: 3,
    avaliacao: 10.0,
    sala: "Sala de Treinamento",
    periodo: "04/26",
    observacao: "Excelente estado de limpeza. Parabéns à ...",
    criadoEm: "20/04/26",
  },
];

/**
 * Conjunto completo para demonstração de paginação e filtros no Sistema-CAF.
 */
export const CAF_TABLE_FULL_DATA: CafTableRowData[] = [
  ...CAF_TABLE_SAMPLE_DATA,
  {
    id: 4,
    avaliacao: 8.75,
    sala: "Laboratório de Informática",
    periodo: "04/26",
    observacao: "Equipamentos e bancadas devidamente higienizados.",
    criadoEm: "19/04/26",
  },
  {
    id: 5,
    avaliacao: 4.5,
    sala: "Refeitório Bloco B",
    periodo: "04/26",
    observacao: "Necessária reposição urgente de dispensers de sabonete.",
    criadoEm: "18/04/26",
  },
  {
    id: 6,
    avaliacao: 9.8,
    sala: "Biblioteca Central",
    periodo: "04/26",
    observacao: "Ambiente impecável, ventilação e mesas limpas.",
    criadoEm: "17/04/26",
  },
  {
    id: 7,
    avaliacao: 6.2,
    sala: "Sala de Reuniões B",
    periodo: "04/26",
    observacao: "Quadro branco manchado necessita limpeza profunda.",
    criadoEm: "16/04/26",
  },
  {
    id: 8,
    avaliacao: 9.5,
    sala: "Diretoria de Administração",
    periodo: "04/26",
    observacao: "Higienização completa sem qualquer pendência.",
    criadoEm: "15/04/26",
  },
  {
    id: 9,
    avaliacao: 8.9,
    sala: "Área de Descompressão",
    periodo: "04/26",
    observacao: "Sofás aspirados e lixeiras esvaziadas no horário.",
    criadoEm: "14/04/26",
  },
  {
    id: 10,
    avaliacao: 7.3,
    sala: "Recepção Principal",
    periodo: "04/26",
    observacao: "Piso polido e vidros limpos na entrada.",
    criadoEm: "13/04/26",
  },
  {
    id: 11,
    avaliacao: 9.9,
    sala: "Ambulatório Médico",
    periodo: "04/26",
    observacao: "Protocolos sanitários e de esterilização rigorosamente cumpridos.",
    criadoEm: "12/04/26",
  },
  {
    id: 12,
    avaliacao: 5.1,
    sala: "Almoxarifado Central",
    periodo: "04/26",
    observacao: "Acúmulo de poeira nas prateleiras superiores.",
    criadoEm: "11/04/26",
  },
];

/**
 * Opções padrão para o seletor de quantidade de itens por página do CafTable.
 */
export const CAF_DEFAULT_PAGE_SIZE_OPTIONS: number[] = [5, 10, 15, 20, 30, 50];

/**
 * Fábrica de colunas padrão para o CafTable associando o renderizador do badge de nota.
 */
export function createCafDefaultColumns(
  renderBadge: (score: number) => React.ReactNode,
): TableColumn<CafTableRowData>[] {
  return [
    {
      key: "avaliacao",
      header: "Avaliação",
      filterable: false,
      render: renderBadge,
    },
    {
      key: "sala",
      header: "Sala",
      bold: true,
    },
    {
      key: "periodo",
      header: "Periodo",
    },
    {
      key: "observacao",
      header: "Observação",
    },
    {
      key: "criadoEm",
      header: "Criado em",
    },
  ];
}
