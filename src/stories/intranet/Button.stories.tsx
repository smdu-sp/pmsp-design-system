import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, type ButtonProps } from "@/components/Button";
import { STORY_ICONS, STORY_ICON_NAMES, type StoryIconName } from "../iconGallery";

export interface ButtonStoryProps extends Omit<ButtonProps, "leftIcon" | "rightIcon"> {
  selectedIconLeft?: StoryIconName;
  selectedIconRight?: StoryIconName;
}

const meta: Meta<ButtonStoryProps> = {
  title: "Intranet/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Estilo visual base do botão",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Dimensão e preenchimento do botão",
    },
    rounded: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
      description: "Variante predefinida de arredondamento",
    },
    backgroundColor: {
      control: "color",
      description: "Cor de fundo em hexadecimal (#...) ou variável CSS (var(--...))",
    },
    textColor: {
      control: "color",
      description: "Cor do texto em hexadecimal (#...) ou variável CSS (var(--...))",
    },
    borderRadius: {
      control: "text",
      description: "Raio de borda personalizado (ex: 8px, 1rem, 9999px)",
    },
    iconLeft: {
      control: "boolean",
      description: "Ativar exibição do ícone à esquerda",
    },
    selectedIconLeft: {
      control: "select",
      options: STORY_ICON_NAMES,
      description: "Selecione o ícone à esquerda (exibido apenas quando iconLeft estiver ativo)",
      if: { arg: "iconLeft", truthy: true },
    },
    iconRight: {
      control: "boolean",
      description: "Ativar exibição do ícone à direita",
    },
    selectedIconRight: {
      control: "select",
      options: STORY_ICON_NAMES,
      description: "Selecione o ícone à direita (exibido apenas quando iconRight estiver ativo)",
      if: { arg: "iconRight", truthy: true },
    },
    className: {
      control: "text",
      description: "Classes Tailwind complementares para edição personalizada",
    },
    children: {
      control: "text",
      description: "Texto ou conteúdo interno do botão",
    },
  },
  render: ({ selectedIconLeft, selectedIconRight, ...args }) => {
    const leftIcon =
      selectedIconLeft && STORY_ICONS[selectedIconLeft]
        ? STORY_ICONS[selectedIconLeft]
        : undefined;

    const rightIcon =
      selectedIconRight && STORY_ICONS[selectedIconRight]
        ? STORY_ICONS[selectedIconRight]
        : undefined;

    return <Button {...args} leftIcon={leftIcon} rightIcon={rightIcon} />;
  },
};

export default meta;
type Story = StoryObj<ButtonStoryProps>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    iconLeft: true,
    selectedIconLeft: "Users",
    iconRight: false,
    children: "Acessar Portal do Colaborador",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    iconLeft: true,
    selectedIconLeft: "FileSpreadsheet",
    iconRight: false,
    children: "Consultar Contracheque",
  },
};

export const CustomStyle: Story = {
  args: {
    variant: "primary",
    size: "md",
    backgroundColor: "#0d9488",
    borderRadius: "24px",
    iconLeft: true,
    selectedIconLeft: "Megaphone",
    iconRight: true,
    selectedIconRight: "ArrowRight",
    className: "text-white shadow-md shadow-teal-500/20 border border-teal-400/30 hover:bg-teal-700",
    children: "Novo Comunicado Interno",
  },
};
