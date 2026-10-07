import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CafCard, type CafCardProps, CAF_CARD_SAMPLE_ACTIONS } from "@/components/CafCard";
import { CARD_ICONS, CARD_ICON_NAMES, type CardIconName } from "../iconGallery";

export interface CafCardStoryProps extends Omit<CafCardProps, "icon"> {
  selectedIcon?: CardIconName;
}

const meta: Meta<CafCardStoryProps> = {
  title: "Sistema-CAF/Card",
  component: CafCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
O componente **CafCard** foi projetado especificamente para atalhos e cartões de ação do **Sistema-CAF (Central de Atendimento ao Funcionário)**:
- **Botão / Ícone Circular à Esquerda**: Container arredondado com borda sutil e ícone em destaque (padrão: \`+\` / Plus).
- **Tipografia de Alto Contraste**: Título em negrito (\`font-bold text-slate-900\`) e descrição explicativa em tom suave (\`text-slate-500\`).
- **Container Limpo e Sofisticado**: Fundo branco, cantos arredondados (\`rounded-2xl\`), borda sutil (\`border-slate-200/90\`) e microinterações de hover e active.
- **Suporte a Ações e Navegação**: Funciona como botão interativo (\`onClick\`) com acessibilidade total por teclado (Enter / Espaço) ou como link de navegação do Next.js (\`href\` ou \`route\`).
        `,
      },
    },
  },
  args: {
    title: "Fazer nova avaliação",
    subtitle: "Realize uma nova avaliação de limpeza para as salas da instituição",
    selectedIcon: "Plus",
  },
  argTypes: {
    title: {
      control: "text",
      description: "Título principal da ação em destaque",
    },
    subtitle: {
      control: "text",
      description: "Descrição detalhada do objetivo ou função da ação",
    },
    selectedIcon: {
      control: "select",
      options: CARD_ICON_NAMES,
      description: "Ícone exibido dentro do círculo à esquerda",
    },
    route: {
      control: "text",
      description: "Rota interna do Next.js se o card for utilizado como link de navegação",
    },
    href: {
      control: "text",
      description: "URL externa ou link de destino",
    },
    className: {
      control: "text",
      description: "Classes Tailwind complementares",
    },
  },
  render: ({ selectedIcon, ...args }) => {
    const icon = selectedIcon && selectedIcon !== "Default" && selectedIcon !== "None" ? CARD_ICONS[selectedIcon] : undefined;

    return <CafCard {...args} icon={icon} />;
  },
};

export default meta;
type Story = StoryObj<CafCardStoryProps>;

/**
 * Visual padrão idêntico ao modelo de referência do Sistema-CAF:
 * Ação para iniciar nova avaliação de limpeza com ícone circular de adição (+).
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <CafCard
            icon={<Plus className="h-6 w-6 shrink-0 text-white stroke-[1.75]" />}
            subtitle="Realize uma nova avaliação de limpeza para as salas da instituição"
            title="Fazer nova avaliação"
            href="/nova-avaliacao"
          />
        `.trim(),
      },
    },
  },
  args: {
    title: "Fazer nova avaliação",
    subtitle: "Realize uma nova avaliação de limpeza para as salas da instituição",
    selectedIcon: "Plus",
  },
};

/**
 * Variação para o fluxo de reserva de salas e agendamentos corporativos.
 */
export const CriarReserva: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <CafCard
            icon={<Plus className="h-6 w-6 shrink-0 text-white stroke-[1.75]" />}
            title="Criar Reserva"
            subtitle="Agende uma nova sala para sua reunião ou evento"
            onClick={() => console.log("Criar Reserva")}
            href="/nova-reserva"
          />
        `.trim(),
      },
    },
  },
  args: {
    title: "Criar Reserva",
    subtitle: "Agende uma nova sala para sua reunião ou evento",
    selectedIcon: "Plus",
  },
};

/**
 * Demonstração dos cards de ação do Sistema-CAF organizados em grade responsiva (Grid de Atalhos).
 */
export const ActionGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
      <CafCard title="Fazer nova avaliação" subtitle="Realize uma nova avaliação de limpeza para as salas da instituição" onClick={() => alert("Ação: Fazer nova avaliação")} />
      <CafCard title="Criar Reserva" subtitle="Agende uma nova sala para sua reunião ou evento" onClick={() => alert("Ação: Criar Reserva")} />
      <CafCard title="Abrir Chamado" subtitle="Solicite manutenção corretiva ou preventiva com prioridade" onClick={() => alert("Ação: Abrir Chamado")} />
      <CafCard title="Consultar Histórico" subtitle="Visualize o relatório completo de vistorias e ocorrências registradas" onClick={() => alert("Ação: Consultar Histórico")} />
    </div>
  ),
};
