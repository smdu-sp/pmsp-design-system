import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/Button";
import { Users, FileSpreadsheet, Megaphone } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Intranet/Button",
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
        <Users className="h-4 w-4 text-teal-400" />
        <span>Acessar Portal do Colaborador</span>
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
        <FileSpreadsheet className="h-4 w-4 text-slate-600" />
        <span>Consultar Contracheque</span>
      </>
    ),
  },
};

export const CustomStyle: Story = {
  args: {
    variant: "primary",
    size: "md",
    rounded: "full",
    className: "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 ring-1 ring-teal-400/40",
    children: (
      <>
        <Megaphone className="h-4 w-4 text-teal-100" />
        <span>Novo Comunicado Interno</span>
      </>
    ),
  },
};
