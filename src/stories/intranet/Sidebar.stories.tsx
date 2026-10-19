import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Home, CalendarDays, Megaphone, Contact, Newspaper, User, LifeBuoy } from "lucide-react";
import { IntranetSidebar, type IntranetSidebarProps } from "@/components/IntranetSidebar";
import { INTRANET_DEFAULT_SIDEBAR_ITEMS } from "@/utils/intranetSidebar";
import { IntranetHeader } from "@/components/IntranetHeader";

const meta: Meta<IntranetSidebarProps> = {
  title: "Intranet/Sidebar",
  component: IntranetSidebar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
O componente **IntranetSidebar** foi desenvolvido sob medida para a **SMUL Intranet (Secretaria Municipal de Urbanismo e Licenciamento)**:
- **Seção NAVEGACAO**: Lista vertical de atalhos institucionais com ícones expressivos e estados táteis interativos.
- **Destaque do Item Ativo**: Identificação imediata da página corrente com fundo azul suave (\`#f0f4ff\`) e texto/ícone no azul institucional (\`#0b3299\`).
- **Card Integrado de Suporte Técnico**: Bloco inferior com ícone de boia (\`LifeBuoy\`), orientações sobre chamados de equipamentos e botão de ação *"Abrir chamado"*.
- **Controle Flexível de Estado**: Suporta modo controlado (\`activeItemId\` + \`onItemSelect\`) ou modo autônomo (\`defaultActiveItemId\`).
        `,
      },
    },
  },
  args: {
    sectionTitle: "NAVEGACAO",
    defaultActiveItemId: "inicio",
    showSupportCard: true,
    supportTitle: "Suporte tecnico",
    supportDescription1: "Precisa de ajuda com sistemas ou equipamentos?",
    supportDescription2: "Abra um chamado para receber atendimento da equipe responsavel.",
    supportButtonText: "Abrir chamado",
    items: INTRANET_DEFAULT_SIDEBAR_ITEMS,
  },
  argTypes: {
    sectionTitle: {
      control: "text",
      description: "Título da seção superior de navegação",
    },
    activeItemId: {
      control: "select",
      options: ["inicio", "aniversarios", "comunicados", "diretorio", "eventos", "perfil"],
      description: "Item atualmente ativo no menu (modo controlado)",
    },
    defaultActiveItemId: {
      control: "select",
      options: ["inicio", "aniversarios", "comunicados", "diretorio", "eventos", "perfil"],
      description: "Item inicialmente ativo no menu",
    },
    showSupportCard: {
      control: "boolean",
      description: "Alterna a exibição do card inferior de suporte técnico",
    },
    supportTitle: {
      control: "text",
      description: "Título exibido no card de suporte",
    },
    supportDescription1: {
      control: "text",
      description: "Primeiro parágrafo de texto do card de suporte",
    },
    supportDescription2: {
      control: "text",
      description: "Segundo parágrafo de texto do card de suporte",
    },
    supportButtonText: {
      control: "text",
      description: "Texto do botão de ação de abertura de chamado",
    },
    className: {
      control: "text",
      description: "Classes Tailwind adicionais para estilização do container",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full bg-[#f4f6fa] p-6 sm:p-10 rounded-2xl min-h-[640px] flex items-start justify-start">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<IntranetSidebarProps>;

/**
 * Visual padrão idêntico ao modelo de referência da SMUL Intranet:
 * - Seção 'NAVEGACAO' com 'Inicio' selecionado em azul institucional (#0b3299).
 * - Itens secundários com ícones escuros (Aniversários, Comunicados, Diretório, Eventos, Meu perfil).
 * - Card inferior de Suporte Técnico completo com botão 'Abrir chamado'.
 */
export const Default: Story = {
  args: {
    defaultActiveItemId: "inicio",
  },
};

/**
 * Exemplo com item 'Comunicados' selecionado como página ativa.
 */
export const ComunicadosAtivo: Story = {
  args: {
    defaultActiveItemId: "comunicados",
  },
};

/**
 * Exemplo com badges numéricos informativos em Comunicados e Eventos.
 */
export const ComBadges: Story = {
  args: {
    defaultActiveItemId: "inicio",
    items: [
      {
        id: "inicio",
        label: "Inicio",
        icon: <Home className="w-4 h-4 shrink-0" />,
        href: "#",
      },
      {
        id: "aniversarios",
        label: "Aniversários",
        icon: <CalendarDays className="w-4 h-4 shrink-0" />,
        href: "#",
        badge: "3",
      },
      {
        id: "comunicados",
        label: "Comunicados",
        icon: <Megaphone className="w-4 h-4 shrink-0" />,
        href: "#",
        badge: "Novo",
      },
      {
        id: "diretorio",
        label: "Diretório",
        icon: <Contact className="w-4 h-4 shrink-0" />,
        href: "#",
      },
      {
        id: "eventos",
        label: "Eventos",
        icon: <Newspaper className="w-4 h-4 shrink-0" />,
        href: "#",
        badge: "2",
      },
      {
        id: "perfil",
        label: "Meu perfil",
        icon: <User className="w-4 h-4 shrink-0" />,
        href: "#",
      },
    ],
  },
};
