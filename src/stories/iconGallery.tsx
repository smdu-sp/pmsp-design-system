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
} from "lucide-react";

export const STORY_ICONS = {
  None: null,
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
} as const;

export type StoryIconName = keyof typeof STORY_ICONS;
export const STORY_ICON_NAMES = Object.keys(STORY_ICONS) as StoryIconName[];
