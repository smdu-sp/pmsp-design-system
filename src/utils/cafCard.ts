import * as React from "react";

export interface CafCardSampleAction {
  id: string;
  title: string;
  subtitle: string;
}

/**
 * Ações e exemplos predefinidos para os cards de atalho do Sistema-CAF.
 */
export const CAF_CARD_SAMPLE_ACTIONS: CafCardSampleAction[] = [
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
