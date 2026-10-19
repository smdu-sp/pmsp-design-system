import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IntranetCard, type IntranetCardProps } from "@/components/IntranetCard";
import {
  INTRANET_CARD_SAMPLE_BIRTHDAYS,
  INTRANET_CARD_SAMPLE_NOTICES,
  INTRANET_CARD_SAMPLE_EVENTS,
  INTRANET_AVATAR_COLORS,
  formatTodayAsBirthdayDate,
} from "@/utils/intranetCard";

const meta: Meta<IntranetCardProps> = {
  title: "Intranet/Card",
  component: IntranetCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
O componente **IntranetCard** foi desenvolvido com base no design institucional da **SMUL Intranet (Secretaria Municipal de Urbanismo e Licenciamento)**.

Ele possui **duas variantes exclusivas**:
1. **\`variant="birthday"\` (Card de Aniversariante / Celebração com Botão)**:
   - Círculo de avatar com foto ou iniciais em cores temáticas (\`MT\` em mostarda, \`IC\` em rosa, \`SC\` em roxo).
   - Nome em destaque com badge opcional (*"hoje"* em verde/teal) e departamento em múltiplas linhas.
   - Bloco de informações com data (*"6 de Julho"*, *"11 de Julho"*) e contador de felicitações (*"2 felicitacoes"*, *"Seja o primeiro a parabenizar"*).
   - Botão de ação inferior em destaque (*"Parabenizar"*) em azul institucional (\`#0b3299\`).

2. **\`variant="text"\` (Card Textual / Comunicados e Eventos)**:
   - Título da seção institucional (*"Comunicados recentes"*, *"Próximos eventos"*).
   - Lista textual com títulos em negrito e datas sutis (*"05 jul"*, *"01 jul"*).
   - Suporte a links, cliques interativos ou avisos de estado vazio (*"Nenhum aniversário hoje."*).
        `,
      },
    },
  },
  args: {
    variant: "birthday",
    name: "Ingrid Jesus Costa",
    department: "Divisão de Gestão de Pessoas",
    badge: "hoje",
    date: "6 de Julho",
    felicitations: "Seja o primeiro a parabenizar",
    buttonText: "Parabenizar",
    avatar: {
      initials: "IC",
      color: INTRANET_AVATAR_COLORS.pink,
    },
    title: "Comunicados recentes",
    items: INTRANET_CARD_SAMPLE_NOTICES,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["birthday", "text"],
      description: "Variante do card: 'birthday' (com botão) ou 'text' (apenas textos)",
    },
    name: {
      control: "text",
      description: "Nome do colaborador (usado na variante 'birthday')",
    },
    title: {
      control: "text",
      description: "Título da seção (usado na variante 'text')",
    },
    department: {
      control: "text",
      description: "Departamento / Divisão / Coordenadoria do colaborador",
    },
    badge: {
      control: "text",
      description: "Texto do badge de destaque (ex: 'hoje') ou vazio para ocultar",
    },
    date: {
      control: "text",
      description: "Data do evento ou aniversário (ex: '6 de Julho')",
    },
    felicitations: {
      control: "text",
      description: "Mensagem ou contagem de felicitações (ex: '2 felicitacoes')",
    },
    buttonText: {
      control: "text",
      description: "Texto do botão de ação (variante 'birthday')",
    },
    buttonVariant: {
      control: "select",
      options: ["intranet-primary", "intranet-secondary", "primary", "secondary"],
      description: "Variante visual do botão",
    },
    buttonDisabled: {
      control: "boolean",
      description: "Desabilita o botão de ação",
    },
    emptyText: {
      control: "text",
      description: "Texto de estado vazio exibido no modo 'text'",
    },
    className: {
      control: "text",
      description: "Classes Tailwind adicionais",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full bg-[#f4f6fa] p-6 sm:p-10 rounded-2xl min-h-[400px] flex items-start justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<IntranetCardProps>;

/**
 * **Variante: birthday (Aniversário Hoje no Calendário)**
 *
 * Como a data coincide com o dia atual do calendário, a badge "hoje" é exibida automaticamente!
 */
export const Birthday: Story = {
  args: {
    variant: "birthday",
    name: "Ingrid Jesus Costa",
    department: "Divisão de Gestão de Pessoas",
    date: formatTodayAsBirthdayDate(),
    felicitations: "Seja o primeiro a parabenizar",
    buttonText: "Parabenizar",
    avatar: {
      initials: "IC",
      color: INTRANET_AVATAR_COLORS.pink,
    },
  },
};

/**
 * **Variante: birthday (Outra Data do Calendário)**
 *
 * Como a data ("6 de Julho") não é hoje, a badge "hoje" fica automaticamente OCULTA!
 */
export const BirthdayOutraData: Story = {
  args: {
    variant: "birthday",
    name: "Sandra Maria Coelho",
    department: "SERVIN / DSIGP",
    date: "6 de Julho",
    felicitations: "1 felicitacao",
    buttonText: "Parabenizar",
    avatar: {
      initials: "SC",
      color: INTRANET_AVATAR_COLORS.purple,
    },
  },
};

/**
 * **Variante: text (Card com Apenas Textos)**
 *
 * Apresenta o cabeçalho 'Comunicados recentes' e uma lista de tópicos com títulos
 * em negrito e datas correspondentes, sem botão de ação inferior.
 */
export const Text: Story = {
  args: {
    variant: "text",
    title: "Comunicados recentes",
    items: INTRANET_CARD_SAMPLE_NOTICES,
  },
};
