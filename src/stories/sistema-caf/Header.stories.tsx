import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CafHeader, type CafHeaderProps, CAF_DEFAULT_HEADER_ITEMS } from "@/components/CafHeader";
import { FileText, Layers, CheckSquare, Building2, Bell } from "lucide-react";

export interface HeaderStoryProps extends CafHeaderProps {
  avaliacoesBadge?: number;
  salasBadge?: number;
}

const meta: Meta<HeaderStoryProps> = {
  title: "Sistema-CAF/Header",
  component: CafHeader,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
O componente **CafHeader** é a barra de navegação principal do **Sistema-CAF (Central de Atendimento ao Funcionário)**:
- **Estado Ativo (Clique / Seleção)**: Destaque com pílula em azul anil sólido (\`#0b3299\`), texto branco em negrito e sombra suave (\`shadow-2xs\`).
- **Estado Hover**: Transição suave para um azul mais fraco/suave (\`#0b3299/10\` ou \`bg-blue-50\`) com tipografia em azul anil, proporcionando feedback visual moderno e responsivo.
- **Estado Não Selecionado (Unselected)**: Todos os itens mantêm tipografia suave em tom cinza (\`text-slate-600\`), sem qualquer preenchimento ativo inicial.
- **Container Flutuante**: Fundo branco translúcido (\`bg-white/95 backdrop-blur-md\`), bordas arredondadas (\`rounded-2xl\`) e contorno suave (\`border-slate-200/90\`).
- **Navegação com Href Obrigatório**: Cada item recebe uma URL de destino (\`href\`), sendo renderizado como \`<Link>\` nativo do Next.js com acessibilidade total por teclado (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Espaço</kbd>).
- **Badges Externos Dinâmicos**: Suporta contadores e badges numéricos recebidos externamente (via prop \`badges\` ou \`item.badge\`), adaptando automaticamente as cores da pílula conforme o item estiver ativo ou inativo.
        `,
      },
    },
  },
  args: {
    items: CAF_DEFAULT_HEADER_ITEMS,
    align: "center",
    variant: "floating",
    allowDeselect: true,
  },
  argTypes: {
    align: {
      control: "select",
      options: ["start", "center", "end", "between"],
      description: "Alinhamento horizontal dos itens de navegação",
    },
    variant: {
      control: "select",
      options: ["floating", "fixed", "full"],
      description: "Variante de apresentação do container (flutuante, fixo ao topo ou largura total)",
    },
    allowDeselect: {
      control: "boolean",
      description: "Permite desselecionar o item clicando novamente sobre ele",
    },
  },
};

export default meta;
type Story = StoryObj<HeaderStoryProps>;

/**
 * Visual padrão do Sistema-CAF:
 * Inicia com 'Avaliações' selecionado com fundo azul anil (#0b3299) e texto branco.
 * Ao passar o mouse sobre as demais opções, exibe o tom azul suave (#0b3299/10).
 * Ao clicar em outra opção, ela assume o azul sólido.
 * Cada item possui seu respectivo `href`.
 */
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Visual padrão de referência do Sistema-CAF: inicia com 'Avaliações' selecionado e cada item possui seu respectivo `href`.",
      },
    },
  },
  render: (args) => {
    const [active, setActive] = React.useState<string | null>("avaliacoes");
    return <CafHeader {...args} activeId={active} onActiveChange={setActive} />;
  },
  args: {
    items: CAF_DEFAULT_HEADER_ITEMS,
    align: "center",
  },
};

/**
 * Visual desmarcado inicial:
 * Inicia totalmente desmarcado (nenhum item possui o fundo azul escuro).
 * Ao passar o mouse sobre qualquer opção, exibe a pílula em azul suave.
 * Ao clicar em qualquer opção, ela se torna ativa assumindo o fundo azul sólido.
 * Cada item possui seu respectivo `href`.
 */
export const Unselected: Story = {
  parameters: {
    docs: {
      description: {
        story: "Inicia com `activeId={null}`. Todas as opções aguardam seleção pelo usuário e contam com hover suave e `href` configurado.",
      },
    },
  },
  render: (args) => {
    const [active, setActive] = React.useState<string | null>(null);
    return <CafHeader {...args} activeId={active} onActiveChange={setActive} />;
  },
  args: {
    items: CAF_DEFAULT_HEADER_ITEMS,
    align: "center",
  },
};

/**
 * Itens com badges numéricos informativos de pendências:
 * Recebe os valores dos badges externamente (via prop `badges` ou controles numéricos no Storybook).
 * As pílulas adaptam suas cores automaticamente ao estado ativo (#0b3299/branco) ou inativo (slate-200/slate-700).
 */
export const WithBadges: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Itens de navegação acompanhados de badges com contagem de pendências recebidas externamente (via prop `badges` ou controles do Storybook). O estilo da pílula adapta suas cores automaticamente ao estado ativo/inativo.",
      },
    },
  },
  argTypes: {
    avaliacoesBadge: {
      control: "number",
      description: "Valor numérico do badge de Avaliações recebido externamente",
    },
    salasBadge: {
      control: "number",
      description: "Valor numérico do badge de Salas recebido externamente",
    },
  },
  args: {
    avaliacoesBadge: 12,
    salasBadge: 48,
    align: "center",
  },
  render: ({ avaliacoesBadge = 12, salasBadge = 48, ...args }) => {
    const [active, setActive] = React.useState<string | null>("avaliacoes");
    return (
      <CafHeader
        {...args}
        activeId={active}
        onActiveChange={setActive}
        badges={{
          avaliacoes: avaliacoesBadge,
          salas: salasBadge,
        }}
      />
    );
  },
};

/**
 * Itens com ícones visuais para identificação rápida:
 * Cada item possui seu respectivo `href` e ícone SVG.
 */
export const WithIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: "Itens de navegação enriquecidos com ícones representativos e `href` configurado em cada item.",
      },
    },
  },
  render: (args) => {
    const [active, setActive] = React.useState<string | null>("avaliacoes");
    return <CafHeader {...args} activeId={active} onActiveChange={setActive} />;
  },
  args: {
    items: [
      {
        id: "avaliacoes",
        label: "Avaliações",
        href: "/avaliacoes",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        id: "categorias",
        label: "Categorias",
        href: "/categorias",
        icon: <Layers className="w-4 h-4" />,
      },
      {
        id: "criterios",
        label: "Critérios de Avaliação",
        href: "/criterios",
        icon: <CheckSquare className="w-4 h-4" />,
      },
      {
        id: "salas",
        label: "Salas",
        href: "/salas",
        icon: <Building2 className="w-4 h-4" />,
      },
    ],
    align: "center",
  },
};
