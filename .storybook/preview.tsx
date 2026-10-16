import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";

const COMPONENT_IMPORT_MAP: Record<string, string> = {
  Button: 'import { Button } from "@/components/Button";',
  Card: 'import { Card } from "@/components/Card";',
  CafCard: 'import { CafCard } from "@/components/CafCard";',
  Table: 'import { Table } from "@/components/Table";',
  CafTable: 'import { CafTable, CafScoreBadge } from "@/components/CafTable";',
  Dropdown: 'import { Dropdown } from "@/components/Dropdown";',
  CafHeader: 'import { CafHeader } from "@/components/CafHeader";',
  IntranetHeader: 'import { IntranetHeader } from "@/components/IntranetHeader";',
};

function resolveImportStatement(storyContext: any, code?: string): string {
  const componentName =
    storyContext?.component?.displayName ||
    storyContext?.component?.name ||
    "";

  const title = (storyContext?.title || "").toLowerCase();

  if (title.includes("intranet") && title.includes("header")) {
    return 'import { IntranetHeader } from "@/components/IntranetHeader";';
  }
  if (title.includes("sistema-caf") && title.includes("header")) {
    return 'import { CafHeader } from "@/components/CafHeader";';
  }
  if (title.includes("sistema-caf") && title.includes("table")) {
    return 'import { CafTable, CafScoreBadge } from "@/components/CafTable";';
  }
  if (title.includes("sistema-caf") && title.includes("card")) {
    return 'import { CafCard } from "@/components/CafCard";';
  }
  if (title.includes("table")) {
    if (code && (code.includes("<TableHeader") || code.includes("<TableRow"))) {
      return 'import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/Table";';
    }
    return 'import { Table } from "@/components/Table";';
  }
  if (title.includes("dropdown")) {
    return 'import { Dropdown } from "@/components/Dropdown";';
  }
  if (title.includes("button")) {
    return 'import { Button } from "@/components/Button";';
  }
  if (title.includes("card")) {
    return 'import { Card } from "@/components/Card";';
  }

  if (COMPONENT_IMPORT_MAP[componentName]) {
    return COMPONENT_IMPORT_MAP[componentName];
  }

  return "";
}

const KNOWN_LUCIDE_ICONS = [
  "MessageCircle",
  "Mail",
  "Phone",
  "HelpCircle",
  "Info",
  "ShieldCheck",
  "FileText",
  "AlertTriangle",
  "CheckCircle2",
  "Filter",
  "ReceiptText",
  "Users",
  "FileSpreadsheet",
  "Megaphone",
  "ArrowRight",
  "ArrowLeft",
  "ChevronRight",
  "ChevronLeft",
  "ChevronDown",
  "ChevronUp",
  "MoreVertical",
  "MoreHorizontal",
  "Settings",
  "User",
  "Edit",
  "Copy",
  "Check",
  "Plus",
  "Download",
  "Search",
  "Trash2",
  "ExternalLink",
  "UploadCloud",
  "Building2",
  "Bell",
  "Layers",
  "CheckSquare",
  "LogOut",
  "Share2",
  "Play",
  "Pencil",
  "X",
  "Send",
  "ImageIcon",
];

function resolveIconImports(code: string): string {
  if (!code) return "";
  const detectedIcons: string[] = [];
  for (const icon of KNOWN_LUCIDE_ICONS) {
    const regex = new RegExp(`<${icon}\\b`);
    if (regex.test(code)) {
      detectedIcons.push(icon);
    }
  }
  if (detectedIcons.length > 0) {
    return `import { ${detectedIcons.join(", ")} } from "lucide-react";`;
  }
  return "";
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: {
        type: "dynamic",
        transform: (code: string, storyContext: any) => {
          if (!code) {
            return code;
          }

          let cleanCode = code.trim();

          // Unwrap decorative center containers if present in generated JSX
          const centerDivRegex = /^<div[^>]*className=["'][^"']*justify-center[^"']*["'][^>]*>\s*([\s\S]*?)\s*<\/div>$/;
          const match = cleanCode.match(centerDivRegex);
          if (match && match[1]) {
            cleanCode = match[1].trim();
          }

          if (cleanCode.includes("import ")) {
            return cleanCode;
          }

          const importLine = resolveImportStatement(storyContext, cleanCode);
          const iconImportLine = resolveIconImports(cleanCode);

          const imports = [importLine, iconImportLine].filter(Boolean).join("\n");
          if (imports) {
            return `${imports}\n\n${cleanCode}`;
          }
          return cleanCode;
        },
      },
    },
  },
};

export default preview;
