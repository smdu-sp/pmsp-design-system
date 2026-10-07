import * as React from "react";
import { createPortal } from "react-dom";
import type { VariantProps } from "class-variance-authority";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, Check, RotateCcw } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  tableVariants,
  type TableVariant,
  type TableDensity,
  type TableColumn,
  type TableFilterType,
  type TableFilterOption,
  getPaginationRange,
  isColumnBold,
  resolveContainerStyles,
  getContainerAriaLabel,
  extractCellValue,
  handleRowKeyDown,
  filterChildrenWithoutHeader,
  useTableState,
  updateColumnFilter,
  resolveSortButtonAriaLabel,
  checkShouldRenderHeader,
  checkIsDeclarativeTable,
  calculatePaginationOffsets,
} from "@/utils/table";
import { TableColumnFilter, type TableColumnFilterProps } from "./TableColumnFilter";

export { tableVariants, TableColumnFilter, useTableState, updateColumnFilter };
export type { TableVariant, TableDensity, TableColumn, TableFilterType, TableFilterOption, TableColumnFilterProps };

export interface TableProps extends React.HTMLAttributes<HTMLTableElement>, VariantProps<typeof tableVariants> {
  /**
   * Define quantas colunas vão existir na tabela.
   * Se fornecido em conjunto com headers/columns/data, ajusta ou restringe a quantidade exibida.
   */
  columnsCount?: number;

  /**
   * Define se o texto da primeira coluna vai ser em negrito ou não.
   * @default true
   */
  boldFirstColumn?: boolean;

  /**
   * @deprecated Utilize `boldFirstColumn` para alternar o negrito da primeira coluna.
   */
  boldColumns?: number[] | boolean[];

  /**
   * Títulos das colunas para o cabeçalho (modo declarativo simples).
   * Ex: `["Tema", "Descrição", "Acesso"]`
   */
  headers?: React.ReactNode[];

  /**
   * Configurações detalhadas de cada coluna (modo estruturado).
   */
  columns?: TableColumn[];

  /**
   * Define se o cabeçalho (<thead>) da tabela deve ser exibido.
   * Quando definido como `false`, oculta o cabeçalho mantendo a estrutura de colunas do corpo.
   * @default true
   */
  showHeader?: boolean;

  /**
   * Alias alternativo para `showHeader`.
   * @default true
   */
  hasHeader?: boolean;

  /**
   * Dados a serem exibidos no corpo da tabela (matriz de valores ou array de objetos).
   * Ex: `[["Cartaz do mês", "Cartazes já publicados...", "Em breve"], ...]`
   */
  data?: React.ReactNode[][] | Record<string, any>[];

  /** Habilita efeito hover nas linhas da tabela (padrão: true) */
  hoverable?: boolean;

  /**
   * Índice da coluna que servirá semanticamente como cabeçalho de linha (<th scope="row">).
   * Essencial para usuários de leitores de tela identificarem o contexto da linha ao navegar pelas colunas.
   */
  rowHeaderColIndex?: number;

  /** Mensagem ou componente exibido quando o array de dados estiver vazio */
  emptyMessage?: React.ReactNode;

  /** Indica se os dados da tabela estão em carregamento */
  isLoading?: boolean;

  /** Mensagem ou componente exibido durante o estado de carregamento */
  loadingMessage?: React.ReactNode;

  /** Rótulo acessível da região de rolagem horizontal (WCAG 2.1.1 e 4.1.2) */
  scrollableRegionLabel?: string;

  /**
   * Permite focar o container com a tecla Tab para possibilitar rolagem horizontal via teclado (padrão: true).
   */
  keyboardScrollable?: boolean;

  /** Atributos HTML adicionais para o container de rolagem externo */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;

  /** Callback acionado ao interagir (clique ou Enter/Espaço) com uma linha */
  onRowClick?: (row: any, rowIndex: number) => void;

  /** Cor de fundo personalizada para o container (hexadecimal '#...' ou variável CSS 'var(--...)') */
  backgroundColor?: string;

  /** Cor de texto personalizada (hexadecimal '#...' ou variável CSS 'var(--...)') */
  textColor?: string;

  /** Raio de borda personalizado do container (ex: '16px', '1rem', '9999px' ou número) */
  borderRadius?: string | number;

  /**
   * Define o limite de itens exibidos por página na tabela.
   * Se a quantidade de itens atingir ou ultrapassar esse limite, a paginação é exibida automaticamente.
   */
  limit?: number;

  /**
   * Alias para `limit`. Define a quantidade de linhas por página.
   */
  pageSize?: number;

  /**
   * Página atual em modo controlado (iniciando em 1).
   */
  page?: number;

  /**
   * Página inicial padrão para modo não-controlado (padrão: 1).
   */
  defaultPage?: number;

  /**
   * Callback acionado ao alterar de página.
   */
  onPageChange?: (page: number) => void;

  /**
   * Quantidade total de registros para cálculo da paginação.
   * Por padrão, assume a quantidade de itens no array `data`.
   */
  totalItems?: number;

  /**
   * Força a exibição (true) ou ocultação (false) dos controles de paginação.
   * Se omitido, é exibido automaticamente caso o total de registros atinja ou supere o limite definido.
   */
  showPagination?: boolean;

  /**
   * Se verdadeiro, oculta os controles de paginação quando houver apenas 1 página.
   * @default false
   */
  hideOnSinglePage?: boolean;

  /**
   * Define se exibe a contagem informativa de itens (ex: "Mostrando 1 a 4 de 9 itens").
   * @default true
   */
  showPaginationInfo?: boolean;

  /**
   * Exibe botões para saltar diretamente para a primeira e última página.
   * @default false
   */
  showFirstLastButtons?: boolean;

  /**
   * Opções numéricas para o seletor de limite de itens por página (ex: [3, 5, 10]).
   */
  pageSizeOptions?: number[];

  /**
   * Callback acionado ao alterar o limite de itens por página pelo seletor.
   */
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * Rótulo acessível da barra de navegação de páginas.
   * @default "Paginação da tabela"
   */
  paginationAriaLabel?: string;

  /**
   * Classes CSS complementares para a barra de paginação.
   */
  paginationClassName?: string;

  /**
   * Habilita menu dropdown de filtro no cabeçalho das colunas.
   * Se definido como true, torna todas as colunas filtráveis por padrão (salvo se a coluna definir `filterable: false`).
   */
  filterable?: boolean;

  /**
   * Valores dos filtros ativos por coluna (formato `{ [colunaKey]: valor }`).
   * Utilizado para controle externo do estado dos filtros.
   */
  filters?: Record<string, any>;

  /**
   * Filtros iniciais padrão para modo não-controlado.
   */
  defaultFilters?: Record<string, any>;

  /**
   * Callback acionado sempre que algum filtro de coluna é aplicado, alterado ou limpo.
   */
  onFilterChange?: (filters: Record<string, any>) => void;
}

// --- Componentes Compostos ---

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-slate-100/90 text-xs sm:text-sm font-semibold text-slate-900 border-b border-slate-200/80", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("divide-y divide-slate-100 bg-white", className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("bg-slate-50 font-medium text-slate-900 border-t border-slate-200", className)} {...props} />
));
TableFooter.displayName = "TableFooter";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
  isInteractive?: boolean;
  selected?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className, hoverable = true, isInteractive = false, selected, onClick, onKeyDown, tabIndex, role, ...props }, ref) => {
  const isClickable = isInteractive || Boolean(onClick);

  return (
    <tr
      ref={ref}
      tabIndex={isClickable ? (tabIndex ?? 0) : tabIndex}
      role={isClickable ? (role ?? "button") : role}
      aria-selected={selected}
      onClick={onClick}
      onKeyDown={(e) => handleRowKeyDown(e, isClickable, onClick, onKeyDown)}
      className={cn(
        "border-slate-100 last:border-b-0 transition-colors motion-reduce:transition-none",
        hoverable && "hover:bg-slate-50/70",
        selected && "bg-blue-50/70 hover:bg-blue-50/90",
        isClickable && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset",
        className,
      )}
      {...props}
    />
  );
});
TableRow.displayName = "TableRow";

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  variant?: TableVariant | null;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortDirection?: "ascending" | "descending" | "none" | false;
  onSort?: () => void;
  sortAriaLabel?: string;
  /** Habilita menu dropdown de filtro no cabeçalho */
  filterable?: boolean;
  /** Tipo de filtro exibido: 'checkbox' | 'select' | 'text' */
  filterType?: TableFilterType;
  /** Opções de valores para o filtro */
  filterOptions?: (string | TableFilterOption)[];
  /** Valor atualmente selecionado no filtro */
  filterValue?: any;
  /** Callback acionado ao alterar o valor do filtro */
  onFilterChange?: (value: any) => void;
  /** Placeholder customizado para o campo de texto/busca do filtro */
  filterPlaceholder?: string;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      align = "left",
      scope = "col",
      sortable = false,
      sortDirection,
      onSort,
      sortAriaLabel,
      filterable = false,
      filterType = "checkbox",
      filterOptions,
      filterValue,
      onFilterChange,
      filterPlaceholder,
      variant,
      children,
      ...props
    },
    ref,
  ) => {
    const isCaf = variant === "caf";
    const ariaSortValue = sortDirection || (sortable ? "none" : undefined);
    const hasFilter = filterable && Boolean(onFilterChange || filterOptions);
    const resolvedSortAriaLabel = resolveSortButtonAriaLabel(children, sortDirection, sortAriaLabel);

    const sortButton = sortable ? (
      <button
        type="button"
        onClick={onSort}
        aria-label={resolvedSortAriaLabel}
        className={cn(
          "group inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 -mx-1.5 -my-1 font-semibold",
          isCaf ? "text-white hover:bg-white/10" : "font-bold text-slate-900 hover:bg-slate-200/70",
          "transition-colors motion-reduce:transition-none cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1",
          align === "center" && "justify-center mx-auto",
          align === "right" && "justify-end ml-auto",
        )}
      >
        <span>{children}</span>
        <span className={cn("inline-flex shrink-0", isCaf ? "text-white/80 group-hover:text-white" : "text-slate-600 group-hover:text-slate-900")} aria-hidden="true">
          {sortDirection === "ascending" ? (
            <ArrowUp className="w-3.5 h-3.5" />
          ) : sortDirection === "descending" ? (
            <ArrowDown className="w-3.5 h-3.5" />
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          )}
        </span>
      </button>
    ) : null;

    const baseThClasses = cn(
      isCaf ? "font-semibold text-white tracking-tight text-left" : "font-bold text-slate-900 tracking-tight text-left",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className,
    );

    if (!hasFilter) {
      return (
        <th ref={ref} scope={scope} aria-sort={ariaSortValue} className={baseThClasses} {...props}>
          {sortable ? sortButton : children}
        </th>
      );
    }

    return (
      <th
        ref={ref}
        scope={scope}
        aria-sort={ariaSortValue}
        className={cn(
          isCaf ? "font-semibold text-white tracking-tight text-left relative" : "font-bold text-slate-900 tracking-tight text-left relative",
          align === "center" && "text-center",
          align === "right" && "text-right",
          className,
        )}
        {...props}
      >
        <div className={cn("inline-flex items-center gap-1.5 max-w-full", align === "center" && "justify-center mx-auto", align === "right" && "justify-end ml-auto")}>
          {sortable ? sortButton : <span>{children}</span>}
          <TableColumnFilter
            columnTitle={children}
            filterType={filterType}
            options={filterOptions}
            value={filterValue}
            onChange={onFilterChange}
            placeholder={filterPlaceholder}
            align={align}
            isCaf={isCaf}
          />
        </div>
      </th>
    );
  },
);
TableHead.displayName = "TableHead";

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  bold?: boolean;
  align?: "left" | "center" | "right";
  as?: "td" | "th";
  scope?: "col" | "row" | "colgroup" | "rowgroup";
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ className, bold, align = "left", as, scope, ...props }, ref) => {
  const isRowHeader = as === "th" || scope === "row";
  const Component = isRowHeader ? "th" : "td";
  const shouldBeBold = bold !== undefined ? bold : isRowHeader;

  return (
    <Component
      ref={ref}
      scope={scope ?? (isRowHeader ? "row" : undefined)}
      className={cn(
        "leading-relaxed transition-colors motion-reduce:transition-none",
        shouldBeBold ? "font-bold text-slate-900" : "font-normal text-slate-700",
        isRowHeader && "text-left",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
      {...props}
    />
  );
});
TableCell.displayName = "TableCell";

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  side?: "top" | "bottom";
  srOnly?: boolean;
}

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(({ className, side = "bottom", srOnly = false, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(srOnly ? "sr-only" : cn("text-xs sm:text-sm text-slate-600 font-medium", side === "top" ? "caption-top mb-3 text-left" : "caption-bottom mt-3 text-center"), className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// --- Subcomponente de Paginação ---

export interface TablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: TableVariant | null;
  /** Página atual (1-indexada) */
  currentPage: number;
  /** Quantidade total de páginas */
  totalPages: number;
  /** Quantidade total de itens */
  totalItems?: number;
  /** Quantidade de itens exibidos por página */
  pageSize?: number;
  /** Callback acionado ao alterar de página */
  onPageChange: (page: number) => void;
  /** Define se exibe o texto resumo (ex: "Mostrando 1 a 4 de 9 itens") */
  showInfo?: boolean;
  /** Exibe botões para saltar para a primeira e última página */
  showFirstLast?: boolean;
  /** Opções numéricas para o seletor de quantidade de itens por página */
  pageSizeOptions?: number[];
  /** Callback acionado ao alterar o pageSize pelo seletor */
  onPageSizeChange?: (pageSize: number) => void;
  /** Rótulo acessível da região de paginação */
  ariaLabel?: string;
  /** Termo utilizado para nomear os itens no resumo (padrão: "itens") */
  itemLabel?: string;
}

export const TablePagination = React.forwardRef<HTMLDivElement, TablePaginationProps>(
  (
    {
      className,
      variant = "default",
      currentPage,
      totalPages,
      totalItems,
      pageSize,
      onPageChange,
      showInfo = true,
      showFirstLast = true,
      pageSizeOptions,
      onPageSizeChange,
      ariaLabel = "Paginação da tabela",
      itemLabel = "itens",
      ...props
    },
    ref,
  ) => {
    const isCaf = variant === "caf";
    const pages = React.useMemo(() => getPaginationRange(currentPage, totalPages), [currentPage, totalPages]);
    const { startIndex, endIndex } = calculatePaginationOffsets(currentPage, pageSize, totalItems);

    const [isPageSizeOpen, setIsPageSizeOpen] = React.useState(false);
    const pageSizeButtonRef = React.useRef<HTMLButtonElement>(null);
    const pageSizeMenuRef = React.useRef<HTMLDivElement>(null);
    const [menuCoords, setMenuCoords] = React.useState<{ top?: number; bottom?: number; left: number } | null>(null);

    const updateMenuPosition = React.useCallback(() => {
      if (!pageSizeButtonRef.current || typeof window === "undefined") return;
      const rect = pageSizeButtonRef.current.getBoundingClientRect();
      const menuWidth = 84;
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;

      // Abre acima do botão ("acima de qualquer outro item" e evita corte na borda inferior da tela/container)
      const openAbove = spaceAbove >= 160 || spaceAbove >= spaceBelow;
      const left = Math.max(12, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 12));

      if (openAbove) {
        setMenuCoords({
          bottom: window.innerHeight - rect.top + 6,
          left,
        });
      } else {
        setMenuCoords({
          top: rect.bottom + 6,
          left,
        });
      }
    }, []);

    React.useEffect(() => {
      if (!isPageSizeOpen) return;
      updateMenuPosition();

      const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
        const target = e.target as Node;
        if (pageSizeMenuRef.current && !pageSizeMenuRef.current.contains(target) && pageSizeButtonRef.current && !pageSizeButtonRef.current.contains(target)) {
          setIsPageSizeOpen(false);
        }
      };

      const handleScrollOrResize = () => {
        updateMenuPosition();
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsPageSizeOpen(false);
          pageSizeButtonRef.current?.focus();
        }
      };

      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);

      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
        document.removeEventListener("touchstart", handleOutsideClick);
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
      };
    }, [isPageSizeOpen, updateMenuPosition]);

    const navButtonClass = cn(
      "inline-flex items-center justify-center h-8 rounded-lg border border-slate-200/80 bg-white text-slate-700 shadow-xs transition-colors motion-reduce:transition-none shrink-0",
      "hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1",
      "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:border-slate-200",
    );

    return (
      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        className={cn(
          "flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-3 border-t border-slate-200/80 bg-slate-50/50 text-slate-700 text-xs sm:text-sm select-none",
          isCaf && "bg-white border-slate-100 text-slate-500",
          className,
        )}
        {...props}
      >
        {/* Bloco de informações */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2 sm:gap-4">
          {showInfo && (
            <div role="status" aria-live="polite" className={cn("text-xs sm:text-sm font-medium", isCaf ? "text-slate-500 font-normal" : "text-slate-600")}>
              {isCaf ? (
                <>
                  Página <span className="font-semibold text-slate-800">{currentPage}</span> de <span className="font-semibold text-slate-800">{totalPages}</span> ({totalItems ?? 0} {itemLabel})
                </>
              ) : totalItems !== undefined && pageSize !== undefined ? (
                <>
                  <span className="hidden sm:inline">Mostrando </span>
                  <span className="font-semibold text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</span> a <span className="font-semibold text-slate-900">{Math.min(endIndex, totalItems)}</span>{" "}
                  de <span className="font-semibold text-slate-900">{totalItems}</span> {itemLabel}
                </>
              ) : (
                <>
                  Página <span className="font-semibold text-slate-900">{currentPage}</span> de <span className="font-semibold text-slate-900">{totalPages}</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bloco de navegação centralizado */}
        {isCaf ? (
          <nav role="navigation" aria-label={ariaLabel} className="inline-flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Página anterior"
              className="w-7 h-7 sm:w-8 sm:h-8 inline-flex items-center justify-center rounded-md border border-slate-200/90 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            {pages.map((p, idx) => {
              if (typeof p === "string") {
                return (
                  <span key={`ellipsis-${idx}`} className="inline-flex items-center justify-center min-w-7 h-7 text-slate-400 select-none text-xs">
                    &hellip;
                  </span>
                );
              }

              const isActive = p === currentPage;
              return (
                <button
                  key={`page-${p}`}
                  type="button"
                  onClick={() => onPageChange(p)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 inline-flex items-center justify-center text-xs font-bold rounded-md transition-colors cursor-pointer",
                    isActive ? "bg-[#0b3299] text-white shadow-2xs" : "bg-white text-slate-700 hover:bg-slate-100 border border-transparent",
                  )}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Próxima página"
              className="w-7 h-7 sm:w-8 sm:h-8 inline-flex items-center justify-center rounded-md border border-slate-200/90 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </nav>
        ) : (
          <nav role="navigation" aria-label={ariaLabel} className="w-full sm:w-auto">
            {/* Visualização para Mobile (< 640px) */}
            <div className="flex sm:hidden items-center justify-between w-full gap-2 pt-2 border-t border-slate-200/60">
              <div className="inline-flex items-center gap-1">
                {showFirstLast && (
                  <button type="button" onClick={() => onPageChange(1)} disabled={currentPage <= 1} aria-label="Ir para a primeira página" className={cn(navButtonClass, "w-8 h-8 p-0")}>
                    <ChevronsLeft className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">Primeira página</span>
                  </button>
                )}
                <button type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} aria-label="Ir para a página anterior" className={cn(navButtonClass, "w-8 h-8 p-0")}>
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">Página anterior</span>
                </button>
              </div>

              <div className="text-xs font-medium text-slate-700 select-none text-center px-1">
                Página <strong className="font-bold text-slate-900">{currentPage}</strong> de <strong className="font-bold text-slate-900">{totalPages}</strong>
              </div>

              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  aria-label="Ir para a próxima página"
                  className={cn(navButtonClass, "w-8 h-8 p-0")}
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">Próxima página</span>
                </button>
                {showFirstLast && (
                  <button
                    type="button"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                    aria-label="Ir para a última página"
                    className={cn(navButtonClass, "w-8 h-8 p-0")}
                  >
                    <ChevronsRight className="w-4 h-4" aria-hidden="true" />
                    <span className="sr-only">Última página</span>
                  </button>
                )}
              </div>
            </div>

            {/* Visualização para Desktop e Tablets (>= 640px) */}
            <div className="hidden sm:inline-flex items-center gap-1 sm:gap-1.5 justify-end">
              {showFirstLast && (
                <button type="button" onClick={() => onPageChange(1)} disabled={currentPage <= 1} aria-label="Ir para a primeira página" className={cn(navButtonClass, "w-8 p-0")}>
                  <ChevronsLeft className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">Primeira página</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                aria-label="Ir para a página anterior"
                className={cn(navButtonClass, "gap-1 px-2.5 sm:px-3")}
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline font-medium">Anterior</span>
              </button>

              <div className="inline-flex items-center gap-1">
                {pages.map((p, idx) => {
                  if (typeof p === "string") {
                    return (
                      <span key={`ellipsis-${idx}`} className="inline-flex items-center justify-center min-w-8 h-8 text-slate-400 select-none text-xs sm:text-sm" aria-hidden="true">
                        &hellip;
                      </span>
                    );
                  }

                  const isActive = p === currentPage;
                  return (
                    <button
                      type="button"
                      key={`page-${p}`}
                      onClick={() => onPageChange(p)}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={isActive ? `Página ${p}, página atual` : `Ir para a página ${p}`}
                      className={cn(
                        "inline-flex items-center justify-center min-w-8 h-8 px-2 text-xs sm:text-sm font-medium rounded-lg transition-colors motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1",
                        isActive ? "bg-slate-900 text-white font-semibold shadow-xs" : "text-slate-700 hover:bg-slate-200/70 hover:text-slate-900 border border-transparent",
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                aria-label="Ir para a próxima página"
                className={cn(navButtonClass, "gap-1 px-2.5 sm:px-3")}
              >
                <span className="hidden sm:inline font-medium">Próxima</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>

              {showFirstLast && (
                <button type="button" onClick={() => onPageChange(totalPages)} disabled={currentPage >= totalPages} aria-label="Ir para a última página" className={cn(navButtonClass, "w-8 p-0")}>
                  <ChevronsRight className="w-4 h-4" aria-hidden="true" />
                  <span className="sr-only">Última página</span>
                </button>
              )}
            </div>
          </nav>
        )}

        {/* Bloco seletor de linhas por página */}
        {pageSizeOptions && pageSizeOptions.length > 0 && onPageSizeChange && (
          <div className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 font-normal shrink-0">
            <span className="whitespace-nowrap">Itens por página:</span>
            {isCaf ? (
              <div className="relative inline-flex items-center">
                <button
                  ref={pageSizeButtonRef}
                  type="button"
                  onClick={() => setIsPageSizeOpen((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={isPageSizeOpen}
                  aria-label={`Selecionar itens por página, atualmente ${pageSize}`}
                  className="inline-flex items-center justify-between gap-1.5 min-w-[54px] px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-800 shadow-2xs hover:border-slate-300 hover:bg-slate-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <span>{pageSize}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-150", isPageSizeOpen && "rotate-180")} aria-hidden="true" />
                </button>

                {isPageSizeOpen &&
                  typeof document !== "undefined" &&
                  createPortal(
                    <div
                      ref={pageSizeMenuRef}
                      role="listbox"
                      aria-label="Opções de quantidade de itens por página"
                      style={{
                        position: "fixed",
                        left: menuCoords ? `${menuCoords.left}px` : undefined,
                        top: menuCoords?.top !== undefined ? `${menuCoords.top}px` : undefined,
                        bottom: menuCoords?.bottom !== undefined ? `${menuCoords.bottom}px` : undefined,
                        zIndex: 99999,
                      }}
                      className="min-w-[84px] max-h-60 overflow-y-auto bg-white rounded-xl shadow-2xl border border-slate-200/90 ring-1 ring-slate-900/5 py-1.5 animate-in fade-in-50 zoom-in-95 duration-100"
                    >
                      {pageSizeOptions.map((opt) => {
                        const isSelected = opt === pageSize;
                        return (
                          <button
                            key={opt}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              onPageSizeChange(opt);
                              setIsPageSizeOpen(false);
                              pageSizeButtonRef.current?.focus();
                            }}
                            className={cn(
                              "w-full flex items-center gap-1.5 pl-2.5 pr-4 py-1.5 text-xs text-slate-700 hover:bg-slate-100/80 cursor-pointer transition-colors text-left",
                              isSelected && "font-semibold text-slate-900 bg-slate-50/80",
                            )}
                          >
                            <span className="w-3.5 flex items-center justify-center text-[#0b3299]">{isSelected ? <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" /> : null}</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>,
                    document.body,
                  )}
              </div>
            ) : (
              <select
                id="table-page-size-select"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                aria-label="Selecionar quantidade de itens por página"
                className="rounded-lg border bg-white px-2 py-1 text-xs sm:text-sm font-medium text-slate-800 shadow-xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
              >
                {pageSizeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>
    );
  },
);
TablePagination.displayName = "TablePagination";

// --- Componente Principal Table ---

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      variant = "default",
      density = "default",
      columnsCount,
      boldFirstColumn = true,
      boldColumns,
      headers,
      columns,
      showHeader = true,
      hasHeader,
      data,
      hoverable = true,
      rowHeaderColIndex,
      emptyMessage = "Nenhum dado encontrado.",
      isLoading = false,
      loadingMessage = "Carregando dados da tabela...",
      scrollableRegionLabel,
      keyboardScrollable = true,
      containerProps,
      onRowClick,
      backgroundColor,
      textColor,
      borderRadius,
      limit,
      pageSize,
      page,
      defaultPage = 1,
      onPageChange,
      totalItems,
      showPagination,
      hideOnSinglePage = false,
      showPaginationInfo = true,
      showFirstLastButtons = true,
      pageSizeOptions,
      onPageSizeChange,
      paginationAriaLabel,
      paginationClassName,
      filterable,
      filters,
      defaultFilters,
      onFilterChange,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const {
      activePage,
      totalPages,
      totalCount,
      effectivePageSize,
      startIndex,
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
    } = useTableState({
      data,
      columns,
      headers,
      columnsCount,
      boldFirstColumn,
      boldColumns,
      pageSize,
      limit,
      page,
      defaultPage,
      onPageChange,
      totalItems,
      pageSizeOptions,
      onPageSizeChange,
      showPagination,
      hideOnSinglePage,
      isLoading,
      filterable,
      filters,
      defaultFilters,
      onFilterChange,
    });

    // Resolução de estilos customizados via utilitário
    const containerStyles = resolveContainerStyles({
      backgroundColor,
      textColor,
      borderRadius,
      style,
    });

    // Determina o nome acessível da região com rolagem via utilitário
    const containerAriaLabel = getContainerAriaLabel(scrollableRegionLabel, props["aria-label"]);

    const isDeclarativeMode = checkIsDeclarativeTable(normalizedColumns.length, data?.length);
    const shouldRenderHeader = checkShouldRenderHeader(showHeader, hasHeader);
    const hasAnyFilterableColumn = Boolean(filterable || normalizedColumns.some((c) => c.filterable));

    return (
      <div
        style={Object.keys(containerStyles).length > 0 ? containerStyles : undefined}
        {...containerProps}
        className={cn(
          "w-full rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden transition-all motion-reduce:transition-none flex flex-col",
          containerProps?.className,
          className,
        )}
      >
        <div
          role="region"
          aria-label={containerAriaLabel}
          tabIndex={keyboardScrollable ? 0 : undefined}
          className={cn("w-full overflow-x-auto", keyboardScrollable && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset")}
        >
          <table ref={ref} aria-busy={isLoading ? true : undefined} className={cn(tableVariants({ variant, density }))} {...props}>
            {isDeclarativeMode ? (
              <>
                {shouldRenderHeader && normalizedColumns.length > 0 && (
                  <TableHeader className={variant === "caf" ? "bg-[#0b3299] text-white border-b-0" : undefined}>
                    <TableRow hoverable={false} className={variant === "caf" ? "border-b-0 hover:bg-transparent" : undefined}>
                      {normalizedColumns.map((col, colIndex) => {
                        const colKey = col.key || `col-${colIndex}`;
                        const isAvaliacaoCol =
                          col.key?.toLowerCase() === "avaliacao" ||
                          (typeof col.header === "string" &&
                            col.header
                              .toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .includes("avaliacao"));
                        const isColFilterable = variant === "caf" && isAvaliacaoCol ? false : col.filterable !== undefined ? col.filterable : (filterable ?? false);
                        const colFilterOptions = columnsFilterOptionsMap[colIndex];
                        const currentFilterValue = activeFilters[colKey] ?? activeFilters[col.key || ""] ?? (typeof col.header === "string" ? activeFilters[col.header] : undefined);

                        return (
                          <TableHead
                            key={colKey}
                            variant={variant}
                            align={col.align}
                            sortable={col.sortable}
                            sortDirection={col.sortDirection}
                            onSort={col.onSort}
                            sortAriaLabel={col.sortAriaLabel}
                            style={col.width ? { width: col.width } : undefined}
                            filterable={isColFilterable}
                            filterType={col.filterType || "checkbox"}
                            filterOptions={colFilterOptions}
                            filterValue={currentFilterValue}
                            onFilterChange={(val) => handleColumnFilterChange(colKey, val)}
                            filterPlaceholder={col.filterPlaceholder}
                          >
                            {col.header}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                )}

                <TableBody>
                  {isLoading ? (
                    <TableRow hoverable={false}>
                      <TableCell colSpan={normalizedColumns.length || columnsCount || 1} className="py-12 text-center">
                        <div role="status" aria-live="polite" className="inline-flex flex-col items-center justify-center gap-2 text-slate-600 font-medium">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600 shrink-0 inline-block" aria-hidden="true" />
                          <span>{loadingMessage}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedData && paginatedData.length > 0 ? (
                    paginatedData.map((row, indexOnPage) => {
                      const rowIndex = startIndex + indexOnPage;
                      const isArrayRow = Array.isArray(row);
                      const totalCols =
                        normalizedColumns.length > 0 ? normalizedColumns.length : typeof columnsCount === "number" ? columnsCount : isArrayRow ? (row as any[]).length : Object.keys(row).length;

                      return (
                        <TableRow key={`row-${rowIndex}`} hoverable={hoverable} isInteractive={Boolean(onRowClick)} onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}>
                          {Array.from({ length: totalCols }).map((_, colIndex) => {
                            const colDef = normalizedColumns[colIndex];
                            const cellBold = isColumnBold(colIndex, colDef, boldFirstColumn, boldColumns);
                            const isRowHeader = colDef?.isRowHeader ?? (rowHeaderColIndex !== undefined ? rowHeaderColIndex === colIndex : false);

                            const { renderedContent } = extractCellValue({
                              row,
                              colIndex,
                              colDef,
                              rowIndex,
                            });

                            return (
                              <TableCell key={`cell-${rowIndex}-${colIndex}`} as={isRowHeader ? "th" : "td"} scope={isRowHeader ? "row" : undefined} bold={cellBold} align={colDef?.align}>
                                {renderedContent}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })
                  ) : filteredData && filteredData.length === 0 && data && data.length > 0 && isFiltered ? (
                    <TableRow hoverable={false}>
                      <TableCell colSpan={normalizedColumns.length || columnsCount || 1} className="py-10 text-center">
                        <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-2">
                          <p className="text-slate-600 font-medium">Nenhum resultado encontrado para os filtros aplicados.</p>
                          <button
                            type="button"
                            onClick={handleClearAllFilters}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Limpar todos os filtros</span>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow hoverable={false}>
                      <TableCell colSpan={normalizedColumns.length || columnsCount || 1} className="py-8 text-center">
                        <div role="status" aria-live="polite" className="text-slate-600 font-medium italic">
                          {emptyMessage}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </>
            ) : shouldRenderHeader ? (
              children
            ) : (
              filterChildrenWithoutHeader(children)
            )}
          </table>
        </div>

        {shouldRenderPagination && (
          <TablePagination
            variant={variant}
            currentPage={activePage}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={effectivePageSize}
            onPageChange={handlePageChange}
            showInfo={showPaginationInfo}
            showFirstLast={variant === "caf" ? false : showFirstLastButtons}
            pageSizeOptions={pageSizeOptions ?? (variant === "caf" ? [5, 10, 15, 20, 30, 50] : undefined)}
            onPageSizeChange={handlePageSizeChange}
            ariaLabel={paginationAriaLabel}
            className={paginationClassName}
          />
        )}
      </div>
    );
  },
);

Table.displayName = "Table";
