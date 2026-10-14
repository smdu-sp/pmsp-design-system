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

function resolveImportStatement(storyContext: any): string {
  const componentName =
    storyContext?.component?.displayName ||
    storyContext?.component?.name ||
    "";

  if (COMPONENT_IMPORT_MAP[componentName]) {
    return COMPONENT_IMPORT_MAP[componentName];
  }

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
  if (title.includes("button")) {
    return 'import { Button } from "@/components/Button";';
  }
  if (title.includes("dropdown")) {
    return 'import { Dropdown } from "@/components/Dropdown";';
  }
  if (title.includes("table")) {
    return 'import { Table } from "@/components/Table";';
  }
  if (title.includes("card")) {
    return 'import { Card } from "@/components/Card";';
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
        transform: (code: string, storyContext: any) => {
          if (!code || code.includes("import ")) {
            return code;
          }
          const importLine = resolveImportStatement(storyContext);
          if (importLine) {
            return `${importLine}\n\n${code.trim()}`;
          }
          return code;
        },
      },
    },
  },
};

export default preview;
