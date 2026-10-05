import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown, type DropdownProps } from "@/components/Dropdown";
import { STORY_ICONS, STORY_ICON_NAMES, type StoryIconName } from "../iconGallery";
import { MoreVertical, ChevronDown, Edit, Copy, Share2, Trash2, User, Settings, LogOut, HelpCircle, Bell, Check, Filter } from "lucide-react";

export interface DropdownStoryProps extends Omit<DropdownProps, "leftIcon" | "rightIcon"> {
  selectedIconLeft?: StoryIconName;
  selectedIconRight?: StoryIconName;
}

const meta: Meta<DropdownStoryProps> = {
  title: "CIPA/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Componente flutuante e isolado de **Dropdown** baseado em React Portal. Oferece transições suaves de entrada/saída, posicionamento inteligente com reposicionamento automático na rolagem/redimensionamento, suporte a acessibilidade (WAI-ARIA, foco e tecla Escape), alinhamento customizável e controle total dos ícones à esquerda e à direita do gatilho (com suporte ao modo somente ícones quando não houver texto).",
      },
    },
  },
  args: {
    label: "Opções da linha",
    iconLeft: false,
    selectedIconLeft: "Filter",
    iconRight: true,
    selectedIconRight: "ChevronDown",
    align: "left",
    width: 260,
    animationDuration: 200,
    size: "md",
    triggerVariant: "outline",
    portal: true,
    ariaLabel: "Menu de opções",
  },
  argTypes: {
    label: {
      control: "text",
      description: "Texto ou rótulo do botão gatilho. Se vazio, o botão exibe apenas os ícones.",
    },
    animationDuration: {
      control: { type: "range", min: 100, max: 2000, step: 50 },
      description: "Duração em milissegundos da animação de opacidade ao abrir e fechar o menu",
    },
    iconLeft: {
      control: "boolean",
      description: "Ativar exibição do ícone à esquerda do gatilho",
    },
    selectedIconLeft: {
      control: "select",
      options: STORY_ICON_NAMES,
      description: "Selecione o ícone à esquerda (exibido apenas quando iconLeft estiver ativo)",
      if: { arg: "iconLeft", truthy: true },
    },
    iconRight: {
      control: "boolean",
      description: "Ativar exibição do ícone à direita do gatilho",
    },
    selectedIconRight: {
      control: "select",
      options: STORY_ICON_NAMES,
      description: "Selecione o ícone à direita (exibido apenas quando iconRight estiver ativo)",
      if: { arg: "iconRight", truthy: true },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Dimensão e espaçamento do botão gatilho",
    },
    triggerVariant: {
      control: "select",
      options: ["outline", "primary", "secondary", "ghost"],
      description: "Estilo visual do botão gatilho",
    },
    align: {
      control: "select",
      options: ["left", "center", "right"],
      description: "Alinhamento do popover em relação ao botão gatilho",
    },
    width: {
      control: "number",
      description: "Largura em pixels do menu dropdown",
    },
    portal: {
      control: "boolean",
      description: "Se o menu deve ser renderizado no document.body via Portal para sobrepor tabelas e cards",
    },
    ariaLabel: {
      control: "text",
      description: "Rótulo de acessibilidade para leitores de tela",
    },
  },
  render: ({ selectedIconLeft, selectedIconRight, iconLeft, iconRight, label, ...args }) => {
    const leftIcon = iconLeft && selectedIconLeft && STORY_ICONS[selectedIconLeft] ? STORY_ICONS[selectedIconLeft] : undefined;

    const rightIcon = iconRight && selectedIconRight && STORY_ICONS[selectedIconRight] ? STORY_ICONS[selectedIconRight] : undefined;

    return (
      <div className="p-16 flex items-center justify-center">
        <Dropdown {...args} label={label} iconLeft={iconLeft} iconRight={iconRight} leftIcon={leftIcon} rightIcon={rightIcon}>
          <div className="py-1 divide-y divide-slate-100 text-xs">
            <div className="pb-1.5 space-y-0.5">
              <Dropdown.Item iconLeft leftIcon={<Edit className="w-3.5 h-3.5 text-slate-500" />}>
                Editar registro
              </Dropdown.Item>
              <Dropdown.Item iconLeft leftIcon={<Copy className="w-3.5 h-3.5 text-slate-500" />}>
                Duplicar linha
              </Dropdown.Item>
              <Dropdown.Item iconLeft leftIcon={<Share2 className="w-3.5 h-3.5 text-slate-500" />}>
                Compartilhar link
              </Dropdown.Item>
            </div>
            <div className="pt-1.5">
              <Dropdown.Item variant="danger" iconLeft leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-500" />}>
                Excluir registro
              </Dropdown.Item>
            </div>
          </div>
        </Dropdown>
      </div>
    );
  },
};

export default meta;
type Story = StoryObj<DropdownStoryProps>;

/**
 * Menu padrão com texto e chevron na direita. Use os controles para alternar ícones e texto.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <Dropdown
            label="Opções da linha"
            iconRight
            rightIcon={<ChevronDown />}
          >
            <Dropdown.Item iconLeft leftIcon={<Edit />}>Editar registro</Dropdown.Item>
            <Dropdown.Item iconLeft leftIcon={<Copy />}>Duplicar linha</Dropdown.Item>
            <Dropdown.Item iconLeft leftIcon={<Share2 />}>Compartilhar link</Dropdown.Item>
            <Dropdown.Item variant="danger" iconLeft leftIcon={<Trash2 />}>Excluir registro</Dropdown.Item>
          </Dropdown>
        `.trim(),
      },
    },
  },
  args: {
    label: "Opções da linha",
    iconLeft: false,
    selectedIconLeft: "Filter",
    iconRight: true,
    selectedIconRight: "ChevronDown",
  },
};

/**
 * Exibe apenas o ícone no gatilho quando não houver texto (ex: botão de ações de linha com MoreVertical).
 */
export const IconOnly: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <Dropdown
            iconLeft
            leftIcon={<MoreVertical />}
            ariaLabel="Mais opções da linha"
          >
            <Dropdown.Item iconLeft leftIcon={<Edit />}>Editar registro</Dropdown.Item>
            <Dropdown.Item iconLeft leftIcon={<Copy />}>Duplicar linha</Dropdown.Item>
            <Dropdown.Item iconLeft leftIcon={<Share2 />}>Compartilhar link</Dropdown.Item>
            <Dropdown.Item variant="danger" iconLeft leftIcon={<Trash2 />}>Excluir registro</Dropdown.Item>
          </Dropdown>
        `.trim(),
      },
    },
  },
  args: {
    label: "",
    iconLeft: true,
    selectedIconLeft: "MoreVertical",
    iconRight: false,
    ariaLabel: "Mais opções da linha",
  },
};

/**
 * Gatilho com ícone na esquerda, texto e indicador chevron na direita.
 */
export const BothIcons: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <Dropdown
            label="Filtrar Resultados"
            iconLeft
            leftIcon={<Filter />}
            iconRight
            rightIcon={<ChevronDown />}
          >
            <Dropdown.Item iconLeft leftIcon={<Edit />}>Editar registro</Dropdown.Item>
            <Dropdown.Item iconLeft leftIcon={<Copy />}>Duplicar linha</Dropdown.Item>
            <Dropdown.Item iconLeft leftIcon={<Share2 />}>Compartilhar link</Dropdown.Item>
            <Dropdown.Item variant="danger" iconLeft leftIcon={<Trash2 />}>Excluir registro</Dropdown.Item>
          </Dropdown>
        `.trim(),
      },
    },
  },
  args: {
    label: "Filtrar Resultados",
    iconLeft: true,
    selectedIconLeft: "Filter",
    iconRight: true,
    selectedIconRight: "ChevronDown",
  },
};

/**
 * Caso não haja texto mas ambos os ícones estejam ativos, exibe apenas os dois ícones juntos.
 */
export const BothIconsWithoutText: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <Dropdown
            iconLeft
            leftIcon={<Filter />}
            iconRight
            rightIcon={<ChevronDown />}
            ariaLabel="Filtro rápido"
          >
            <Dropdown.Item iconLeft leftIcon={<Edit />}>Editar registro</Dropdown.Item>
            <Dropdown.Item iconLeft leftIcon={<Copy />}>Duplicar linha</Dropdown.Item>
            <Dropdown.Item iconLeft leftIcon={<Share2 />}>Compartilhar link</Dropdown.Item>
            <Dropdown.Item variant="danger" iconLeft leftIcon={<Trash2 />}>Excluir registro</Dropdown.Item>
          </Dropdown>
        `.trim(),
      },
    },
  },
  args: {
    label: "",
    iconLeft: true,
    selectedIconLeft: "Filter",
    iconRight: true,
    selectedIconRight: "ChevronDown",
    ariaLabel: "Filtro rápido",
  },
};
