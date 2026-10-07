import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CafTable, CafScoreBadge, type CafTableProps, CAF_TABLE_SAMPLE_DATA, CAF_TABLE_FULL_DATA, CAF_DEFAULT_COLUMNS, CAF_DEFAULT_PAGE_SIZE_OPTIONS } from "@/components/CafTable";

const meta: Meta<CafTableProps> = {
  title: "Sistema-CAF/Table",
  component: CafTable,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
O componente **CafTable** foi projetado especificamente para o **Sistema-CAF (Central de Atendimento ao Funcionário / Manutenção)**:
- **Cabeçalho Azul Índigo Real (\`#0b3299\`)**: Alto contraste com texto em branco e tipografia semibold.
- **Pílulas de Avaliação (\`CafScoreBadge\`)**: Destaque visual com notas elevadas (>= 7.0) em azul sólido e notas inferiores em fundo branco com borda sutil.
- **Paginação CAF Integrada**: Exibe resumo descritivo \`Página X de Y (Z itens)\`, botões compactos de navegação e seletor moderno de quantidade de itens por página com menu popup e indicador de seleção (\`✓\`).
        `,
      },
    },
  },
  args: {
    columns: CAF_DEFAULT_COLUMNS,
    data: CAF_TABLE_SAMPLE_DATA,
    pageSizeOptions: CAF_DEFAULT_PAGE_SIZE_OPTIONS,
    pageSize: 10,
    hoverable: true,
    showPagination: true,
  },
  argTypes: {
    pageSize: {
      control: "select",
      options: CAF_DEFAULT_PAGE_SIZE_OPTIONS,
      description: "Quantidade de linhas por página",
    },
    pageSizeOptions: {
      control: "object",
      description: "Lista de opções numéricas disponíveis no seletor de itens por página",
    },
    hoverable: {
      control: "boolean",
      description: "Ativa realce suave ao passar o cursor sobre as linhas",
    },
    isLoading: {
      control: "boolean",
      description: "Exibe estado de carregamento com spinner animado",
    },
    emptyMessage: {
      control: "text",
      description: "Mensagem exibida quando não houver registros",
    },
    showHeader: {
      control: "boolean",
      description: "Exibir ou ocultar o cabeçalho azul da tabela",
    },
  },
};

export default meta;
type Story = StoryObj<CafTableProps>;

/**
 * Visual idêntico ao layout de referência do Sistema-CAF:
 * 3 linhas de avaliações de salas e limpeza com notas em badges, período, observações e data de criação.
 */
export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <CafTable
            columns={[
              {
                key: "avaliacao",
                header: "Avaliação",
                render: (val) => <CafScoreBadge score={val} />,
              },
              { key: "sala", header: "Sala", bold: true },
              { key: "periodo", header: "Periodo" },
              { key: "observacao", header: "Observação" },
              { key: "criadoEm", header: "Criado em" },
            ]}
            data={data}
            pageSize={10}
          />
        `.trim(),
      },
    },
  },
  args: {
    columns: CAF_DEFAULT_COLUMNS,
    data: CAF_TABLE_SAMPLE_DATA,
    pageSize: 10,
  },
};

/**
 * Demonstração de múltiplas páginas ativas com seletor interativo de itens por página (1, 2, 5, 10, 15, 20, 30, 50).
 */
export const WithPagination: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <CafTable
            columns={CAF_DEFAULT_COLUMNS}
            data={data}
            pageSize={5}
            pageSizeOptions={[5, 10, 15, 20, 30, 50]}
          />
        `.trim(),
      },
    },
  },
  args: {
    columns: CAF_DEFAULT_COLUMNS,
    data: CAF_TABLE_FULL_DATA,
    pageSize: 5,
    pageSizeOptions: [5, 10, 15, 20, 30, 50],
  },
};

/**
 * Tabela CAF com filtros de coluna habilitados no cabeçalho azul.
 */
export const WithFilters: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <CafTable
            columns={[
              {
                key: "avaliacao",
                header: "Avaliação",
                filterable: false,
                render: (val) => <CafScoreBadge score={val} />,
              },
              { key: "sala", header: "Sala", bold: true, filterable: true },
              { key: "periodo", header: "Periodo", filterable: true },
              { key: "observacao", header: "Observação" },
              { key: "criadoEm", header: "Criado em" },
            ]}
            data={data}
          />
        `.trim(),
      },
    },
  },
  args: {
    columns: [
      {
        key: "avaliacao",
        header: "Avaliação",
        filterable: false,
        render: (val: number) => <CafScoreBadge score={val} />,
      },
      { key: "sala", header: "Sala", bold: true, filterable: true },
      { key: "periodo", header: "Periodo", filterable: true },
      { key: "observacao", header: "Observação" },
      { key: "criadoEm", header: "Criado em" },
    ],
    data: CAF_TABLE_FULL_DATA,
    pageSize: 5,
  },
};

/**
 * Estado de carregamento com indicador de progresso animado.
 */
export const Loading: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <CafTable
            columns={CAF_DEFAULT_COLUMNS}
            data={[]}
            isLoading
            loadingMessage="Carregando avaliações do Sistema-CAF..."
          />
        `.trim(),
      },
    },
  },
  args: {
    columns: CAF_DEFAULT_COLUMNS,
    data: [],
    isLoading: true,
    loadingMessage: "Carregando avaliações do Sistema-CAF...",
  },
};

/**
 * Estado vazio quando nenhum registro for encontrado para os filtros ou período selecionado.
 */
export const Empty: Story = {
  parameters: {
    docs: {
      source: {
        code: `
          <CafTable
            columns={CAF_DEFAULT_COLUMNS}
            data={[]}
            emptyMessage="Nenhuma avaliação registrada para este período."
          />
        `.trim(),
      },
    },
  },
  args: {
    columns: CAF_DEFAULT_COLUMNS,
    data: [],
    emptyMessage: "Nenhuma avaliação registrada para este período.",
  },
};
