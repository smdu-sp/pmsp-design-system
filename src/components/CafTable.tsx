import * as React from "react";
import { Table, type TableProps, type TableColumn } from "./Table";
import {
  formatCafScore,
  getCafScoreBadgeClass,
  resolveCafColumns,
  resolveCafTableContainerClass,
  createCafDefaultColumns,
  CAF_TABLE_SAMPLE_DATA,
  CAF_TABLE_FULL_DATA,
  CAF_DEFAULT_PAGE_SIZE_OPTIONS,
  type CafTableRowData,
  type FormattedCafScore,
} from "@/utils/cafTable";

export {
  CAF_TABLE_SAMPLE_DATA,
  CAF_TABLE_FULL_DATA,
  CAF_DEFAULT_PAGE_SIZE_OPTIONS,
  formatCafScore,
  getCafScoreBadgeClass,
  resolveCafColumns,
  resolveCafTableContainerClass,
};
export type { CafTableRowData, FormattedCafScore };

export interface CafScoreBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  score: number | string;
  threshold?: number;
}

/**
 * Badge em formato de pílula para exibição da nota de Avaliação do Sistema-CAF.
 * Exibe fundo azul escuro (#0b3299) para notas elevadas (>= 7.0) e contorno cinza com fundo branco para notas inferiores.
 */
export const CafScoreBadge: React.FC<CafScoreBadgeProps> = ({ score, threshold = 7.0, className, ...props }) => {
  const { formatted, isHigh } = formatCafScore(score, threshold);

  return (
    <span
      className={getCafScoreBadgeClass(isHigh, className)}
      {...props}
    >
      {formatted}
    </span>
  );
};

/**
 * Definição padrão de colunas para o Sistema-CAF com renderização semântica da nota de avaliação.
 */
export const CAF_DEFAULT_COLUMNS: TableColumn<CafTableRowData>[] = createCafDefaultColumns((val: number) => (
  <CafScoreBadge score={val} />
));

export interface CafTableProps extends Omit<TableProps, "variant"> {
  variant?: "caf";
}

/**
 * Componente de Tabela especializado para o **Sistema-CAF**.
 * Apresenta cabeçalho azul anil (#0b3299), tipografia com alto contraste,
 * badges de avaliação destacados e barra de paginação responsiva com seletor customizado de itens por página.
 * Nota: A coluna 'Avaliação' possui filtro desabilitado por especificação de design.
 */
export const CafTable = React.forwardRef<HTMLTableElement, CafTableProps>(
  ({ columns, boldFirstColumn = false, pageSizeOptions = CAF_DEFAULT_PAGE_SIZE_OPTIONS, pageSize = 10, className, ...props }, ref) => {
    // Normalização isolada via utilitário, garantindo ausência de filtro em 'Avaliação'
    const resolvedColumns = React.useMemo(() => {
      return resolveCafColumns(columns, CAF_DEFAULT_COLUMNS);
    }, [columns]);

    return (
      <Table
        ref={ref}
        variant="caf"
        columns={resolvedColumns}
        boldFirstColumn={boldFirstColumn}
        pageSizeOptions={pageSizeOptions}
        pageSize={pageSize}
        className={resolveCafTableContainerClass(className)}
        {...props}
      />
    );
  },
);

CafTable.displayName = "CafTable";
