import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, type CardProps } from "@/components/Card";
import { CARD_ICONS, CARD_ICON_NAMES, type CardIconName } from "../iconGallery";

export interface CardStoryProps extends Omit<CardProps, "icon"> {
  selectedIcon?: CardIconName;
}

function resolveCardPropsForVariant(args: CardStoryProps): CardProps {
  const variant = args.variant || "text";

  const styleProps: Partial<CardProps> = {
    variant,
    className: args.className,
    backgroundColor: args.backgroundColor,
    textColor: args.textColor,
    borderRadius: args.borderRadius,
  };

  switch (variant) {
    case "text":
      return {
        ...styleProps,
        title: args.title,
        subtitle: args.subtitle,
        items: args.items,
        listType: args.listType,
      };

    case "quick-access": {
      const resolvedIcon = args.selectedIcon === "None" ? null : CARD_ICONS[args.selectedIcon && args.selectedIcon !== "Default" ? args.selectedIcon : "MessageCircle"];

      return {
        ...styleProps,
        title: args.title,
        subtitle: args.subtitle,
        route: args.route,
        href: args.href,
        target: args.target,
        rel: args.rel,
        icon: resolvedIcon,
      };
    }

    case "file":
      return {
        ...styleProps,
        uploadText: args.uploadText,
        file: args.file,
        accept: args.accept,
        editableUploadText: args.editableUploadText,
      };

    case "media":
      return {
        ...styleProps,
        title: args.title,
        subtitle: args.subtitle,
        image: args.image,
        thumbnailText: args.thumbnailText,
        status: args.status,
        href: args.href,
      };

    default:
      return { ...styleProps };
  }
}

const meta: Meta<CardStoryProps> = {
  title: "CIPA/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
O componente **Card** foi desenvolvido com foco em **alta acessibilidade (WCAG 2.1 AA)** e **responsividade fluida**:
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "file", "quick-access", "media"],
      description: "Alterna entre texto com lista, upload de arquivo, acesso rápido via Link ou card de mídia/vídeo",
    },
    route: {
      control: "text",
      description: "Rota interna do Next.js via tag Link (padrão: '/')",
      if: { arg: "variant", eq: "quick-access" },
    },
    selectedIcon: {
      control: "select",
      options: CARD_ICON_NAMES,
      description: "Selecione o ícone a ser exibido no topo do card (MessageCircle, Mail, Phone, Info, etc.)",
      if: { arg: "variant", eq: "quick-access" },
    },
    uploadText: {
      control: "text",
      description: "Texto orientativo exibido na área de upload (editável diretamente nos Controls ou inline no card)",
      if: { arg: "variant", eq: "file" },
    },
    thumbnailText: {
      control: "text",
      description: "Texto do placeholder quando não houver miniatura (modo mídia)",
      if: { arg: "variant", eq: "media" },
    },
    image: {
      control: "text",
      description: "URL da imagem de miniatura do vídeo. Se vazia, exibe o fallback tracejado (modo mídia)",
      if: { arg: "variant", eq: "media" },
    },
    status: {
      control: "text",
      description: "Status ou indicação complementar do vídeo (ex: 'Em breve') (modo mídia)",
      if: { arg: "variant", eq: "media" },
    },
    title: {
      control: "text",
      description: "Título ou texto principal (modo texto, acesso rápido e mídia)",
      if: { arg: "variant", neq: "file" },
    },
    subtitle: {
      control: "text",
      description: "Subtexto explicativo ou descrição (modo texto, acesso rápido e mídia)",
      if: { arg: "variant", neq: "file" },
    },
    items: {
      control: "object",
      description: "Array de textos a serem exibidos como lista (modo texto)",
      if: { arg: "variant", eq: "text" },
    },
    listType: {
      control: "inline-radio",
      options: ["ul", "ol"],
      description: "Tipo de lista: marcadores ('ul') ou numerada ('ol')",
      if: { arg: "variant", eq: "text" },
    },
    accept: {
      control: "text",
      description: "Tipos de arquivo aceitos (ex: image/*, .pdf) (modo arquivo)",
      if: { arg: "variant", eq: "file" },
    },
    backgroundColor: {
      control: "color",
      description: "Cor de fundo customizada em hexadecimal (#...) ou variável CSS (var(--...))",
    },
    textColor: {
      control: "color",
      description: "Cor do texto em hexadecimal (#...) ou variável CSS (var(--...))",
    },
    borderRadius: {
      control: "text",
      description: "Raio de borda personalizado (ex: 16px, 1rem, 9999px)",
    },
  },
  render: (args) => {
    const cardProps = resolveCardPropsForVariant(args);
    return <Card {...cardProps} />;
  },
};

export default meta;
type Story = StoryObj<CardStoryProps>;

/** Card de texto básico conforme o design da CIPA */
export const TextDefault: Story = {
  args: {
    variant: "text",
    title: "O que é a CIPA ?",
    subtitle: "É uma comissão de trabalho criada para promover ações voltadas à segurança e à saúde no ambiente de trabalho.",
  },
};

/** Card de texto com lista não ordenada (ul - marcadores) */
export const TextWithUnorderedList: Story = {
  args: {
    variant: "text",
    title: "Atribuições da CIPA",
    subtitle: "Principais ações desenvolvidas para garantir a segurança no trabalho:",
    items: [
      "Identificar os riscos do processo de trabalho e propor medidas preventivas",
      "Elaborar o mapa de riscos da unidade com a participação dos trabalhadores",
      "Divulgar e zelar pela observância das normas regulamentadoras de segurança",
      "Participar da investigação das causas de acidentes e doenças ocupacionais",
    ],
    listType: "ul",
  },
};

/** Card de texto com lista ordenada (ol - números) */
export const TextWithOrderedList: Story = {
  args: {
    variant: "text",
    title: "Cronograma de Eleição CIPA",
    subtitle: "Etapas do processo eleitoral de acordo com a NR-5:",
    items: [
      "Publicação e divulgação do edital de convocação em locais visíveis",
      "Período de inscrição dos candidatos interessados",
      "Realização da eleição por escrutínio secreto durante a jornada normal",
      "Apuração dos votos e publicação oficial do resultado",
      "Treinamento obrigatório para titulares e suplentes antes da posse",
    ],
    listType: "ol",
  },
};

/** Card de upload com área tracejada para envio de arquivos acessível via teclado */
export const FileUpload: Story = {
  args: {
    variant: "file",
    uploadText: "Arraste aqui o cartaz do mês",
    accept: "image/*",
  },
};

/** Card de arquivo com imagem pré-carregada para demonstração */
export const FileSelectedPreview: Story = {
  args: {
    variant: "file",
    uploadText: "Arraste aqui o cartaz do mês",
    file: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400&auto=format&fit=crop&q=80",
  },
};

/** Card de acesso rápido para navegação com rota e ícone (3ª variante via Next.js Link) */
export const QuickAccess: Story = {
  args: {
    variant: "quick-access",
    route: "/",
    selectedIcon: "MessageCircle",
    title: "Quer falar com a gente ?",
    subtitle: "E-mails, caixas de recado e canal de acolhimento",
  },
};
