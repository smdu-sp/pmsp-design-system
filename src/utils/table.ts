import * as React from "react";

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
}: NormalizeTableColumnsParams): TableColumn[] {
  if (columns && columns.length > 0) {
    const sliced = typeof columnsCount === "number" ? columns.slice(0, columnsCount) : columns;
    return sliced.map((col, idx) => ({
      ...col,
      bold: isColumnBold(idx, col, boldFirstColumn, boldColumns),
    }));
  }

  if (headers && headers.length > 0) {
    const slicedHeaders =
      typeof columnsCount === "number" ? headers.slice(0, columnsCount) : headers;

    const result: TableColumn[] = slicedHeaders.map((header, idx) => ({
      key: `col-${idx}`,
      header,
      bold: isColumnBold(idx, undefined, boldFirstColumn, boldColumns),
    }));

    if (typeof columnsCount === "number" && result.length < columnsCount) {
      const diff = columnsCount - result.length;
      for (let i = 0; i < diff; i++) {
        const idx = result.length;
        result.push({
          key: `col-${idx}`,
          header: `Coluna ${idx + 1}`,
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
