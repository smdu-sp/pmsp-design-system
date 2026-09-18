import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/Button";
import { CheckCircle2, Filter, ReceiptText } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Sistema-CAF/Button",
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
        <CheckCircle2 className="h-4 w-4 text-sky-400" />
        <span>Aprovar Pedido CAF</span>
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
        <Filter className="h-4 w-4 text-slate-500" />
        <span>Filtrar Lançamentos</span>
      </>
    ),
  },
};

export const CustomStyle: Story = {
  args: {
    variant: "primary",
    size: "md",
    rounded: "lg",
    className: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-400/30",
    children: (
      <>
        <ReceiptText className="h-4 w-4 text-indigo-200" />
        <span>Gerar Comprovante Fiscal</span>
      </>
    ),
  },
};
