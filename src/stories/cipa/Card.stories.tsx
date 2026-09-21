import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, type CardProps } from "@/components/Card";

const meta: Meta<CardProps> = {
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
  args: {
    variant: "text",
    title: "O que é a CIPA ?",
    subtitle: "É uma comissão de trabalho criada para promover ações voltadas à segurança e à saúde no ambiente de trabalho.",
    uploadText: "Arraste aqui o cartaz do mês",
    editableUploadText: false,
    listType: "ul",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["text", "file"],
      description: "Alterna entre o card de conteúdo textual e o card de upload de arquivo",
    },
    uploadText: {
      control: "text",
      description: "Texto orientativo exibido na área de upload (editável diretamente nos Controls ou inline no card)",
    },
    editableUploadText: {
      control: "boolean",
      description: "Habilita a edição direta do texto no próprio card através de duplo clique ou botão de lápis",
    },
    title: {
      control: "text",
      description: "Título ou texto principal (modo texto)",
    },
    subtitle: {
      control: "text",
      description: "Subtexto explicativo ou descrição (modo texto)",
    },
    items: {
      control: "object",
      description: "Array de textos a serem exibidos como lista (modo texto)",
    },
    listType: {
      control: "inline-radio",
      options: ["ul", "ol"],
      description: "Tipo de lista: marcadores ('ul') ou numerada ('ol')",
    },
    accept: {
      control: "text",
      description: "Tipos de arquivo aceitos (ex: image/*, .pdf) (modo arquivo)",
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
};

export default meta;
type Story = StoryObj<CardProps>;

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

/** Card de arquivo com edição direta do texto habilitada no próprio card */
export const EditableFileUpload: Story = {
  args: {
    variant: "file",
    uploadText: "Arraste aqui o cartaz do mês",
    editableUploadText: true,
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

/** Simulação em tela compacta/mobile demonstrando padding e quebra de palavras */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    variant: "text",
    title: "Comissão Interna de Prevenção de Acidentes e Assédio",
    subtitle: "Ações preventivas e canais de apoio disponíveis para todos os colaboradores.",
    items: ["Orientações preventivas e cartilhas digitais", "Canal de denúncias confidenciais e acolhimento"],
    listType: "ul",
  },
  render: (args) => (
    <div className="max-w-[320px] p-2 bg-slate-100 rounded-xl">
      <Card {...args} />
    </div>
  ),
};

/** Demonstração de múltiplos cards em um Grid Responsivo */
export const ResponsiveGrid: Story = {
  render: () => (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Painel Integrado da CIPA (Grid Responsivo)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="text" title="O que é a CIPA ?" subtitle="Comissão voltada à segurança, prevenção e saúde no ambiente corporativo." />

        <Card variant="file" uploadText="Arraste aqui o cartaz do mês" accept="image/*" />

        <Card
          variant="text"
          title="Normas Principais"
          subtitle="Resumo dos pontos fundamentais:"
          items={["Uso obrigatório de EPI em áreas técnicas", "Relato imediato de quase-acidentes", "Manutenção periódica das rotas de fuga"]}
          listType="ul"
        />
      </div>
    </div>
  ),
};

/** Exemplo de customização de cores e borda com alto contraste */
export const CustomStyle: Story = {
  args: {
    variant: "text",
    title: "Alerta de Segurança e Higiene",
    subtitle: "Uso obrigatório de EPI em todas as dependências operacionais durante o período de manutenção.",
    items: ["Capacete de segurança com jugular ajustada", "Óculos de proteção contra impactos frontais e laterais", "Calçado de segurança com biqueira de proteção"],
    listType: "ul",
    backgroundColor: "#eff6ff",
    textColor: "#1e3a8a",
    borderRadius: "16px",
  },
};
