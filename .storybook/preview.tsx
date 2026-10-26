import type { Preview } from "@storybook/react";
import { withThemeByClassName } from "@storybook/addon-themes";
import { INITIAL_VIEWPORTS } from "storybook/viewport";
import "../src/styles/globals.css";

const PMSP_CUSTOM_VIEWPORTS = {
  pmspMobileSm: {
    name: "Munícipe Mobile (360x640)",
    styles: { width: "360px", height: "640px" },
    type: "mobile" as const,
  },
  pmspMobileMd: {
    name: "Munícipe Mobile (390x844)",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
  pmspTablet: {
    name: "Tablet Fiscalização (768x1024)",
    styles: { width: "768px", height: "1024px" },
    type: "tablet" as const,
  },
  pmspDesktopStandard: {
    name: "Desktop Repartição (1366x768)",
    styles: { width: "1366px", height: "768px" },
    type: "desktop" as const,
  },
  pmspDesktopFullHD: {
    name: "Desktop Full HD (1920x1080)",
    styles: { width: "1920px", height: "1080px" },
    type: "desktop" as const,
  },
};

const COMPONENT_IMPORT_MAP: Record<string, string> = {
  Button: 'import { Button } from "@/components/Button";',
  Card: 'import { Card } from "@/components/Card";',
  CafCard: 'import { CafCard } from "@/components/CafCard";',
  Table: 'import { Table } from "@/components/Table";',
  CafTable: 'import { CafTable, CafScoreBadge } from "@/components/CafTable";',
  Dropdown: 'import { Dropdown } from "@/components/Dropdown";',
  CafHeader: 'import { CafHeader } from "@/components/CafHeader";',
  IntranetHeader: 'import { IntranetHeader } from "@/components/IntranetHeader";',
  IntranetSidebar: 'import { IntranetSidebar } from "@/components/IntranetSidebar";',
  Badge: 'import { Badge } from "@/components/Badge";',
  Alert: 'import { Alert } from "@/components/Alert";',
  Input: 'import { Input } from "@/components/Input";',
  FormField: 'import { FormField, Input } from "@/components/Input";',
  Textarea: 'import { Textarea } from "@/components/Textarea";',
  Skeleton: 'import { Skeleton } from "@/components/Skeleton";',
  Modal: 'import { Modal } from "@/components/Modal";',
  Tabs: 'import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs";',
  Breadcrumb: 'import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/Breadcrumb";',
  Tooltip: 'import { Tooltip } from "@/components/Tooltip";',
  AccessibilityBar: 'import { AccessibilityBar } from "@/components/AccessibilityBar";',
  ToastProvider: 'import { ToastProvider, useToast } from "@/components/Toast";',
};

function resolveImportStatement(storyContext: any, code?: string): string {
  const componentName =
    storyContext?.component?.displayName ||
    storyContext?.component?.name ||
    "";

  const title = (storyContext?.title || "").toLowerCase();

  if (title.includes("intranet") && title.includes("sidebar")) {
    return 'import { IntranetSidebar } from "@/components/IntranetSidebar";';
  }
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
  "Home",
  "CalendarDays",
  "Contact",
  "Newspaper",
  "LifeBuoy",
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
    options: {
      storySort: {
        order: [
          "Docs",
          ["Introdução", "Design Tokens & Cores", "Acessibilidade (e-MAG & WCAG)", "Iconografia"],
          "CIPA",
          "Intranet",
          "Sistema-CAF",
        ],
      },
    },
    viewport: {
      viewports: {
        ...PMSP_CUSTOM_VIEWPORTS,
        ...INITIAL_VIEWPORTS,
      },
    },
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
  decorators: [
    withThemeByClassName({
      themes: {
        Claro: "",
        Escuro: "dark",
        "Alto Contraste": "high-contrast",
      },
      defaultTheme: "Claro",
      parentSelector: "html",
    }),
  ],
};

export default preview;
