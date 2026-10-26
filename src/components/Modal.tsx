import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

export interface ModalProps {
  /** Controla visibilidade do modal */
  isOpen: boolean;
  /** Callback acionado ao fechar (via ESC, botão fechar ou clique no overlay) */
  onClose: () => void;
  /** Título do modal */
  title?: React.ReactNode;
  /** Descrição ou subtítulo do modal */
  description?: React.ReactNode;
  /** Largura máxima do modal ('sm' | 'md' | 'lg' | 'xl' | 'full') */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
  /** Conteúdo do modal */
  children?: React.ReactNode;
  /** Rodapé com botões de ação */
  footer?: React.ReactNode;
  /** Ocultar botão de fechar no cabeçalho */
  hideCloseButton?: boolean;
}

const MAX_WIDTH_MAP = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-4xl",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  maxWidth = "md",
  children,
  footer,
  hideCloseButton = false,
}) => {
  const titleId = React.useId();
  const descId = React.useId();

  // Fechar no teclado (Escape)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Conteúdo do Modal */}
      <div
        className={cn(
          "relative z-10 w-full rounded-xl bg-white shadow-2xl border border-slate-200 p-6 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 transition-all transform animate-in zoom-in-95 duration-200",
          MAX_WIDTH_MAP[maxWidth],
        )}
      >
        {/* Cabeçalho */}
        {(title || !hideCloseButton) && (
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              {title && (
                <h3 id={titleId} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {title}
                </h3>
              )}
              {description && (
                <p id={descId} className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar janela"
                className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Corpo */}
        <div className="py-4 text-sm text-slate-700 dark:text-slate-300">{children}</div>

        {/* Rodapé */}
        {footer && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = "Modal";
