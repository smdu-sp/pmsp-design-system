import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import * as LucideIcons from "lucide-react";
import { Search, Check, Copy } from "lucide-react";
import { Input } from "@/components/Input";
import { Badge } from "@/components/Badge";

const meta: Meta = {
  title: "Docs/Iconografia",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Catálogo oficial de iconografia do **PMSP Design System**. Os ícones são baseados na biblioteca `lucide-react`, com traço padrão `strokeWidth={1.75}` ou `2`. Clique em qualquer ícone para copiar o código de importação diretamente para a área de transferência.",
      },
    },
  },
};

export default meta;

const ICON_LIST = [
  { name: "Search", category: "Navegação" },
  { name: "FileText", category: "Documentos" },
  { name: "FileSpreadsheet", category: "Documentos" },
  { name: "ReceiptText", category: "Documentos" },
  { name: "Users", category: "Institucional" },
  { name: "User", category: "Institucional" },
  { name: "Building2", category: "Institucional" },
  { name: "ShieldCheck", category: "Segurança" },
  { name: "CheckCircle2", category: "Feedback" },
  { name: "AlertTriangle", category: "Feedback" },
  { name: "AlertCircle", category: "Feedback" },
  { name: "Info", category: "Feedback" },
  { name: "Check", category: "Feedback" },
  { name: "Bell", category: "Comunicação" },
  { name: "Mail", category: "Comunicação" },
  { name: "MessageCircle", category: "Comunicação" },
  { name: "Phone", category: "Comunicação" },
  { name: "Megaphone", category: "Comunicação" },
  { name: "Send", category: "Comunicação" },
  { name: "Download", category: "Ações" },
  { name: "UploadCloud", category: "Ações" },
  { name: "Plus", category: "Ações" },
  { name: "Trash2", category: "Ações" },
  { name: "Edit", category: "Ações" },
  { name: "Copy", category: "Ações" },
  { name: "Share2", category: "Ações" },
  { name: "Filter", category: "Ações" },
  { name: "Settings", category: "Sistema" },
  { name: "LogOut", category: "Sistema" },
  { name: "HelpCircle", category: "Sistema" },
  { name: "ExternalLink", category: "Navegação" },
  { name: "ChevronDown", category: "Navegação" },
  { name: "ChevronUp", category: "Navegação" },
  { name: "ChevronLeft", category: "Navegação" },
  { name: "ChevronRight", category: "Navegação" },
  { name: "ArrowLeft", category: "Navegação" },
  { name: "ArrowRight", category: "Navegação" },
  { name: "MoreVertical", category: "Navegação" },
  { name: "MoreHorizontal", category: "Navegação" },
  { name: "Home", category: "Navegação" },
  { name: "CalendarDays", category: "Documentos" },
];

export const GaleriaInterativa: StoryObj = {
  render: () => {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState<string>("Todas");
    const [copiedName, setCopiedName] = React.useState<string | null>(null);

    const categories = ["Todas", "Documentos", "Ações", "Navegação", "Comunicação", "Feedback", "Institucional", "Sistema"];

    const filtered = ICON_LIST.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "Todas" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const handleCopy = (iconName: string) => {
      const code = `import { ${iconName} } from "lucide-react";\n\n<${iconName} className="h-4 w-4" />`;
      navigator.clipboard.writeText(code);
      setCopiedName(iconName);
      setTimeout(() => setCopiedName(null), 2000);
    };

    return (
      <div className="space-y-6 max-w-5xl">
        {/* Barra de Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Pesquisar ícones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0b3299] text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Contador */}
        <div className="text-xs text-slate-500">
          Exibindo <strong>{filtered.length}</strong> de {ICON_LIST.length} ícones disponíveis
        </div>

        {/* Grade de Ícones */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map((item) => {
            const IconComponent = (LucideIcons as any)[item.name];
            if (!IconComponent) return null;
            const isCopied = copiedName === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleCopy(item.name)}
                className={`group relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all text-center cursor-pointer ${
                  isCopied
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-700"
                    : "bg-white hover:bg-slate-50 border-slate-200 hover:border-[#0b3299]/50 shadow-xs dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-850"
                }`}
              >
                <div className="h-8 w-8 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:scale-110 transition-transform">
                  {isCopied ? (
                    <Check className="h-6 w-6 text-emerald-600 animate-in zoom-in" />
                  ) : (
                    <IconComponent className="h-6 w-6" strokeWidth={1.75} />
                  )}
                </div>

                <span className="mt-3 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full">
                  {item.name}
                </span>

                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {item.category}
                </span>

                {isCopied && (
                  <div className="absolute inset-0 bg-emerald-600/10 rounded-xl flex items-center justify-center pointer-events-none">
                    <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      Copiado!
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
};
