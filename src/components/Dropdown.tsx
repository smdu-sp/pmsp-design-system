import * as React from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MoreVertical } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  calculateDropdownCoords,
  getDropdownFixedStyles,
  getDropdownTriggerSizeClass,
  getDropdownTriggerVariantClass,
  resolveDropdownTriggerState,
  useDropdownState,
  type DropdownAlign,
  type DropdownCoords,
  type DropdownSize,
  type DropdownVariant,
} from "@/utils/dropdown";

export type { DropdownAlign, DropdownPlacement, DropdownSize, DropdownVariant, DropdownCoords } from "@/utils/dropdown";
export { useDropdownState };

export interface DropdownProps {
  /** Estado de abertura controlado */
  open?: boolean;
  /** Estado de abertura inicial em modo não controlado */
  defaultOpen?: boolean;
  /** Callback acionado ao alterar o estado de abertura */
  onOpenChange?: (open: boolean) => void;
  /** Elemento ou função renderizadora que atua como gatilho customizado do dropdown */
  trigger?: React.ReactNode | ((props: { isOpen: boolean; toggle: () => void }) => React.ReactNode);
  /** Texto ou rótulo exibido no botão gatilho padrão */
  label?: React.ReactNode;
  /** Alias para o rótulo do gatilho padrão */
  triggerText?: React.ReactNode;
  /** Exibir ícone à esquerda no botão gatilho padrão */
  iconLeft?: boolean;
  /** Exibir ícone à direita no botão gatilho padrão */
  iconRight?: boolean;
  /** Elemento de ícone personalizado à esquerda */
  leftIcon?: React.ReactNode;
  /** Elemento de ícone personalizado à direita */
  rightIcon?: React.ReactNode;
  /** Classes CSS adicionais para o botão gatilho padrão */
  triggerClassName?: string;
  /** Variante visual do botão gatilho padrão */
  triggerVariant?: DropdownVariant;
  /** Tamanho do botão gatilho padrão */
  size?: DropdownSize;
  /** Conteúdo exibido dentro do menu dropdown */
  children: React.ReactNode;
  /** Alinhamento horizontal do menu em relação ao gatilho */
  align?: DropdownAlign;
  /** Classes CSS adicionais para o container flutuante do popover */
  className?: string;
  /** Estilos inline adicionais para o container do popover */
  style?: React.CSSProperties;
  /** Largura máxima ou largura personalizada do dropdown (padrão: 260px) */
  width?: number;
  /** Duração em milissegundos da animação de opacidade ao abrir e fechar (padrão: 200) */
  animationDuration?: number;
  /** Se o dropdown deve ser renderizado via Portal diretamente no document.body (padrão: true) */
  portal?: boolean;
  /** Rótulo acessível da janela do dropdown */
  ariaLabel?: string;
  /** Papel semântico ARIA do container do dropdown ('dialog' | 'menu', padrão: 'dialog') */
  role?: "dialog" | "menu";
}

const DropdownComponent = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      trigger,
      label,
      triggerText,
      iconLeft,
      iconRight,
      leftIcon,
      rightIcon,
      triggerClassName,
      triggerVariant = "outline",
      size = "md",
      children,
      align = "left",
      className,
      style,
      width = 260,
      animationDuration = 200,
      portal = true,
      ariaLabel = "Menu de opções",
      role = "dialog",
    },
    ref,
  ) => {
    const {
      isOpen,
      coords,
      isMounted,
      isVisible,
      triggerContainerRef,
      popoverRef,
      toggle,
      handleSetOpen,
    } = useDropdownState({
      open,
      defaultOpen,
      onOpenChange,
      align,
      width,
      animationDuration,
    });

    React.useImperativeHandle(ref, () => triggerContainerRef.current!);

    const fixedStyles = getDropdownFixedStyles(
      coords,
      triggerContainerRef.current,
      animationDuration,
      style,
    );

    const popoverContent = (
      <div
        ref={popoverRef}
        role={role}
        tabIndex={-1}
        aria-modal={role === "dialog" ? "true" : undefined}
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
        style={fixedStyles}
        className={cn(
          "z-9999 min-w-55 max-w-xs w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200/90 ring-1 ring-slate-900/5 p-3.5 text-xs text-slate-800 outline-none",
          "transform-gpu motion-reduce:transition-none",
          "transition-[opacity,transform] will-change-[opacity,transform]",
          isVisible
            ? "opacity-100 scale-100 translate-y-0 ease-out"
            : coords.placement === "top"
              ? "opacity-0 scale-95 translate-y-2 ease-in pointer-events-none"
              : "opacity-0 scale-95 -translate-y-2 ease-in pointer-events-none",
          className,
        )}
      >
        {children}
      </div>
    );

    const {
      resolvedLabel,
      hasText,
      showIconLeft,
      showIconRight,
      fallbackNeeded,
      isSingleIcon,
    } = resolveDropdownTriggerState({
      label,
      triggerText,
      iconLeft,
      iconRight,
      leftIcon,
      rightIcon,
      hasCustomTrigger: Boolean(trigger),
    });

    const defaultChevron = <ChevronDown className={cn("w-4 h-4 text-slate-500 transition-transform duration-200", isOpen && "rotate-180")} />;
    const defaultLeftIcon = <MoreVertical className="w-4 h-4 text-slate-500" />;

    const resolvedLeftIcon = leftIcon ?? (showIconLeft ? defaultLeftIcon : null);
    const resolvedRightIcon = rightIcon ?? (showIconRight ? defaultChevron : null);

    const sizeClass = getDropdownTriggerSizeClass(size, hasText, isSingleIcon);
    const variantClass = getDropdownTriggerVariantClass(triggerVariant);

    const renderDefaultTrigger = () => (
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={typeof resolvedLabel === "string" && resolvedLabel ? resolvedLabel : ariaLabel || "Menu de opções"}
        className={cn(
          "inline-flex items-center font-medium transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
          variantClass,
          sizeClass,
          isOpen && (triggerVariant === "primary" ? "ring-2 ring-slate-950/20" : "bg-slate-50 border-slate-400 ring-2 ring-slate-400/20"),
          triggerClassName,
        )}
      >
        {fallbackNeeded ? (
          <span className="shrink-0 inline-flex items-center justify-center">
            <MoreVertical className="w-4 h-4 text-slate-600" />
          </span>
        ) : (
          <>
            {showIconLeft && resolvedLeftIcon && <span className="shrink-0 inline-flex items-center justify-center">{resolvedLeftIcon}</span>}
            {hasText && <span className="truncate">{resolvedLabel}</span>}
            {showIconRight && resolvedRightIcon && <span className="shrink-0 inline-flex items-center justify-center">{resolvedRightIcon}</span>}
          </>
        )}
      </button>
    );

    const triggerElement = trigger ? (typeof trigger === "function" ? trigger({ isOpen, toggle }) : trigger) : renderDefaultTrigger();

    return (
      <div ref={triggerContainerRef} className="relative inline-flex items-center">
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggle();
          }}
          className="inline-flex items-center"
        >
          {triggerElement}
        </div>

        {isMounted && typeof document !== "undefined" && (portal ? createPortal(popoverContent, document.body) : popoverContent)}
      </div>
    );
  },
);

DropdownComponent.displayName = "Dropdown";

export interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Rótulo ou conteúdo textual do item */
  label?: React.ReactNode;
  /** Exibir ícone à esquerda */
  iconLeft?: boolean;
  /** Exibir ícone à direita */
  iconRight?: boolean;
  /** Elemento de ícone personalizado à esquerda */
  leftIcon?: React.ReactNode;
  /** Elemento de ícone personalizado à direita */
  rightIcon?: React.ReactNode;
  /** Variante de cor do item ('default' | 'danger') */
  variant?: "default" | "danger";
}

export const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(({ children, label, iconLeft, iconRight, leftIcon, rightIcon, variant = "default", className, ...props }, ref) => {
  const { resolvedLabel, hasText, showIconLeft, showIconRight } = resolveDropdownTriggerState({
    label: label ?? children,
    iconLeft,
    iconRight,
    leftIcon,
    rightIcon,
  });

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      className={cn(
        "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-left cursor-pointer text-xs",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset focus-visible:bg-slate-100",
        variant === "danger"
          ? "text-rose-600 hover:bg-rose-50 font-medium focus-visible:ring-rose-500 focus-visible:bg-rose-50"
          : "text-slate-700 hover:bg-slate-100",
        !hasText && "justify-center",
        className,
      )}
      {...props}
    >
      {showIconLeft && leftIcon && <span className="shrink-0 inline-flex items-center" aria-hidden="true">{leftIcon}</span>}
      {hasText && <span className="grow truncate">{resolvedLabel}</span>}
      {showIconRight && rightIcon && <span className="shrink-0 inline-flex items-center ml-auto" aria-hidden="true">{rightIcon}</span>}
    </button>
  );
});

DropdownItem.displayName = "DropdownItem";

export const Dropdown = Object.assign(DropdownComponent, {
  Item: DropdownItem,
});
