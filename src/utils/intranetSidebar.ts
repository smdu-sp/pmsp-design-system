import * as React from "react";
import {
  Home,
  CalendarDays,
  Megaphone,
  Contact,
  Newspaper,
  User,
} from "lucide-react";
import { cn } from "@/utils/cn";

export interface IntranetSidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
}

export const INTRANET_DEFAULT_SIDEBAR_ITEMS: IntranetSidebarItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    icon: React.createElement(Home, { className: "w-4 h-4 shrink-0" }),
    href: "#",
  },
  {
    id: "aniversarios",
    label: "Aniversários",
    icon: React.createElement(CalendarDays, { className: "w-4 h-4 shrink-0" }),
    href: "#",
  },
  {
    id: "comunicados",
    label: "Comunicados",
    icon: React.createElement(Megaphone, { className: "w-4 h-4 shrink-0" }),
    href: "#",
  },
  {
    id: "diretorio",
    label: "Diretório",
    icon: React.createElement(Contact, { className: "w-4 h-4 shrink-0" }),
    href: "#",
  },
  {
    id: "eventos",
    label: "Eventos",
    icon: React.createElement(Newspaper, { className: "w-4 h-4 shrink-0" }),
    href: "#",
  },
  {
    id: "perfil",
    label: "Meu perfil",
    icon: React.createElement(User, { className: "w-4 h-4 shrink-0" }),
    href: "#",
  },
];

/**
 * Retorna as classes do container principal do IntranetSidebar.
 */
export function getIntranetSidebarContainerClass(className?: string): string {
  return cn(
    "w-64 sm:w-72 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 flex flex-col justify-between select-none transition-all",
    className,
  );
}

/**
 * Retorna as classes para um item individual da lista de navegação.
 */
export function getIntranetSidebarItemClass(isActive: boolean, disabled?: boolean): string {
  if (disabled) {
    return "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-300 cursor-not-allowed opacity-60 pointer-events-none";
  }

  if (isActive) {
    return "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#0b3299] bg-[#f0f4ff] shadow-2xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299] focus-visible:ring-offset-2";
  }

  return "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299] focus-visible:ring-offset-2";
}

/**
 * Retorna as classes para o card inferior de suporte técnico.
 */
export function getIntranetSupportCardClass(className?: string): string {
  return cn(
    "mt-6 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs flex flex-col transition-all",
    className,
  );
}
