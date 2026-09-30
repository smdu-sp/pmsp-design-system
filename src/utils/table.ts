import * as React from "react";

export type TableFilterType = "checkbox" | "select" | "text";

export interface TableFilterOption {
  label: string;
  value: any;
}

export interface TableColumn<T = any> {
  /** Chave identificadora única da coluna */
  key?: string;
  /** Conteúdo ou texto do cabeçalho da coluna */
  header?: React.ReactNode;
  /** Define se o texto das células desta coluna será exibido em negrito */
  bold?: boolean;
  /** Alinhamento horizontal do conteúdo */
  align?: "left" | "center" | "right";
  /** Largura customizada da coluna (ex: '200px', '30%', 'auto') */
  width?: string | number;
  /** Renderizador personalizado para a célula */
  render?: (value: any, row: T, rowIndex: number, colIndex: number) => React.ReactNode;
  /** Define se a coluna deve agir como cabeçalho de linha (<th scope="row">) para leitores de tela */
  isRowHeader?: boolean;
  /** Indica se a coluna permite ordenação */
  sortable?: boolean;
  /** Direção atual da ordenação para o leitor de tela (aria-sort) */
  sortDirection?: "ascending" | "descending" | "none" | false;
  /** Ação disparada ao clicar para ordenar a coluna */
  onSort?: () => void;
  /** Rótulo acessível complementar para o botão de ordenação */
  sortAriaLabel?: string;
  /** Habilita menu dropdown de filtro no cabeçalho desta coluna */
  filterable?: boolean;
  /** Tipo de filtro exibido no dropdown: 'checkbox' (múltipla escolha), 'select' (única escolha) ou 'text' (busca textual) */
  filterType?: TableFilterType;
  /** Opções de valores para o filtro. Se omitido, é derivado automaticamente dos dados da tabela */
  filterOptions?: (string | TableFilterOption)[];
  /** Placeholder customizado para o campo de busca do filtro */
  filterPlaceholder?: string;
  /** Função personalizada de comparação para filtrar a linha */
  filterFn?: (rowValue: any, filterValue: any, row: T) => boolean;
}

/**
 * Calcula a lista de páginas e reticências a serem exibidas na paginação de tabelas.
 * Garante uma navegação fluida com limite visual de 7 botões de página na versão desktop.
 */
export function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const showLeftEllipsis = currentPage > 4;
  const showRightEllipsis = currentPage < totalPages - 3;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

/**
 * Verifica se a célula ou coluna deve ser renderizada com tipografia em negrito (font-bold).
 * Prioriza a propriedade `bold` da coluna individual, e em seguida checa se a primeira coluna
 * deve ser negrito (`boldFirstColumn`), mantendo suporte retrocompatível para `boldColumns`.
 */
export function isColumnBold(
  colIndex: number,
  columnDef?: TableColumn,
  boldFirstColumn?: boolean,
  boldColumns?: number[] | boolean[],
): boolean {
  if (columnDef?.bold !== undefined) {
    return columnDef.bold;
  }

  if (colIndex === 0 && boldFirstColumn !== undefined) {
    return Boolean(boldFirstColumn);
  }

  if (boldColumns !== undefined && Array.isArray(boldColumns)) {
    if (boldColumns.length === 0) return false;

    if (typeof boldColumns[0] === "number") {
      return (boldColumns as number[]).includes(colIndex);
    }

    if (typeof boldColumns[colIndex] === "boolean") {
      return Boolean(boldColumns[colIndex]);
    }
  }

  if (colIndex === 0) {
    return boldFirstColumn ?? true;
  }

  return false;
}

export interface ResolveContainerStylesParams {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

/**
 * Converte variáveis CSS, cores hexadecimais e raios de borda em estilos CSS inline para o container da tabela.
 */
export function resolveContainerStyles({
  backgroundColor,
  textColor,
  borderRadius,
  style,
}: ResolveContainerStylesParams): React.CSSProperties {
  const resolvedBg = backgroundColor
    ? backgroundColor.startsWith("--")
      ? `var(${backgroundColor})`
      : backgroundColor
    : undefined;

  const resolvedTextColor = textColor
    ? textColor.startsWith("--")
      ? `var(${textColor})`
      : textColor
    : undefined;

  const resolvedBr =
    typeof borderRadius === "number"
      ? `${borderRadius}px`
      : borderRadius
        ? borderRadius.startsWith("--")
          ? `var(${borderRadius})`
          : borderRadius
        : undefined;

  return {
    ...(resolvedBg ? { backgroundColor: resolvedBg } : {}),
    ...(resolvedTextColor ? { color: resolvedTextColor } : {}),
    ...(resolvedBr ? { borderRadius: resolvedBr } : {}),
    ...style,
  };
}

/**
 * Retorna o rótulo acessível descritivo da região com rolagem horizontal da tabela (WCAG 2.1.1 e 4.1.2).
 */
export function getContainerAriaLabel(
  scrollableRegionLabel?: string,
  tableAriaLabel?: string,
): string {
  return (
    scrollableRegionLabel ||
    (tableAriaLabel
      ? `${tableAriaLabel} (região com rolagem)`
      : "Tabela de dados com rolagem horizontal")
  );
}

export interface NormalizeTableColumnsParams {
  columns?: TableColumn[];
  headers?: React.ReactNode[];
  columnsCount?: number;
  boldFirstColumn?: boolean;
  boldColumns?: number[] | boolean[];
  filterable?: boolean;
  filterOptionsMap?: Record<number | string, (string | TableFilterOption)[]>;
}

/**
 * Normaliza colunas declaradas via array de `headers` simples, objetos `columns` ou contagem numérica `columnsCount`.
 */
export function normalizeTableColumns({
  columns,
  headers,
  columnsCount,
  boldFirstColumn = true,
  boldColumns,
  filterable = false,
  filterOptionsMap,
}: NormalizeTableColumnsParams): TableColumn[] {
  if (columns && columns.length > 0) {
    const sliced = typeof columnsCount === "number" ? columns.slice(0, columnsCount) : columns;
    return sliced.map((col, idx) => ({
      ...col,
      filterable: col.filterable !== undefined ? col.filterable : filterable,
      filterOptions: col.filterOptions || (filterOptionsMap ? filterOptionsMap[col.key || idx] : undefined),
      bold: isColumnBold(idx, col, boldFirstColumn, boldColumns),
    }));
  }

  if (headers && headers.length > 0) {
    const slicedHeaders =
      typeof columnsCount === "number" ? headers.slice(0, columnsCount) : headers;

    const result: TableColumn[] = slicedHeaders.map((header, idx) => ({
      key: `col-${idx}`,
      header,
      filterable,
      filterOptions: filterOptionsMap ? filterOptionsMap[`col-${idx}`] || filterOptionsMap[idx] : undefined,
      bold: isColumnBold(idx, undefined, boldFirstColumn, boldColumns),
    }));

    if (typeof columnsCount === "number" && result.length < columnsCount) {
      const diff = columnsCount - result.length;
      for (let i = 0; i < diff; i++) {
        const idx = result.length;
        result.push({
          key: `col-${idx}`,
          header: `Coluna ${idx + 1}`,
          filterable,
          bold: isColumnBold(idx, undefined, boldFirstColumn, boldColumns),
        });
      }
    }

    return result;
  }

  if (typeof columnsCount === "number" && columnsCount > 0) {
    return Array.from({ length: columnsCount }).map((_, idx) => ({
      key: `col-${idx}`,
      header: `Coluna ${idx + 1}`,
      filterable,
      bold: isColumnBold(idx, undefined, boldFirstColumn, boldColumns),
    }));
  }

  return [];
}

export interface PaginateDataParams<T = any> {
  data?: T[];
  isPaginationActive: boolean;
  startIndex: number;
  endIndex: number;
  totalItems?: number;
  effectivePageSize?: number;
}

/**
 * Fatia os dados para exibição na página ativa da tabela, preservando dados já pré-fatiados externamente.
 */
export function paginateData<T = any>({
  data,
  isPaginationActive,
  startIndex,
  endIndex,
  totalItems,
  effectivePageSize,
}: PaginateDataParams<T>): T[] | undefined {
  if (!data || !isPaginationActive) return data;
  if (totalItems !== undefined && effectivePageSize && data.length <= effectivePageSize) {
    return data;
  }
  return data.slice(startIndex, endIndex);
}

export interface ExtractCellValueParams {
  row: any;
  colIndex: number;
  colDef?: TableColumn;
  rowIndex: number;
}

/**
 * Extrai o valor bruto e o conteúdo renderizado de uma célula considerando matriz de arrays ou objetos.
 */
export function extractCellValue({
  row,
  colIndex,
  colDef,
  rowIndex,
}: ExtractCellValueParams): {
  rawValue: React.ReactNode;
  renderedContent: React.ReactNode;
} {
  const isArrayRow = Array.isArray(row);
  let rawValue: React.ReactNode = null;

  if (isArrayRow) {
    rawValue = (row as any[])[colIndex];
  } else if (colDef?.key && typeof row === "object" && row !== null) {
    rawValue = (row as Record<string, any>)[colDef.key];
  } else if (typeof row === "object" && row !== null) {
    const keys = Object.keys(row);
    rawValue = (row as Record<string, any>)[keys[colIndex]];
  }

  const renderedContent = colDef?.render
    ? colDef.render(rawValue, row, rowIndex, colIndex)
    : rawValue;

  return { rawValue, renderedContent };
}

export interface CalculatePaginationParams {
  totalItems?: number;
  dataLength?: number;
  pageSize?: number;
  limit?: number;
  currentPage: number;
}

/**
 * Calcula os valores centrais de paginação: total de páginas, página ativa delimitada,
 * flag de ativação e intervalos de índice (startIndex, endIndex).
 */
export function calculatePaginationValues({
  totalItems,
  dataLength = 0,
  pageSize,
  limit,
  currentPage,
}: CalculatePaginationParams) {
  const effectivePageSize =
    typeof pageSize === "number" ? pageSize : typeof limit === "number" ? limit : undefined;

  const totalCount = totalItems !== undefined ? totalItems : dataLength;
  const totalPages =
    effectivePageSize && effectivePageSize > 0
      ? Math.max(1, Math.ceil(totalCount / effectivePageSize))
      : 1;

  const activePage = Math.min(Math.max(1, currentPage), totalPages);
  const isPaginationActive = Boolean(effectivePageSize && effectivePageSize > 0);
  const startIndex = isPaginationActive ? (activePage - 1) * effectivePageSize! : 0;
  const endIndex = isPaginationActive ? startIndex + effectivePageSize! : totalCount;

  return {
    effectivePageSize,
    totalCount,
    totalPages,
    activePage,
    isPaginationActive,
    startIndex,
    endIndex,
  };
}

/**
 * Extrai texto legível de um valor primitivo ou de um ReactNode (elemento, fragmento, array, etc).
 */
export function getNodeText(node: any): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string" || typeof node === "number" || typeof node === "boolean") {
    return String(node).trim();
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).filter(Boolean).join(" ").trim();
  }
  if (React.isValidElement(node)) {
    const props = (node as React.ReactElement).props as any;
    if (props && props.children !== undefined) {
      return getNodeText(props.children);
    }
    if (props && (props["aria-label"] || props.title)) {
      return String(props["aria-label"] || props.title).trim();
    }
    return "";
  }
  if (typeof node === "object") {
    if ("label" in node) return getNodeText((node as any).label);
    if ("value" in node) return getNodeText((node as any).value);
  }
  return String(node).trim();
}

/**
 * Normaliza opções de filtro garantindo o formato de array de { label: string, value: any }.
 */
export function normalizeFilterOptions(options?: (string | TableFilterOption)[]): TableFilterOption[] {
  if (!options || options.length === 0) return [];
  return options.map((opt) => {
    if (typeof opt === "object" && opt !== null && "label" in opt && "value" in opt) {
      const label = getNodeText((opt as TableFilterOption).label) || String((opt as TableFilterOption).label);
      return {
        label,
        value: (opt as TableFilterOption).value,
      };
    }
    const label = getNodeText(opt) || String(opt);
    return { label, value: typeof opt === "string" || typeof opt === "number" ? opt : label };
  });
}

/**
 * Extrai valores únicos existentes para uma coluna a partir do conjunto de dados da tabela.
 */
export function extractUniqueColumnValues(data: any[], colIndex: number, colKey?: string): TableFilterOption[] {
  if (!data || !Array.isArray(data) || data.length === 0) return [];

  const valuesSet = new Set<string>();

  data.forEach((row, rowIndex) => {
    if (!row) return;
    const { rawValue, renderedContent } = extractCellValue({ row, colIndex, rowIndex });
    const textVal = getNodeText(rawValue) || getNodeText(renderedContent);
    if (textVal.length > 0) {
      valuesSet.add(textVal);
    }
  });

  return Array.from(valuesSet)
    .sort((a, b) => a.localeCompare(b, "pt-BR"))
    .map((val) => ({ label: val, value: val }));
}

export interface FilterTableDataParams<T = any> {
  data?: T[];
  filters: Record<string, any>;
  columns: TableColumn<T>[];
}

/**
 * Filtra as linhas da tabela de acordo com os filtros ativos em cada coluna.
 */
export function filterTableData<T = any>({
  data,
  filters,
  columns,
}: FilterTableDataParams<T>): T[] {
  if (!data || !Array.isArray(data)) return [];
  if (!filters || Object.keys(filters).length === 0) return data;

  const activeEntries = Object.entries(filters).filter(([_, val]) => {
    if (val === undefined || val === null) return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === "string") return val.trim().length > 0;
    return true;
  });

  if (activeEntries.length === 0) return data;

  return data.filter((row, rowIndex) => {
    return activeEntries.every(([colIdentifier, filterValue]) => {
      const colIndex = columns.findIndex(
        (col, idx) => col.key === colIdentifier || `col-${idx}` === colIdentifier || col.header === colIdentifier,
      );

      const colDef = colIndex !== -1 ? columns[colIndex] : undefined;
      const targetIndex = colIndex !== -1 ? colIndex : 0;

      const { rawValue, renderedContent } = extractCellValue({
        row,
        colIndex: targetIndex,
        colDef,
        rowIndex,
      });

      if (colDef?.filterFn) {
        return colDef.filterFn(rawValue, filterValue, row);
      }

      const rawText = getNodeText(rawValue);
      const renderedText = getNodeText(renderedContent);
      const cellText = (rawText || renderedText).trim();

      if (colDef?.filterType === "text" || (typeof filterValue === "string" && !Array.isArray(filterValue))) {
        return cellText.toLowerCase().includes(String(filterValue).toLowerCase().trim());
      }

      if (Array.isArray(filterValue)) {
        return filterValue.some((val) => {
          const filterText = getNodeText(val).trim().toLowerCase();
          return (
            (filterText.length > 0 && filterText === cellText.toLowerCase()) ||
            val === rawValue ||
            String(val).toLowerCase().trim() === cellText.toLowerCase()
          );
        });
      }

      const singleFilterText = getNodeText(filterValue).trim().toLowerCase();
      return (
        (singleFilterText.length > 0 && singleFilterText === cellText.toLowerCase()) ||
        filterValue === rawValue ||
        String(filterValue).toLowerCase().trim() === cellText.toLowerCase()
      );
    });
  });
}

/**
 * Atualiza o mapa de filtros ativos adicionando, alterando ou removendo o valor de uma coluna.
 * Se o valor for vazio, nulo ou array vazio, a chave é removida para manter o objeto limpo.
 */
export function updateColumnFilter(
  currentFilters: Record<string, any>,
  colKey: string,
  val: any,
): Record<string, any> {
  const nextFilters = { ...currentFilters };
  if (
    val === undefined ||
    val === null ||
    (Array.isArray(val) && val.length === 0) ||
    (typeof val === "string" && val.trim() === "")
  ) {
    delete nextFilters[colKey];
  } else {
    nextFilters[colKey] = val;
  }
  return nextFilters;
}

export interface BuildFilterOptionsMapParams {
  columns: TableColumn[];
  filterable?: boolean;
  data?: any[];
}

/**
 * Constrói o mapa de opções de filtro para cada coluna da tabela (por índice de coluna).
 * Prioriza opções pré-definidas em `col.filterOptions` e, caso não definidas, extrai os valores únicos dos dados.
 */
export function buildColumnsFilterOptionsMap({
  columns,
  filterable = false,
  data,
}: BuildFilterOptionsMapParams): Record<number, TableFilterOption[]> {
  const map: Record<number, TableFilterOption[]> = {};
  columns.forEach((col, colIndex) => {
    const isColFilterable = col.filterable !== undefined ? col.filterable : filterable;
    if (!isColFilterable) return;
    if (col.filterOptions && col.filterOptions.length > 0) {
      map[colIndex] = normalizeFilterOptions(col.filterOptions);
    } else if (data && data.length > 0) {
      map[colIndex] = extractUniqueColumnValues(data, colIndex, col.key);
    } else {
      map[colIndex] = [];
    }
  });
  return map;
}

/**
 * Delimita o número da página requisitada dentro do intervalo válido [1, totalPages].
 */
export function clampPage(newPage: number, totalPages: number): number {
  return Math.min(Math.max(1, newPage), Math.max(1, totalPages));
}

export interface ShouldRenderPaginationParams {
  isLoading?: boolean;
  showPagination?: boolean;
  isPaginationActive: boolean;
  totalCount: number;
  hideOnSinglePage?: boolean;
  hasPageSizeSelector: boolean;
  totalPages: number;
}

/**
 * Avalia se a barra de paginação deve ser renderizada com base nas condições de estado da tabela.
 */
export function checkShouldRenderPagination({
  isLoading = false,
  showPagination,
  isPaginationActive,
  totalCount,
  hideOnSinglePage = false,
  hasPageSizeSelector,
  totalPages,
}: ShouldRenderPaginationParams): boolean {
  if (isLoading) return false;
  if (showPagination !== undefined) return showPagination;
  return (
    isPaginationActive &&
    totalCount > 0 &&
    (!hideOnSinglePage || hasPageSizeSelector || totalPages > 1)
  );
}

/**
 * Gerenciador de eventos de teclado (Enter e Espaço) para linhas interativas da tabela.
 */
export function handleRowKeyDown(
  e: React.KeyboardEvent<HTMLTableRowElement>,
  isClickable: boolean,
  onClick?: (e: React.MouseEvent<HTMLTableRowElement>) => void,
  onKeyDown?: (e: React.KeyboardEvent<HTMLTableRowElement>) => void,
): void {
  if (isClickable && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    onClick?.(e as any);
  }
  onKeyDown?.(e);
}

/**
 * Filtra os filhos de um elemento composto removendo o elemento de cabeçalho (<thead> ou <TableHeader />)
 * quando a propriedade showHeader/hasHeader for false.
 */
export function filterChildrenWithoutHeader(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (
      React.isValidElement(child) &&
      ((child.type as any)?.displayName === "TableHeader" ||
        (child.type as any)?.name === "TableHeader" ||
        (typeof child.type === "string" && child.type === "thead"))
    ) {
      return null;
    }
    return child;
  });
}

export interface UseTableStateParams<T = any> {
  data?: T[];
  columns?: TableColumn<T>[];
  headers?: React.ReactNode[];
  columnsCount?: number;
  boldFirstColumn?: boolean;
  boldColumns?: number[] | boolean[];
  pageSize?: number;
  limit?: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  showPagination?: boolean;
  hideOnSinglePage?: boolean;
  isLoading?: boolean;
  filterable?: boolean;
  filters?: Record<string, any>;
  defaultFilters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
}

/**
 * Hook utilitário que gerencia o estado completo da tabela:
 * normalização de colunas, paginação (controlada e não controlada),
 * filtros por coluna (controlados e não controlados), mapeamento de opções e fatiamento dos dados.
 */
export function useTableState<T = any>({
  data,
  columns,
  headers,
  columnsCount,
  boldFirstColumn = true,
  boldColumns,
  pageSize,
  limit,
  page,
  defaultPage = 1,
  onPageChange,
  totalItems,
  pageSizeOptions,
  onPageSizeChange,
  showPagination,
  hideOnSinglePage = false,
  isLoading = false,
  filterable,
  filters,
  defaultFilters,
  onFilterChange,
}: UseTableStateParams<T>) {
  // Resolução do tamanho de página / limite de itens
  const initialPageSize = typeof pageSize === "number" ? pageSize : typeof limit === "number" ? limit : undefined;
  const [internalPageSize, setInternalPageSize] = React.useState<number | undefined>(initialPageSize);

  React.useEffect(() => {
    const resolvedSize = typeof pageSize === "number" ? pageSize : typeof limit === "number" ? limit : undefined;
    setInternalPageSize(resolvedSize);
  }, [pageSize, limit]);

  // Resolução da página atual (modo controlado vs não-controlado)
  const [internalPage, setInternalPage] = React.useState<number>(defaultPage ?? 1);
  const currentPage = page !== undefined ? page : internalPage;

  // Resolução dos filtros por coluna (modo controlado vs não-controlado)
  const [internalFilters, setInternalFilters] = React.useState<Record<string, any>>(defaultFilters || {});
  const activeFilters = filters !== undefined ? filters : internalFilters;

  const handleColumnFilterChange = React.useCallback(
    (colKey: string, val: any) => {
      const nextFilters = updateColumnFilter(activeFilters, colKey, val);

      if (filters === undefined) {
        setInternalFilters(nextFilters);
        setInternalPage(1);
      }
      onFilterChange?.(nextFilters);
      onPageChange?.(1);
    },
    [activeFilters, filters, onFilterChange, onPageChange],
  );

  const handleClearAllFilters = React.useCallback(() => {
    if (filters === undefined) {
      setInternalFilters({});
      setInternalPage(1);
    }
    onFilterChange?.({});
    onPageChange?.(1);
  }, [filters, onFilterChange, onPageChange]);

  // Montagem da lista normalizada de colunas
  const normalizedColumns = React.useMemo(() => {
    return normalizeTableColumns({
      columns,
      headers,
      columnsCount,
      boldFirstColumn,
      boldColumns,
      filterable,
    });
  }, [columns, headers, columnsCount, boldFirstColumn, boldColumns, filterable]);

  // Mapeamento automático de opções de filtro para colunas
  const columnsFilterOptionsMap = React.useMemo(() => {
    return buildColumnsFilterOptionsMap({
      columns: normalizedColumns,
      filterable,
      data: data as any[],
    });
  }, [normalizedColumns, filterable, data]);

  // Filtragem dos dados da tabela antes da paginação
  const filteredData = React.useMemo(() => {
    return filterTableData({
      data: data as any[],
      filters: activeFilters,
      columns: normalizedColumns,
    });
  }, [data, activeFilters, normalizedColumns]);

  const isFiltered = Object.keys(activeFilters).length > 0;

  const {
    effectivePageSize,
    totalCount,
    totalPages,
    activePage,
    isPaginationActive,
    startIndex,
    endIndex,
  } = calculatePaginationValues({
    totalItems: totalItems !== undefined ? totalItems : (filteredData ? filteredData.length : 0),
    dataLength: filteredData ? filteredData.length : 0,
    pageSize: internalPageSize,
    currentPage,
  });

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      const clamped = clampPage(newPage, totalPages);
      if (page === undefined) {
        setInternalPage(clamped);
      }
      onPageChange?.(clamped);
    },
    [page, totalPages, onPageChange],
  );

  const handlePageSizeChange = React.useCallback(
    (newSize: number) => {
      setInternalPageSize(newSize);
      onPageSizeChange?.(newSize);
      if (page === undefined) {
        setInternalPage(1);
      }
      onPageChange?.(1);
    },
    [page, onPageSizeChange, onPageChange],
  );

  const hasPageSizeSelector = Boolean(pageSizeOptions && pageSizeOptions.length > 0);
  const shouldRenderPagination = checkShouldRenderPagination({
    isLoading,
    showPagination,
    isPaginationActive,
    totalCount,
    hideOnSinglePage,
    hasPageSizeSelector,
    totalPages,
  });

  const paginatedData = React.useMemo(() => {
    return paginateData({
      data: filteredData,
      isPaginationActive,
      startIndex,
      endIndex,
      totalItems,
      effectivePageSize,
    });
  }, [filteredData, isPaginationActive, startIndex, endIndex, totalItems, effectivePageSize]);

  return {
    currentPage,
    activePage,
    totalPages,
    totalCount,
    effectivePageSize,
    startIndex,
    endIndex,
    isPaginationActive,
    normalizedColumns,
    columnsFilterOptionsMap,
    filteredData,
    paginatedData,
    activeFilters,
    isFiltered,
    shouldRenderPagination,
    handleColumnFilterChange,
    handleClearAllFilters,
    handlePageChange,
    handlePageSizeChange,
  };
}


