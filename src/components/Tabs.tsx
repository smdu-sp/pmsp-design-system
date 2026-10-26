import * as React from "react";
import { cn } from "@/utils/cn";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (val: string) => void;
  orientation?: "horizontal" | "vertical";
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Valor da aba ativa em modo controlado */
  value?: string;
  /** Valor inicial em modo não controlado */
  defaultValue?: string;
  /** Callback acionado ao trocar de aba */
  onValueChange?: (value: string) => void;
  /** Orientação do tablist ('horizontal' | 'vertical') */
  orientation?: "horizontal" | "vertical";
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value,
      defaultValue = "",
      onValueChange,
      orientation = "horizontal",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalTab, setInternalTab] = React.useState(defaultValue);
    const activeTab = value !== undefined ? value : internalTab;

    const setActiveTab = React.useCallback(
      (newVal: string) => {
        if (value === undefined) {
          setInternalTab(newVal);
        }
        onValueChange?.(newVal);
      },
      [value, onValueChange],
    );

    return (
      <TabsContext.Provider value={{ activeTab, setActiveTab, orientation }}>
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "vertical" ? "flex-row gap-6" : "flex-col gap-4",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);
Tabs.displayName = "Tabs";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "pills" | "underline" | "boxed";
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, variant = "boxed", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          "inline-flex items-center select-none",
          variant === "boxed" &&
            "bg-slate-100 p-1 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700",
          variant === "pills" && "gap-2",
          variant === "underline" &&
            "border-b border-slate-200 dark:border-slate-700 w-full gap-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Identificador único desta aba */
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    if (!ctx) throw new Error("TabsTrigger deve ser usado dentro de Tabs");

    const isSelected = ctx.activeTab === value;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => ctx.setActiveTab(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap px-3.5 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950/20 disabled:pointer-events-none disabled:opacity-50 cursor-pointer rounded-md",
          isSelected
            ? "bg-white text-slate-900 shadow-xs font-semibold dark:bg-slate-900 dark:text-slate-100"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Identificador correspondente ao TabsTrigger */
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext);
    if (!ctx) throw new Error("TabsContent deve ser usado dentro de Tabs");

    if (ctx.activeTab !== value) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn("focus-visible:outline-none animate-in fade-in-50 duration-150", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TabsContent.displayName = "TabsContent";
