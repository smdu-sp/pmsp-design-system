import * as React from "react";
import { Filter, Search, Check, X, RotateCcw } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  type TableFilterType,
  type TableFilterOption,
} from "@/utils/table";
import { useTableColumnFilter } from "@/utils/tableColumnFilter";
import { Dropdown } from "./Dropdown";

export interface TableColumnFilterProps {
  /** Rótulo ou título da coluna associada */
  columnTitle?: React.ReactNode;
  /** Tipo de filtro exibido: 'checkbox' | 'select' | 'text' */
  filterType?: TableFilterType;
  /** Lista de opções disponíveis */
  options?: (string | TableFilterOption)[];
  /** Valor atual selecionado */
  value?: any;
  /** Callback acionado ao alterar os valores do filtro */
  onChange?: (value: any) => void;
  /** Placeholder customizado para o campo de busca/texto */
  placeholder?: string;
  /** Alinhamento do dropdown em relação ao cabeçalho */
  align?: "left" | "center" | "right";
  /** Rótulo acessível adicional para o botão */
  ariaLabel?: string;
}

export const TableColumnFilter = React.forwardRef<HTMLDivElement, TableColumnFilterProps>(
  (
    {
      columnTitle,
      filterType = "checkbox",
      options,
      value,
      onChange,
      placeholder,
      align = "left",
      ariaLabel,
    },
    ref,
  ) => {
    const {
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
    } = useTableColumnFilter({
      options,
      value,
      onChange,
      columnTitle,
      ariaLabel,
    });

    return (
      <Dropdown
        ref={ref}
        open={isOpen}
        onOpenChange={setIsOpen}
        align={align}
        ariaLabel={menuAriaLabel}
        trigger={
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-label={triggerAriaLabel}
            className={cn(
              "relative inline-flex items-center justify-center p-1 rounded-md transition-all duration-150 motion-reduce:transition-none cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 active:scale-95",
              isOpen && "ring-2 ring-blue-600/30 text-blue-700 bg-blue-50/80",
              isFilterActive && !isOpen && "bg-blue-100 text-blue-700 hover:bg-blue-200/80 shadow-2xs font-semibold",
              !isFilterActive && !isOpen && "text-slate-400 hover:text-slate-700 hover:bg-slate-200/70",
            )}
          >
            <Filter
              className={cn(
                "w-3.5 h-3.5 shrink-0 transition-transform duration-150",
                isOpen && "scale-110 text-blue-600",
              )}
              aria-hidden="true"
            />
            {isFilterActive && activeCount > 0 && (
              <span
                className={cn(
                  "ml-1 inline-flex items-center justify-center text-[10px] font-bold rounded-full bg-blue-600 text-white leading-none shadow-xs",
                  activeCount > 9 ? "px-1 min-w-[16px] h-4" : "w-4 h-4",
                )}
              >
                {activeCount}
              </span>
            )}
          </button>
        }
      >
        {/* Cabeçalho do Popover */}
        <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 font-semibold text-slate-900">
          <span className="truncate">
            {titleText ? `Filtrar: ${titleText}` : "Filtrar coluna"}
          </span>
          {isFilterActive && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
              <span>Limpar</span>
            </button>
          )}
        </div>

        {/* Conteúdo dinâmico por filterType */}
        {filterType === "text" ? (
          <div className="space-y-2">
            <div className="relative">
              <Search
                className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                value={value || ""}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder || "Filtrar por texto..."}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                autoFocus
              />
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-2 top-2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                  aria-label="Limpar campo de texto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : filterType === "select" ? (
          <div className="max-h-52 overflow-y-auto space-y-0.5 pr-0.5">
            <button
              type="button"
              onClick={() => {
                onChange?.(undefined);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer",
                !isFilterActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-700 hover:bg-slate-100",
              )}
            >
              <span>Todos</span>
              {!isFilterActive && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
            </button>
            {normalizedOptions.map((opt, i) => {
              const isSelected = String(value) === String(opt.value);
              return (
                <button
                  key={`select-opt-${i}-${opt.value}`}
                  type="button"
                  onClick={() => {
                    onChange?.(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer",
                    isSelected ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        ) : (
          /* filterType === "checkbox" (padrão) */
          <div className="space-y-2">
            {normalizedOptions.length > 4 && (
              <div className="relative">
                <Search
                  className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder || "Buscar opções..."}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            )}

            {normalizedOptions.length > 1 && (
              <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 font-medium">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="hover:text-blue-600 transition-colors cursor-pointer"
                >
                  Selecionar todos
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Desmarcar todos
                </button>
              </div>
            )}

            <div className="max-h-48 overflow-y-auto space-y-0.5 divide-y divide-slate-50 pr-0.5">
              {visibleOptions.length > 0 ? (
                visibleOptions.map((opt, i) => {
                  const isChecked = selectedValues.some((v) => String(v) === String(opt.value));
                  return (
                    <label
                      key={`check-opt-${i}-${opt.value}`}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100/80 cursor-pointer select-none transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxToggle(opt.value)}
                        className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="truncate text-slate-700">{opt.label}</span>
                    </label>
                  );
                })
              ) : (
                <div className="py-4 text-center text-slate-400 italic">
                  Nenhuma opção encontrada.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                {selectedValues.length} de {normalizedOptions.length} selecionado(s)
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </Dropdown>
    );
  },
);

TableColumnFilter.displayName = "TableColumnFilter";
