import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

export const tableVariants = cva("w-full text-left text-sm border-collapse", {
  variants: {
    variant: {
      default: "text-slate-700",
      striped: "text-slate-700 [&_tbody_tr:nth-child(even)]:bg-slate-50/70",
      bordered: "text-slate-700 border border-slate-200 [&_th]:border-r [&_th]:border-slate-200 [&_td]:border-r [&_td]:border-slate-100",
    },
    density: {
      default: "[&_th]:px-5 [&_th]:py-3.5 sm:[&_th]:px-6 sm:[&_th]:py-4 [&_td]:px-5 [&_td]:py-3.5 sm:[&_td]:px-6 sm:[&_td]:py-4",
      compact: "[&_th]:px-4 [&_th]:py-2.5 sm:[&_th]:px-4.5 sm:[&_th]:py-3 [&_td]:px-4 [&_td]:py-2.5 sm:[&_td]:px-4.5 sm:[&_td]:py-3",
      relaxed: "[&_th]:px-6 [&_th]:py-4 sm:[&_th]:px-7 sm:[&_th]:py-5 [&_td]:px-6 [&_td]:py-4.5 sm:[&_td]:px-7 sm:[&_td]:py-5",
    },
  },
  defaultVariants: {
    variant: "default",
    density: "default",
  },
});

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

export interface TableProps extends React.HTMLAttributes<HTMLTableElement>, VariantProps<typeof tableVariants> {
  /**
   * Define quantas colunas vão existir na tabela.
   * Se fornecido em conjunto com headers/columns/data, ajusta ou restringe a quantidade exibida.
   */
  columnsCount?: number;

  /**
   * Define se o texto da coluna vai ser em negrito ou não.
   * Pode ser um array de índices de colunas em negrito (ex: `[0]` ou `[0, 2]`)
   * ou um array booleano correspondente a cada coluna (ex: `[true, false, false]`).
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
}

// --- Componentes Compostos ---

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn("bg-slate-100/90 text-xs sm:text-sm font-semibold text-slate-900 border-b border-slate-200/80", className)}
      {...props}
    />
  ),
);
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("divide-y divide-slate-100 bg-white", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("bg-slate-50 font-medium text-slate-900 border-t border-slate-200", className)} {...props} />
  ),
);
TableFooter.displayName = "TableFooter";

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
  isInteractive?: boolean;
  selected?: boolean;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      className,
      hoverable = true,
      isInteractive = false,
      selected,
      onClick,
      onKeyDown,
      tabIndex,
      role,
      ...props
    },
    ref,
  ) => {
    const isClickable = isInteractive || Boolean(onClick);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      if (isClickable && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick?.(e as any);
      }
      onKeyDown?.(e);
    };

    return (
      <tr
        ref={ref}
        tabIndex={isClickable ? (tabIndex ?? 0) : tabIndex}
        role={isClickable ? (role ?? "button") : role}
        aria-selected={selected}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "border-slate-100 last:border-b-0 transition-colors motion-reduce:transition-none",
          hoverable && "hover:bg-slate-50/70",
          selected && "bg-blue-50/70 hover:bg-blue-50/90",
          isClickable &&
            "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset",
          className,
        )}
        {...props}
      />
    );
  },
);
TableRow.displayName = "TableRow";

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortDirection?: "ascending" | "descending" | "none" | false;
  onSort?: () => void;
  sortAriaLabel?: string;
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
      children,
      ...props
    },
    ref,
  ) => {
    const ariaSortValue = sortDirection || (sortable ? "none" : undefined);

    return (
      <th
        ref={ref}
        scope={scope}
        aria-sort={ariaSortValue}
        className={cn(
          "font-bold text-slate-900 tracking-tight text-left",
          align === "center" && "text-center",
          align === "right" && "text-right",
          className,
        )}
        {...props}
      >
        {sortable ? (
          <button
            type="button"
            onClick={onSort}
            aria-label={
              sortAriaLabel ||
              (typeof children === "string"
                ? `Ordenar por ${children}${
                    sortDirection === "ascending"
                      ? ", atualmente em ordem crescente"
                      : sortDirection === "descending"
                        ? ", atualmente em ordem decrescente"
                        : ", não ordenado"
                  }`
                : undefined)
            }
            className={cn(
              "group inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 -mx-1.5 -my-1 font-bold text-slate-900",
              "hover:bg-slate-200/70 transition-colors motion-reduce:transition-none cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1",
              align === "center" && "justify-center mx-auto",
              align === "right" && "justify-end ml-auto",
            )}
          >
            <span>{children}</span>
            <span className="inline-flex shrink-0 text-slate-600 group-hover:text-slate-900" aria-hidden="true">
              {sortDirection === "ascending" ? (
                <ArrowUp className="w-3.5 h-3.5" />
              ) : sortDirection === "descending" ? (
                <ArrowDown className="w-3.5 h-3.5" />
              ) : (
                <ArrowUpDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
              )}
            </span>
          </button>
        ) : (
          children
        )}
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

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, bold = false, align = "left", as, scope, ...props }, ref) => {
    const isRowHeader = as === "th" || scope === "row";
    const Component = isRowHeader ? "th" : "td";

    return (
      <Component
        ref={ref}
        scope={scope ?? (isRowHeader ? "row" : undefined)}
        className={cn(
          "leading-relaxed transition-colors motion-reduce:transition-none",
          bold || isRowHeader ? "font-bold text-slate-900 text-left" : "font-normal text-slate-700",
          align === "center" && "text-center",
          align === "right" && "text-right",
          className,
        )}
        {...props}
      />
    );
  },
);
TableCell.displayName = "TableCell";

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  side?: "top" | "bottom";
  srOnly?: boolean;
}

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, side = "bottom", srOnly = false, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn(
        srOnly
          ? "sr-only"
          : cn(
              "text-xs sm:text-sm text-slate-600 font-medium",
              side === "top" ? "caption-top mb-3 text-left" : "caption-bottom mt-3 text-center",
            ),
        className,
      )}
      {...props}
    />
  ),
);
TableCaption.displayName = "TableCaption";

// --- Componente Principal Table ---

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      variant = "default",
      density = "default",
      columnsCount,
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
      style,
      children,
      ...props
    },
    ref,
  ) => {
    // Resolução de estilos customizados
    const resolvedBg = backgroundColor ? (backgroundColor.startsWith("--") ? `var(${backgroundColor})` : backgroundColor) : undefined;

    const resolvedTextColor = textColor ? (textColor.startsWith("--") ? `var(${textColor})` : textColor) : undefined;

    const resolvedBr = typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius ? (borderRadius.startsWith("--") ? `var(${borderRadius})` : borderRadius) : undefined;

    const containerStyles: React.CSSProperties = {
      ...(resolvedBg ? { backgroundColor: resolvedBg } : {}),
      ...(resolvedTextColor ? { color: resolvedTextColor } : {}),
      ...(resolvedBr ? { borderRadius: resolvedBr } : {}),
      ...style,
    };

    // Determina o nome acessível da região com rolagem
    const containerAriaLabel =
      scrollableRegionLabel ||
      (props["aria-label"] ? `${props["aria-label"]} (região com rolagem)` : "Tabela de dados com rolagem horizontal");

    // Função utilitária para verificar se a coluna deve ser renderizada em negrito
    const isColumnBold = (colIndex: number, columnDef?: TableColumn): boolean => {
      // 1. Se o objeto de coluna definir explicitamente bold
      if (columnDef?.bold !== undefined) {
        return columnDef.bold;
      }

      // 2. Se a prop global boldColumns foi informada
      if (boldColumns !== undefined && Array.isArray(boldColumns)) {
        if (boldColumns.length === 0) return false;

        // Se for array de números com índices: ex: [0] ou [0, 2]
        if (typeof boldColumns[0] === "number") {
          return (boldColumns as number[]).includes(colIndex);
        }

        // Se for array de booleanos: ex: [true, false, false]
        if (typeof boldColumns[colIndex] === "boolean") {
          return Boolean(boldColumns[colIndex]);
        }
      }

      return false;
    };

    // Montagem da lista normalizada de colunas caso esteja em modo declarativo (headers ou columns)
    const normalizedColumns: TableColumn[] = React.useMemo(() => {
      if (columns && columns.length > 0) {
        const sliced = typeof columnsCount === "number" ? columns.slice(0, columnsCount) : columns;
        return sliced.map((col, idx) => ({
          ...col,
          bold: isColumnBold(idx, col),
        }));
      }

      if (headers && headers.length > 0) {
        const slicedHeaders = typeof columnsCount === "number" ? headers.slice(0, columnsCount) : headers;

        // Se columnsCount for maior que headers fornecidos, preenche colunas restantes
        const result: TableColumn[] = slicedHeaders.map((header, idx) => ({
          key: `col-${idx}`,
          header,
          bold: isColumnBold(idx),
        }));

        if (typeof columnsCount === "number" && result.length < columnsCount) {
          const diff = columnsCount - result.length;
          for (let i = 0; i < diff; i++) {
            const idx = result.length;
            result.push({
              key: `col-${idx}`,
              header: `Coluna ${idx + 1}`,
              bold: isColumnBold(idx),
            });
          }
        }

        return result;
      }

      if (typeof columnsCount === "number" && columnsCount > 0) {
        return Array.from({ length: columnsCount }).map((_, idx) => ({
          key: `col-${idx}`,
          header: `Coluna ${idx + 1}`,
          bold: isColumnBold(idx),
        }));
      }

      return [];
    }, [columns, headers, columnsCount, boldColumns]);

    const isDeclarativeMode = normalizedColumns.length > 0 || (data && data.length > 0);
    const shouldRenderHeader =
      showHeader === false || (showHeader as unknown) === "false" || hasHeader === false || (hasHeader as unknown) === "false"
        ? false
        : true;

    return (
      <div
        role="region"
        aria-label={containerAriaLabel}
        tabIndex={keyboardScrollable ? 0 : undefined}
        style={Object.keys(containerStyles).length > 0 ? containerStyles : undefined}
        {...containerProps}
        className={cn(
          "w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all motion-reduce:transition-none",
          keyboardScrollable &&
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
          containerProps?.className,
          className,
        )}
      >
        <table
          ref={ref}
          aria-busy={isLoading ? true : undefined}
          className={cn(tableVariants({ variant, density }))}
          {...props}
        >
          {isDeclarativeMode ? (
            <>
              {shouldRenderHeader && normalizedColumns.length > 0 && (
                <TableHeader>
                  <TableRow hoverable={false}>
                    {normalizedColumns.map((col, colIndex) => (
                      <TableHead
                        key={col.key || `head-${colIndex}`}
                        align={col.align}
                        sortable={col.sortable}
                        sortDirection={col.sortDirection}
                        onSort={col.onSort}
                        sortAriaLabel={col.sortAriaLabel}
                        style={col.width ? { width: col.width } : undefined}
                      >
                        {col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
              )}

              <TableBody>
                {isLoading ? (
                  <TableRow hoverable={false}>
                    <TableCell
                      colSpan={normalizedColumns.length || columnsCount || 1}
                      className="py-12 text-center"
                    >
                      <div
                        role="status"
                        aria-live="polite"
                        className="inline-flex flex-col items-center justify-center gap-2 text-slate-600 font-medium"
                      >
                        <Loader2
                          className="w-6 h-6 animate-spin text-blue-600 shrink-0 inline-block"
                          aria-hidden="true"
                        />
                        <span>{loadingMessage}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data && data.length > 0 ? (
                  data.map((row, rowIndex) => {
                    const isArrayRow = Array.isArray(row);
                    const totalCols =
                      normalizedColumns.length > 0
                        ? normalizedColumns.length
                        : typeof columnsCount === "number"
                          ? columnsCount
                          : isArrayRow
                            ? (row as any[]).length
                            : Object.keys(row).length;

                    return (
                      <TableRow
                        key={`row-${rowIndex}`}
                        hoverable={hoverable}
                        isInteractive={Boolean(onRowClick)}
                        onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                      >
                        {Array.from({ length: totalCols }).map((_, colIndex) => {
                          const colDef = normalizedColumns[colIndex];
                          const cellBold = isColumnBold(colIndex, colDef);
                          const isRowHeader =
                            colDef?.isRowHeader ??
                            (rowHeaderColIndex !== undefined ? rowHeaderColIndex === colIndex : false);

                          let cellValue: React.ReactNode = null;
                          if (isArrayRow) {
                            cellValue = (row as any[])[colIndex];
                          } else if (colDef?.key && typeof row === "object") {
                            cellValue = (row as Record<string, any>)[colDef.key];
                          } else if (typeof row === "object") {
                            const keys = Object.keys(row);
                            cellValue = (row as Record<string, any>)[keys[colIndex]];
                          }

                          const renderedContent = colDef?.render
                            ? colDef.render(cellValue, row, rowIndex, colIndex)
                            : cellValue;

                          return (
                            <TableCell
                              key={`cell-${rowIndex}-${colIndex}`}
                              as={isRowHeader ? "th" : "td"}
                              scope={isRowHeader ? "row" : undefined}
                              bold={cellBold}
                              align={colDef?.align}
                            >
                              {renderedContent}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow hoverable={false}>
                    <TableCell
                      colSpan={normalizedColumns.length || columnsCount || 1}
                      className="py-8 text-center"
                    >
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
            React.Children.map(children, (child) => {
              if (
                React.isValidElement(child) &&
                (child.type === TableHeader ||
                  (child.type as any)?.displayName === "TableHeader" ||
                  (typeof child.type === "string" && child.type === "thead"))
              ) {
                return null;
              }
              return child;
            })
          )}
        </table>
      </div>
    );
  },
);

Table.displayName = "Table";

