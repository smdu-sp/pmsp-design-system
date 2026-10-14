import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IntranetHeader, type IntranetHeaderProps, INTRANET_DEFAULT_NOTIFICATIONS, INTRANET_THEME_OPTIONS, INTRANET_DEFAULT_USER } from "@/components/IntranetHeader";

const meta: Meta<IntranetHeaderProps> = {
  title: "Intranet/Header",
  component: IntranetHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
O componente **IntranetHeader** foi desenvolvido sob medida para a **SMUL Intranet (Secretaria Municipal de Urbanismo e Licenciamento)**:
- **Barra Flutuante Sofisticada**: Fundo branco puro, cantos arredondados (\`rounded-2xl\`), borda sutil e sombra suave.
- **Identidade Institucional à Esquerda**: Logo azul anil (\`#0b3299\`), título **SMUL Intranet** em negrito e subtítulo *Urbanismo e Licenciamento*.
- **Barra de Busca Central**: Input arredondado em pílula (\`rounded-full\`) com ícone de lupa para localização rápida de pessoas, comunicados e posts.
- **Três Menus Dropdown Independentes à Direita**:
  1. 🔔 **Notificações**: Dropdown com lista de avisos, indicadores visuais coloridos (rosa, azul e cinza), horário relativo e botão de ação *"Marcar como lidas"*.
  2. ☀️ **Tema**: Menu compacto de alternância de aparência (*Claro*, *Escuro*, *Sistema*).
  3. 👤 **Perfil do Usuário**: Card do usuário autenticado com avatar em iniciais (*VV*), e-mail institucional e link *"Meu perfil"*.
        `,
      },
    },
  },
  args: {
    title: "SMUL Intranet",
    subtitle: "Urbanismo e Licenciamento",
    searchPlaceholder: "Buscar pessoas, comunicados, posts...",
    notifications: INTRANET_DEFAULT_NOTIFICATIONS,
    themeOptions: INTRANET_THEME_OPTIONS,
    user: INTRANET_DEFAULT_USER,
    theme: "light",
  },
  argTypes: {
    title: {
      control: "text",
      description: "Título principal da aplicação no cabeçalho",
    },
    subtitle: {
      control: "text",
      description: "Subtítulo institucional exibido abaixo do título",
    },
    searchPlaceholder: {
      control: "text",
      description: "Texto de placeholder para o campo de busca",
    },
    defaultOpenDropdown: {
      control: "select",
      options: [null, "notifications", "theme", "profile"],
      description: "Dropdown inicialmente aberto ('notifications' | 'theme' | 'profile' | null)",
    },
    theme: {
      control: "select",
      options: ["light", "dark", "system"],
      description: "Tema selecionado atualmente",
    },
    unreadCount: {
      control: "number",
      description: "Contador numérico de notificações não lidas no badge do sino",
    },
    hideSearch: {
      control: "boolean",
      description: "Oculta o campo de busca central",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full bg-[#f4f6fa] p-4 sm:p-8 rounded-2xl min-h-[480px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<IntranetHeaderProps>;

/**
 * Visual padrão de referência do Header da SMUL Intranet:
 * Barra com busca central e os 3 botões/gatilhos de dropdown fechados.
 * Clique em cada um dos ícones à direita para abrir o respectivo menu.
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Visual padrão completo e interativo do Header da SMUL Intranet. Clique no sino para Notificações, no sol para Tema e no avatar para Perfil.",
      },
      source: {
        code: `
import { IntranetHeader } from "@/components/IntranetHeader";

<IntranetHeader
  title="SMUL Intranet"
  subtitle="Urbanismo e Licenciamento"
  searchPlaceholder="Buscar pessoas, comunicados, posts..."
  onSearchSubmit={(query) => console.log("Buscando:", query)}
/>
        `.trim(),
      },
    },
  },
};

/**
 * Exemplo com Usuário Personalizado:
 * Mostra o header com outro perfil corporativo (ex: Coordenador de Urbanismo).
 */
export const CustomUser: Story = {
  parameters: {
    docs: {
      description: {
        story: "Header configurado com outro usuário corporativo da Secretaria de Urbanismo e Licenciamento.",
      },
      source: {
        code: `
import { IntranetHeader } from "@/components/IntranetHeader";

<IntranetHeader
  user={{
    name: "Mariana Souza",
    role: "Coordenadora de Licenciamento",
    email: "marianasouza@prefeitura.sp.gov.br",
    initials: "MS",
    avatarBg: "#8b5cf6",
  }}
/>
        `.trim(),
      },
    },
  },
  args: {
    user: {
      name: "Mariana Souza",
      role: "Coordenadora de Licenciamento",
      email: "marianasouza@prefeitura.sp.gov.br",
      initials: "MS",
      avatarBg: "#8b5cf6",
    },
  },
};
