import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Megaphone, Image as ImageIcon, Send } from "lucide-react";
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
  args: {
    theme: "intranet",
    variant: "primary",
    rounded: "lg",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Paleta institucional da Intranet: 'primary' (Azul #0b3299 preenchido) ou 'secondary' (Delineado com fundo branco, texto e ícone azuis)",
    },
    theme: {
      control: "select",
      options: ["intranet", "default"],
      description: "Tema de cores aplicado ao botão (padrão da Intranet: 'intranet')",
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
      description: "Cor de fundo customizada em hexadecimal (#...) ou variável CSS (var(--...))",
    },
    textColor: {
      control: "color",
      description: "Cor do texto customizada em hexadecimal (#...) ou variável CSS (var(--...))",
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
  render: ({ selectedIconLeft, selectedIconRight, theme = "intranet", ...args }) => {
    const leftIcon =
      args.iconLeft && selectedIconLeft && STORY_ICONS[selectedIconLeft]
        ? STORY_ICONS[selectedIconLeft]
        : undefined;

    const rightIcon =
      args.iconRight && selectedIconRight && STORY_ICONS[selectedIconRight]
        ? STORY_ICONS[selectedIconRight]
        : undefined;

    return <Button {...args} theme={theme} leftIcon={leftIcon} rightIcon={rightIcon} />;
  },
};

export default meta;
type Story = StoryObj<ButtonStoryProps>;

/** Botão primário preenchido em azul (#0b3299) com ícone de envio e texto branco */
export const Primary: Story = {
  args: {
    variant: "primary",
    theme: "intranet",
    size: "md",
    rounded: "lg",
    iconLeft: true,
    selectedIconLeft: "Send",
    iconRight: false,
    children: "Publicar",
  },
};

/** Botão secundário delineado com fundo claro, texto e ícone em azul institucional (#0b3299) */
export const Secondary: Story = {
  args: {
    variant: "secondary",
    theme: "intranet",
    size: "md",
    rounded: "lg",
    iconLeft: true,
    selectedIconLeft: "Megaphone",
    iconRight: false,
    children: "Comunicado",
  },
};

/** Botão secundário delineado para inserção de imagem com texto e ícone em azul institucional (#0b3299) */
export const Imagem: Story = {
  args: {
    variant: "secondary",
    theme: "intranet",
    size: "md",
    rounded: "lg",
    iconLeft: true,
    selectedIconLeft: "ImageIcon",
    iconRight: false,
    children: "Imagem",
  },
};

/** Barra de publicação completa idêntica ao design da Intranet (Comunicado e Imagem à esquerda, Publicar à direita) */
export const PostToolbar: Story = {
  render: () => (
    <div className="w-full max-w-2xl p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <Button
          theme="intranet"
          variant="secondary"
          rounded="lg"
          iconLeft
          leftIcon={<Megaphone className="h-4 w-4" />}
        >
          Comunicado
        </Button>
        <Button
          theme="intranet"
          variant="secondary"
          rounded="lg"
          iconLeft
          leftIcon={<ImageIcon className="h-4 w-4" />}
        >
          Imagem
        </Button>
      </div>

      <Button
        theme="intranet"
        variant="primary"
        rounded="lg"
        iconLeft
        leftIcon={<Send className="h-4 w-4" />}
      >
        Publicar
      </Button>
    </div>
  ),
};

export const Publicar: Story = {
  ...Primary,
};

export const Comunicado: Story = {
  ...Secondary,
};
