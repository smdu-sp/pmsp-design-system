import React from "react";
import {
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ReceiptText,
  Users,
  FileSpreadsheet,
  Megaphone,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Plus,
  Download,
  Search,
  Trash2,
  ExternalLink,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  Info,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";

export const STORY_ICONS = {
  None: null,
  MessageCircle: <MessageCircle className="h-4 w-4 shrink-0 text-slate-700" />,
  Mail: <Mail className="h-4 w-4 shrink-0 text-slate-700" />,
  Phone: <Phone className="h-4 w-4 shrink-0 text-slate-700" />,
  HelpCircle: <HelpCircle className="h-4 w-4 shrink-0 text-slate-700" />,
  Info: <Info className="h-4 w-4 shrink-0 text-slate-700" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />,
  FileText: <FileText className="h-4 w-4 shrink-0 text-slate-500" />,
  AlertTriangle: <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />,
  CheckCircle2: <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-400" />,
  Filter: <Filter className="h-4 w-4 shrink-0 text-slate-400" />,
  ReceiptText: <ReceiptText className="h-4 w-4 shrink-0 text-indigo-300" />,
  Users: <Users className="h-4 w-4 shrink-0 text-teal-400" />,
  FileSpreadsheet: <FileSpreadsheet className="h-4 w-4 shrink-0 text-slate-400" />,
  Megaphone: <Megaphone className="h-4 w-4 shrink-0 text-teal-300" />,
  ArrowRight: <ArrowRight className="h-4 w-4 shrink-0" />,
  ArrowLeft: <ArrowLeft className="h-4 w-4 shrink-0" />,
  ChevronRight: <ChevronRight className="h-4 w-4 shrink-0" />,
  ChevronLeft: <ChevronLeft className="h-4 w-4 shrink-0" />,
  Plus: <Plus className="h-4 w-4 shrink-0" />,
  Download: <Download className="h-4 w-4 shrink-0" />,
  Search: <Search className="h-4 w-4 shrink-0" />,
  Trash2: <Trash2 className="h-4 w-4 shrink-0 text-rose-400" />,
  ExternalLink: <ExternalLink className="h-4 w-4 shrink-0" />,
  UploadCloud: <UploadCloud className="h-4 w-4 shrink-0 text-blue-500" />,
} as const;

export type StoryIconName = keyof typeof STORY_ICONS;
export const STORY_ICON_NAMES = Object.keys(STORY_ICONS) as StoryIconName[];

/** Ícones dimensionados para componentes Card (24px / h-6 w-6) */
export const CARD_ICONS = {
  Default: undefined,
  MessageCircle: <MessageCircle className="h-6 w-6 shrink-0 text-slate-700 stroke-[1.75]" />,
  Mail: <Mail className="h-6 w-6 shrink-0 text-slate-700 stroke-[1.75]" />,
  Phone: <Phone className="h-6 w-6 shrink-0 text-slate-700 stroke-[1.75]" />,
  HelpCircle: <HelpCircle className="h-6 w-6 shrink-0 text-slate-700 stroke-[1.75]" />,
  Info: <Info className="h-6 w-6 shrink-0 text-slate-700 stroke-[1.75]" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 shrink-0 text-emerald-600 stroke-[1.75]" />,
  FileText: <FileText className="h-6 w-6 shrink-0 text-slate-600 stroke-[1.75]" />,
  AlertTriangle: <AlertTriangle className="h-6 w-6 shrink-0 text-amber-500 stroke-[1.75]" />,
  Users: <Users className="h-6 w-6 shrink-0 text-teal-600 stroke-[1.75]" />,
  Megaphone: <Megaphone className="h-6 w-6 shrink-0 text-teal-600 stroke-[1.75]" />,
  ExternalLink: <ExternalLink className="h-6 w-6 shrink-0 text-slate-600 stroke-[1.75]" />,
  UploadCloud: <UploadCloud className="h-6 w-6 shrink-0 text-blue-600 stroke-[1.75]" />,
  Download: <Download className="h-6 w-6 shrink-0 text-slate-600 stroke-[1.75]" />,
  Search: <Search className="h-6 w-6 shrink-0 text-slate-600 stroke-[1.75]" />,
  ImageIcon: <ImageIcon className="h-6 w-6 shrink-0 text-slate-600 stroke-[1.75]" />,
  None: null,
} as const;

export type CardIconName = keyof typeof CARD_ICONS;
export const CARD_ICON_NAMES = Object.keys(CARD_ICONS) as CardIconName[];
