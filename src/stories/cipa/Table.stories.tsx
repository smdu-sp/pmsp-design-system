import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CIPA_DATA } from "@/components/mock-cipa-data";
import { Table, type TableProps, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/Table";

const CIPA_HEADERS = ["Tema", "Descrição", "Acesso"];

const meta: Meta<TableProps> = {
  title: "CIPA/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    showHeader: true,
    columnsCount: 3,
    boldColumns: [0],
    rowHeaderColIndex: 0,
    headers: CIPA_HEADERS,
    data: CIPA_DATA,
    variant: "default",
    density: "default",
    hoverable: true,
  },
  argTypes: {
    showHeader: {
      control: "boolean",
      description: "Define se o cabeçalho (<thead>) da tabela deve ser exibido",
    },
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
    limit: {
      control: { type: "range", min: 1, max: 100, step: 1 },
      description: "Limite de itens exibidos na tabela. Se o limite for atingido, a paginação é exibida automaticamente.",
    },
    pageSize: {
      control: { type: "range", min: 1, max: 100, step: 1 },
      description: "Alias para o limite de itens por página.",
    },
    showPaginationInfo: {
      control: "boolean",
      description: "Exibe o resumo informativo com a contagem de itens exibidos.",
    },
    showFirstLastButtons: {
      control: "boolean",
      description: "Exibe botões para navegar diretamente para a primeira e última página.",
    },
    pageSizeOptions: {
      control: "object",
      description: "Opções para o seletor de limite de itens por página (ex: [3, 5, 9]).",
    },
    hideOnSinglePage: {
      control: "boolean",
      description: "Oculta a barra de paginação quando houver apenas 1 página.",
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
    limit: 5,
    pageSizeOptions: [5, 10, 20, 50],
    boldColumns: [0],
    rowHeaderColIndex: 0,
    headers: CIPA_HEADERS,
    data: CIPA_DATA,
  },
};

/**
 * Tabela padrão com paginação e seletor de quantidade de itens por página (`pageSizeOptions={[3, 5, 9]}`).
 */
export const Pagination: Story = {
  args: {
    limit: 5,
    pageSizeOptions: [5, 10, 20, 50],
    showFirstLastButtons: true,
    showPaginationInfo: true,
    hideOnSinglePage: false,
  },
};

/**
 * Tabela sem a linha de cabeçalho (`showHeader={false}`), indicada para listagens compactas ou cards tabulares.
 */
export const WithoutHeader: Story = {
  args: {
    showHeader: false,
    limit: 5,
    pageSizeOptions: [5, 10, 20, 50],
  },
};

/**
 * Demonstração dos estilos visuais da tabela, englobando as variações de estilo (striped, bordered)
 * e densidade de espaçamento das células (compact, relaxed).
 */
export const VisualStyles: Story = {
  args: {
    variant: "striped",
    density: "compact",
    limit: 5,
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
