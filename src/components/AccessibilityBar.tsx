import * as React from "react";
import { Eye, Type } from "lucide-react";
import { cn } from "@/utils/cn";

export interface AccessibilityBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ID do contêiner do conteúdo principal para o atalho de pular */
  contentId?: string;
  /** ID do menu de navegação */
  menuId?: string;
  /** ID do campo de busca */
  searchId?: string;
  /** ID do rodapé */
  footerId?: string;
  /** Callback acionado ao alterar o tamanho da fonte (percentual, ex: 90, 100, 110, 120) */
  onFontSizeChange?: (scale: number) => void;
  /** Callback acionado ao alternar alto contraste */
  onToggleContrast?: (isHighContrast: boolean) => void;
}

export const AccessibilityBar = React.forwardRef<HTMLDivElement, AccessibilityBarProps>(
  (
    {
      className,
      contentId = "main-content",
      menuId = "main-nav",
      searchId = "main-search",
      footerId = "main-footer",
      onFontSizeChange,
      onToggleContrast,
      ...props
    },
    ref,
  ) => {
    const [fontSizeScale, setFontSizeScale] = React.useState<number>(100);
    const [isContrast, setIsContrast] = React.useState<boolean>(false);

    const handleFontSize = (delta: number) => {
      const newScale = Math.min(Math.max(fontSizeScale + delta, 85), 130);
      setFontSizeScale(newScale);
      document.documentElement.style.fontSize = `${newScale}%`;
      onFontSizeChange?.(newScale);
    };

    const handleResetFontSize = () => {
      setFontSizeScale(100);
      document.documentElement.style.fontSize = "100%";
      onFontSizeChange?.(100);
    };

    const handleToggleContrast = () => {
      const nextContrast = !isContrast;
      setIsContrast(nextContrast);
      if (nextContrast) {
        document.documentElement.classList.add("high-contrast");
      } else {
        document.documentElement.classList.remove("high-contrast");
      }
      onToggleContrast?.(nextContrast);
    };

    return (
      <header
        ref={ref}
        role="region"
        aria-label="Barra de acessibilidade governamental"
        className={cn(
          "w-full bg-slate-900 text-white text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-3 select-none border-b border-slate-800",
          className,
        )}
        {...props}
      >
        {/* Links de Salto para Acessibilidade (Visíveis ao Foco) */}
        <div className="flex items-center gap-3">
          <a
            href={`#${contentId}`}
            className="focus:inline-block hidden focus:absolute focus:z-50 focus:bg-[#0b3299] focus:text-white focus:px-3 focus:py-1 focus:rounded-md font-semibold underline"
          >
            Ir para o conteúdo [Alt + 1]
          </a>
          <div className="hidden md:flex items-center gap-3 text-slate-300">
            <a href={`#${contentId}`} className="hover:text-white hover:underline transition-colors">
              Ir para o conteúdo <span className="opacity-60">[1]</span>
            </a>
            <span className="text-slate-600">|</span>
            <a href={`#${menuId}`} className="hover:text-white hover:underline transition-colors">
              Ir para o menu <span className="opacity-60">[2]</span>
            </a>
            <span className="text-slate-600">|</span>
            <a href={`#${searchId}`} className="hover:text-white hover:underline transition-colors">
              Ir para a busca <span className="opacity-60">[3]</span>
            </a>
            <span className="text-slate-600">|</span>
            <a href={`#${footerId}`} className="hover:text-white hover:underline transition-colors">
              Ir para o rodapé <span className="opacity-60">[4]</span>
            </a>
          </div>
        </div>

        {/* Controles de Acessibilidade Visual */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Zoom da Fonte */}
          <div className="flex items-center gap-1 border-r border-slate-700 pr-3">
            <span className="sr-only">Tamanho do texto</span>
            <button
              type="button"
              onClick={() => handleFontSize(-5)}
              title="Diminuir tamanho da fonte"
              aria-label="Diminuir tamanho da fonte"
              className="px-1.5 py-0.5 font-bold hover:bg-slate-800 rounded transition-colors cursor-pointer text-slate-300 hover:text-white"
            >
              A-
            </button>
            <button
              type="button"
              onClick={handleResetFontSize}
              title="Redefinir tamanho padrão da fonte"
              aria-label="Redefinir tamanho padrão da fonte"
              className="px-1.5 py-0.5 font-semibold hover:bg-slate-800 rounded transition-colors cursor-pointer text-slate-300 hover:text-white"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => handleFontSize(5)}
              title="Aumentar tamanho da fonte"
              aria-label="Aumentar tamanho da fonte"
              className="px-1.5 py-0.5 font-bold hover:bg-slate-800 rounded transition-colors cursor-pointer text-slate-300 hover:text-white"
            >
              A+
            </button>
          </div>

          {/* Alto Contraste */}
          <button
            type="button"
            onClick={handleToggleContrast}
            aria-pressed={isContrast}
            className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors cursor-pointer",
              isContrast ? "bg-amber-400 text-slate-950 font-bold" : "hover:bg-slate-800 text-slate-200",
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Alto Contraste</span>
          </button>
        </div>
      </header>
    );
  },
);

AccessibilityBar.displayName = "AccessibilityBar";
