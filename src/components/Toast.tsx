import * as React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/utils/cn";

export type ToastVariant = "info" | "success" | "warning" | "destructive";

export interface ToastOptions {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
};

const TOAST_ICONS = {
  info: <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />,
  destructive: <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />,
};

const TOAST_VARIANTS = {
  info: "border-blue-200 bg-white dark:bg-slate-900 dark:border-blue-900",
  success: "border-emerald-200 bg-white dark:bg-slate-900 dark:border-emerald-900",
  warning: "border-amber-200 bg-white dark:bg-slate-900 dark:border-amber-900",
  destructive: "border-rose-200 bg-white dark:bg-slate-900 dark:border-rose-900",
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ duration = 4000, ...options }: ToastOptions) => {
      const id = options.id || Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...options, id, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {/* Container de Toasts Flutuantes */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => {
          const variant = t.variant || "info";
          return (
            <div
              key={t.id}
              role={variant === "destructive" ? "alert" : "status"}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-bottom-5 duration-200",
                TOAST_VARIANTS[variant],
              )}
            >
              {TOAST_ICONS[variant]}
              <div className="flex-1 space-y-1">
                {t.title && <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.title}</div>}
                {t.description && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{t.description}</div>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dispensar notificação"
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
