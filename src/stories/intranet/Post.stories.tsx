import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { IntranetPost, type IntranetPostProps } from "@/components/IntranetPost";
import { INTRANET_SAMPLE_POST, INTRANET_DEFAULT_CURRENT_USER, INTRANET_DEFAULT_POST_COMMENTS } from "@/utils/intranetPost";

const meta: Meta<IntranetPostProps> = {
  title: "Intranet/Post",
  component: IntranetPost,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
O componente **IntranetPost** é o modelo visual e funcional padrão para **publicações, notícias e comunicados da SMUL Intranet**.

### Recursos Principais:
- **Identificação do Autor**: Avatar circular com iniciais temáticas (\`CC\`), nome institucional, tag temática (*"comunicado"*) e tempo relativo da publicação.
- **Mídia Integrada**: Suporte a imagens, cartazes e banners em alta definição com bordas arredondadas e efeito de foco.
- **Contador Dinâmico de Curtidas**: Clique no ícone de coração (\`Heart\`) para curtir/descurtir em tempo real, incrementando ou decrementando o contador e ativando animação e preenchimento em vermelho.
- **Contador Dinâmico de Comentários**: Exibe a contagem atualizada de comentários (\`MessageCircle\`) e foca no campo de escrita ao ser clicado.
- **Recepção de Novos Comentários**: Permite que o usuário autenticado digite um comentário e envie pressionando \`Enter\` ou clicando no botão de aviãozinho (\`Send\`), adicionando o comentário imediatamente à lista e atualizando o contador!
- **Compartilhamento**: Ação de copiar link da postagem com feedback instantâneo.
        `,
      },
    },
  },
  args: {
    author: INTRANET_SAMPLE_POST.author,
    content: INTRANET_SAMPLE_POST.content,
    image: INTRANET_SAMPLE_POST.image,
    imageAlt: INTRANET_SAMPLE_POST.imageAlt,
    likesCount: 34,
    comments: INTRANET_DEFAULT_POST_COMMENTS,
    currentUser: INTRANET_DEFAULT_CURRENT_USER,
    commentPlaceholder: "Escreva um comentario...",
    showComments: true,
  },
  argTypes: {
    content: {
      control: "text",
      description: "Texto principal do corpo da postagem",
    },
    image: {
      control: "text",
      description: "URL da imagem ou banner da publicação",
    },
    likesCount: {
      control: "number",
      description: "Quantidade inicial de curtidas",
    },
    isLiked: {
      control: "boolean",
      description: "Define se o post está curtido pelo usuário atual",
    },
    comments: {
      description: "Lista de comentários da postagem",
    },
    commentPlaceholder: {
      control: "text",
      description: "Texto orientativo do input de comentários",
    },
    showComments: {
      control: "boolean",
      description: "Exibe ou oculta a seção de comentários",
    },
    className: {
      control: "text",
      description: "Classes Tailwind adicionais para o container",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full bg-[#f4f6fa] p-4 sm:p-10 rounded-2xl min-h-[640px] flex items-start justify-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<IntranetPostProps>;

/**
 * **Post Padrão da Intranet (Idêntico ao Modelo de Referência)**
 *
 * Apresenta o comunicado oficial da Coordenadoria de Comunicação sobre o novo site da Intranet:
 * - Contador com 34 curtidas (clique para curtir e descurtir).
 * - Comentário existente da servidora Sandra Maria.
 * - Campo de envio para novos comentários com avatar do usuário logado (VV).
 */
export const Default: Story = {};
