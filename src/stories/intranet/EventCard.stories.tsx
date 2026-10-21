import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IntranetEventCard, type IntranetEventCardProps } from "@/components/IntranetEventCard";
import { INTRANET_SAMPLE_EVENT, INTRANET_SAMPLE_EVENTS_LIST } from "@/utils/intranetEventCard";

const meta: Meta<IntranetEventCardProps> = {
  title: "Intranet/EventCard",
  component: IntranetEventCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
O componente **IntranetEventCard** representa os cartões de eventos, reuniões institucionais e datas importantes da **SMUL Intranet**.

### Recursos Principais:
- **Bloco Calendário em Destaque**: Quadrado no azul institucional (\`#0b3299\`) com dia e mês abreviado em letras maiúsculas (\`08 JUL\`).
- **Tag Temática com Ícone**: Ícone de calendário e categorização da pauta (*"Evento"*, *"Reunião"*, *"Palestra"*).
- **Título Institucional**: Tipografia forte e limpa em negrito (*"Reuniao geral SMUL"*).
- **Local e Pauta**: Informações detalhadas de auditório/sala, horário e pauta do encontro.
- **Interatividade Total**: Suporte a links (\`href\`), cliques (\`onClick\`) e badges de status (*"Online"*, *"Hoje"*).
        `,
      },
    },
  },
  args: {
    day: INTRANET_SAMPLE_EVENT.day,
    month: INTRANET_SAMPLE_EVENT.month,
    category: INTRANET_SAMPLE_EVENT.category,
    title: INTRANET_SAMPLE_EVENT.title,
    description: INTRANET_SAMPLE_EVENT.description,
  },
  argTypes: {
    day: {
      control: "text",
      description: "Dia do evento (ex: '08' ou 8)",
    },
    month: {
      control: "text",
      description: "Mês abreviado em maiúsculas (ex: 'JUL', 'AGO')",
    },
    category: {
      control: "text",
      description: "Categoria exibida ao lado do ícone de calendário",
    },
    title: {
      control: "text",
      description: "Título principal da reunião ou evento",
    },
    description: {
      control: "text",
      description: "Descrição de local, horário e pauta",
    },
    badge: {
      control: "text",
      description: "Badge opcional de status no canto superior direito (ex: 'Online')",
    },
    target: {
      control: "select",
      options: ["_blank", "_self", "_parent", "_top"],
      description: "Define onde abrir o link quando href for informado (ex: '_blank' para nova aba)",
    },
    dateBadgeColor: {
      control: "color",
      description: "Cor personalizada para o bloco de calendário",
    },
    className: {
      control: "text",
      description: "Classes Tailwind complementares",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full bg-[#f4f6fa] p-4 sm:p-10 rounded-2xl min-h-[320px] flex items-center justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<IntranetEventCardProps>;

/**
 * **Card de Evento Padrão (Fiel ao Modelo de Referência)**
 *
 * Apresenta a reunião geral da SMUL no dia 08 de Julho no auditório principal.
 */
export const Default: Story = {};

/**
 * **Card Clicável / Link Interativo**
 *
 * Ao receber `href` ou `onClick`, o card ganha cursor interativo, elevação de sombra e transição de cor suave.
 * Configurado com `target="_blank"` para abrir o link em uma nova janela/aba com segurança (`rel="noopener noreferrer"`).
 */
export const InteractiveLink: Story = {
  args: {
    title: "Reuniao geral SMUL (Clique para abrir em nova janela)",
    href: "https://capital.sp.gov.br",
    target: "_blank",
  },
};

/**
 * **Com Objeto Date Nativo do JavaScript**
 *
 * O componente extrai automaticamente o dia de dois dígitos e o mês abreviado em maiúsculas.
 */
export const UsingDateObject: Story = {
  args: {
    date: new Date(2026, 6, 8), // 8 de Julho
    title: "Reunião de Alinhamento Estratégico",
    description: "Sala de reuniões da Assessoria Técnica, 15h.",
  },
};

/**
 * **Grade / Lista de Próximos Eventos da Intranet**
 *
 * Demonstra a composição de múltiplos cards em um painel completo com o cabeçalho idêntico ao modelo da Intranet.
 */
export const EventsList: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-slate-900">Próximos Eventos</h2>
        <p className="text-xs sm:text-sm text-slate-500">Agenda de encontros, comunicações internas e datas importantes.</p>
      </div>

      {INTRANET_SAMPLE_EVENTS_LIST.map((event) => (
        <IntranetEventCard key={event.id} day={event.day} month={event.month} category={event.category} title={event.title} description={event.description} badge={event.badge} href="#" />
      ))}
    </div>
  ),
};
