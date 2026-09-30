import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Dropdown, type DropdownProps } from "@/components/Dropdown";
import { Button } from "@/components/Button";
import {
  MoreVertical,
  ChevronDown,
  Edit,
  Copy,
  Share2,
  Trash2,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Bell,
  Check,
} from "lucide-react";

const meta: Meta<typeof Dropdown> = {
  title: "CIPA/Dropdown",
  component: Dropdown,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Componente flutuante e isolado de **Dropdown** baseado em React Portal. Oferece transições suaves de entrada/saída, posicionamento inteligente com reposicionamento automático na rolagem/redimensionamento, suporte a acessibilidade (WAI-ARIA, foco e tecla Escape) e alinhamento customizável.",
      },
    },
  },
  argTypes: {
    align: {
      control: "select",
      options: ["left", "center", "right"],
      description: "Alinhamento do popover em relação ao botão gatilho",
      defaultValue: "left",
    },
    width: {
      control: "number",
      description: "Largura em pixels do menu dropdown",
      defaultValue: 260,
    },
    portal: {
      control: "boolean",
      description: "Se o menu deve ser renderizado no document.body via Portal para sobrepor tabelas e cards",
      defaultValue: true,
    },
    ariaLabel: {
      control: "text",
      description: "Rótulo de acessibilidade para leitores de tela",
      defaultValue: "Menu de opções",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

/**
 * Menu de ações básico acionado por um botão com ícone de opções.
 */
export const Default: Story = {
  render: (args) => (
    <div className="p-16 flex items-center justify-center">
      <Dropdown
        {...args}
        trigger={
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-2xs transition-colors cursor-pointer"
          >
            <span>Opções da linha</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        }
      >
        <div className="py-1 divide-y divide-slate-100 text-xs">
          <div className="pb-1.5 space-y-0.5">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              <span>Editar registro</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Duplicar linha</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Compartilhar link</span>
            </button>
          </div>
          <div className="pt-1.5">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Excluir registro</span>
            </button>
          </div>
        </div>
      </Dropdown>
    </div>
  ),
};

/**
 * Menu de perfil de usuário com avatar, status e atalhos rápidos.
 */
export const UserProfileMenu: Story = {
  render: () => (
    <div className="p-16 flex items-center justify-center">
      <Dropdown
        align="right"
        width={280}
        trigger={({ isOpen }) => (
          <button
            type="button"
            className={`flex items-center gap-3 p-1.5 pr-3 rounded-full border transition-all cursor-pointer ${
              isOpen
                ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center">
              CS
            </div>
            <div className="text-left text-xs">
              <p className="font-semibold text-slate-800 leading-tight">Carlos Silva</p>
              <p className="text-slate-500 text-[11px]">carlos.silva@prefeitura.sp.gov.br</p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
        )}
      >
        <div className="space-y-2">
          <div className="px-2 py-1.5 bg-slate-50 rounded-lg">
            <p className="text-[11px] font-medium text-slate-500">Conectado como</p>
            <p className="text-xs font-semibold text-slate-800">Administrador CIPA</p>
          </div>

          <div className="space-y-0.5">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Meu perfil</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Preferências</span>
            </button>
            <button
              type="button"
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Ajuda e Documentação</span>
            </button>
          </div>

          <div className="pt-1.5 border-t border-slate-100">
            <button
              type="button"
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </Dropdown>
    </div>
  ),
};

/**
 * Comparativo dos três alinhamentos suportados: à esquerda (`left`), centralizado (`center`) e à direita (`right`).
 */
export const Alignments: Story = {
  render: () => (
    <div className="p-16 flex flex-wrap items-center justify-around gap-6">
      <Dropdown
        align="left"
        trigger={
          <button
            type="button"
            className="px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Alinhar: Left
          </button>
        }
      >
        <p className="font-semibold text-slate-800 mb-1">Alinhado à Esquerda</p>
        <p className="text-slate-600 text-xs">
          O menu flutuante alinha sua extremidade esquerda com a do gatilho.
        </p>
      </Dropdown>

      <Dropdown
        align="center"
        trigger={
          <button
            type="button"
            className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-500 transition-colors cursor-pointer"
          >
            Alinhar: Center
          </button>
        }
      >
        <p className="font-semibold text-slate-800 mb-1">Alinhado ao Centro</p>
        <p className="text-slate-600 text-xs">
          O menu flutuante se centraliza horizontalmente em relação ao botão.
        </p>
      </Dropdown>

      <Dropdown
        align="right"
        trigger={
          <button
            type="button"
            className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Alinhar: Right
          </button>
        }
      >
        <p className="font-semibold text-slate-800 mb-1">Alinhado à Direita</p>
        <p className="text-slate-600 text-xs">
          O menu flutuante alinha sua extremidade direita com a do gatilho.
        </p>
      </Dropdown>
    </div>
  ),
};
