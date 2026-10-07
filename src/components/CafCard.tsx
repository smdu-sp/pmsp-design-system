import * as React from "react";
import { Plus } from "lucide-react";
import { Card, type CardProps } from "./Card";
import { cn } from "@/utils/cn";

export interface CafCardProps extends Omit<CardProps, "variant"> {
  variant?: "caf";
}

/**
 * Ações e exemplos predefinidos para os cards de atalho do Sistema-CAF.
 */
export const CAF_CARD_SAMPLE_ACTIONS = [
  {
    id: "avaliacao",
    title: "Fazer nova avaliação",
    subtitle: "Realize uma nova avaliação de limpeza para as salas da instituição",
  },
  {
    id: "reserva",
    title: "Criar Reserva",
    subtitle: "Agende uma nova sala para sua reunião ou evento",
  },
  {
    id: "chamado",
    title: "Abrir Chamado",
    subtitle: "Solicite manutenção corretiva ou preventiva para os ambientes",
  },
];

/**
 * Componente de Card especializado para ações e atalhos do **Sistema-CAF**.
 *
 * Características de design:
 * - Botão/ícone circular com borda sutil à esquerda (padrão: ícone `+` / Plus).
 * - Título em negrito (`font-bold text-slate-900`) com transição suave ao passar o cursor.
 * - Subtexto descritivo explicativo (`text-slate-500 text-xs sm:text-sm`).
 * - Fundo branco puro, borda arredondada (`rounded-2xl`), sombra sutil (`shadow-xs`) e estados interativos (`hover`, `active`).
 */
export const CafCard = React.forwardRef<HTMLElement, CafCardProps>(
  (
    {
      title = "Fazer nova avaliação",
      subtitle = "Realize uma nova avaliação de limpeza para as salas da instituição",
      icon,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <Card
        ref={ref}
        variant="caf"
        title={title}
        subtitle={subtitle}
        icon={icon ?? <Plus className="w-5 h-5 stroke-[2] text-slate-800" />}
        className={cn("bg-white border-slate-200/90 hover:border-slate-300", className)}
        {...props}
      />
    );
  },
);

CafCard.displayName = "CafCard";
