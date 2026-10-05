import * as React from "react";
import {
  type TableFilterType,
  type TableFilterOption,
  normalizeFilterOptions,
} from "./table";


export interface ResolveFilterStateResult {
  isFilterActive: boolean;
  activeCount: number;
  selectedValues: any[];
}

/**
 * Avalia o valor atual do filtro e extrai o status de ativo, contagem de itens e lista de valores selecionados.
 */
export function resolveFilterState(value: any): ResolveFilterStateResult {
  const isFilterActive = (() => {
    if (value === undefined || value === null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    return true;
  })();

  const activeCount = Array.isArray(value) ? value.length : isFilterActive ? 1 : 0;

  const selectedValues: any[] = (() => {
    if (Array.isArray(value)) return value;
    if (value !== undefined && value !== null && value !== "") return [value];
    return [];
  })();

  return { isFilterActive, activeCount, selectedValues };
}

/**
 * Alterna a seleção de uma opção em um filtro de múltipla escolha (checkbox).
 * Retorna `undefined` se a lista resultante for vazia para manter o filtro desativado.
 */
export function toggleCheckboxFilterValue(selectedValues: any[], optValue: any): any[] | undefined {
  const exists = selectedValues.some((v) => String(v) === String(optValue));
  let next: any[];
  if (exists) {
    next = selectedValues.filter((v) => String(v) !== String(optValue));
  } else {
    next = [...selectedValues, optValue];
  }
  return next.length > 0 ? next : undefined;
}

/**
 * Resolve o rótulo acessível descritivo do botão disparador do filtro para leitores de tela.
 */
export function resolveTableColumnFilterAriaLabel(
  titleText?: string,
  isFilterActive?: boolean,
  activeCount?: number,
  customAriaLabel?: string,
): string {
  if (customAriaLabel) return customAriaLabel;

  if (titleText) {
    if (isFilterActive && activeCount && activeCount > 0) {
      return `Filtrar coluna ${titleText}, filtro ativo com ${activeCount} item(ns) selecionado(s)`;
    }
    return isFilterActive ? `Filtrar coluna ${titleText}, filtro ativo` : `Filtrar coluna ${titleText}`;
  }

  return isFilterActive ? "Filtrar coluna, filtro ativo" : "Filtrar coluna";
}

/**
 * Resolve o rótulo acessível da caixa/menu dropdown de filtros.
 */
export function resolveTableColumnFilterMenuAriaLabel(titleText?: string): string {
  return titleText ? `Menu de filtros para ${titleText}` : "Menu de filtros da coluna";
}

export interface UseTableColumnFilterParams {
  options?: (string | TableFilterOption)[];
  value?: any;
  onChange?: (value: any) => void;
  columnTitle?: React.ReactNode;
  ariaLabel?: string;
}

/**
 * Hook utilitário que isola toda a lógica do filtro de coluna da tabela:
 * normalização de opções, busca/filtro de texto, controle de checkboxes, seleção global e acessibilidade WAI-ARIA.
 */
export function useTableColumnFilter({
  options,
  value,
  onChange,
  columnTitle,
  ariaLabel,
}: UseTableColumnFilterParams) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const normalizedOptions = React.useMemo(() => {
    return normalizeFilterOptions(options);
  }, [options]);

  const { isFilterActive, activeCount, selectedValues } = React.useMemo(() => {
    return resolveFilterState(value);
  }, [value]);

  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const handleCheckboxToggle = (optValue: any) => {
    const next = toggleCheckboxFilterValue(selectedValues, optValue);
    onChange?.(next);
  };

  const handleSelectAll = () => {
    const allVals = normalizedOptions.map((o) => o.value);
    onChange?.(allVals);
  };

  const handleClear = () => {
    onChange?.(undefined);
    setSearchQuery("");
  };

  const visibleOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const q = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [normalizedOptions, searchQuery]);

  const titleText = typeof columnTitle === "string" ? columnTitle : undefined;

  const triggerAriaLabel = resolveTableColumnFilterAriaLabel(
    titleText,
    isFilterActive,
    activeCount,
    ariaLabel,
  );

  const menuAriaLabel = resolveTableColumnFilterMenuAriaLabel(titleText);

  return {
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery,
    normalizedOptions,
    isFilterActive,
    activeCount,
    selectedValues,
    visibleOptions,
    titleText,
    triggerAriaLabel,
    menuAriaLabel,
    handleCheckboxToggle,
    handleSelectAll,
    handleClear,
  };
}
