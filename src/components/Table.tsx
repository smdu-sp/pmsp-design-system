import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

export const tableVariants = cva("w-full text-left text-sm border-collapse", {
  variants: {
    variant: {
      default: "text-slate-700",
      striped: "text-slate-700 [&_tbody_tr:nth-child(even)]:bg-slate-50/60",
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
}

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
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
   * Dados a serem exibidos no corpo da tabela (matriz de valores ou array de objetos).
   * Ex: `[["Cartaz do mês", "Cartazes já publicados...", "Em breve"], ...]`
   */
  data?: (React.ReactNode)[][] | Record<string, any>[];

  /** Habilita efeito hover nas linhas da tabela (padrão: true) */
  hoverable?: boolean;

  /** Legenda descritiva acessível para a tabela */
  caption?: React.ReactNode;

  /** Mensagem ou componente exibido quando o array de dados estiver vazio */
  emptyMessage?: React.ReactNode;

  /** Cor de fundo personalizada para o container (hexadecimal '#...' ou variável CSS 'var(--...)') */
  backgroundColor?: string;

  /** Cor de texto personalizada (hexadecimal '#...' ou variável CSS 'var(--...)') */
  textColor?: string;

  /** Raio de borda personalizado do container (ex: '16px', '1rem', '9999px' ou número) */
  borderRadius?: string | number;
}

// --- Componentes Compostos ---

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-slate-100/90 text-xs sm:text-sm font-semibold text-slate-900 border-b border-slate-200/80 select-none",
      className
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("divide-y divide-slate-100 bg-white", className)} {...props} />
));
TableBody.displayName = "TableBody";

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-slate-50 font-medium text-slate-900 border-t border-slate-200", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement> & { hoverable?: boolean }
>(({ className, hoverable = true, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-slate-100 last:border-b-0 transition-colors",
      hoverable && "hover:bg-slate-50/70",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & { align?: "left" | "center" | "right" }
>(({ className, align = "left", ...props }, ref) => (
  <th
    ref={ref}
    scope="col"
    className={cn(
      "font-bold text-slate-900 tracking-tight text-left",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & {
    bold?: boolean;
    align?: "left" | "center" | "right";
  }
>(({ className, bold = false, align = "left", ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "leading-relaxed transition-colors",
      bold ? "font-bold text-slate-900" : "font-normal text-slate-600",
      align === "center" && "text-center",
      align === "right" && "text-right",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-3 text-xs sm:text-sm text-slate-500 text-center font-normal", className)}
    {...props}
  />
));
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
      data,
      hoverable = true,
      caption,
      emptyMessage = "Nenhum dado encontrado.",
      backgroundColor,
      textColor,
      borderRadius,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Resolução de estilos customizados
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

    const containerStyles: React.CSSProperties = {
      ...(resolvedBg ? { backgroundColor: resolvedBg } : {}),
      ...(resolvedTextColor ? { color: resolvedTextColor } : {}),
      ...(resolvedBr ? { borderRadius: resolvedBr } : {}),
      ...style,
    };

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
        const slicedHeaders =
          typeof columnsCount === "number" ? headers.slice(0, columnsCount) : headers;

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

    return (
      <div
        style={Object.keys(containerStyles).length > 0 ? containerStyles : undefined}
        className={cn(
          "w-full overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all",
          className
        )}
      >
        <table
          ref={ref}
          className={cn(tableVariants({ variant, density }))}
          {...props}
        >
          {caption && <TableCaption>{caption}</TableCaption>}

          {isDeclarativeMode ? (
            <>
              {normalizedColumns.length > 0 && (
                <TableHeader>
                  <TableRow hoverable={false}>
                    {normalizedColumns.map((col, colIndex) => (
                      <TableHead
                        key={col.key || `head-${colIndex}`}
                        align={col.align}
                        style={col.width ? { width: col.width } : undefined}
                      >
                        {col.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
              )}

              <TableBody>
                {data && data.length > 0 ? (
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
                      <TableRow key={`row-${rowIndex}`} hoverable={hoverable}>
                        {Array.from({ length: totalCols }).map((_, colIndex) => {
                          const colDef = normalizedColumns[colIndex];
                          const cellBold = isColumnBold(colIndex, colDef);

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
                      className="py-8 text-center text-slate-400 italic"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </>
          ) : (
            children
          )}
        </table>
      </div>
    );
  }
);

Table.displayName = "Table";
