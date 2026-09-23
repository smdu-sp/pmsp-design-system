import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Table, type TableProps, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/Table";

const CIPA_HEADERS = ["Tema", "Descrição", "Acesso"];

const CIPA_DATA = [
  [
    "Cartaz do mês (histórico)",
    "Cartazes já publicados, disponíveis para consulta.",
    <span key="1" className="italic text-slate-400 font-normal">
      Em breve
    </span>,
  ],
  [
    "E-mails informativos",
    "Comunicados enviados periodicamente pela CIPA.",
    <span key="2" className="italic text-slate-400 font-normal">
      Em breve
    </span>,
  ],
  [
    "Mapa de risco",
    "Mapeamento de riscos por unidade/setor.",
    <span key="3" className="italic text-slate-400 font-normal">
      Em breve
    </span>,
  ],
  [
    "Legislação",
    "Normas regulamentadoras e legislação aplicável.",
    <span key="4" className="italic text-slate-400 font-normal">
      Em breve
    </span>,
  ],
  [
    "CAT — Comunicação de Acidente de Trabalho",
    "Como preencher e onde encaminhar.",
    <span key="5" className="italic text-slate-400 font-normal">
      Em breve
    </span>,
  ],
  [
    "Assédio — acolhimento e orientações",
    "Como identificar, denunciar e buscar apoio.",
    <span key="6" className="italic text-slate-400 font-normal">
      Em breve
    </span>,
  ],
  [
    "Calendário e atas de reuniões",
    "Datas dos encontros e registros das decisões da CIPA.",
    <span key="7" className="italic text-slate-400 font-normal">
      Em breve
    </span>,
  ],
  [
    "Perguntas frequentes (FAQ)",
    "Respostas para as dúvidas mais comuns.",
    <span key="8" className="italic text-slate-400 font-normal">
      Em breve
    </span>,
  ],
  [
    "Artigos e temas",
    "Conteúdos aprofundando prevenção e saúde no trabalho.",
    <span key="9" className="italic text-slate-400 font-normal">
      Em breve
    </span>,
  ],
];

const meta: Meta<TableProps> = {
  title: "CIPA/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
O componente **Table** foi desenvolvido com visual moderno e limpo conforme os padrões da CIPA/PMSP:
- **Cabeçalho com cantos arredondados e fundo cinza suave** (\`bg-slate-100\`).
- Suporte à prop **\`columnsCount\`** para definir/restringir quantas colunas vão existir.
- Suporte à prop **\`boldColumns\`** para definir quais colunas terão texto em negrito (ex: \`[0]\` para a 1ª coluna).
- Dois modos de uso: **declarativo** (passando \`headers\` + \`data\`) ou **composto** (\`<TableHeader>\`, \`<TableRow>\`, etc.).
- Totalmente acessível (WCAG 2.1 AA) e com rolagem horizontal fluida em telas mobile.
        `,
      },
    },
  },
  args: {
    columnsCount: 3,
    boldColumns: [0],
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
 * Tabela padrão idêntica ao design da CIPA fornecido na imagem de referência.
 * Possui 3 colunas, com a 1ª coluna ("Tema") em negrito (`boldColumns={[0]}`).
 */
export const Default: Story = {
  args: {
    columnsCount: 3,
    boldColumns: [0],
    headers: CIPA_HEADERS,
    data: CIPA_DATA,
  },
};

/**
 * Exemplo interativo com controles para alterar o número de colunas (`columnsCount`)
 * e configurar o negrito (`boldColumns`).
 */
export const ConfigurableColumns: Story = {
  args: {
    columnsCount: 3,
    boldColumns: [0, 2],
    headers: ["Documento", "Responsável", "Status", "Data", "Ações"],
    data: [
      ["Ata de Reunião Ordinária nº 04", "Comissão CIPA", "Aprovada", "10/05/2026", "Visualizar"],
      ["Relatório de Inspeção Setorial", "Eng. de Segurança", "Pendente", "18/05/2026", "Revisar"],
      ["Mapa de Risco Atualizado", "Técnico do Trabalho", "Publicado", "01/06/2026", "Download"],
      ["Investigação de Incidente", "Representante CIPA", "Em andamento", "12/06/2026", "Acompanhar"],
    ],
  },
};

/**
 * Tabela zebrada (striped) com linhas alternadas para facilitar a leitura de tabelas densas.
 */
export const Striped: Story = {
  args: {
    variant: "striped",
    columnsCount: 3,
    boldColumns: [0],
    headers: CIPA_HEADERS,
    data: CIPA_DATA,
  },
};

/**
 * Modo compacto para painéis ou modais com espaço reduzido.
 */
export const Compact: Story = {
  args: {
    density: "compact",
    columnsCount: 3,
    boldColumns: [0],
    headers: CIPA_HEADERS,
    data: CIPA_DATA,
  },
};

/**
 * Demonstração do modo composto utilizando os subcomponentes (`TableHeader`, `TableRow`, `TableCell`, etc.).
 */
export const CompoundComposition: Story = {
  render: () => (
    <Table className="max-w-4xl mx-auto">
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
          <TableCell bold>SEC-01</TableCell>
          <TableCell>Edifício Central - Gabinete</TableCell>
          <TableCell align="center">
            <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Baixo</span>
          </TableCell>
          <TableCell align="right">120</TableCell>
        </TableRow>
        <TableRow>
          <TableCell bold>SEC-02</TableCell>
          <TableCell>Almoxarifado e Manutenção</TableCell>
          <TableCell align="center">
            <span className="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">Médio</span>
          </TableCell>
          <TableCell align="right">45</TableCell>
        </TableRow>
        <TableRow>
          <TableCell bold>SEC-03</TableCell>
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

/**
 * Demonstração em viewport mobile (320px) com rolagem horizontal suave e acessível.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    columnsCount: 3,
    boldColumns: [0],
    headers: CIPA_HEADERS,
    data: CIPA_DATA.slice(0, 4),
  },
  render: (args) => (
    <div className="max-w-90 p-2 bg-slate-100 rounded-2xl">
      <Table {...args} />
    </div>
  ),
};
