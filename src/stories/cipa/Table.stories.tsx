import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Table, type TableProps, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/Table";

const CIPA_HEADERS = ["Tema", "Descrição", "Acesso"];

const CIPA_DATA = [
  [
    "Cartaz do mês (histórico)",
    "Cartazes já publicados, disponíveis para consulta.",
    <span key="1" className="italic text-slate-600 font-medium">
      Em breve
    </span>,
  ],
  [
    "E-mails informativos",
    "Comunicados enviados periodicamente pela CIPA.",
    <span key="2" className="italic text-slate-600 font-medium">
      Em breve
    </span>,
  ],
  [
    "Mapa de risco",
    "Mapeamento de riscos por unidade/setor.",
    <span key="3" className="italic text-slate-600 font-medium">
      Em breve
    </span>,
  ],
  [
    "Legislação",
    "Normas regulamentadoras e legislação aplicável.",
    <span key="4" className="italic text-slate-600 font-medium">
      Em breve
    </span>,
  ],
  [
    "CAT — Comunicação de Acidente de Trabalho",
    "Como preencher e onde encaminhar.",
    <span key="5" className="italic text-slate-600 font-medium">
      Em breve
    </span>,
  ],
  [
    "Assédio — acolhimento e orientações",
    "Como identificar, denunciar e buscar apoio.",
    <span key="6" className="italic text-slate-600 font-medium">
      Em breve
    </span>,
  ],
  [
    "Calendário e atas de reuniões",
    "Datas dos encontros e registros das decisões da CIPA.",
    <span key="7" className="italic text-slate-600 font-medium">
      Em breve
    </span>,
  ],
  [
    "Perguntas frequentes (FAQ)",
    "Respostas para as dúvidas mais comuns.",
    <span key="8" className="italic text-slate-600 font-medium">
      Em breve
    </span>,
  ],
  [
    "Artigos e temas",
    "Conteúdos aprofundando prevenção e saúde no trabalho.",
    <span key="9" className="italic text-slate-600 font-medium">
      Em breve
    </span>,
  ],
];

const meta: Meta<TableProps> = {
  title: "CIPA/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    columnsCount: 3,
    boldColumns: [0],
    rowHeaderColIndex: 0,
    caption: "Materiais informativos e canais de atendimento da CIPA",
    captionSide: "bottom",
    captionSrOnly: false,
    headers: CIPA_HEADERS,
    data: CIPA_DATA,
    variant: "default",
    density: "default",
    hoverable: true,
  },
  argTypes: {
    columnsCount: {
      control: { type: "range", min: 1, max: 5, step: 1 },
      description: "Define quantas colunas vão existir na tabela",
    },
    boldColumns: {
      control: "object",
      description: "Array de índices das colunas com texto em negrito (ex: [0], [0, 2] ou [true, false, false])",
    },
    rowHeaderColIndex: {
      control: { type: "number", min: 0, max: 4, step: 1 },
      description: 'Índice da coluna que age semanticamente como cabeçalho de linha (<th scope="row">)',
    },
    caption: {
      control: "text",
      description: "Legenda descritiva acessível (renderiza <caption>)",
    },
    captionSide: {
      control: "select",
      options: ["top", "bottom"],
      description: "Posição do caption na tabela",
    },
    captionSrOnly: {
      control: "boolean",
      description: "Oculta visualmente o caption mantendo acessível para leitores de tela",
    },
    isLoading: {
      control: "boolean",
      description: "Exibe estado de carregamento com aria-busy e aria-live",
    },
    variant: {
      control: "select",
      options: ["default", "striped", "bordered"],
      description: "Variante visual da tabela",
    },
    density: {
      control: "select",
      options: ["default", "compact", "relaxed"],
      description: "Espaçamento interno das células (densidade)",
    },
    hoverable: {
      control: "boolean",
      description: "Destacar a linha ao passar o mouse",
    },
    backgroundColor: {
      control: "color",
      description: "Cor de fundo personalizada do container",
    },
    textColor: {
      control: "color",
      description: "Cor de texto personalizada",
    },
    borderRadius: {
      control: "text",
      description: "Raio de borda personalizado (ex: 16px, 1rem, 9999px)",
    },
  },
};

export default meta;
type Story = StoryObj<TableProps>;

/**
 * Tabela padrão idêntica ao design da CIPA, com a 1ª coluna ("Tema") como cabeçalho de linha
 * (`<th scope="row">`), contraste AA/AAA e legenda descritiva.
 */
export const Default: Story = {
  args: {
    columnsCount: 3,
    boldColumns: [0],
    rowHeaderColIndex: 0,
    caption: "Materiais informativos e canais de atendimento da CIPA",
    headers: CIPA_HEADERS,
    data: CIPA_DATA,
  },
};

/**
 * Tabela zebrada (striped) com linhas alternadas para facilitar a leitura.
 */
export const Striped: Story = {
  args: {
    variant: "striped",
  },
};

/**
 * Tabela com bordas (bordered) entre células e colunas.
 */
export const Bordered: Story = {
  args: {
    variant: "bordered",
  },
};

/**
 * Modo compacto com espaçamento reduzido para modais ou painéis com espaço restrito.
 */
export const Compact: Story = {
  args: {
    density: "compact",
  },
};

/**
 * Estado de carregamento com indicador acessível (aria-busy e role status).
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    loadingMessage: "Carregando documentos da CIPA...",
  },
};

/**
 * Estado exibido quando a tabela não possui nenhum registro retornado.
 */
export const Empty: Story = {
  args: {
    data: [],
    emptyMessage: "Nenhum documento encontrado.",
  },
};

/**
 * Demonstração do modo composto utilizando os subcomponentes (`TableHeader`, `TableRow`, `TableCell`, etc.).
 */
export const CompoundComposition: Story = {
  render: () => (
    <Table className="max-w-4xl mx-auto" caption={<TableCaption side="top">Mapeamento de riscos e trabalhadores por unidade operacional</TableCaption>}>
      <TableHeader>
        <TableRow hoverable={false}>
          <TableHead>Identificador</TableHead>
          <TableHead>Unidade / Setor</TableHead>
          <TableHead align="center">Grau de Risco</TableHead>
          <TableHead align="right">Trabalhadores</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell as="th" scope="row" bold>
            SEC-01
          </TableCell>
          <TableCell>Edifício Central - Gabinete</TableCell>
          <TableCell align="center">
            <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Baixo</span>
          </TableCell>
          <TableCell align="right">120</TableCell>
        </TableRow>
        <TableRow>
          <TableCell as="th" scope="row" bold>
            SEC-02
          </TableCell>
          <TableCell>Almoxarifado e Manutenção</TableCell>
          <TableCell align="center">
            <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-900">Médio</span>
          </TableCell>
          <TableCell align="right">45</TableCell>
        </TableRow>
        <TableRow>
          <TableCell as="th" scope="row" bold>
            SEC-03
          </TableCell>
          <TableCell>Oficina Operacional</TableCell>
          <TableCell align="center">
            <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">Alto</span>
          </TableCell>
          <TableCell align="right">78</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

