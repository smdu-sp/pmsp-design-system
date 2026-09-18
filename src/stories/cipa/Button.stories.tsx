import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/Button";
import { ShieldCheck, FileText, AlertTriangle } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "CIPA/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    rounded: {
      control: "select",
      options: ["none", "sm", "md", "lg", "full"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    rounded: "md",
    children: (
      <>
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>Registrar Inspeção CIPA</span>
      </>
    ),
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    rounded: "md",
    children: (
      <>
        <FileText className="h-4 w-4 text-slate-600" />
        <span>Consultar Atas e Normas</span>
      </>
    ),
  },
};

export const CustomStyle: Story = {
  args: {
    variant: "primary",
    size: "lg",
    rounded: "full",
    className: "bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 border border-amber-500",
    children: (
      <>
        <AlertTriangle className="h-5 w-5 text-amber-100" />
        <span>Emitir Alerta de Incidente</span>
      </>
    ),
  },
};
